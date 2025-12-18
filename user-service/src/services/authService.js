import {
  findByEmailRepo,
  findByIdRepo,
  createUserRepo,
  findByPhoneRepo
} from "../repositories/sequelize/userRepository.js";
import logger from "../utils/logger.js";
import { v4 as uuidv4 } from 'uuid';
import i18n from "../i18n/langConfig.js";
import bcrypt from "bcrypt";
import { penalizeLogin, resetLogin } from "../middleware/loginLimiter.js";
import { generateAccessToken,generateRefreshToken,verifyToken } from "../utils/generateTokens.js";
import redisClient from "../../../common/src/config/redisClient.js";


export const signupUserService = async (data) => {
  const { phoneNumber,fullName, email, password} = data;
  const id = uuidv4()

  const emailExist = await findByEmailRepo(email);
  if (emailExist){
    logger.warn(`Signup failed: email already exists -> ${email}`);
    throw new Error(i18n.__("USER.CONFLICT_EMAIL", { email }));
  } 
  const phoneNoExist = await findByPhoneRepo(phoneNumber);
  if (phoneNoExist){
    logger.warn(`Signup failed: phone number already exists -> ${phoneNumber}`);
    throw new Error(i18n.__("USER.CONFLICT_PHONE_NUMBER", { phoneNumber }));
  } 
               
  const hashedPassword = await bcrypt.hash(password, 10);

  const user = await createUserRepo({
    id,
    phone_number:phoneNumber,
    name:fullName,
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
  
  const token = await generateAccessToken(user.id,user.language);
  
  const refreshToken =  generateRefreshToken(user.id, user.language);
  await resetLogin(ip);
  return {user,token,refreshToken};
};

export const refreshUserTokenService = async (refreshToken) => {
  const stored = verifyToken(refreshToken, process.env.REFRESH_SECRET);

  if (!stored || stored.expiresAt < new Date()) {
    logger.warn("Refresh failed: invalid token");
    throw new Error(i18n.__("USER.INVALID_TOKEN") );
  }
  const user = await findByIdRepo(stored.userId);
  if (!user) throw new Error("User not found");

  const newAccessToken = generateAccessToken(stored.userId);
  logger.info(`Refresh success: new token issued for userId=${stored.userId}`);

  return newAccessToken;
};

export const logoutUserService = async (userId) => {
   await redisClient.del(userId);
  return true;
};

