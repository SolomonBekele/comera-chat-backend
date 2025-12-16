import { ConversationParticipant } from "./models/conversationParticipantModel.js";


/* Add single user */
export const addParticipantRepo = ({
  conversationId,
  userId,
  role = "member",
}) => {
  return ConversationParticipant.create({
    conversation_id: conversationId,
    user_id: userId,
    role,
  });
};  

/* Add multiple users */
export const addParticipantsRepo = (conversationId, users=[], session) => {
  return ConversationParticipant.insertMany(
    users.map(u => ({
      conversation_id: conversationId,
      user_id: u.userId,
      role: u.role || "member",
    })),
    { session }
  );
};

export const getOtherUserIdByConversationIdAndUserIdRepo = async (conversationId, userId) => {
  const participants = await ConversationParticipant.find({
    conversation_id: conversationId,
    user_id: { $ne: userId }, // exclude current user
  }).select("user_id -_id").lean();

  // Return array of user IDs
  return participants.map(p => p.user_id.toString());
};


/* Get participants by conversation */
export const getParticipantsByConversationIdRepo = (conversationId) => {
  return ConversationParticipant.find({
    conversation_id: conversationId,
  }).lean();
};

/* Get conversations for user (chat list) */
export const getUserConversationsByUserIdRepo = (userId) => {
  return ConversationParticipant.find({ user_id: userId })
    .select("conversation_id role joined_at last_read_message_id")
    .lean();
};
export const getUserConversationsByUserIdAndTypeRepo = async (userId, type) => {
  const results = await ConversationParticipant.find({ user_id: userId })
    .select("conversation_id role joined_at last_read_message_id")
    .populate({
      path: "conversation_id",
      select: "name type group_pic last_message_id created_at updated_at",
    })
    .lean();

  return results
    .filter(p => p.conversation_id !== null && p.conversation_id.type === type)
    .map(p => {
        // Rename key
      p.conversation = p.conversation_id;
      delete p.conversation_id;
      // If not group, remove group_pic and name
      if (p.conversation.type !== "group") {
        delete p.conversation.group_pic;
        delete p.conversation.name;
      }
      return p;
    });
};


/* Update last read message */
export const updateLastReadMessageRepo = ({
  conversationId,
  userId,
  messageId,
}) => {
  return ConversationParticipant.findOneAndUpdate(
    { conversation_id: conversationId, user_id: userId },
    { last_read_message_id: messageId },
    { new: true }
  );
};

/* Update participant role */
export const updateParticipantRoleRepo = ({
  conversationId,
  userId,
  role,
}) => {
  return ConversationParticipant.findOneAndUpdate(
    { conversation_id: conversationId, user_id: userId },
    { role },
    { new: true }
  );
};

/* Remove participant */
export const removeParticipantRepo = (conversationId, userId) => {
  return ConversationParticipant.findOneAndDelete({
    conversation_id: conversationId,
    user_id: userId,
  });
};

/* Check if user exists in conversation */
export const isParticipantRepo = (conversationId, userId) => {
  return ConversationParticipant.exists({
    conversation_id: conversationId,
    user_id: userId,
  });
};
