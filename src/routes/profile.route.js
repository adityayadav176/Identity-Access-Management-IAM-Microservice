import { Router } from "express";
import { verifyUser } from "../middleware/verifyUser.middleware.js";
import { createProfile } from "../controllers/profile.controller.js";

const router = Router();

router.post("/", verifyUser, createProfile);
export default router;