package main

import (
	"context"
	"database/sql"
	"embed"
	"log"
	"net/http"
	"net/url"
	"slices"
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

	r.GET("/s", func(c *gin.Context) {
		query := c.Query("q")
		var visited []string

		current := query

		for !slices.Contains(visited, current) {
			visited = append(visited, current)
			dest, err := queries.GetGoto(ctx, current)
			if err != nil {
				c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
				return
			}
			link, err := url.Parse(dest.Dest)
			if err != nil || !link.IsAbs() {
				current = dest.Dest
			} else {
				c.Redirect(http.StatusFound, link.String())
				return
			}
		}

		c.JSON(http.StatusLoopDetected, gin.H{"message": current + " was attempted to be visited twice"})

	})

	r.GET("/gotos", func(c *gin.Context) {
		gotos, err := queries.ListGotos(ctx)
		if err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"err": err.Error()})
			return
		}

		c.JSON(http.StatusOK, gotos)
		return
	})

	r.PUT("/gotos", func(c *gin.Context) {

		var params sqlc.UpsertGotoParams

		err := c.BindJSON(&params)
		if err != nil {
			log.Panic(err)
			return
		}

		upsertGoto, err := queries.UpsertGoto(ctx, params)
		if err != nil {
			log.Panic(err)
			return
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
