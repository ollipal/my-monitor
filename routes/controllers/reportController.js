import { format } from "../../deps.js";
import * as reportService from "../../services/reportService.js";

const today = () => {
  return format(new Date(), "yyyy-MM-dd");
};

const getLanding = async ({ render }) => {
  render("index.ejs", {
    morningReports: await reportService.getAllMorningReports(),
    date: today(),
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

export { getBehaviourSummary, getLanding, postMorningform };
