import { Router } from "express";
import { getInterviewById, getInterviewsByApplication, getInterviewsByJob, getMyInterviews, getTodayInterviews, getUpcomingInterviews, rescheduleInterview, scheduleInterview, updateInterviewStatus } from "../controllers/interview.controller.js";
import { verifyUser } from "../middleware/verifyUser.middleware.js";

const router = Router();

router.post("/" ,verifyUser, scheduleInterview);
router.get("/me", verifyUser, getMyInterviews);
router.get("/upcoming", verifyUser, getUpcomingInterviews);
router.get("/today", verifyUser, getTodayInterviews);
router.get("/:interviewId", verifyUser, getInterviewById);
router.patch("/:interviewId/reschedule", verifyUser, rescheduleInterview);
router.patch("/:interviewId/status", verifyUser, updateInterviewStatus);
router.get("/job/:jobId", verifyUser, getInterviewsByJob);
router.get(
    "/application/:applicationId",
    verifyUser,
    getInterviewsByApplication
);
export default router;