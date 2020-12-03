import * as reportService from "../../services/reportService.js";

const getReports = async ({ response }) => {
  response.body = await reportService.getReports();
};

export { getReports };
