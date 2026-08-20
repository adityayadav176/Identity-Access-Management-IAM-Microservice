import { Router } from "express";
import { deleteMessage, editMessage, getMessages, markMessageAsDelivered, markMessageAsRead } from "../controllers/message.controller.js";
import {verifyUser} from "../middleware/verifyUser.middleware.js"
 
const router = Router();

router.get("/:conversationId", verifyUser, getMessages);

router.patch("/:messageId", verifyUser, editMessage);

router.delete("/:messageId", verifyUser, deleteMessage);

router.patch("/:messageId/read", verifyUser, markMessageAsRead);

router.patch("/:messageId/delivered", verifyUser, markMessageAsDelivered);
export default router;