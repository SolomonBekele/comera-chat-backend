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
import { getLastMessageService, getUnreadCountService,  } from "./messageService.js";
import { formatTimeAgo } from "../../../common/util/formatTime.js";

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

export const getUserConversationsByUserIdAndTypeService = async (userId, type) => {
  const conversations =await getUserConversationsByUserIdAndTypeRepo(userId, type);

  if (!conversations || conversations.length === 0) {
    throw new Error(i18n.__("CONVERSATION.NOT_FOUND"));
  }
  const filteredConversations = await Promise.all(
    conversations
      .filter(p => p.conversation_id && p.conversation_id.type === type)
      .map(async (p) => {
        const countUnreadMessage = await getUnreadCountService({
            conversationId:p.conversation_id._id,
            lastReadMessageId:p.last_read_message_id,
            userId,
        })
        p.unreadMessage = countUnreadMessage;
        p.id = p._id;
        delete p._id;

        const conversationInfo = p.conversation_id;

        // ✅ get last message for this conversation
        const lastMessage = await getLastMessageService(conversationInfo._id);

        conversationInfo.lastMessage = lastMessage?.content || null;
        conversationInfo.lastMessageType = lastMessage?.type || null;
        conversationInfo.lastMessageTime = formatTimeAgo(lastMessage?.sentAt)

        // remove unwanted fields
        delete conversationInfo.last_message_id;

        // If NOT group → remove group info
        if (conversationInfo.type !== "group") {
          delete conversationInfo.group_pic;
          delete conversationInfo.name;
        }

        return {
          ...p,
          conversationInfo,
          conversation_id: undefined,
        };
      })
  );

  if (filteredConversations.length === 0) {
    throw new Error(i18n.__("CONVERSATION.NOT_FOUND"));
  }

  return filteredConversations;
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
