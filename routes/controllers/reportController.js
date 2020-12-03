import { format } from "../../deps.js";
import * as reportService from "../../services/reportService.js";

const formattedDate = (date) => {
  console.log(date);
  return format(date, "yyyy-MM-dd");
};

const getLanding = async ({ render }) => {
  const todaysMorningReport = await reportService.getMorningReport(
    formattedDate(new Date())
  );
  const yesterdaysMorningReport = await reportService.getMorningReport(
    formattedDate(new Date(Date.now() - 24 * 60 * 60 * 1000))
  );
  render("index.ejs", {
    morningReports: await reportService.getAllMorningReports(),
    date: formattedDate(new Date()),
    todaysMorningReport,
    yesterdaysMorningReport,
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

export { getBehaviourSummary, getLanding, postMorningform, postEveningform };
