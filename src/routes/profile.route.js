import { Router } from "express";
import { verifyUser } from "../middleware/verifyUser.middleware.js";
import { createProfile, getMyProfile, getProfileByUserId, getProfileCompletion, searchUserProfile, updateProfile } from "../controllers/profile.controller.js";

const router = Router();

router.post("/", verifyUser, createProfile);
router.patch("/", verifyUser, updateProfile);
router.get("/search", searchUserProfile);
router.get("/profileCompletion", verifyUser, getProfileCompletion);
router.get("/:userId", verifyUser, getProfileByUserId);
router.get("/me", verifyUser, getMyProfile);
export default router;