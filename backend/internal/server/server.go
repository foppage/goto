package server

import (
	"log"

	"git.june.pet/june/goto/internal/controllers"
	"git.june.pet/june/goto/internal/sqlc"
	"github.com/gin-gonic/gin"
)

func CreateServer(queries *sqlc.Queries) {
	server := gin.Default()

	server.GET("/destinations", controllers.ListDestinations(queries))
	server.POST("/destinations", controllers.CreateDestination(queries))
	server.DELETE("/destinations/:id", controllers.DeleteDestination(queries))
	server.PUT("/destinations/:id", controllers.UpdateDestination(queries))

	err := server.Run()
	if err != nil {
		log.Panic(err)
	}
}
