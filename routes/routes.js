import { Router } from "../deps.js";
import {
  getBehaviourSummary,
  getLanding,
  postEveningform,
  postMorningform,
  postWeekform,
  postMonthform,
} from "./controllers/reportController.js";
import * as reportApi from "./apis/reportApi.js";

const router = new Router();

router
  .get("/", getLanding)
  .get("/behavior/summary", getBehaviourSummary)
  .post("/morningform", postMorningform)
  .post("/eveningform", postEveningform)
  .post("/behavior/summary/weekform", postWeekform)
  .post("/behavior/summary/monthform", postMonthform);

export { router };
