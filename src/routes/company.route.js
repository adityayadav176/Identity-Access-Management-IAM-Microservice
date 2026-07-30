import { Router } from "express";
import { createCompany, getAllCompanies, getCompanyById, updateCompany } from "../controllers/company.controller.js";
import { verifyUser } from "../middleware/verifyUser.middleware.js";

const router = Router()

router.post("/" ,verifyUser, createCompany);
router.get("/:companyId", verifyUser, getCompanyById);
router.get("/", getAllCompanies);
router.patch("/:companyId", verifyUser, updateCompany);

export default router