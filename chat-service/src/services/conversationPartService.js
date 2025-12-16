import {
  addParticipantRepo,
  addParticipantsRepo,
  getParticipantsByConversationIdRepo,
  getUserConversationsByUserIdRepo,
  updateLastReadMessageRepo,
  removeParticipantRepo,
  getUserConversationsByUserIdAndTypeRepo,
  getOtherUserIdByConversationIdAndUserIdRepo,
} from "../repositories/mongo/conversationParticipantRepo.js";

import logger from "../utils/logger.js";
import i18n from "../i18n/langConfig.js";

export const addParticipantService = async (data) => {
  const participant = await addParticipantRepo(data);

  if (!participant) {
    throw new Error(i18n.__("CONVERSATION_PARTICIPANT.ADD_FAILED"));
  }

  return participant;
};

export const addParticipantsService = async (conversationId, users,session) => {
  const participants = await addParticipantsRepo(conversationId, users,session);

  if (!participants || participants.length === 0) {
    throw new Error(i18n.__("CONVERSATION_PARTICIPANT.ADD_FAILED"));
  }

  return participants;
};

export const getOtherUserIdByConversationIdAndUserIdService = async (conversationId, userId) => {
  try {
    const otherUsers = await getOtherUserIdByConversationIdAndUserIdRepo(conversationId, userId);

    if (!otherUsers || otherUsers.length === 0) {
      logger.warn(`No other participants found in conversation ${conversationId} for user ${userId}`);
      throw new Error(i18n.__("conversation.no_other_participants"));
    }

    return otherUsers;
  } catch (error) {
    logger.error(`Failed to fetch other participants for conversation ${conversationId}: ${error.message}`);
    throw new Error(i18n.__("conversation.fetch_error"));
  }
};

export const getParticipantsService = async (conversationId) => {
  const participants = await getParticipantsByConversationIdRepo(conversationId);

  if (!participants || participants.length === 0) {
    throw new Error(i18n.__("CONVERSATION_PARTICIPANT.NOT_FOUND"));
  }

  return participants;
};

export const getUserConversationsByUserIdService = async (userId) => {
  const conversations = await getUserConversationsByUserIdRepo(userId);

  if (!conversations || conversations.length === 0) {
    throw new Error(i18n.__("CONVERSATION.NOT_FOUND"));
  }

  return conversations;
};

export const getUserConversationsByUserIdAndTypeService = async (userId,type) => {
  const conversations = await getUserConversationsByUserIdAndTypeRepo(userId,type);

  if (!conversations || conversations.length === 0) {
    throw new Error(i18n.__("CONVERSATION.NOT_FOUND"));
  }

  return conversations;
};

export const markConversationReadService = async ({
  conversationId,
  userId,
  messageId,
}) => {
  const updated = await updateLastReadMessageRepo({
    conversationId,
    userId,
    messageId,
  });

  if (!updated) {
    throw new Error(i18n.__("CONVERSATION_PARTICIPANT.UPDATE_FAILED"));
  }

  return updated;
};

export const leaveConversationService = async (conversationId, userId) => {
  const removed = await removeParticipantRepo(conversationId, userId);

  if (!removed) {
    throw new Error(i18n.__("CONVERSATION_PARTICIPANT.NOT_FOUND"));
  }

  logger.info(`User left conversation: user=${userId}, conversation=${conversationId}`);
  return removed;
};
