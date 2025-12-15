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
export const addParticipantsRepo = (conversationId, users = []) => {
  return ConversationParticipant.insertMany(
    users.map((u) => ({
      conversation_id: conversationId,
      user_id: u.userId,
      role: u.role || "member",
    }))
  );
};

/* Get participants by conversation */
export const getParticipantsByConversationIdRepo = (conversationId) => {
  return ConversationParticipant.find({
    conversation_id: conversationId,
  }).lean();
};

/* Get conversations for user (chat list) */
export const getUserConversationsRepo = (userId) => {
  return ConversationParticipant.find({ user_id: userId })
    .select("conversation_id role joined_at last_read_message_id")
    .lean();
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
