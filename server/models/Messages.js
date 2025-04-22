import mongoose from "mongoose";
import { encrypt, safeDecrypt } from "../config/crypto.js";

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
      enum: ["processing", "processed"]
    },
    message_status: {
      type: String,
      default: 'pending',
      enum: ["pending", "sent", "delivered", "seen"]
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

// Pre-save hook to encrypt text
MessageSchema.pre("save", function (next) {
  if (this.isModified("text") && !this.text.includes(":")) {
    this.text = encrypt(this.text);
  }
  next();
});

// Method to decrypt text on retrieval
MessageSchema.methods.getDecryptedText = function () {
  return safeDecrypt(this.text);
};

export default mongoose.model("Messages", MessageSchema);
