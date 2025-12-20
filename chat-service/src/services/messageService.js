import {
  getMessagesByConversationRepo,
  softDeleteMessageRepo,
  countUnreadMessagesRepo,
  createMessageRepo,
  getLastMessageRepo,
  markMessageDeliveredByConversationIdRepo
} from "../repositories/mongo/messageRepo.js";

import logger from "../utils/logger.js";
import i18n from "../i18n/langConfig.js";

export const creatMessageService = async (payload,session) => {
  const message = await createMessageRepo(payload,session);

  if (!message) {
    logger.error("Failed to send message");
    throw new Error(i18n.__("MESSAGE.SEND_FAILED"));
  }

  logger.info(`Message sent: id=${message._id}`);
  return message;
};

export const getMessagesService = async (params) => {
  const messages = await getMessagesByConversationRepo(params);

  if (!messages || messages.length === 0) {
    throw new Error(i18n.__("MESSAGE.NOT_FOUND"));
  }

  return messages;
};
export const getLastMessageService = async (conversation_id) => {
  const message = await getLastMessageRepo(conversation_id);

  if (!message) {
    throw new Error(i18n.__("MESSAGE.NOT_FOUND"));
  }
  return {content:message.content,type:message.type,sentAt:message.sent_at};
};

export const deleteMessageService = async (messageId) => {
  const deleted = await softDeleteMessageRepo(messageId);

  if (!deleted) {
    throw new Error(i18n.__("MESSAGE.DELETE_FAILED"));
  }

  logger.info(`Message soft-deleted: id=${messageId}`);
  return deleted;
};

export const getUnreadCountService = async (data) => {
  const count = await countUnreadMessagesRepo(data);

  if (count === null || count === undefined) {
    throw new Error(i18n.__("MESSAGE.UNREAD_COUNT_FAILED"));
  }

  return count;
};

export const markMessageDeliveredByConversationIdService = async (params) => {
  const messages = await markMessageDeliveredByConversationIdRepo(conversationId);

  if (!messages) {
    throw new Error(i18n.__("MESSAGE.NOT_FOUND"));
  }

  return true;
};
