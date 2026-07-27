import { Router } from "express";
import { changeJobStatus, createJob, deleteJob, getAllJobs, getJobById, permanentDeleteJob, updateJob } from "../controllers/job.controller.js";
import { verifyUser } from "../middleware/verifyUser.middleware.js";
const router = Router()

router.post("/",verifyUser, createJob);
router.patch("/:JobId", verifyUser, updateJob);
router.delete("/:JobId", verifyUser, deleteJob);
router.delete("/:JobId/parmanent", verifyUser, permanentDeleteJob);
router.get("/:JobId", verifyUser, getJobById);
router.get("/", verifyUser, getAllJobs);
router.patch("/Status/:JobId", verifyUser, changeJobStatus);

export default router