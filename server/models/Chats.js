import mongoose from "mongoose";

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
      required: function () {
        return this.is_group;
      },
      min: 1,
      unique: true,
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
