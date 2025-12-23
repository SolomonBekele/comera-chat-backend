import { getUserSocket } from "./socketStore.js";

export const getReceiverSocketId = async (receiverId) => {
  return await getUserSocket(receiverId);
};
