package controllers

import (
	"net/http"
	"strconv"

	"git.june.pet/june/goto/internal/sqlc"
	"github.com/gin-gonic/gin"
)

func ListDestinations(queries *sqlc.Queries) gin.HandlerFunc {
	return func(c *gin.Context) {
		destinations, err := queries.ListDestinations(c.Request.Context())
		if err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
			return
		}
		c.JSON(http.StatusOK, destinations)
	}
}

func CreateDestination(queries *sqlc.Queries) gin.HandlerFunc {
	return func(c *gin.Context) {

		var params sqlc.CreateDestinationParams

		err := c.ShouldBindJSON(&params)
		if err != nil {
			c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
			return
		}

		destination, err := queries.CreateDestination(c.Request.Context(), params)
		if err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
			return
		}

		c.JSON(http.StatusCreated, destination)
	}
}

func DeleteDestination(queries *sqlc.Queries) gin.HandlerFunc {
	return func(c *gin.Context) {

		id := c.Param("id")
		idInt, err := strconv.Atoi(id)
		if err != nil {
			c.JSON(http.StatusBadRequest, gin.H{
				"message": "id must be integer",
			})
			return
		}

		err = queries.DeleteDestinationByID(c.Request.Context(), int64(idInt))
		if err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
			return
		}

		c.Status(http.StatusNoContent)

	}
}

func UpdateDestination(queries *sqlc.Queries) gin.HandlerFunc {
	return func(c *gin.Context) {

		type putParamStruct struct {
			Name string `json:"name"`
			Url  string `json:"url"`
		}

		id := c.Param("id")

		idInt, err := strconv.Atoi(id)
		if err != nil {
			c.JSON(http.StatusBadRequest, gin.H{
				"message": "id must be integer",
			})
			return
		}

		var params putParamStruct
		err = c.ShouldBindJSON(&params)
		if err != nil {
			c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
			return
		}

		destination, err := queries.UpdateDestinationByID(c.Request.Context(), sqlc.UpdateDestinationByIDParams{
			ID:   int64(idInt),
			Name: params.Name,
			Url:  params.Url,
		})
		if err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
			return
		}

		c.JSON(http.StatusOK, destination)

	}
}
