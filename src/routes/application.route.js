import { Router } from "express";
import { applyForJob } from "../controllers/application.controller.js";
import { verifyUser } from "../middleware/verifyUser.middleware.js";
const router = Router();

router.post("/:jobId",verifyUser, applyForJob);
export default router;