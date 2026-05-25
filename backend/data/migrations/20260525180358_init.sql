-- +goose Up
CREATE TABLE Goto(
                     "id" INTEGER PRIMARY KEY AUTOINCREMENT,
                     "name" VARCHAR(255) UNIQUE NOT NULL,
                     "dest" VARCHAR(255) NOT NULL
);

-- +goose Down
DROP TABLE Goto;
