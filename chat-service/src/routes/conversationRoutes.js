import express from "express"
import { getConversationList } from "../controllers/conversationController.js";



const router = express.Router();
router.get("/", getConversationList);

export default router;