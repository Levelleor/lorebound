package store

import (
	"bytes"
	"context"
	"database/sql"
	"encoding/json"
	"errors"
	"net/url"
	"reflect"
	"sort"
	"strconv"
	"strings"
	"unicode"
	"unicode/utf8"
)

var ErrSettingsChanged = errors.New("model_settings_changed")

type ModelProfile struct {
	ID        string `json:"id"`
	Name      string `json:"name"`
	Kind      string `json:"kind"`
	BaseURL   string `json:"baseUrl"`
	Model     string `json:"model"`
	TimeoutMS int    `json:"timeoutMs"`
}

type ConnectionsRequest struct {
	SchemaVersion int    `json:"schemaVersion"`
	Epoch         string `json:"epoch"`
}

type Connections struct {
	ConnectionsRequest
	Revision        int64          `json:"revision"`
	Mode            string         `json:"mode"`
	ActiveProfileID string         `json:"activeProfileId"`
	Profiles        []ModelProfile `json:"profiles"`
}

type SaveConnectionsRequest struct {
	ConnectionsRequest
	ExpectedRevision int64          `json:"expectedRevision"`
	Mode             string         `json:"mode"`
	ActiveProfileID  string         `json:"activeProfileId"`
	Profiles         []ModelProfile `json:"profiles"`
}

func (r *SaveConnectionsRequest) UnmarshalJSON(data []byte) error {
	type plain SaveConnectionsRequest
	var value plain
	decoder := json.NewDecoder(bytes.NewReader(data))
	decoder.DisallowUnknownFields()
	if err := decoder.Decode(&value); err != nil {
		return ErrInvalidRequest
	}
	var fields map[string]json.RawMessage
	if err := json.Unmarshal(data, &fields); err != nil || len(fields) != 6 {
		return ErrInvalidRequest
	}
	for _, name := range []string{"schemaVersion", "epoch", "expectedRevision", "mode", "activeProfileId", "profiles"} {
		raw, ok := fields[name]
		if !ok || bytes.Equal(bytes.TrimSpace(raw), []byte("null")) {
			return ErrInvalidRequest
		}
	}
	*r = SaveConnectionsRequest(value)
	return nil
}

func addConnections(tx *sql.Tx) error {
	_, err := tx.Exec(`CREATE TABLE model_profiles (
 id TEXT PRIMARY KEY, name TEXT NOT NULL, kind TEXT NOT NULL,
 base_url TEXT NOT NULL, model TEXT NOT NULL, timeout_ms INTEGER NOT NULL);
 CREATE TABLE model_settings (
 id INTEGER PRIMARY KEY CHECK(id=1), revision INTEGER NOT NULL,
 mode TEXT NOT NULL, active_profile_id TEXT REFERENCES model_profiles(id));
 INSERT INTO model_settings VALUES(1,0,'simulation',NULL);
 PRAGMA user_version=6;`)
	return err
}

func connectionsEpoch(tx *sql.Tx, req ConnectionsRequest) error {
	if req.SchemaVersion != SchemaVersion || req.Epoch == "" {
		return ErrInvalidRequest
	}
	current, err := epoch(tx)
	if err != nil {
		return err
	}
	if current != req.Epoch {
		return ErrWrongEpoch
	}
	return nil
}

func readConnections(ctx context.Context, tx *sql.Tx, req ConnectionsRequest) (Connections, error) {
	result := Connections{ConnectionsRequest: req, Profiles: []ModelProfile{}}
	if err := connectionsEpoch(tx, req); err != nil {
		return result, err
	}
	if err := tx.QueryRowContext(ctx, `SELECT revision,mode,COALESCE(active_profile_id,'') FROM model_settings WHERE id=1`).Scan(&result.Revision, &result.Mode, &result.ActiveProfileID); err != nil {
		return result, err
	}
	rows, err := tx.QueryContext(ctx, `SELECT id,name,kind,base_url,model,timeout_ms FROM model_profiles ORDER BY id`)
	if err != nil {
		return result, err
	}
	defer rows.Close()
	for rows.Next() {
		var profile ModelProfile
		if err := rows.Scan(&profile.ID, &profile.Name, &profile.Kind, &profile.BaseURL, &profile.Model, &profile.TimeoutMS); err != nil {
			return result, err
		}
		result.Profiles = append(result.Profiles, profile)
	}
	return result, rows.Err()
}

func (s *Store) ReadConnections(ctx context.Context, req ConnectionsRequest) (Connections, error) {
	tx, err := s.db.BeginTx(ctx, &sql.TxOptions{ReadOnly: true})
	if err != nil {
		return Connections{}, err
	}
	defer tx.Rollback()
	result, err := readConnections(ctx, tx, req)
	if err != nil {
		return result, err
	}
	return result, tx.Commit()
}

func validProfile(profile ModelProfile) bool {
	if !identifier.MatchString(profile.ID) || (profile.Kind != "llamacpp" && profile.Kind != "custom") ||
		!utf8.ValidString(profile.Name) || strings.TrimSpace(profile.Name) == "" || utf8.RuneCountInString(profile.Name) > 80 ||
		!utf8.ValidString(profile.Model) || strings.TrimSpace(profile.Model) == "" || utf8.RuneCountInString(profile.Model) > 200 ||
		profile.TimeoutMS < 1000 || profile.TimeoutMS > 300000 || len(profile.BaseURL) > 2048 ||
		strings.ContainsAny(profile.BaseURL, "?#\\") || strings.IndexFunc(profile.BaseURL, unicode.IsSpace) >= 0 {
		return false
	}
	endpoint, err := url.Parse(profile.BaseURL)
	if err != nil {
		return false
	}
	if port := endpoint.Port(); port != "" {
		if _, err := strconv.ParseUint(port, 10, 16); err != nil {
			return false
		}
	}
	return (endpoint.Scheme == "http" || endpoint.Scheme == "https") &&
		endpoint.Hostname() != "" && endpoint.User == nil && endpoint.Opaque == "" && endpoint.RawQuery == "" && endpoint.Fragment == ""
}

func (s *Store) SaveConnections(ctx context.Context, req SaveConnectionsRequest) (Connections, error) {
	if req.ExpectedRevision < 0 || req.ExpectedRevision >= 9007199254740991 || req.Profiles == nil || len(req.Profiles) > 32 ||
		(req.Mode != "simulation" && req.Mode != "local") || (req.Mode == "simulation" && req.ActiveProfileID != "") {
		return Connections{}, ErrInvalidRequest
	}
	ids := map[string]bool{}
	for _, profile := range req.Profiles {
		if !validProfile(profile) || ids[profile.ID] {
			return Connections{}, ErrInvalidRequest
		}
		ids[profile.ID] = true
	}
	if req.ActiveProfileID != "" && !ids[req.ActiveProfileID] {
		return Connections{}, ErrInvalidRequest
	}
	profiles := append([]ModelProfile{}, req.Profiles...)
	sort.Slice(profiles, func(i, j int) bool { return profiles[i].ID < profiles[j].ID })
	tx, err := s.db.BeginTx(ctx, nil)
	if err != nil {
		return Connections{}, err
	}
	defer tx.Rollback()
	current, err := readConnections(ctx, tx, req.ConnectionsRequest)
	if err != nil {
		return current, err
	}
	// An identical current value also resolves a lost settings-save response.
	if current.Mode == req.Mode && current.ActiveProfileID == req.ActiveProfileID && reflect.DeepEqual(current.Profiles, profiles) {
		return current, tx.Commit()
	}
	if current.Revision != req.ExpectedRevision {
		return current, ErrSettingsChanged
	}
	if _, err = tx.ExecContext(ctx, `UPDATE model_settings SET active_profile_id=NULL WHERE id=1; DELETE FROM model_profiles;`); err != nil {
		return current, err
	}
	for _, profile := range profiles {
		if _, err = tx.ExecContext(ctx, `INSERT INTO model_profiles VALUES(?,?,?,?,?,?)`, profile.ID, profile.Name, profile.Kind, profile.BaseURL, profile.Model, profile.TimeoutMS); err != nil {
			return current, err
		}
	}
	var active any
	if req.ActiveProfileID != "" {
		active = req.ActiveProfileID
	}
	if _, err = tx.ExecContext(ctx, `UPDATE model_settings SET revision=revision+1,mode=?,active_profile_id=? WHERE id=1`, req.Mode, active); err != nil {
		return current, err
	}
	result, err := readConnections(ctx, tx, req.ConnectionsRequest)
	if err != nil {
		return result, err
	}
	return result, tx.Commit()
}
