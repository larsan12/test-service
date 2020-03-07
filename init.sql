CREATE SCHEMA test;

CREATE TABLE test.users (
    id bigint NOT NULL,
    login text NOT NULL,
    password text NOT NULL,
    enabled boolean NOT NULL
);

CREATE SEQUENCE test.users_ids INCREMENT BY 1 START WITH 123;
ALTER TABLE test.users ALTER id SET DEFAULT nextval('test.users_ids'::regclass);

ALTER TABLE test.users ADD CONSTRAINT login_uniq UNIQUE (login);
ALTER TABLE test.users ADD CONSTRAINT id_primary PRIMARY KEY (id);
ALTER TABLE test.users OWNER TO postgres;

INSERT INTO test.users (login, password, enabled) VALUES ('test1', '$2a$10$GCP8RdW6AXdvxSShI3taL.8BfUT0nzVxwxLDsaMh8vZFUQKghgODy', true);
INSERT INTO test.users (login, password, enabled) VALUES ('test2', '$2a$10$GCP8RdW6AXdvxSShI3taL.8BfUT0nzVxwxLDsaMh8vZFUQKghgODy', true);
INSERT INTO test.users (login, password, enabled) VALUES ('test3', '$2a$10$GCP8RdW6AXdvxSShI3taL.8BfUT0nzVxwxLDsaMh8vZFUQKghgODy', true);
INSERT INTO test.users (login, password, enabled) VALUES ('test4', '$2a$10$GCP8RdW6AXdvxSShI3taL.8BfUT0nzVxwxLDsaMh8vZFUQKghgODy', false);