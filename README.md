# my-monitor

With this application, you can keep track of your behavior, which means t
the time spent on:

- sleeping
- stydying
- exercises

and the quality of:

- sleeping
- eating
- mood

The application can be found at: https://my-m0nit0r.herokuapp.com/

It works with deno + oak framwork, server side rendering with .ejs and
is styled with PaperCSS! The deployment is automatically with Github
Actions to Heroku, and data is stored to PostgreSQL.

# Running the application locally

## Configuring Postgres database:

After creating your Postgres database, add proper tables with:

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

CREATE INDEX ON morning_reports(date_trunc('day', date::timestamp));

CREATE TABLE evening_reports (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id) NOT NULL,
    date DATE NOT NULL,
    sports_duration REAL NOT NULL,
    study_duration REAL NOT NULL,
    eating_quality INT NOT NULL CHECK (0 <= eating_quality AND eating_quality <= 5),
    evening_mood INT NOT NULL CHECK (0 <= evening_mood AND evening_mood <= 5)
);

CREATE INDEX ON evening_reports(date_trunc('day', date::timestamp));
```

then create an `.env` file to `/config`, and add these variables
with proper values to it:

```
PG_USER=
PG_PASSWORD=
PG_HOSTNAME=
PG_PORT=
PG_DB_NAME=
```

(the same values can be found from `/config/.env.examples`)

## starting the application

After the database has been configured, you can run

- app with: `./app.sh run`
- tests with: `./app.sh test`
- formatter with: `./app.sh format`
- linter with: `./app.sh lint`
- test+formatter+linter with: `./app.sh pre-commit`
- requirements met with: `./app.sh requirements`

(if the bash script is not working on your platform, you can use
`deno run --allow-read --allow-net --unstable --allow-env app.js`
directly to run the application, and
`TESTING=1 deno test --allow-read --allow-net --allow-env --unstable`
for running the tests)

# Differences compared to the requirements

The website/api provides information on the week of the date, and not
necessarily for the past 7 days. This was done because it makes more
sense to me, and it is tecnically as harder/harder.

# Requirements

The requirements for the project requirements can be found at `REQUIREMENTS.md`

Each requirement that has been met is marked with a '✅' symbol.

Each requirement that was implemented, but not in a way that described is marked with ❌
and attached with an explanation.

The current ratio of [requirements implementd]/[total requirements] can be printed with
`./app.sh requirements`
