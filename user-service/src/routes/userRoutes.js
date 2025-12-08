import express from "express"
import  {
  signupUser,
  loginUser,
  refreshTokenUser,
  logoutUser,
} from "../controllers/userController.js";
import { loginLimiterMW } from "../middleware/loginLimiter.js";
import { validateLoginUser, validateRefreshToken, validateSignUpUser } from "../middleware/userInputValidation.js";

const router = express.Router();

router.post("/signup",validateSignUpUser, signupUser);
router.post("/login",validateLoginUser,loginLimiterMW ,loginUser);
router.post("/refresh-token",validateRefreshToken, refreshTokenUser);
router.post("/logout", logoutUser);

export default router;