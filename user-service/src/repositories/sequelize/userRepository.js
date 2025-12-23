import User from "../sequelize/db/model/userModel.js";
import { Op } from "sequelize";

export const findByEmailRepo = async (email) => {
  const user =await  User.findOne({ where: { email } });
  return user ? user.dataValues : null;
};
export const findByPhoneRepo = async (phone_number) => {
  const user =await  User.findOne({ where: { phone_number } });
  return user ? user.dataValues : null;
};


export const findByUsernameRepo = async (username) => {
  const user = await User.findOne({ where: { username } });
  return user ? user.dataValues : null;
};

export const findByEmailOrUsernameRepo = async (email, username) => {
  const user =await User.findOne({
    where: {
      [Op.or]: [{ email }, { username }]
    }
  });
  return user ? user.dataValues : null;
};

export const createUserRepo = async (data) => {
  const created_user= await User.create(data);
  return created_user ? created_user.dataValues :null;
};

export const findByIdRepo = async (id) => {
  const user = await User.findByPk(id);
  return user ? user.dataValues : null;
};
export const getAllUsersRepo = async () => {
  const users = await User.findAll();
  return users.map((u) => u.dataValues);
};
export const updateUserRepo = async (id,phone_number,name,status) => {
  const user = await User.findByPk(id);
  if (!user) return null;
  user.name = name;
  user.phone_number = phone_number;
  user.status = status;
  await user.save();
  return user.dataValues;
};
export const updateProfilePicRepo = async (id,media_id) => {
  const user = await User.findByPk(id);
  if (!user) return null;
  user.profile_picture = media_id;
  await user.save();
};
export const updatelastSeenRepo = async (id) => {
  const user = await User.findByPk(id);
  if (!user) return null;
  user.last_seen = new Date();
  await user.save();
};
