import { Conversation } from "../repositories/mongo/models/conversationModel.js";
import { getOtherUserIdByConversationIdAndUserIdService, getUserConversationsByUserIdAndTypeService, getUserConversationsByUserIdService } from "../services/conversationPartService.js";
import { fetchUserFromUserService } from "../services/userService.js";
import logger from "../utils/logger.js";


export const getConversationList = async (req, res) => {
  try {
    logger.info("get conversation list endpoint hit ....")
    const userId = req.userId;

    // Check user existence
    

    // Fetch conversations of type 'one-to-one'
    const conversations = await getUserConversationsByUserIdAndTypeService(userId, "one-to-one");

    // Fetch peer users for each conversation
    for (const conversation of conversations) {
      const peerUserIds = await getOtherUserIdByConversationIdAndUserIdService(
        conversation.conversationInfo._id,
        userId
      );

    
    const peerUser = await fetchUserFromUserService(peerUserIds[0]);
    if (!peerUser?.success) {
      return res.status(404).json({ success: false, message: "User not found" });
    }
    conversation.peerUser = peerUser;
      
    }

    res.status(200).json({
      success: true,
      data: conversations,
    });
  } catch (error) {
    console.error("Error fetching conversations:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch conversations",
      error: error.message,
    });
  }
};
