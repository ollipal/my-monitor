import { executeQuery } from "../database/database.js";

const getAllMorningReports = async () => {
  const res = await executeQuery("SELECT * FROM morning_reports");
  if (res && res.rowCount > 0) {
    return res.rowsOfObjects();
  }
  return [];
};

export { getAllMorningReports };
