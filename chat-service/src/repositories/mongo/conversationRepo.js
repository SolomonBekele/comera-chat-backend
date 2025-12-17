import { Conversation } from "./models/conversationModel.js";

/* Create conversation */
export const createConversationRepo = (type, data = {}, session) => {
  return Conversation.create(
    [{ type, ...data }],
    { session }
  ).then(res => res[0]);
};

/* Find by ID */
export const findConversationByIdRepo = (conversationId) => {
  return Conversation.findById(conversationId).lean();
};

/* Update last message */
export const updateLastMessageRepo = (conversationId, messageId, session) => {
  return Conversation.findByIdAndUpdate(
    conversationId,
    { last_message_id: messageId},
    { new: true, session }
  );
};

/* Find multiple conversations */
export const findConversationsByIdsRepo = (conversationIds) => {
  return Conversation.find({
    _id: { $in: conversationIds },
  }).lean();
};

/* Delete conversation */
export const deleteConversationRepo = (conversationId) => {
  return Conversation.findByIdAndDelete(conversationId);
};
