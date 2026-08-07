import { Router } from "express";
import { getInterviewById, getMyInterviews, rescheduleInterview, scheduleInterview, updateInterviewStatus } from "../controllers/interview.controller.js";
import { verifyUser } from "../middleware/verifyUser.middleware.js";

const router = Router();

router.post("/" ,verifyUser, scheduleInterview);
router.get("/me", verifyUser, getMyInterviews);
router.get("/:interviewId", verifyUser, getInterviewById);
router.patch("/:interviewId/reschedule", verifyUser, rescheduleInterview);
router.patch("/:interviewId/status", verifyUser, updateInterviewStatus);
export default router;