import * as reportService from "../../services/reportService.js";
import { getUserId } from "../../services/sessionService.js";
import { format, weekOfYear } from "../../deps.js";

const getLanding = async ({ session, render }) => {
  const userId = await getUserId(session);
  const todaysReport = await reportService.getReport(new Date(), userId);
  const yesterdaysReport = await reportService.getReport(
    new Date(Date.now() - 24 * 60 * 60 * 1000),
    userId,
  );
  const mood =
    todaysReport.avg_mood === "N/A" || yesterdaysReport.avg_mood === "N/A"
      ? "Mood direction is not available"
      : todaysReport.avg_mood > yesterdaysReport.avg_mood
      ? "Mood is improving :D"
      : todaysReport.morning_mood === yesterdaysReport.morning_mood
      ? "Mood is the same as yesterday :)"
      : "Mood is not improving :(";
  render("index.ejs", {
    reports: await reportService.getReports(),
    date: reportService.formattedDate(new Date()),
    todaysReport,
    yesterdaysReport,
    mood,
  });
};

const getBehaviourSummary = async ({ request, session, render }) => {
  const userId = await getUserId(session);
  // get passed week and month, passed or current
  const searchParams = request.url.searchParams;
  const week = searchParams.has("week")
    ? searchParams.get("week")
    : weekOfYear(new Date());
  const month = searchParams.has("month")
    ? searchParams.get("month")
    : format(new Date(), "MM");

  let current, reportAvgs;
  if (searchParams.has("month")) {
    // use month if was passed
    current = { number: month, type: "month" };
    reportAvgs = await reportService.getUserReportAveragesByWeekOrMonth({
      month,
      userId,
    });
  } else {
    // else use week, which defaults to the current week
    current = { number: week, type: "week" };
    reportAvgs = await reportService.getUserReportAveragesByWeekOrMonth({
      week,
      userId,
    });
  }
  render("behaviorSummary.ejs", { ...reportAvgs, week, month, current });
};

const postMorningform = async ({ request, response, session }) => {
  const userId = await getUserId(session);
  const report = await request.body().value;
  // TODO validate report
  // TODO validate date is yyy-MM-dd
  await reportService.addMorningReport(report, userId);
  response.redirect("/");
};

const postEveningform = async ({ request, response, session }) => {
  const userId = await getUserId(session);
  const report = await request.body().value;
  // TODO validate report
  await reportService.addEveningReport(report, userId);
  response.redirect("/");
};

const postWeekform = async ({ request, response }) => {
  const week = (await request.body().value).get("week");
  // TODO validate week
  if (week) {
    response.redirect(`/behavior/summary?week=${week}`);
  } else {
    response.redirect("/behavior/summary");
  }
};

const postMonthform = async ({ request, response }) => {
  const month = (await request.body().value).get("month");
  // TODO validate month
  if (month) {
    response.redirect(`/behavior/summary?month=${month}`);
  } else {
    response.redirect("/behavior/summary");
  }
};

export {
  getBehaviourSummary,
  getLanding,
  postEveningform,
  postMonthform,
  postMorningform,
  postWeekform,
};
