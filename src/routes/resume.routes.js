import { Router } from "express";
import { verifyUser } from "../middleware/verifyUser.middleware.js";
import { deleteResume, getAllUserResumes, getResumeById, replaceResumeFile, restoreResume, setIsDefault, updateResumeDetails, uploadResume } from "../controllers/resume.controller.js";
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
router.patch("/ChangeStatus/:resumeId", verifyUser, setIsDefault);
router.patch("/delete/:resumeId", verifyUser, deleteResume);
router.patch("/restore/:resumeId", verifyUser, restoreResume);
export default router;