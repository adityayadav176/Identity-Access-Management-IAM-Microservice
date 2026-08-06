import { Router } from "express";
import { applyForJob, getMyApplications } from "../controllers/application.controller.js";
import { verifyUser } from "../middleware/verifyUser.middleware.js";
const router = Router();

router.post("/:jobId",verifyUser, applyForJob);
router.get("/", verifyUser, getMyApplications);
export default router;