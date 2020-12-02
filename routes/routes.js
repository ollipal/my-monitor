import { Router } from "../deps.js";
import { handleGet } from "./controllers/behaviorController.js";
import * as behaviorApi from "./apis/behaviorApi.js";

const router = new Router();

router.get("/", handleGet);

export { router };
