import { executeQuery } from "../database/database.js";
import { format } from "../deps.js";

const formattedDate = (date) => {
  return format(date, "yyyy-MM-dd");
};

const _getMorningReports = async () => {
  const res = await executeQuery(
    "SELECT id, date, sleep_duration, sleep_quality, morning_mood FROM morning_reports",
  );
  if (res && res.rowCount > 0) {
    return res.rowsOfObjects();
  }
  return [];
};

const _getEveningReports = async () => {
  const res = await executeQuery(
    "SELECT id, date, sports_duration, study_duration, eating_quality, evening_mood FROM evening_reports",
  );
  if (res && res.rowCount > 0) {
    return res.rowsOfObjects();
  }
  return [];
};

const getReports = async () => {
  const morningReports = await _getMorningReports();
  const eveningReports = await _getEveningReports();

  return [...morningReports, ...eveningReports];
};

const _getMorningAverages = async ({ week, month, year }) => {
  const res = await executeQuery(
    `SELECT
    AVG(sleep_duration)::numeric(10,2) AS average_sleep_duration,
    AVG(sleep_quality)::numeric(10,2) AS average_sleep_quality,
    AVG(morning_mood)::numeric(10,2) AS average_morning_mood
    FROM morning_reports
    WHERE to_char(date, $1) = $2;`,
    week ? "IYYY-IW" : "IYYY-MM",
    week ? `${year}-${week}` : `${year}-${month}`,
  );
  if (
    res &&
    res.rowCount > 0 && // why res.rowCount > 0 when there is no actual data...
    res.rowsOfObjects()[0]["average_morning_mood"]
  ) {
    return res.rowsOfObjects()[0];
  } else {
    return {
      average_sleep_duration: "N/A",
      average_sleep_quality: "N/A",
      average_morning_mood: "N/A",
    };
  }
};

const _getEveningAverages = async ({ week, month, year }) => {
  const res = await executeQuery(
    `SELECT
    AVG(sports_duration)::numeric(10,2) AS average_sports_duration,
    AVG(study_duration)::numeric(10,2) AS average_study_duration,
    AVG(eating_quality)::numeric(10,2) AS average_eating_quality,
    AVG(evening_mood)::numeric(10,2) AS average_evening_mood
    FROM evening_reports
    WHERE to_char(date, $1) = $2;`,
    week ? "IYYY-IW" : "IYYY-MM",
    week ? `${year}-${week}` : `${year}-${month}`,
  );
  if (
    res &&
    res.rowCount > 0 && // why res.rowCount > 0 when there is no actual data...
    res.rowsOfObjects()[0]["average_evening_mood"]
  ) {
    return res.rowsOfObjects()[0];
  } else {
    return {
      average_sports_duration: "N/A",
      average_study_duration: "N/A",
      average_eating_quality: "N/A",
      average_evening_mood: "N/A",
    };
  }
};

const getReportAverages = async (params) => {
  if ((!params.week && !params.month) || (params.week && params.month)) {
    throw "Define week or month";
  }
  // supports the current year only
  const year = format(new Date(), "yyyy");
  const morningAvg = await _getMorningAverages({ ...params, year });
  const eveningAvg = await _getEveningAverages({ ...params, year });

  return { ...morningAvg, ...eveningAvg };
};

const addMorningReport = async (report) => {
  await executeQuery(
    `INSERT INTO morning_reports
    (user_id, date, sleep_duration, sleep_quality, morning_mood)
    VALUES ($1, $2, $3, $4, $5);`,
    1, // TODO allow other users
    report.get("date"),
    report.get("sleep_duration"),
    report.get("sleep_quality"),
    report.get("morning_mood"),
  );
};

const addEveningReport = async (report) => {
  await executeQuery(
    `INSERT INTO evening_reports
    (user_id, date, sports_duration, study_duration, eating_quality, evening_mood)
    VALUES ($1, $2, $3, $4, $5, $6);`,
    1, // TODO allow other users
    report.get("date"),
    report.get("sports_duration"),
    report.get("study_duration"),
    report.get("eating_quality"),
    report.get("evening_mood"),
  );
};

const _getMorningReport = async (date) => {
  const res = await executeQuery(
    `SELECT sleep_duration, sleep_quality, morning_mood
    FROM morning_reports
    WHERE date_trunc('day', date) = $1;`,
    formattedDate(date),
  );
  if (res && res.rowCount > 0) {
    return res.rowsOfObjects()[0]; // TODO make sure only one exists
  }
  return { sleep_duration: "N/A", sleep_quality: "N/A", morning_mood: "N/A" };
};

const _getEveningReport = async (date) => {
  const res = await executeQuery(
    `SELECT sports_duration, study_duration, eating_quality, evening_mood
    FROM evening_reports
    WHERE date_trunc('day', date) = $1;`,
    formattedDate(date),
  );
  if (res && res.rowCount > 0) {
    return res.rowsOfObjects()[0]; // TODO make sure only one exists
  }
  return {
    sports_duration: "N/A",
    study_duration: "N/A",
    eating_quality: "N/A",
    evening_mood: "N/A",
  };
};

const getReport = async (date) => {
  // TODO other than the current week
  const morningReport = await _getMorningReport(date);
  const eveningReport = await _getEveningReport(date);
  const report = { ...morningReport, ...eveningReport };
  // deno-lint-ignore camelcase
  const avg_mood =
    report.morning_mood === "N/A" || report.evening_mood === "N/A"
      ? "N/A"
      : ((report.morning_mood + report.evening_mood) / 2).toFixed(2);
  return { ...report, avg_mood };
};

export {
  addEveningReport,
  addMorningReport,
  formattedDate,
  getReport,
  getReportAverages,
  getReports,
};
