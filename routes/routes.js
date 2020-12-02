import { Router } from "../deps.js";
import {
  handleLanding,
  handleBehaviourSummary,
  handlePostMorningForm,
} from "./controllers/reportController.js";
import * as reportApi from "./apis/reportApi.js";

const router = new Router();

router
  .get("/", handleLanding)
  .get("/behavior/summary", handleBehaviourSummary)
  .post("/morningform", handlePostMorningForm);

export { router };
