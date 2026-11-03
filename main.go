package main

import (
	"embed"
	"flag"
	"fmt"
	"io/fs"
	"log"
	"os"
	"path/filepath"

	"github.com/Levelleor/lorebound/internal/store"
	"github.com/wailsapp/wails/v3/pkg/application"
)

//go:embed all:frontend/build
var assets embed.FS

func main() {
	dataDir := flag.String("data-dir", "", "dedicated disposable Gate 0 data directory (required)")
	port := flag.Int("port", 8080, "loopback HTTP port")
	flag.Parse()
	if *dataDir == "" || *port < 1 || *port > 65535 {
		log.Fatal("supply -data-dir and a valid -port; use a dedicated disposable Gate 0 directory")
	}
	if host := os.Getenv("WAILS_SERVER_HOST"); host != "" && host != "127.0.0.1" {
		log.Fatal("WAILS_SERVER_HOST must remain 127.0.0.1")
	}
	if err := os.MkdirAll(*dataDir, 0700); err != nil {
		log.Fatal(err)
	}
	db, err := store.Open(filepath.Join(*dataDir, "gate0.db"))
	if err != nil {
		log.Fatal(err)
	}
	defer db.Close()
	web, err := fs.Sub(assets, "frontend/build")
	if err != nil {
		log.Fatal(err)
	}
	app := application.New(application.Options{
		Name: "Lorebound Gate 0",
		Server: application.ServerOptions{
			Host:                     "127.0.0.1",
			Port:                     *port,
			WebSocketAllowAllOrigins: false,
		},
		Services: []application.Service{application.NewService(&GateService{store: db})},
		Assets:   application.AssetOptions{Handler: application.BundledAssetFileServer(web)},
	})
	fmt.Printf("Lorebound Gate 0: http://127.0.0.1:%d\n", *port)
	if err := app.Run(); err != nil {
		log.Fatal(err)
	}
}
