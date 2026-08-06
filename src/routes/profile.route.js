import { Router } from "express";
import { verifyUser } from "../middleware/verifyUser.middleware.js";
import { createProfile, updateProfile } from "../controllers/profile.controller.js";

const router = Router();

router.post("/", verifyUser, createProfile);
router.patch("/", verifyUser, updateProfile);
export default router;