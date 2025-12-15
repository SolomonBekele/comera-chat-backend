import mongoose from "mongoose";

const conversationParticipantSchema = new mongoose.Schema(
  {
    conversation_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Conversation",
      required: true,
      index: true,
    },

    user_id: {
      type: String, 
      required: true,
      index: true,
    },

    role: {
      type: String,
      enum: ["member", "admin"],
      default: "member",
    },

    last_read_message_id: {
      type: String,
      default: null,
    },
  },
  {
    timestamps: {
      createdAt: "joined_at",
      updatedAt: false,
    },
  }
);

// Prevent duplicate user in same conversation
conversationParticipantSchema.index(
  { conversation_id: 1, user_id: 1 },
  { unique: true }
);

export const ConversationParticipant = mongoose.model(
  "ConversationParticipant",
  conversationParticipantSchema
);
