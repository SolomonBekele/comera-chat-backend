import { Conversation } from "./models/conversationModel.js";

/* Create conversation */
export const createConversationRepo = (type = "one_on_one",name,group_pic) => {
  return Conversation.create({ type,name,group_pic});
};

/* Find by ID */
export const findConversationByIdRepo = (conversationId) => {
  return Conversation.findById(conversationId).lean();
};

/* Update last message */
export const updateLastMessageRepo = (conversationId, messageId) => {
  return Conversation.findByIdAndUpdate(
    conversationId,
    { last_message_id: messageId },
    { new: true }
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
