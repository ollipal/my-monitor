import { executeQuery } from "../database/database.js";

const getAllMorningReports = async () => {
  const res = await executeQuery("SELECT * FROM morning_reports");
  if (res && res.rowCount > 0) {
    return res.rowsOfObjects();
  }
  return [];
};

const getReportAverages = async () => {
  // TODO other than the current week
  const res = await executeQuery(
    `SELECT
    AVG(sleep_duration)::numeric(10,2) AS average_sleep_duration,
    AVG(sleep_quality)::numeric(10,2) AS average_sleep_quality,
    AVG(morning_mood)::numeric(10,2) AS average_mood
    FROM morning_reports
    WHERE date BETWEEN date_trunc('week', NOW()) AND NOW();`
  );
  if (res && res.rowCount > 0) {
    return res.rowsOfObjects()[0];
  }
  return {};
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
    report.get("morning_mood")
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
    report.get("evening_mood")
  );
};

const getMorningReport = async (date) => {
  const res = await executeQuery(
    `SELECT sleep_duration, sleep_quality, morning_mood
    FROM morning_reports
    WHERE date_trunc('day', date) = $1;`,
    date
  );
  if (res && res.rowCount > 0) {
    return res.rowsOfObjects()[0]; // TODO make sure only one exists
  }
  return { sleep_duration: "N/A", sleep_quality: "N/A", morning_mood: "N/A" };
};

export {
  addMorningReport,
  addEveningReport,
  getAllMorningReports,
  getReportAverages,
  getMorningReport,
};
