package db

import (
	"database/sql"
	"embed"
	"fmt"

	"git.june.pet/june/goto/internal/sqlc"
	"github.com/pressly/goose/v3"
)

//go:embed migrations/*.sql
var embedMigrations embed.FS

func CreateDB() (*sql.DB, *sqlc.Queries, error) {

	dbConn, err := sql.Open("sqlite", "db/data.db")
	if err != nil {
		return nil, nil, fmt.Errorf("open db: %w", err)
	}

	if _, err := dbConn.Exec("PRAGMA foreign_keys = ON"); err != nil {
		return nil, nil, fmt.Errorf("enable foreign keys: %w", err)
	}

	goose.SetBaseFS(embedMigrations)
	if err := goose.SetDialect("sqlite3"); err != nil {
		return nil, nil, fmt.Errorf("set goose dialect: %w", err)
	}

	if err := goose.Up(dbConn, "migrations"); err != nil {
		return nil, nil, fmt.Errorf("run migrations: %w", err)
	}

	queries := sqlc.New(dbConn)

	return dbConn, queries, nil

}
