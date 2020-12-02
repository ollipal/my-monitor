# my-monitor

## Configuring Postgres database:

After creating your Postgres database, add proper tables with:

```
CREATE TABLE behaviors (
    id SERIAL PRIMARY KEY,
    title TEXT NOT NULL,
    content TEXT NOT NULL
);
```

Then create a `.env` file to project root, and add contents proper contents to:

```
PG_USER=
PG_PASSWORD=
PG_HOSTNAME=
PG_PORT=
PG_DB_NAME=
```
