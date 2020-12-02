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
    mood INT NOT NULL CHECK (0 <= mood AND mood <= 5)
);

CREATE TABLE evening_reports (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id) NOT NULL,
    date DATE NOT NULL,
    sports_exercise_duration REAL NOT NULL,
    study_duration REAL NOT NULL,
    eating_quality INT NOT NULL CHECK (0 <= eating_quality AND eating_quality <= 5),
    mood INT NOT NULL CHECK (0 <= mood AND mood <= 5)
);
```

then create a `.env` file to project root, and add contents proper contents to:

```
PG_USER=
PG_PASSWORD=
PG_HOSTNAME=
PG_PORT=
PG_DB_NAME=
```

## Running the application

After the database has been configured, run the application with:

`deno run --allow-read --allow-net app.js`
