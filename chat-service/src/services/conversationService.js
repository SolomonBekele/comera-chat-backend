import {
  createConversationRepo,
  findConversationByIdRepo,
  findConversationsByIdsRepo,
  updateLastMessageRepo,
} from "../repositories/mongo/conversationRepo.js";

import logger from "../utils/logger.js";
import i18n from "../i18n/langConfig.js";


export const createConversationService = async (
  type,
  data,
  session
) => {
  const conversation = await createConversationRepo(type, data, session);
  if (!conversation) {
    logger.error("Failed to create conversation");
    throw new Error(i18n.__("CONVERSATION.CREATE_FAILED"));
  }

  logger.info(`Conversation created: id=${conversation._id}`);
  return conversation;
};


export const getConversationByIdService = async (id) => {
  const conversation = await findConversationByIdRepo(id);

  if (!conversation) {
    logger.warn(`Conversation not found: id=${id}`);
    throw new Error(i18n.__("CONVERSATION.NOT_FOUND"));
  }

  return conversation;
};

export const getConversationsByIdsService = async (ids) => {
  const conversations = await findConversationsByIdsRepo(ids);

  if (!conversations || conversations.length === 0) {
    logger.warn("No conversations found for given IDs");
    throw new Error(i18n.__("CONVERSATION.NOT_FOUND"));
  }

  return conversations;
};

export const updateLastMessageService = async (conversationId, messageId,session) => {
  const updatedConversation = await updateLastMessageRepo(
    conversationId,
    messageId,
    session
  );

  if (!updatedConversation) {
    logger.warn(`Failed to update last message for conversation: id=${conversationId}`);
    throw new Error(i18n.__("CONVERSATION.UPDATE_FAILED"));
  }

  return updatedConversation;
};
