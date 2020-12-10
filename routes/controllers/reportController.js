import * as reportService from "../../services/reportService.js";
import {
  getAndForgetValuesErrors,
  getUserEmail,
  getUserId,
  getWeekMonth,
  saveMonth,
  saveValuesErrors,
  saveWeek,
} from "../../services/sessionService.js";
import {
  validateEveningReport,
  validateMorningReport,
} from "../../services/validationService.js";
import { format, weekOfYear } from "../../deps.js";

const getLanding = async ({ session, render }) => {
  const userId = await getUserId(session);
  const todaysAverageMood = await reportService.getAverageMood(
    new Date(),
    userId,
  );
  const yesterdaysAverageMood = await reportService.getAverageMood(
    new Date(Date.now() - 24 * 60 * 60 * 1000),
    userId,
  );
  const moodSummary = !todaysAverageMood || !yesterdaysAverageMood
    ? "not sure how things are looking..."
    : todaysAverageMood > yesterdaysAverageMood
    ? "things are looking bright today"
    : todaysAverageMood === yesterdaysAverageMood
    ? "things are looking the same as yesterday"
    : "things are looking gloomy today";
  render("index.ejs", {
    todaysAverageMood: todaysAverageMood ? todaysAverageMood : "N/A",
    yesterdaysAverageMood: yesterdaysAverageMood
      ? yesterdaysAverageMood
      : "N/A",
    moodSummary,
    email: await getUserEmail(session),
  });
};

const getBehaviourReporting = async ({ session, render }) => {
  const userId = await getUserId(session);
  const [values, errors] = await getAndForgetValuesErrors(session);
  render("behaviorReporting.ejs", {
    date: reportService.formattedDate(new Date()),
    morningReportDoneToday: await reportService.morningReportDoneToday(userId),
    eveningReportDoneToday: await reportService.eveningReportDoneToday(userId),
    email: await getUserEmail(session),
    values,
    errors,
  });
};

const getBehaviourSummary = async ({ session, render }) => {
  const userId = await getUserId(session);
  // get saved week/month or use current
  let [week, month] = await getWeekMonth(session);
  if (!week) {
    week = weekOfYear(new Date());
  }
  if (!month) {
    month = Number(format(new Date(), "MM"));
  }
  // supports the current year only
  const year = format(new Date(), "yyyy");

  const weekAvgs = await reportService.getUserReportAveragesByWeek({
    userId,
    week,
    year,
  });
  const monthAvgs = await reportService.getUserReportAveragesByMonth({
    userId,
    month,
    year,
  });

  render("behaviorSummary.ejs", {
    weekAvgs,
    monthAvgs,
    week,
    month,
    email: await getUserEmail(session),
  });
};

const _parseMorningValues = async (request) => {
  const report = await request.body().value;
  /*
   * String are handled separately
   * because parseFloat("") returns NaN
   * which passes all other tests...
   */
  return {
    morningDateString: report.get("date"),
    sleepDurationString: report.get("sleep_duration"),
    sleepQualityString: report.get("sleep_quality"),
    morningMoodString: report.get("morning_mood"),
    sleepDuration: parseFloat(report.get("sleep_duration")),
    sleepQuality: parseFloat(report.get("sleep_quality")),
    morningMood: parseFloat(report.get("morning_mood")),
  };
};

const _parseEveningValues = async (request) => {
  const report = await request.body().value;
  /*
   * String are handled separately
   * because parseFloat("") returns NaN
   * which passes all other tests...
   */
  return {
    eveningDateString: report.get("date"),
    sportsDurationString: report.get("sports_duration"),
    studyDurationString: report.get("study_duration"),
    eatingQualityString: report.get("eating_quality"),
    eveningMoodString: report.get("evening_mood"),
    sportsDuration: parseFloat(report.get("sports_duration")),
    studyDuration: parseFloat(report.get("study_duration")),
    eatingQuality: parseFloat(report.get("eating_quality")),
    eveningMood: parseFloat(report.get("evening_mood")),
  };
};

const postMorningform = async ({ request, response, session }) => {
  const userId = await getUserId(session);
  const values = await _parseMorningValues(request);
  const [passes, errors] = await validateMorningReport(values);

  if (passes) {
    await reportService.addMorningReport(values, userId);
    response.redirect("/behavior/reporting");
  } else {
    await saveValuesErrors(session, values, errors);
    response.redirect("/behavior/reporting");
  }
};

const postEveningform = async ({ request, response, session }) => {
  const userId = await getUserId(session);
  const values = await _parseEveningValues(request);
  const [passes, errors] = await validateEveningReport(values);

  if (passes) {
    await reportService.addEveningReport(values, userId);
    response.redirect("/behavior/reporting");
  } else {
    await saveValuesErrors(session, values, errors);
    response.redirect("/behavior/reporting");
  }
};

const postWeekform = async ({ request, response, session }) => {
  // TODO validate week
  const week = (await request.body().value).get("week");
  await saveWeek(session, week);
  response.redirect("/behavior/summary");
};

const postMonthform = async ({ request, response, session }) => {
  // TODO validate month
  const month = (await request.body().value).get("month");
  await saveMonth(session, month);
  response.redirect("/behavior/summary");
};

export {
  getBehaviourReporting,
  getBehaviourSummary,
  getLanding,
  postEveningform,
  postMonthform,
  postMorningform,
  postWeekform,
};
