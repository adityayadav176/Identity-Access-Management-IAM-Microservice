import { Router } from "express";
import { createJob } from "../controllers/job.controller.js";
import { verifyUser } from "../middleware/verifyUser.middleware.js";
const router = Router()

router.post("/",verifyUser, createJob);

export default router