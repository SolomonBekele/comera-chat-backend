import {
    findByEmailRepo,
  findByIdRepo,
  findByPhoneRepo,
  getAllUsersRepo,
  updateUserRepo,
} from "../repositories/sequelize/userRepository.js";
import logger from "../utils/logger.js";
import { v4 as uuidv4 } from 'uuid';
import i18n from "../i18n/langConfig.js";

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
export const updateUserService = async (id,data) => {
  const { phoneNumber,fullName,status} = data;
  const user = await findByIdRepo(id)
  const phoneNoExist = await findByPhoneRepo(phoneNumber);
  if (user?.phone_number != phoneNumber && phoneNoExist){
    logger.warn(`user update failed: phone number already exists -> ${phoneNumber}`);
    throw new Error(i18n.__("USER.CONFLICT_PHONE_NUMBER", { phoneNumber }));
  } 
  const updatedUser = await updateUserRepo(id,phoneNumber,fullName,status);
  const {password,...userWithoutPassword} = updatedUser;
  return userWithoutPassword;
};