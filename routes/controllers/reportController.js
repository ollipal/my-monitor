import * as reportService from "../../services/reportService.js";
import {
  getUserId,
  getWeekMonth,
  saveMonth,
  saveWeek,
} from "../../services/sessionService.js";
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
    ? ""
    : todaysAverageMood > yesterdaysAverageMood
    ? "things are looking bright today"
    : todaysAverageMood === yesterdaysAverageMood
    ? "things are looking the same as yesterday"
    : "things are looking gloomy today";
  render("index.ejs", {
    todaysAverageMood,
    yesterdaysAverageMood,
    moodSummary,
  });
};

const getBehaviourReporting = async ({ session, render }) => {
  const userId = await getUserId(session);
  render("behaviorReporting.ejs", {
    date: reportService.formattedDate(new Date()),
    morningReportDoneToday: await reportService.morningReportDoneToday(userId),
    eveningReportDoneToday: await reportService.eveningReportDoneToday(userId),
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

  render("behaviorSummary.ejs", { weekAvgs, monthAvgs, week, month });
};

const postMorningform = async ({ request, response, session }) => {
  const userId = await getUserId(session);
  const report = await request.body().value;
  // TODO validate report
  // TODO validate date is yyy-MM-dd
  await reportService.addMorningReport(report, userId);
  response.redirect("/behavior/reporting");
};

const postEveningform = async ({ request, response, session }) => {
  const userId = await getUserId(session);
  const report = await request.body().value;
  // TODO validate report
  await reportService.addEveningReport(report, userId);
  response.redirect("/behavior/reporting");
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
