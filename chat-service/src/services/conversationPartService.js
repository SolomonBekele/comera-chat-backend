import {
  addParticipantRepo,
  addParticipantsRepo,
  getParticipantsByConversationIdRepo,
  getUserConversationsRepo,
  updateLastReadMessageRepo,
  removeParticipantRepo,
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

export const addParticipantsService = async (conversationId, users) => {
  const participants = await addParticipantsRepo(conversationId, users);

  if (!participants || participants.length === 0) {
    throw new Error(i18n.__("CONVERSATION_PARTICIPANT.ADD_FAILED"));
  }

  return participants;
};

export const getParticipantsService = async (conversationId) => {
  const participants = await getParticipantsByConversationIdRepo(conversationId);

  if (!participants || participants.length === 0) {
    throw new Error(i18n.__("CONVERSATION_PARTICIPANT.NOT_FOUND"));
  }

  return participants;
};

export const getUserConversationsService = async (userId) => {
  const conversations = await getUserConversationsRepo(userId);

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
