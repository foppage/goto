package db

import (
	"database/sql"
	"embed"
	"log"

	"git.june.pet/june/goto/internal/sqlc"
	"github.com/pressly/goose/v3"
)

//go:embed migrations/*.sql
var embedMigrations embed.FS

func CreateDB() (*sql.DB, *sqlc.Queries, error) {

	dbConn, err := sql.Open("sqlite", "internal/db/data/data.db")
	if err != nil {
		log.Panic(err)
		return nil, nil, err

	}

	if _, err := dbConn.Exec("PRAGMA foreign_keys = ON"); err != nil {
		log.Panic(err)
		return nil, nil, err
	}

	goose.SetBaseFS(embedMigrations)
	if err := goose.SetDialect("sqlite3"); err != nil {
		log.Panic(err)
		return nil, nil, err

	}

	if err := goose.Up(dbConn, "migrations"); err != nil {
		log.Panic(err)
		return nil, nil, err
	}

	queries := sqlc.New(dbConn)

	return dbConn, queries, nil

}
