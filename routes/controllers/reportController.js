import * as reportService from "../../services/reportService.js";
import { format, weekOfYear } from "../../deps.js";

const getLanding = async ({ render }) => {
  const todaysReport = await reportService.getReport(new Date());
  const yesterdaysReport = await reportService.getReport(
    new Date(Date.now() - 24 * 60 * 60 * 1000)
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

const getBehaviourSummary = async ({ request, render }) => {
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
    reportAvgs = await reportService.getReportAverages({ month });
  } else {
    // else use week, which defaults to the current week
    current = { number: week, type: "week" };
    reportAvgs = await reportService.getReportAverages({ week });
  }
  render("summary.ejs", { ...reportAvgs, week, month, current });
};

const postMorningform = async ({ request, response }) => {
  const report = await request.body().value;
  // TODO validate report
  await reportService.addMorningReport(report);
  response.redirect("/");
};

const postEveningform = async ({ request, response }) => {
  const report = await request.body().value;
  // TODO validate report
  await reportService.addEveningReport(report);
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
  postMorningform,
  postWeekform,
  postMonthform,
};
