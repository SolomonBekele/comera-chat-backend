import mongoose from "mongoose";
const conversationSchema = new mongoose.Schema(
  {
    type: {
      type: String,
      enum: ["one-to-one", "group"],
      required: true,
    },

    /* ONLY for group chats */
    name: {
      type: String,
      default: null,
    },

    group_pic: {
      type: String,
      default: null,
    },

    last_message_id: {
      type: String,
      default: null,
    },
  },
  {
    timestamps: {
      createdAt: "created_at",
      updatedAt: "updated_at",
    },
  }
);
export const Conversation = mongoose.model(
  "Conversation",
  conversationSchema
);