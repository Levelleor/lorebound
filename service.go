package main

import (
	"context"
	"github.com/Levelleor/lorebound/internal/store"
)

// LibraryService exposes only typed adventure-library operations, never SQL or paths.
type LibraryService struct{ store *store.Store }

func (s *LibraryService) List() (store.Library, error) { return s.store.List(context.Background()) }
func (s *LibraryService) Read(req store.ReadRequest) (store.Snapshot, error) {
	return s.store.Read(context.Background(), req)
}
func (s *LibraryService) Create(req store.CreateRequest) (store.CreateResult, error) {
	return s.store.Create(context.Background(), req)
}
func (s *LibraryService) Commit(req store.CommitRequest) (store.CommitResult, error) {
	return s.store.Commit(context.Background(), req)
}
func (s *LibraryService) Fork(req store.ForkRequest) (store.ForkResult, error) {
	return s.store.Fork(context.Background(), req)
}
