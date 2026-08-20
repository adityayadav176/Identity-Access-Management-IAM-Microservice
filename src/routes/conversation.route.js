import { Router } from "express";
import { createOrGetConversation, deleteConversation, getConversationById, getMyConversation, parmanentlyDeleteConversation, restoreConversation } from "../controllers/converstion.controller.js";
import {verifyUser} from "../middleware/verifyUser.middleware.js"

const router = Router();

router.post("/", verifyUser ,createOrGetConversation);
router.get("/me",verifyUser, getMyConversation);
router.get("/:conversationId", verifyUser, getConversationById);
router.delete("/:conversationId/parmanent", verifyUser, parmanentlyDeleteConversation);
router.patch("/:conversationId/delete", verifyUser, deleteConversation);
router.patch("/conversationId/restore", verifyUser, restoreConversation)

export default router;