import * as reportService from "../../services/reportService.js";

const handleGet = async ({ render }) => {
  render("index.ejs", {
    morningReports: await reportService.getAllMorningReports(),
  });
};

export { handleGet };
