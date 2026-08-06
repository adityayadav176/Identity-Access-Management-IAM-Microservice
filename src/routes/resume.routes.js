import { Router } from "express";
import { verifyUser } from "../middleware/verifyUser.middleware.js";
import { getAllUserResumes, uploadResume } from "../controllers/resume.controller.js";
import { upload } from "../middleware/multer.middleware.js";

const router = Router();

router.post(
    "/", 
    verifyUser,
    upload.single("resume"), 
    uploadResume
)
router.get("/userResume",verifyUser, getAllUserResumes);
export default router;