package controllers

import (
	"net/http"

	"git.june.pet/june/goto/internal/sqlc"
	"github.com/gin-gonic/gin"
)

func ResolveQuery(queries *sqlc.Queries) gin.HandlerFunc {
	return func(ctx *gin.Context) {
		queryParam := ctx.Query("q")
		alias, err := queries.GetAliasWithDestinationByName(ctx.Request.Context(), queryParam)
		if err != nil {
			// can't find it, head back to dashboard
			ctx.Redirect(http.StatusMovedPermanently, "/")
			return
		}
		ctx.Redirect(http.StatusFound, alias.DestinationUrl)
	}
}
