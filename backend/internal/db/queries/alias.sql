-- name: ListAliases :many
SELECT * FROM alias;

-- name: ListAliasesByDestinationId :many
SELECT * FROM alias
WHERE destination_id = ?;

-- name: GetAliasWithDestinationByName :one
SELECT a.id, a.name, d.id AS destination_id, d.name AS destination_name, d.url AS destination_url
FROM alias a
JOIN destination d ON a.destination_id = d.id
WHERE a.name = ?;

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