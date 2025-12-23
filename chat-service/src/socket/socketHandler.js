import {
  setUserSocket,
  removeUserSocket,
  getUserSocket,
  getOnlineUsers,
} from "./socketStore.js";
import { sendMessageSocket } from "../../../chat-service/src/controllers/messageController.js";

export const registerSocketHandlers = (io, socket) => {
  const userId = socket.user.id;

  console.log("🔌 User connected:", userId, socket.id);

  const setupUser = async () => {
    await setUserSocket(userId, socket.id);
    io.emit("getOnlineUsers", await getOnlineUsers());
  };

  setupUser();

  // --------------------------💬 Message sending-------------------------------------
  socket.on("message:send", async ({ messageData }) => {
    try {
      const { conversationId, receiverId, content, type } = messageData;
      const message = await sendMessageSocket({ userId, receiverId, conversationId, content, type });

      io.to(socket.id).emit("message:send_success", { conversationId, message });

      const receiverSocketId = await getUserSocket(receiverId);
      if (receiverSocketId) {
        io.to(receiverSocketId).emit("message:new", { conversationId, message });
      }
    } catch (error) {
      console.error("Error sending message:", error);
      socket.emit("message:error", { message: "Failed to send message" });
    }
  });


  // --------------------------⌨️ Typing events --------------------------------
  socket.on("typing:start", async ({ receiverId, conversationId }) => {
    const receiverSocket = await getUserSocket(receiverId);
    if (receiverSocket) io.to(receiverSocket).emit("typing:start", { from: userId, conversationId });
  });

  socket.on("typing:stop", async ({ receiverId, conversationId }) => {
    const receiverSocket = await getUserSocket(receiverId);
    if (receiverSocket) io.to(receiverSocket).emit("typing:stop", { from: userId, conversationId });
  });

  // --------------------------✅ Message seen ---------------------------------
  socket.on("message:seen", async ({ messageId, receiverId }) => {
    const receiverSocket = await getUserSocket(receiverId);
    if (receiverSocket) io.to(receiverSocket).emit("message:seen", { messageId, seenBy: userId });
  });

  //---------------------------- ❌ Disconnect ---------------------------------
  socket.on("disconnect", async () => {
    console.log("❌ User disconnected:", userId, socket.id);
    await removeUserSocket(userId, socket.id);
    io.emit("getOnlineUsers", await getOnlineUsers());
  });
};
