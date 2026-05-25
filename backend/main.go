package main

import (
	"context"
	"database/sql"
	"embed"
	"log"
	"net/http"
	"strconv"

	"git.june.pet/june/goto/gen/sqlc"
	"github.com/gin-gonic/gin"
	"github.com/pressly/goose/v3"
	_ "modernc.org/sqlite"
)

//go:embed data/migrations/*.sql
var embedMigrations embed.FS

func main() {

	ctx := context.Background()

	db, err := sql.Open("sqlite", "./data/data.db")
	if err != nil {
		log.Panic(err)
	}
	defer db.Close()

	goose.SetBaseFS(embedMigrations)
	if err = goose.SetDialect("sqlite3"); err != nil {
		log.Panic(err)
	}

	if err = goose.Up(db, "data/migrations"); err != nil {
		log.Panic(err)
	}

	queries := sqlc.New(db)

	r := gin.Default()

	r.GET("/gotos", func(c *gin.Context) {
		gotos, err := queries.ListGotos(ctx)
		if err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"err": err.Error()})
		}

		c.JSON(http.StatusOK, gotos)
	})

	r.PUT("/gotos", func(c *gin.Context) {

		var params sqlc.UpsertGotoParams

		err := c.ShouldBindBodyWithJSON(&params)
		if err != nil {
			log.Panic(err)
		}

		upsertGoto, err := queries.UpsertGoto(ctx, params)
		if err != nil {
			log.Panic(err)
		}

		c.JSON(http.StatusOK, upsertGoto)
	})

	r.DELETE("/gotos/:id", func(c *gin.Context) {

		id := c.Param("id")
		id_str, err := strconv.Atoi(id)
		if err != nil {
			log.Panic(err)
		}

		err = queries.DeleteGoto(ctx, int64(id_str))
		if err != nil {
			log.Panic(err)
		}

		c.JSON(http.StatusOK, gin.H{
			"success": true,
		})
	})

	// Start server on port 8080 (default)
	// Server will listen on 0.0.0.0:8080 (localhost:8080 on Windows)
	err = r.Run()
	if err != nil {
		log.Panic(err)
	}

}
