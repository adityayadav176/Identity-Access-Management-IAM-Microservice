import { Router } from "express";
import {
    changeJobStatus,
    createJob,
    deleteJob,
    getAllJobs,
    getDeletedJobs,
    getJobById,
    getRecruiterJobs,
    permanentDeleteJob,
    restoreJob,
    updateJob
} from "../controllers/job.controller.js";

import { verifyUser } from "../middleware/verifyUser.middleware.js";

const router = Router();

// Create
router.post("/", verifyUser, createJob);

// Collection Routes
router.get("/", verifyUser, getAllJobs);
router.get("/recruiter", verifyUser, getRecruiterJobs);
router.get("/deleted", verifyUser, getDeletedJobs);

// Single Job Routes
router.get("/:JobId", verifyUser, getJobById);
router.patch("/:JobId", verifyUser, updateJob);
router.delete("/:JobId", verifyUser, deleteJob);

// Job Actions
router.patch("/:JobId/status", verifyUser, changeJobStatus);
router.patch("/:JobId/restore", verifyUser, restoreJob);
router.delete("/:JobId/permanent", verifyUser, permanentDeleteJob);

export default router;