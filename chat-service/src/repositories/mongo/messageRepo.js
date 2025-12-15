import { Message } from "./models/messageModel.js";

/* Send message */
export const sendMessageRepo = ({
  conversationId,
  senderId,
  type = "text",
  content,
  mediaUrl,
  replyToMessageId,
}) => {
  return Message.create({
    conversation_id: conversationId,
    sender_id: senderId,
    type,
    content,
    media_url: mediaUrl,
    reply_to_message_id: replyToMessageId,
  });
};

/* Get message by ID */
export const getMessageByIdRepo = (messageId) => {
  return Message.findById(messageId).lean();
};

/* Get messages with pagination */
export const getMessagesByConversationRepo = ({
  conversationId,
  limit = 20,
  before,
}) => {
  const query = {
    conversation_id: conversationId,
    deleted: false,
  };

  if (before) {
    query._id = { $lt: before };
  }

  return Message.find(query).sort({ _id: -1 }).limit(limit).lean();
};

/* Mark delivered */
export const markMessageDeliveredRepo = (messageId) => {
  return Message.findByIdAndUpdate(
    messageId,
    { delivered_at: new Date() },
    { new: true }
  );
};

/* Mark read */
export const markMessageReadRepo = (messageId) => {
  return Message.findByIdAndUpdate(
    messageId,
    { read_at: new Date() },
    { new: true }
  );
};

/* Soft delete */
export const softDeleteMessageRepo = (messageId) => {
  return Message.findByIdAndUpdate(messageId, { deleted: true }, { new: true });
};

/* Get last message */
export const getLastMessageRepo = (conversationId) => {
  return Message.findOne({
    conversation_id: conversationId,
    deleted: false,
  })
    .sort({ sent_at: -1 })
    .lean();
};

/* Count unread messages */
export const countUnreadMessagesRepo = ({
  conversationId,
  lastReadMessageId,
  userId,
}) => {
  const query = {
    conversation_id: conversationId,
    sender_id: { $ne: userId },
    deleted: false,
  };

  if (lastReadMessageId) {
    query._id = { $gt: lastReadMessageId };
  }

  return Message.countDocuments(query);
};
