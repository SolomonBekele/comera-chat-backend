import {
  signupUserService,
  loginUserService,
  refreshUserTokenService,
  logoutUserService,
  getUserByIdService,
  getAllUsersService
} from "../services/userService.js";
import i18n from "../i18n/langConfig.js";

import logger from "../utils/logger.js";
import { data } from "react-router-dom";

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
    res.status(400).json({ success: false, message: i18n.__("INTERNAL_SERVER_ERROR") });
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
         data: userWithOutPassword,
         token:result.token,
         refreshTokenUser:result.refreshToken
        });

  } catch (e) {
    logger.error(`Login error for ${req.body.email}: ${e.message}`, { stack: e.stack });
    res.status(400).json({ success: false, message: e.message });
  }
};

export const refreshTokenUser = async (req, res) => {
  logger.info("Refresh token endpoint hit...");
  try {
    const token = req.body.refreshToken;
    const result = await refreshUserTokenService(token);

    res.json({ success: true, ...result });

  } catch (e) {
    logger.error("Refresh token error", e);
    res.status(400).json({ success: false, message: e.message });
  }
};

export const logoutUser = async (req, res) => {
  logger.info("Logout endpoint hit...");
  try {
    const { refreshToken } = req.body;

    if (!refreshToken) {
      return res.status(400).json({ success: false, message: "Refresh token missing" });
    }

    await logoutUserService(refreshToken);

    res.json({ success: true, message: "Logged out successfully" });

  } catch (e) {
    logger.error("Logout error", e);
    res.status(400).json({ success: false, message: e.message });
  }
};
export const getUserbyId = async (req, res) => {
  logger.info("get user by id endpoint hit...");
  try {
    const id = req.params.id;
    const result = await getUserByIdService(id);

    res.json({
         success: true, 
         message: i18n.__("USER.RETRIEVED_BY_ID",{id,id}),
          ...result 
        });

  } catch (e) {
    logger.error(`Login error for ${req.body.email}: ${error.message}`, { stack: error.stack });
    res.status(400).json({ success: false, message: i18n.__("INTERNAL_SERVER_ERROR") });
  }
};
export const getAllUsers = async (req, res) => {
  logger.info("get all user  endpoint hit...");
  try {
    const id = req.params.id;
    const result = await getAllUsersService();

    res.json({
         success: true, 
         message: i18n.__("USER.RETRIEVED_ALL",{count:result.length}),
          result 
        });

  } catch (err) {
    logger.error("Error fetching all users", { message: err.message, stack: err.stack });
        res.status(500).json({
            success: false,
            message: i18n.__("INTERNAL_SERVER_ERROR"),
        });
  }
};
