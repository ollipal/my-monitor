import { format } from "../../deps.js";
import * as reportService from "../../services/reportService.js";

const getLanding = async ({ render }) => {
  const todaysReport = await reportService.getReport(new Date());
  const yesterdaysReport = await reportService.getReport(
    new Date(Date.now() - 24 * 60 * 60 * 1000),
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

const getBehaviourSummary = async ({ render }) => {
  render("summary.ejs", await reportService.getReportAverages());
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

export { getBehaviourSummary, getLanding, postEveningform, postMorningform };
