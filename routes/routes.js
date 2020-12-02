import { Router } from "../deps.js";
import {
  handleGet,
  submitMorningForm,
} from "./controllers/reportController.js";
import * as reportApi from "./apis/reportApi.js";

const router = new Router();

router.get("/", handleGet);
router.post("/morningform", submitMorningForm);

export { router };
