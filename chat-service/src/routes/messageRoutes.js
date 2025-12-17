import express from "express"

import { getAllMessages, sendMessage } from "../controllers/messageController.js";
import { validateSendMessge } from "../middleware/messageInputValidation.js";


const router = express.Router();

router.post("/",validateSendMessge, sendMessage);
router.get("/:conversationId", getAllMessages);
// router.post("/login",validateLoginUser,loginLimiterMW ,loginUser);
// router.post("/refresh-token",validateRefreshToken, refreshTokenUser);
// router.post("/logout", logoutUser);


export default router;