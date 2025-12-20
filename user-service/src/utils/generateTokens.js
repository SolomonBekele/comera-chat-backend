import jwt from "jsonwebtoken";
import { storeUserToken } from "./storeToken.js";


export const  generateAccessToken = async (userId,language) => {
  const token = jwt.sign({ userId,language }, process.env.JWT_SECRET, {
    expiresIn: "30m",
  });
  await storeUserToken(userId,token);
  return token;
};

export const generateRefreshToken = (userId,language) => {
  return jwt.sign({ userId,language }, process.env.REFRESH_SECRET, {
    expiresIn: "7d", 
  });
};

export const verifyToken = (token, secret) => {
  try {
    return jwt.verify(token, secret);
  } catch (err) {
    return null;
  }
};