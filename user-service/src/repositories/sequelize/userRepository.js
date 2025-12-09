import User from "../sequelize/db/model/userModel.js";
import { Op } from "sequelize";

export const findByEmailRepo = async (email) => {
  return User.findOne({ where: { email } });
};


export const findByUsernameRepo = async (username) => {
  return User.findOne({ where: { username } });
};

export const findByEmailOrUsernameRepo = async (email, username) => {
  return User.findOne({
    where: {
      [Op.or]: [{ email }, { username }]
    }
  });
};

export const createUserRepo = async (data) => {
  return User.create(data);
};

export const findByIdRepo = async (id) => {
  return User.findByPk(id);
};
export const getAllUsersRepo = async () => {
  const users = await User.findAll();
  return users.map((u) => u.dataValues);
};
