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

CREATE TABLE IF NOT EXISTS public."addBook"
(
    unique_id character varying COLLATE pg_catalog."default" NOT NULL,
    title character varying COLLATE pg_catalog."default",
    author character varying COLLATE pg_catalog."default",
    isbn character varying COLLATE pg_catalog."default",
    copies character varying COLLATE pg_catalog."default",
    CONSTRAINT "addBook_pkey" PRIMARY KEY (unique_id)
)


CREATE TABLE IF NOT EXISTS public."borrowBook"
(
    unique_id character varying COLLATE pg_catalog."default" NOT NULL,
    title character varying COLLATE pg_catalog."default" NOT NULL,
    author character varying COLLATE pg_catalog."default" NOT NULL,
    isbn character varying COLLATE pg_catalog."default" NOT NULL,
    "borrowDate" character varying COLLATE pg_catalog."default" NOT NULL,
    "dueDate" character varying COLLATE pg_catalog."default" NOT NULL,
    CONSTRAINT "borrowBook_pkey" PRIMARY KEY (unique_id)
)
