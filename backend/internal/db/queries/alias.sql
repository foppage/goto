-- name: ListAliases :many
SELECT * FROM alias;

-- name: ListAliasesByDestinationId :many
SELECT * FROM alias
WHERE destination_id = ?;

-- name: CreateAlias :one
INSERT INTO alias (name, destination_id)
VALUES (?, ?)
RETURNING *;

-- name: DeleteAliasByID :exec
DELETE FROM Alias
WHERE id = ?;

-- name: UpdateAliasByID :one
UPDATE alias
SET name = ?, destination_id = ?
WHERE id = ?
RETURNING *;