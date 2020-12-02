import { format } from "../../deps.js";
import * as reportService from "../../services/reportService.js";

const today = () => {
  return format(new Date(), "yyyy-MM-dd");
};

const handleLanding = async ({ render }) => {
  render("index.ejs", {
    morningReports: await reportService.getAllMorningReports(),
    date: today(),
  });
};

const handleBehaviourSummary = async ({ render }) => {
  render("summary.ejs", await reportService.getReportAverages());
};

const handlePostMorningForm = async ({ request, response }) => {
  const report = await request.body().value;
  // TODO validate report
  await reportService.addMorningReport(report);
  response.redirect("/");
};

export { handleLanding, handleBehaviourSummary, handlePostMorningForm };
