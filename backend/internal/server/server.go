package server

import (
	"log"
	"net/http"

	"git.june.pet/june/goto/internal/controllers"
	"git.june.pet/june/goto/internal/sqlc"
	"github.com/gin-gonic/gin"
)

func CreateServer(queries *sqlc.Queries) {
	router := gin.Default()

	router.GET("/", func(ctx *gin.Context) {
		ctx.File("./dist/index.html")
	})
	router.StaticFile("/favicon.svg", "./dist/favicon.svg")
	router.Static("/assets", "./dist/assets")

	api := router.Group("/api")
	{
		api.GET("/destinations", controllers.ListDestinations(queries))
		api.POST("/destinations", controllers.CreateDestination(queries))
		api.DELETE("/destinations/:id", controllers.DeleteDestination(queries))
		api.PUT("/destinations/:id", controllers.UpdateDestination(queries))

		api.GET("/aliases", controllers.ListAliases(queries))
		api.POST("/aliases", controllers.CreateAlias(queries))
		api.DELETE("/aliases/:id", controllers.DeleteAlias(queries))
		api.PUT("/aliases/:id", controllers.UpdateAlias(queries))
	}

	router.GET("/s", controllers.ResolveQuery(queries))

	err := http.ListenAndServe(":6020", router)
	if err != nil {
		log.Panic(err)
	}
}
