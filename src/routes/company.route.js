import { Router } from "express";
import { createCompany, deleteCompany, getAllCompanies, getCompanyById, permanentDeleteCompany, restoreCompany, updateCompany } from "../controllers/company.controller.js";
import { verifyUser } from "../middleware/verifyUser.middleware.js";

const router = Router()

router.post("/" ,verifyUser, createCompany);
router.get("/:companyId", verifyUser, getCompanyById);
router.get("/", getAllCompanies);
router.patch("/:companyId", verifyUser, updateCompany);
router.patch("/:companyId/delete", verifyUser, deleteCompany);
router.delete("/:companyId/permanent", verifyUser, permanentDeleteCompany);
router.patch("/:companyId/restore", verifyUser, restoreCompany);

export default router