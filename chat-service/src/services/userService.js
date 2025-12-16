// chat-service/src/services/userService.js
import { userClient } from "../grpc/userClient.js";

export const fetchUserFromUserService = (userId) => {
  return new Promise((resolve, reject) => {
    userClient.GetUserById({ user_id: userId }, (err, response) => {
      if (err) return reject(err);
      resolve(response);
    });
  });
};
