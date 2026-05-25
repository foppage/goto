-- name: ListGotos :many
SELECT * FROM Goto
WHERE id = ?;

-- name: GetGoto :one
SELECT * FROM Goto;

-- name: UpsertGoto :one
INSERT INTO Goto (
    name,
    dest
) VALUES (
    ?, ?
) ON CONFLICT (name) DO UPDATE SET
dest = excluded.dest
RETURNING *;

-- name: DeleteGoto :exec
DELETE FROM Goto WHERE id = ?;