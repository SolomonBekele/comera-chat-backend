import express from "express"

import { sendMessage } from "../controllers/messageController.js";
import { validateSendMessge } from "../middleware/messageInputValidation.js";


const router = express.Router();

router.post("/",validateSendMessge, sendMessage);
// router.post("/login",validateLoginUser,loginLimiterMW ,loginUser);
// router.post("/refresh-token",validateRefreshToken, refreshTokenUser);
// router.post("/logout", logoutUser);


export default router;