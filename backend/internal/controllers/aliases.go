package controllers

import (
	"net/http"
	"strconv"

	"git.june.pet/june/goto/internal/sqlc"
	"github.com/gin-gonic/gin"
)

func ListAliases(queries *sqlc.Queries) gin.HandlerFunc {
	return func(ctx *gin.Context) {
		aliases, err := queries.ListAliases(ctx.Request.Context())
		if err != nil {
			ctx.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
			return
		}

		if len(aliases) == 0 {
			ctx.JSON(http.StatusOK, []sqlc.Alias{})
			return
		}

		ctx.JSON(http.StatusOK, aliases)
	}
}

func CreateAlias(queries *sqlc.Queries) gin.HandlerFunc {
	return func(ctx *gin.Context) {
		var params sqlc.CreateAliasParams
		err := ctx.BindJSON(&params)
		if err != nil {
			ctx.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
			return
		}

		alias, err := queries.CreateAlias(ctx.Request.Context(), params)
		if err != nil {
			ctx.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
			return
		}
		ctx.JSON(http.StatusOK, alias)
	}
}

func DeleteAlias(queries *sqlc.Queries) gin.HandlerFunc {
	return func(ctx *gin.Context) {
		id := ctx.Param("id")
		idInt, err := strconv.Atoi(id)
		if err != nil {
			ctx.JSON(400, gin.H{"error": "id must be integer"})
			return
		}

		err = queries.DeleteAliasByID(ctx.Request.Context(), int64(idInt))
		if err != nil {
			ctx.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
			return
		}
		ctx.Status(http.StatusNoContent)
	}
}

func UpdateAlias(queries *sqlc.Queries) gin.HandlerFunc {
	return func(ctx *gin.Context) {
		id := ctx.Param("id")
		idInt, err := strconv.Atoi(id)
		if err != nil {
			ctx.JSON(400, gin.H{"error": "id must be integer"})
			return
		}

		var params sqlc.UpdateAliasByIDParams

		err = ctx.BindJSON(&params)
		if err != nil {
			ctx.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
			return
		}

		params.ID = int64(idInt)

		alias, err := queries.UpdateAliasByID(ctx.Request.Context(), params)
		if err != nil {
			ctx.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
			return
		}
		ctx.JSON(http.StatusOK, alias)
	}
}
