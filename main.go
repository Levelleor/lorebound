package main

import (
	"embed"
	"flag"
	"fmt"
	"io/fs"
	"log"
	"os"
	"path/filepath"
	"runtime"

	"github.com/Levelleor/lorebound/internal/store"
	"github.com/wailsapp/wails/v3/pkg/application"
)

//go:embed all:frontend/build
var assets embed.FS

func main() {
	dataDir := flag.String("data-dir", "", "library directory (defaults to per-user application data)")
	port := flag.Int("port", 8080, "loopback HTTP port")
	flag.Parse()
	if *port < 1 || *port > 65535 {
		log.Fatal("supply a valid -port")
	}
	if *dataDir == "" {
		var err error
		*dataDir, err = defaultDataDir()
		if err != nil {
			log.Fatal(err)
		}
	}
	if host := os.Getenv("WAILS_SERVER_HOST"); host != "" && host != "127.0.0.1" {
		log.Fatal("WAILS_SERVER_HOST must remain 127.0.0.1")
	}
	if err := os.MkdirAll(*dataDir, 0700); err != nil {
		log.Fatal(err)
	}
	db, err := store.Open(filepath.Join(*dataDir, "lorebound.db"))
	if err != nil {
		log.Fatal(err)
	}
	defer db.Close()
	web, err := fs.Sub(assets, "frontend/build")
	if err != nil {
		log.Fatal(err)
	}
	app := application.New(application.Options{
		Name: "Lorebound",
		Server: application.ServerOptions{
			Host:                     "127.0.0.1",
			Port:                     *port,
			WebSocketAllowAllOrigins: false,
		},
		Services: []application.Service{application.NewService(&LibraryService{store: db})},
		Assets:   application.AssetOptions{Handler: application.BundledAssetFileServer(web)},
	})
	fmt.Printf("Lorebound: http://127.0.0.1:%d\n", *port)
	if err := app.Run(); err != nil {
		log.Fatal(err)
	}
}

func defaultDataDir() (string, error) {
	if runtime.GOOS == "windows" {
		path, err := os.UserConfigDir()
		if err != nil {
			return "", err
		}
		return filepath.Join(path, "Lorebound"), nil
	}
	homeDir, err := os.UserHomeDir()
	if err != nil {
		return "", err
	}
	if runtime.GOOS == "darwin" {
		return filepath.Join(homeDir, "Library", "Application Support", "Lorebound"), nil
	}
	if path := os.Getenv("XDG_DATA_HOME"); filepath.IsAbs(path) {
		return filepath.Join(path, "Lorebound"), nil
	}
	return filepath.Join(homeDir, ".local", "share", "Lorebound"), nil
}
