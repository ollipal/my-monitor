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
    AVG(mood)::numeric(10,2) AS average_mood
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
    (user_id, date, sleep_duration, sleep_quality, mood)
    VALUES ($1, $2, $3, $4, $5);`,
    1, // TODO allow other users
    report.get("date"),
    report.get("sleep_duration"),
    report.get("sleep_quality"),
    report.get("mood")
  );
};

export { getAllMorningReports, getReportAverages, addMorningReport };
