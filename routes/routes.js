import { Router } from "../deps.js";
import { handleGet } from "./controllers/reportController.js";
import * as reportApi from "./apis/reportApi.js";

const router = new Router();

router.get("/", handleGet);

export { router };
