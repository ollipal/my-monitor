import { Router } from "../deps.js";
import {
  getAuthLogin,
  getAuthRegister,
  postAuthLogin,
  postAuthRegister,
} from "./controllers/userController.js";
import {
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
  .get("/behavior/summary", getBehaviourSummary)
  .post("/behavior/summary/weekform", postWeekform)
  .post("/behavior/summary/monthform", postMonthform)
  .get("/api/summary", getApiSummary)
  .get("/api/summary/:year/:month/:day", getApiSummaryYearMonthDay);

export { router };
