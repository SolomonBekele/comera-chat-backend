import {  addParticipantsService } from "../services/conversationPartService.js";
import { createConversationService, updateLastMessageService } from "../services/conversationService.js";
import { creatMessageService, getMessagesService } from "../services/messageService.js";
import mongoose from "mongoose";
import logger from "../utils/logger.js";
import i18n from "../i18n/langConfig.js";

export const sendMessage = async (req, res) => {
  const session = await mongoose.startSession();

  try {
    session.startTransaction();
    const senderId = req.userId;
    const { receiverId, content, type } = req.body;
    let conversationId = req.body.conversationId;

    // 1️⃣ Create 1-1 conversation lazily
    if (!conversationId) {
      const conversation = await createConversationService(
        "one-to-one",
        {},
        session
      );

      await addParticipantsService(
        conversation._id,
        [
          { userId: senderId },
          { userId: receiverId },
        ],
        session
      );

      conversationId = conversation._id;
    }

    // 2️⃣ Send message
    const message = await creatMessageService(
      {
        conversation_id: conversationId,
        sender_id: senderId,
        content,
        type,
      },
      session
    );

    // 3️⃣ Update last message
    await updateLastMessageService(
      conversationId,
      message._id,
      session
    );

    await session.commitTransaction();
    session.endSession();

    res.json({
      success: true,
      conversationId,
      message,
    });

  } catch (error) {
    await session.abortTransaction();
    session.endSession();

    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};


export const getAllMessages = async (req, res) => {
  try {
    const { conversationId } = req.params;

    if (!conversationId) {
      return res.status(400).json({
        success: false,
        message: i18n.__("CONVERSATION.ID_REQUIRED"),
      });
    }

    const messages = await getMessagesService(conversationId);

    return res.status(200).json({
      success: true,
      message: i18n.__("MESSAGE.RETRIEVED"),
      data: messages,
    });

  } catch (err) {
    logger.error("Error fetching messages", {
      message: err.message,
      stack: err.stack,
    });

    return res.status(404).json({
      success: false,
      message: err.message,
    });
  }
};



