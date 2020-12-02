import { executeQuery } from "../database/database.js";

const getAllMorningReports = async () => {
  const res = await executeQuery("SELECT * FROM morning_reports");
  if (res && res.rowCount > 0) {
    return res.rowsOfObjects();
  }
  return [];
};

const addMorningReport = async (report) => {
  await executeQuery(
    "INSERT INTO morning_reports " +
      "(user_id, date, sleep_duration, sleep_quality, mood) " +
      "VALUES ($1, $2, $3, $4, $5);",
    1, // TODO allow other users
    report.get("date"),
    report.get("sleep_duration"),
    report.get("sleep_quality"),
    report.get("mood")
  );
};

export { getAllMorningReports, addMorningReport };
