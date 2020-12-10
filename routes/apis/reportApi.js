import * as reportService from "../../services/reportService.js";

const getReports = async ({ response }) => {
  response.body = await reportService.getReports();
};

const getApiSummary = async ({ response }) => {
  response.body = await reportService.getAllReportAveragesPast7days();
};

const getApiSummaryYearMonthDay = async ({ response, params }) => {
  response.body = await reportService.getAllReportAveragesByDate({
    year: params.year,
    month: params.month,
    day: params.day,
  });
};

export { getApiSummary, getApiSummaryYearMonthDay, getReports };
