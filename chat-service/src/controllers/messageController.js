import { addParticipantService } from "../services/conversationPartService.js";
import { createConversationService, updateLastMessageService } from "../services/conversationService.js";
import { sendMessageService } from "../services/messageService.js";

export const sendMessage = async (req, res) => {
  try {
    const senderId = req.userId;
    const { receiverId, content, type } = req.body;

    let conversationId = req.body.conversationId;

    // 1️⃣ If no conversation yet → create one
    if (!conversationId) {
      const conversation = await createConversationService("one_on_one");

      await addParticipantService(conversation._id, [
        { userId: senderId },
        { userId: receiverId },
      ]);

      conversationId = conversation._id;
    }

    // 2️⃣ Send message
    const message = await sendMessageService({
      conversationId,
      senderId,
      content,
      type,
    });

    // 3️⃣ Update last message
    await updateLastMessageService(conversationId, message._id);

    res.json({
      success: true,
      conversationId,
      message,
    });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};
