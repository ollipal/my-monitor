/*
users
*/
CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  email VARCHAR(320) NOT NULL,
  password CHAR(60) NOT NULL
);

CREATE UNIQUE INDEX ON users((lower(email)));


/*
morning_reports
*/
CREATE TABLE morning_reports (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id) NOT NULL,
    date DATE NOT NULL,
    sleep_duration REAL NOT NULL,
    sleep_quality INT NOT NULL CHECK (0 <= sleep_quality AND sleep_quality <= 5),
    morning_mood INT NOT NULL CHECK (0 <= morning_mood AND morning_mood <= 5)
);

CREATE INDEX ON morning_reports(date_trunc('day', date::timestamp));

/*
evening_reports
*/
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