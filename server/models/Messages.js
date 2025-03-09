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
      ref: "User",
      required: true,
    },
    text: { type: String, required: true },
    sent_at: {
      type: Date,
      default: Date.now,
    },
    read_by: [
      { type: mongoose.Schema.Types.ObjectId, ref: "User" }
    ],
    is_active: {
      type: Boolean,
      default: true,
    },
    processing_status: {
      type: String,
      default: 'processing',
    },
    reaction: {
      emoji: { type: String },
      reacted_by: [
        { type: mongoose.Schema.Types.ObjectId, ref: "User" }
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
