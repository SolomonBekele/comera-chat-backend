import mongoose from "mongoose";
import { Message } from "./models/messageModel.js";

/* Send message */
export const createMessageRepo = (payload, session) => {
  return Message.create(
    [payload],
    { session }
  ).then(res => res[0]);
};


/* Get message by ID */
export const getMessageByIdRepo = (messageId) => {
  return Message.findById(messageId).lean();
};

/* Get messages with pagination */
export const getMessagesByConversationWithPaginationRepo = ({
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

export const getMessagesByConversationRepo = (conversationId) => {
  return Message.find({
    conversation_id: conversationId,
    deleted: false,
  })
    .sort({ _id: 1 }) // ✅ oldest → newest
    .lean();
};


/* Mark delivered */
export const markMessageDeliveredByMessageIdRepo = (_id) => {
  return Message.findByIdAndUpdate(
    _id,
    { delivered_at: new Date() },
    { new: true }
  );
};
export const markMessageDeliveredByConversationIdRepo = (conversationId) => {
  return Message.updateMany(
    { conversationId, delivered_at: { $exists: false } },
    { $set: { delivered_at: new Date() } }
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
export const countUnreadMessagesRepo = ({ conversationId, lastReadMessageId, userId }) => {
  const query = {
    conversation_id: new mongoose.Types.ObjectId(conversationId),
    deleted: false,
  };

  // sender_id type handling
  // If stored as ObjectId in DB
  // query.sender_id = { $ne: new mongoose.Types.ObjectId(userId) };
  // If stored as string (UUID)
  query.sender_id = { $ne: userId };

  if (lastReadMessageId) {
    query._id = { $gt: new mongoose.Types.ObjectId(lastReadMessageId) };
  }

  return Message.countDocuments(query);
};
