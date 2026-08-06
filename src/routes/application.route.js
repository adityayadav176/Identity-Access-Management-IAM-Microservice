import { Router } from "express";
import { applyForJob, getApplicationById, getJobApplications, getMyApplications, updateApplicationStatus, withdrawApplication } from "../controllers/application.controller.js";
import { verifyUser } from "../middleware/verifyUser.middleware.js";
const router = Router();

router.post("/:jobId",verifyUser, applyForJob);
router.get("/", verifyUser, getMyApplications);
router.patch(
    "/:applicationId/status",
    verifyUser,
    updateApplicationStatus
);
router.get(
    "/:applicationId",
    verifyUser,
    getApplicationById
);
router.patch(
    "/:applicationId/withdraw",
    verifyUser,
    withdrawApplication
);
router.get("/getJobApplications/:jobId", verifyUser, getJobApplications);


export default router;