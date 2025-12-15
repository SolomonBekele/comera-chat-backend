import mongoose from "mongoose";

const messageSchema = new mongoose.Schema(
  {
    conversation_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Conversation",
      required: true,
      index: true,
    },

    sender_id: {
      type: String, 
      required: true,
      index: true,
    },

    type: {
      type: String,
      enum: ["text", "image", "video", "file", "location"],
      default: "text",
    },

    content: {
      type: String,
      default: null,
    },

    media_url: {
      type: String,
      default: null,
    },

    delivered_at: {
      type: Date,
      default: null,
    },

    read_at: {
      type: Date,
      default: null,
    },

    deleted: {
      type: Boolean,
      default: false,
    },

    reply_to_message_id: {
      type: String,
      default: null,
    },
  },
  {
    timestamps: {
      createdAt: "sent_at",
      updatedAt: false,
    },
  }
);

export const Message = mongoose.model("Message", messageSchema);
