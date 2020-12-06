// deno-lint-ignore-file camelcase
import {
  executeQuery,
  getQueryFirst,
  getQueryRows,
} from "../database/database.js";
import { format } from "../deps.js";

const _EVENING_NA = {
  average_sports_duration: "N/A",
  average_study_duration: "N/A",
  average_eating_quality: "N/A",
  average_evening_mood: "N/A",
};

const _MORNING_NA = {
  average_sleep_duration: "N/A",
  average_sleep_quality: "N/A",
  average_morning_mood: "N/A",
};

const formattedDate = (date) => {
  return format(date, "yyyy-MM-dd");
};

const _getMorningReports = async () => {
  return await getQueryRows(
    "SELECT id, date, sleep_duration, sleep_quality, morning_mood FROM morning_reports",
  );
};

const _getEveningReports = async () => {
  return await getQueryRows(
    "SELECT id, date, sports_duration, study_duration, eating_quality, evening_mood FROM evening_reports",
  );
};

const getReports = async () => {
  const morningReports = await _getMorningReports();
  const eveningReports = await _getEveningReports();

  return [...morningReports, ...eveningReports];
};

const _getUserMorningAveragesByWeekOrMonth = async ({
  userId,
  week,
  month,
  year,
}) => {
  const averages = await getQueryFirst(
    `SELECT
    AVG(sleep_duration)::numeric(10,2) AS average_sleep_duration,
    AVG(sleep_quality)::numeric(10,2) AS average_sleep_quality,
    AVG(morning_mood)::numeric(10,2) AS average_morning_mood
    FROM morning_reports
    WHERE user_id = $1 AND to_char(date, $2) = $3;`,
    userId,
    week ? "IYYY-IW" : "IYYY-MM",
    week ? `${year}-${week}` : `${year}-${month}`,
  );

  // why res.rowCount > 0 when there is no actual data...
  if (averages?.average_morning_mood) {
    return averages;
  } else {
    return _MORNING_NA;
  }
};

const _getUserEveningAveragesByWeekOrMonth = async ({
  userId,
  week,
  month,
  year,
}) => {
  const averages = await getQueryFirst(
    `SELECT
    AVG(sports_duration)::numeric(10,2) AS average_sports_duration,
    AVG(study_duration)::numeric(10,2) AS average_study_duration,
    AVG(eating_quality)::numeric(10,2) AS average_eating_quality,
    AVG(evening_mood)::numeric(10,2) AS average_evening_mood
    FROM evening_reports
    WHERE user_id = $1 AND to_char(date, $2) = $3;`,
    userId,
    week ? "IYYY-IW" : "IYYY-MM",
    week ? `${year}-${week}` : `${year}-${month}`,
  );

  // why res.rowCount > 0 when there is no actual data...
  if (averages?.average_evening_mood) {
    return averages;
  } else {
    return _EVENING_NA;
  }
};

const getUserReportAveragesByWeekOrMonth = async ({ userId, week, month }) => {
  // TODO validation earlier?
  if ((!week && !month) || (week && month)) {
    throw Error("Define week or month (only one)");
  }

  // supports the current year only
  const year = format(new Date(), "yyyy");
  const morningAvg = await _getUserMorningAveragesByWeekOrMonth({
    userId,
    week,
    month,
    year,
  });
  const eveningAvg = await _getUserEveningAveragesByWeekOrMonth({
    userId,
    week,
    month,
    year,
  });

  return { ...morningAvg, ...eveningAvg };
};

const makeNumeric = (obj) => {
  for (const key of Object.keys(obj)) {
    obj[key] = Number(obj[key]);
  }
  return obj;
};

const _getAllMorningAveragesPast7days = async () => {
  const averages = await getQueryFirst(
    `SELECT
    AVG(sleep_duration)::numeric(10,2) AS average_sleep_duration,
    AVG(sleep_quality)::numeric(10,2) AS average_sleep_quality,
    AVG(morning_mood)::numeric(10,2) AS average_morning_mood
    FROM morning_reports
    WHERE date BETWEEN $1 AND $2`,
    new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
    new Date(),
  );

  // why res.rowCount > 0 when there is no actual data...
  if (averages?.average_morning_mood) {
    return makeNumeric(averages);
  } else {
    return _MORNING_NA;
  }
};

const _getAllEveningAveragesPast7days = async () => {
  const averages = await getQueryFirst(
    `SELECT
    AVG(sports_duration)::numeric(10,2) AS average_sports_duration,
    AVG(study_duration)::numeric(10,2) AS average_study_duration,
    AVG(eating_quality)::numeric(10,2) AS average_eating_quality,
    AVG(evening_mood)::numeric(10,2) AS average_evening_mood
    FROM evening_reports
    WHERE date BETWEEN $1 AND $2`,
    new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
    new Date(),
  );

  // why res.rowCount > 0 when there is no actual data...
  if (averages?.average_evening_mood) {
    return makeNumeric(averages);
  } else {
    return _EVENING_NA;
  }
};

const getAllReportAveragesPast7days = async () => {
  const morningAvg = await _getAllMorningAveragesPast7days();
  const eveningAvg = await _getAllEveningAveragesPast7days();
  return { ...morningAvg, ...eveningAvg };
};

const _getAllMorningAveragesByDate = async (date) => {
  const averages = await getQueryFirst(
    `SELECT
    AVG(sleep_duration)::numeric(10,2) AS average_sleep_duration,
    AVG(sleep_quality)::numeric(10,2) AS average_sleep_quality,
    AVG(morning_mood)::numeric(10,2) AS average_morning_mood
    FROM morning_reports
    WHERE to_char(date, 'IYYY-MM-DD') = $1;`,
    date,
  );

  // why res.rowCount > 0 when there is no actual data...
  if (averages?.average_morning_mood) {
    return makeNumeric(averages);
  } else {
    return _MORNING_NA;
  }
};

const _getAllEveningAveragesByDate = async (date) => {
  const averages = await getQueryFirst(
    `SELECT
    AVG(sports_duration)::numeric(10,2) AS average_sports_duration,
    AVG(study_duration)::numeric(10,2) AS average_study_duration,
    AVG(eating_quality)::numeric(10,2) AS average_eating_quality,
    AVG(evening_mood)::numeric(10,2) AS average_evening_mood
    FROM evening_reports
    WHERE to_char(date, 'IYYY-MM-DD') = $1;`,
    date,
  );

  // why res.rowCount > 0 when there is no actual data...
  if (averages?.average_evening_mood) {
    return makeNumeric(averages);
  } else {
    return _EVENING_NA;
  }
};

const getAllReportAveragesByDate = async ({ year, month, day }) => {
  const date = format(new Date(year, month - 1, day), "yyyy-MM-dd");
  const morningAvg = await _getAllMorningAveragesByDate(date);
  const eveningAvg = await _getAllEveningAveragesByDate(date);
  return { ...morningAvg, ...eveningAvg };
};

const addMorningReport = async (report, userId) => {
  await executeQuery(
    `INSERT INTO morning_reports
    (user_id, date, sleep_duration, sleep_quality, morning_mood)
    VALUES ($1, $2, $3, $4, $5);`,
    userId,
    report.get("date"),
    report.get("sleep_duration"),
    report.get("sleep_quality"),
    report.get("morning_mood"),
  );
};

const addEveningReport = async (report, userId) => {
  await executeQuery(
    `INSERT INTO evening_reports
    (user_id, date, sports_duration, study_duration, eating_quality, evening_mood)
    VALUES ($1, $2, $3, $4, $5, $6);`,
    userId,
    report.get("date"),
    report.get("sports_duration"),
    report.get("study_duration"),
    report.get("eating_quality"),
    report.get("evening_mood"),
  );
};

const _getMorningReport = async (date, userId) => {
  const report = await getQueryFirst(
    `SELECT sleep_duration, sleep_quality, morning_mood
    FROM morning_reports
    WHERE user_id = $1 AND date_trunc('day', date) = $2;`,
    userId,
    formattedDate(date),
  );
  if (report) {
    return report;
  } else {
    return { sleep_duration: "N/A", sleep_quality: "N/A", morning_mood: "N/A" };
  }
};

const _getEveningReport = async (date, userId) => {
  const report = await getQueryFirst(
    `SELECT sports_duration, study_duration, eating_quality, evening_mood
    FROM evening_reports
    WHERE user_id = $1 AND date_trunc('day', date) = $2;`,
    userId,
    formattedDate(date),
  );
  if (report) {
    return report;
  } else {
    return {
      sports_duration: "N/A",
      study_duration: "N/A",
      eating_quality: "N/A",
      evening_mood: "N/A",
    };
  }
};

const getReport = async (date, userId) => {
  const morningReport = await _getMorningReport(date, userId);
  const eveningReport = await _getEveningReport(date, userId);
  const report = { ...morningReport, ...eveningReport };

  // calculate the average mood based on the rersults
  let avg_mood;
  if (report.morning_mood === "N/A" || report.evening_mood === "N/A") {
    avg_mood = "N/A";
  } else {
    avg_mood = ((report.morning_mood + report.evening_mood) / 2).toFixed(2);
  }
  return { ...report, avg_mood };
};

export {
  addEveningReport,
  addMorningReport,
  formattedDate,
  getAllReportAveragesByDate,
  getAllReportAveragesPast7days,
  getReport,
  getReports,
  getUserReportAveragesByWeekOrMonth,
};
