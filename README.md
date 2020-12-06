# my-monitor

## Configuring Postgres database:

After creating your Postgres database, select the correct timezone, for example:

```
SET timezone TO 'Europe/Helsinki';
```

then add proper tables with:

```
CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  email VARCHAR(320) NOT NULL,
  password CHAR(60) NOT NULL
);

CREATE UNIQUE INDEX ON users((lower(email)));

CREATE TABLE morning_reports (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id) NOT NULL,
    date DATE NOT NULL,
    sleep_duration REAL NOT NULL,
    sleep_quality INT NOT NULL CHECK (0 <= sleep_quality AND sleep_quality <= 5),
    morning_mood INT NOT NULL CHECK (0 <= morning_mood AND morning_mood <= 5)
);

CREATE TABLE evening_reports (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id) NOT NULL,
    date DATE NOT NULL,
    sports_duration REAL NOT NULL,
    study_duration REAL NOT NULL,
    eating_quality INT NOT NULL CHECK (0 <= eating_quality AND eating_quality <= 5),
    evening_mood INT NOT NULL CHECK (0 <= evening_mood AND evening_mood <= 5)
);
```

then create an `.env` file to project root, and add contents proper contents to:

```
PG_USER=
PG_PASSWORD=
PG_HOSTNAME=
PG_PORT=
PG_DB_NAME=
```

## Running the application

After the database has been configured, you can run

- app with: `./app.sh run`
- tests with: `./app.sh test`
- formatter with: `./app.sh format`
- linter with: `./app.sh lint`
- test+formatter+linter with: `./app.sh pre-commit`

(if the bash script is not working, you can use
`deno run --allow-read --allow-net --unstable app.js`
direcltly to run the application, etc.)

# Differences compared to the

The website/api provides information on the week of the date, and not
necessarily for the past 7 days. This was done because it makes more
sense to me, and it is tecnically as harder/harder.
