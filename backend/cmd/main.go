package main

import (
	"log"

	"git.june.pet/june/goto/internal/db"
	"git.june.pet/june/goto/internal/server"
	_ "modernc.org/sqlite"
)

func main() {

	conn, queries, err := db.CreateDB()
	if err != nil {
		log.Panic(err)
	}
	defer conn.Close()

	server.CreateServer(queries)
}
