CREATE TABLE admin (
    unique_id VARCHAR PRIMARY KEY,
    name VARCHAR NOT NULL,
    email VARCHAR NOT NULL,
    password VARCHAR NOT NULL,
    address VARCHAR NOT NULL,
    number VARCHAR NOT NULL
);

CREATE TABLE "user" (
    unique_id VARCHAR PRIMARY KEY,
    name VARCHAR NOT NULL,
    email VARCHAR NOT NULL,
    password VARCHAR NOT NULL,
    number VARCHAR NOT NULL,
    role VARCHAR NOT NULL,
    status VARCHAR NOT NULL
);
