import * as reportService from "../../services/reportService.js";

const getAllMorningReports = async ({ response }) => {
  response.body = await reportService.getAllMorningReports();
};

export { getAllMorningReports };
