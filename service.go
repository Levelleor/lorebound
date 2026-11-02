package main

import (
	"context"
	"github.com/Levelleor/lorebound/internal/store"
)

type HostInfo struct {
	Name          string `json:"name"`
	SchemaVersion int    `json:"schemaVersion"`
}

// GateService exposes only technical host and test-record operations.
type GateService struct{ store *store.Store }

func (s *GateService) Ping() HostInfo {
	return HostInfo{Name: "Lorebound Gate 0", SchemaVersion: store.SchemaVersion}
}

func (s *GateService) Read() (store.State, error) {
	return s.store.Read(context.Background())
}

func (s *GateService) Commit(req store.CommitRequest) (store.CommitResult, error) {
	return s.store.Commit(context.Background(), req)
}
