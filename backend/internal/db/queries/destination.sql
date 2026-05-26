-- name: ListDestinations :many
SELECT * FROM destination;

-- name: CreateDestination :one
INSERT INTO destination (name, url)
VALUES (?, ?)
RETURNING *;

-- name: DeleteDestinationByID :exec
DELETE FROM destination
WHERE id = ?;

-- name: GetDestinationByID :one
SELECT * FROM destination
WHERE id = ?;

-- name: UpdateDestinationByID :one
UPDATE destination
SET name = ?, url = ?
WHERE id = ?
RETURNING *;