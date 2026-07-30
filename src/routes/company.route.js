import { Router } from "express";
import { createCompany, getCompanyById } from "../controllers/company.controller.js";
import { verifyUser } from "../middleware/verifyUser.middleware.js";

const router = Router()

router.post("/" ,verifyUser, createCompany);
router.get("/:companyId", verifyUser, getCompanyById);

export default router       