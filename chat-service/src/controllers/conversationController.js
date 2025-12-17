import { Conversation } from "../repositories/mongo/models/conversationModel.js";
import { getConversationIdByTwoUsersService, getOtherUserIdByConversationIdAndUserIdService, getUserConversationsByUserIdAndTypeService, getUserConversationByTwoUserIdAndTypeService } from "../services/conversationPartService.js";
import { getConversationByIdService } from "../services/conversationService.js";
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


export const getConversationByTwoUsers = async (req, res) => {
  try {
    const userId1 = req.userId; // current user
    const userId2 = req.params.otherUserId; // peer user

    if (!userId2) {
      return res.status(400).json({
        success: false,
        message: "Other user id is required",
      });
    }
    
    const conversation = await getUserConversationByTwoUserIdAndTypeService(userId1,userId2,"one-to-one");
    const peerUser = await fetchUserFromUserService(userId2);

    conversation.peerUser = peerUser;

    
    return res.status(200).json({
    success: true,
    message: "CONVERSATION.RETRIEVED",
    conversation,
    });
  } catch (err) {
    return res.status(404).json({
      success: false,
      message: err.message,
    });
  }
};

