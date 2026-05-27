-- +goose Up
CREATE TABLE destination(
                     "id" INTEGER PRIMARY KEY AUTOINCREMENT,
                     "name" VARCHAR(255) UNIQUE NOT NULL,
                     "url" VARCHAR(255) UNIQUE NOT NULL
);

CREATE TABLE alias(
                            "id" INTEGER PRIMARY KEY AUTOINCREMENT,
                            "name" VARCHAR(255) UNIQUE NOT NULL,
                            "destination_id" INTEGER NOT NULL,
                            FOREIGN KEY (destination_id) REFERENCES destination(id) ON DELETE CASCADE
);

-- +goose Down
DROP TABLE destination;
DROP TABLE alias;
