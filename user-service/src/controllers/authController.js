import {
  signupUserService,
  loginUserService,
  refreshUserTokenService,
  logoutUserService
} from "../services/authService.js";
import i18n from "../i18n/langConfig.js";

import logger from "../utils/logger.js";
import { verify } from "crypto";
import { verifyToken } from "../utils/generateTokens.js";


export const signupUser = async (req, res) => {
  logger.info("Register endpoint hit...");
  try {
    await signupUserService(req.body);

    res.status(201).json({
      success: true,
      message: i18n.__("USER.CREATED"),
    });

  } catch (e) {
    logger.error(`Signup error for email=${req.body.email}: ${e.message}`, { stack: e.stack });
    res.status(400).json({ success: false, message: e.message});
  }
};

export const loginUser = async (req, res) => {
  logger.info("Login endpoint hit...");
  try {

    const result = await loginUserService(req.body,req.ip);

    const {password,...userWithOutPassword}= result.user;
    res.json({
         success: true, 
         message: i18n.__("USER.LOGIN_SUCCESS"),
         user: userWithOutPassword,
         token:result.token,
         refreshToken:result.refreshToken
        });

  } catch (e) {
    logger.error(`Login error for ${req.body.email}: ${e.message}`, { stack: e.stack });
    res.status(400).json({ success: false, message: e.message });
  }
};

export const refreshTokenUser = async (req, res) => {
  logger.info("Refresh token endpoint hit...");
  try {
    const refreshToken = req.body.refreshToken;
    const token = await refreshUserTokenService(refreshToken);

    res.json({ success: true, token });

  } catch (e) {
    logger.error("Refresh token error", e);
    res.status(400).json({ success: false, message: e.message });
  }
};

export const logoutUser = async (req, res) => {
  logger.info("Logout endpoint hit...");
  try {
    const token = req.headers.authorization?.split(" ")[1];
 
    const decode = verifyToken(token,process.env.process.env.JWT_SECRET)

    await logoutUserService(decode.userId)

    res.json({ success: true, message: "Logged out successfully" });

  } catch (e) {
    logger.error("Logout error", e);
    res.status(400).json({ success: false, message: e.message });
  }
};
