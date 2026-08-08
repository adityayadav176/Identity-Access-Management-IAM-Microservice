import { Router } from "express";
import { verifyUser } from "../middleware/verifyUser.middleware.js";
import { verifyAdmin } from "../middleware/verifyAdmin.middleware.js";
import { getAdminDashboardStats } from "../controllers/admin.controller.js";

const router = Router();

router.get("/dashboard", verifyUser, verifyAdmin, getAdminDashboardStats);
export default router;