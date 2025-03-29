import mongoose from "mongoose";

const MessageSchema = mongoose.Schema(
  {
    chat_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Chats",
      required: true,
    },
    sender_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Users",
      required: true,
    },
    text: { type: String, required: true },
    sent_at: {
      type: Date,
      default: Date.now,
    },
    read_by: [
      { type: mongoose.Schema.Types.ObjectId, ref: "Users" }
    ],
    is_active: {
      type: Boolean,
      default: true,
    },
    processing_status: {
      type: String,
      default: 'processing',
    },
    message_status: {
      type: String,
      default: 'sent',
      enum: ["sent", "delivered", "seen"]
    },
    is_flagged: {
      type: Boolean,
      default: false,
    },
    reaction: {
      emoji: { type: String },
      reacted_by: [
        { type: mongoose.Schema.Types.ObjectId, ref: "Users" }
      ],
      reacted_at: {
        type: Date,
        default: Date.now,
      },
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model("Messages", MessageSchema);
