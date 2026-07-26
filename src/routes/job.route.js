import { Router } from "express";
import { createJob, updateJob } from "../controllers/job.controller.js";
import { verifyUser } from "../middleware/verifyUser.middleware.js";
const router = Router()

router.post("/",verifyUser, createJob);
router.patch("/", verifyUser, updateJob);

export default router