// deno-lint-ignore-file camelcase
import { executeQuery, getQueryFirst } from "../database/database.js";
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

const _getUserMorningAveragesByWeekOrMonth = async ({
  userId,
  week,
  month,
  year,
}) => {
  if ((!week && !month) || (week && month)) {
    throw Error("Define week or month (only one)");
  }
  const averages = await getQueryFirst(
    `SELECT
    AVG(sleep_duration)::numeric(10,2) AS average_sleep_duration,
    AVG(sleep_quality)::numeric(10,2) AS average_sleep_quality,
    AVG(morning_mood)::numeric(10,2) AS average_morning_mood
    FROM morning_reports
    WHERE user_id = $1 AND to_char(date, $2) = $3;`,
    userId,
    week ? "IYYY-IW" : "IYYY-MM",
    week ? `${year}-${week}` : `${year}-${month}`
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
  if ((!week && !month) || (week && month)) {
    throw Error("Define week or month (only one)");
  }
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
    week ? `${year}-${week}` : `${year}-${month}`
  );

  // why res.rowCount > 0 when there is no actual data...
  if (averages?.average_evening_mood) {
    return averages;
  } else {
    return _EVENING_NA;
  }
};

const getUserReportAveragesByWeek = async ({ userId, week, year }) => {
  const morningAvg = await _getUserMorningAveragesByWeekOrMonth({
    userId,
    week,
    month: null,
    year,
  });
  const eveningAvg = await _getUserEveningAveragesByWeekOrMonth({
    userId,
    week,
    month: null,
    year,
  });

  return { ...morningAvg, ...eveningAvg };
};

const getUserReportAveragesByMonth = async ({ userId, month, year }) => {
  const morningAvg = await _getUserMorningAveragesByWeekOrMonth({
    userId,
    week: null,
    month,
    year,
  });
  const eveningAvg = await _getUserEveningAveragesByWeekOrMonth({
    userId,
    week: null,
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
    new Date()
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
    new Date()
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
    date
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
    date
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

const addMorningReport = async (values, userId) => {
  // delete old (might not exist)
  await executeQuery(
    `DELETE FROM morning_reports
    WHERE user_id = $1 AND to_char(date, 'IYYY-MM-DD') = $2;`,
    userId,
    values.morningDateString
  );
  // add new
  await executeQuery(
    `INSERT INTO morning_reports
    (user_id, date, sleep_duration, sleep_quality, morning_mood)
    VALUES ($1, $2, $3, $4, $5);`,
    userId,
    values.morningDateString,
    values.sleepDuration,
    values.sleepQuality,
    values.morningMood
  );
};

const addEveningReport = async (values, userId) => {
  // delete old (might not exist)
  await executeQuery(
    `DELETE FROM evening_reports
    WHERE user_id = $1 AND to_char(date, 'IYYY-MM-DD') = $2;`,
    userId,
    values.eveningDateString
  );
  // add new
  await executeQuery(
    `INSERT INTO evening_reports
    (user_id, date, sports_duration, study_duration, eating_quality, evening_mood)
    VALUES ($1, $2, $3, $4, $5, $6);`,
    userId,
    values.eveningDateString,
    values.sportsDuration,
    values.studyDuration,
    values.eatingQuality,
    values.eveningMood
  );
};

const _getMorningMood = async (date, userId) => {
  return await getQueryFirst(
    `SELECT morning_mood
    FROM morning_reports
    WHERE user_id = $1 AND date_trunc('day', date::timestamp) = $2;`,
    userId,
    formattedDate(date)
  );
};

const _getEveningMood = async (date, userId) => {
  return await getQueryFirst(
    `SELECT evening_mood
    FROM evening_reports
    WHERE user_id = $1 AND date_trunc('day', date::timestamp) = $2;`,
    userId,
    formattedDate(date)
  );
};

const getAverageMood = async (date, userId) => {
  const morningMoodResult = await _getMorningMood(date, userId);
  const eveningMoodResult = await _getEveningMood(date, userId);

  // calculate the average mood based on the rersults
  if (!morningMoodResult || !eveningMoodResult) {
    return null;
  } else {
    return (
      (morningMoodResult.morning_mood + eveningMoodResult.evening_mood) /
      2
    ).toFixed(2);
  }
};

const morningReportDoneToday = async (userId) => {
  const report = await getQueryFirst(
    `SELECT *
    FROM morning_reports
    WHERE user_id = $1 AND date_trunc('day', date::timestamp) = $2;`,
    userId,
    formattedDate(new Date())
  );
  return report ? true : false;
};
const eveningReportDoneToday = async (userId) => {
  const report = await getQueryFirst(
    `SELECT *
    FROM evening_reports
    WHERE user_id = $1 AND date_trunc('day', date::timestamp) = $2;`,
    userId,
    formattedDate(new Date())
  );
  return report ? true : false;
};

export {
  // testing
  _getUserEveningAveragesByWeekOrMonth,
  _getUserMorningAveragesByWeekOrMonth,
  // normal
  addEveningReport,
  addMorningReport,
  eveningReportDoneToday,
  formattedDate,
  getAllReportAveragesByDate,
  getAllReportAveragesPast7days,
  getAverageMood,
  getUserReportAveragesByMonth,
  getUserReportAveragesByWeek,
  morningReportDoneToday,
};
