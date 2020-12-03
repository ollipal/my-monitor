import { Router } from "../deps.js";
import {
  getBehaviourSummary,
  getLanding,
  postMorningform,
  postEveningform,
} from "./controllers/reportController.js";
import * as reportApi from "./apis/reportApi.js";

const router = new Router();

router
  .get("/", getLanding)
  .get("/behavior/summary", getBehaviourSummary)
  .post("/morningform", postMorningform)
  .post("/eveningform", postEveningform);

export { router };
