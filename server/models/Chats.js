import mongoose from "mongoose";
import { v4 as uuidv4 } from 'uuid';

const ChatsSchema = new mongoose.Schema(
  {
    participants: [
      { type: mongoose.Schema.Types.ObjectId, ref: "Users" }
    ],
    is_group: {
      type: Boolean,
      default: false,
    },
    group_name: {
      type: String,
      default: function () {
        // Generate a random name if it's not a group
        return this.is_group ? undefined : `chat-${uuidv4()}`;
      },
      required: function () {
        return this.is_group;
      },
      min: 1,
    },
    group_admins: [
      { type: mongoose.Schema.Types.ObjectId, ref: "Users" }
    ],
    is_active: {
      type: Boolean,
      default: true,
    },
    last_message: {
      text: { type: String },
      sender_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Users",
      },
      sent_at: {
        type: Date,
        default: Date.now,
      },
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model("Chats", ChatsSchema);
