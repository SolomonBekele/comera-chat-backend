import {
  getUserByIdService,
  getAllUsersService,
  updateUserService,
  updateProfilePicService
} from "../services/userService.js";
import i18n from "../i18n/langConfig.js";
import logger from "../utils/logger.js";



export const getUserbyId = async (req, res) => {
  logger.info("get user by id endpoint hit...");
  try {
    const id = req.params.id;
    const user = await getUserByIdService(id);

    res.json({
         success: true, 
         message: i18n.__("USER.RETRIEVED_BY_ID",{id,id}),
          user
        });

  } catch (error) {
    logger.error(`Login error for ${req.body.email}: ${error.message}`, { stack: error.stack });
    res.status(400).json({ success: false, message: error.message });
  }
};
export const getAllUsers = async (req, res) => {
  logger.info("get all user  endpoint hit...");
  try {
    const users = await getAllUsersService();

    res.json({
         success: true, 
         message: i18n.__("USER.RETRIEVED_ALL",{count:users.length}),
          users 
        });

  } catch (err) {
    logger.error("Error fetching all users", { message: err.message, stack: err.stack });
        res.status(500).json({
            success: false,
            message: error.message,
        });
  }
};

export const getUserByToken = async (req,res,next) =>{
    try{
        const id = req.user.id;
        const user = await getUserByIdService(id);
        res.json({
         success: true, 
         message: i18n.__("USER.RETRIEVED_BY_TOKEN"),
          user 
        });

  } catch (error) {
    logger.error(`Login error for ${req.body.email}: ${error.message}`, { stack: error.stack });
    res.status(400).json({ success: false, message: error.message });
  }
}
export const updateUser = async (req,res,next) =>{
    try{
        const id = req.user.id;
        const user = await updateUserService(id,req.body);
        res.json({
         success: true, 
         message: i18n.__("USER.UPDATED_"),
         user 
        });

  } catch (error) {
    logger.error(`Login error for ${req.body.email}: ${error.message}`, { stack: error.stack });
    res.status(400).json({ success: false, message: error.message });
  }
}
export const updateProfilePic = async (req,res,next) =>{
    try{
        const id = req.user.id;
        const imageUrl = await updateProfilePicService(id,req.file);
        res.json({
         success: true, 
         message: i18n.__("USER.UPDATED_PROFILE"),
         imageUrl
        });

  } catch (error) {
    logger.error(`Login error for ${req.body.email}: ${error.message}`, { stack: error.stack });
    res.status(400).json({ success: false, message: error.message });
  }
}

