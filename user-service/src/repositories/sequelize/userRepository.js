import User from "../sequelize/db/model/userModel.js";
import { Op } from "sequelize";

export const findByEmail = async (email) => {
  return User.findOne({ where: { email } });
};


export const findByUsername = async (username) => {
  return User.findOne({ where: { username } });
};

export const findByEmailOrUsername = async (email, username) => {
  return User.findOne({
    where: {
      [Op.or]: [{ email }, { username }]
    }
  });
};

export const createUser = async (data) => {
  return User.create(data);
};

export const findById = async (id) => {
  return User.findByPk(id);
};
