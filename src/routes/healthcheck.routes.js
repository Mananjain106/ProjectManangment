import { Router } from "express";
import { healthCheck } from "../controller/healthchecks.controller.js";


const router = Router();

router.route("/").get(healthCheck);


export default router;

