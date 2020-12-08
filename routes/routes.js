import { Router } from "../deps.js";
import {
  getAuthLogin,
  getAuthLogout,
  getAuthRegister,
  postAuthLogin,
  postAuthLogout,
  postAuthRegister,
} from "./controllers/userController.js";
import {
  getBehaviourReporting,
  getBehaviourSummary,
  getLanding,
  postEveningform,
  postMonthform,
  postMorningform,
  postWeekform,
} from "./controllers/reportController.js";
import { getApiSummary, getApiSummaryYearMonthDay } from "./apis/reportApi.js";

const router = new Router();

router
  .get("/", getLanding)
  .post("/morningform", postMorningform)
  .post("/eveningform", postEveningform)
  .get("/auth/register", getAuthRegister)
  .post("/auth/register", postAuthRegister)
  .get("/auth/login", getAuthLogin)
  .post("/auth/login", postAuthLogin)
  .get("/auth/logout", getAuthLogout)
  .post("/auth/logout", postAuthLogout)
  .get("/behavior/reporting", getBehaviourReporting)
  .get("/behavior/summary", getBehaviourSummary)
  .post("/behavior/summary/weekform", postWeekform)
  .post("/behavior/summary/monthform", postMonthform)
  .get("/api/summary", getApiSummary)
  .get("/api/summary/:year/:month/:day", getApiSummaryYearMonthDay);

export { router };
