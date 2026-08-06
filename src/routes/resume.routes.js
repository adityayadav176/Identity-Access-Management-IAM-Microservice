import { Router } from "express";
import { verifyUser } from "../middleware/verifyUser.middleware.js";
import { getAllUserResumes, getResumeById, replaceResumeFile, updateResumeDetails, uploadResume } from "../controllers/resume.controller.js";
import { upload } from "../middleware/multer.middleware.js";

const router = Router();

router.post(
    "/", 
    verifyUser,
    upload.single("resume"), 
    uploadResume
)
router.get("/userResume",verifyUser, getAllUserResumes);
router.get("/:resumeId",verifyUser, getResumeById);
router.patch("/:resumeId", verifyUser, updateResumeDetails);
router.patch("/update/:resumeId",
    verifyUser,
    upload.single("resume"),
    replaceResumeFile
);
export default router;