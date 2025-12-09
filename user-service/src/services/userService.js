import {
  findByEmailRepo,
  findByEmailOrUsernameRepo,
  findByIdRepo,
  createUserRepo,
  getAllUsersRepo
} from "../repositories/sequelize/userRepository.js";
import logger from "../utils/logger.js";

import i18n from "../i18n/langConfig.js";
import bcrypt from "bcrypt";
import { penalizeLogin, resetLogin } from "../middleware/loginLimiter.js";
import { generateAccessToken,generateRefreshToken,verifyToken } from "../utils/generateTokens.js";
export const signupUserService = async (data) => {
  const { phone_number,name,username, email, password} = data;

  const exists = await findByEmailRepo(email);
  if (exists){
    logger.warn(`Signup failed: email already exists -> ${email}`);
    throw new Error(i18n.__("USER.CONFLICT_EMAIL", { email }));
  } 
               
  const hashedPassword = await bcrypt.hash(password, 10);

  const user = await createUserRepo({
    phone_number,
    name,
    username,
    email,
    password: hashedPassword,
  });
};

export const loginUserService = async (data,ip) => {
  const { email, password } = data;

  const user = await findByEmailRepo(email);
  if (!user) {
    await penalizeLogin(ip,1)
    throw new Error(i18n.__("USER.INVALID_CREDENTIALS") );}

  const valid = await bcrypt.compare(password, user.password);
  if (!valid){ 
     await penalizeLogin(ip,1)
    throw new Error(i18n.__("USER.INVALID_CREDENTIALS"));
  }
  
  const token = generateAccessToken(user.id,user.language);
  const refreshToken = generateRefreshToken(user.id, user.language);
  await resetLogin(ip);
  return {user,token,refreshToken};
};

export const refreshUserTokenService = async (refreshToken) => {
  const stored = verifyToken(refreshToken, process.env.REFRESH_SECRET);

  if (!stored || stored.expiresAt < new Date()) {
    logger.warn("Refresh failed: invalid token");
    throw new Error(i18n.__("USER.INVALID_TOKEN") );
  }

  const user = await findByIdRepo(stored.user_id);
  if (!user) throw new Error("User not found");

  const newAccessToken = generateAccessToken(payload.userId);
  logger.info(`Refresh success: new token issued for userId=${payload.userId}`);

  return newAccessToken;
};

export const logoutUserService = async (refreshToken) => {
  // const removed = await deleteByToken(refreshToken);
  // if (!removed) throw new Error("Invalid refresh token");

  return true;
};

export const getUserByIdService = async (id)=>{
  const user = await findByIdRepo(id);
  if (!user){
    logger.warn(`User not found: id=${id}`);
    throw new Error(i18n.__("USER.NOT_FOUND_ID",{id:id}));
  } 
  const {password,...userWithoutPassword} = user;
  logger.info(`Fetched user by id: id=${id}`);
   return userWithoutPassword
        
}

export const getAllUsersService = async ()=>{
  const users = await getAllUsersRepo();
  if(!users){
            logger.warn("No users found in database");
            return res.status(404).json({
                message:i18n.__("USER.RETRIEVED_NONE")  
            })
        }
  const usersWithoutPasswords = users.map(({ password, ...rest }) => rest);
  logger.info(`Fetched all users: count=${usersWithoutPasswords.length}`);
  return usersWithoutPasswords
        
}