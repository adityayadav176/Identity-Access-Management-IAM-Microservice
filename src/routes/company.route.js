import { Router } from "express";
import { createCompany } from "../controllers/company.controller.js";
import { verifyUser } from "../middleware/verifyUser.middleware.js";

const router = Router()

router.post("/" ,verifyUser, createCompany);

export default router       