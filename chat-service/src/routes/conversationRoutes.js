import express from "express"
import { getConversationByTwoUsers, getConversationList } from "../controllers/conversationController.js";



const router = express.Router();
router.get("/all", getConversationList);
router.get("/user/:otherUserId", getConversationByTwoUsers);

export default router;