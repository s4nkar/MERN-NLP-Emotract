import mongoose from "mongoose";

const MessageMetadataSchema = mongoose.Schema(
  {
    message_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Messages",
      required: true,
    },
    // To store emotion from BERT model 
    bert_emotion: {
        type: String,
        default: null,
      },
    // To store emotion from RoBERTa model 
    roberta_emotion: {
        type: String,
        default: null,
    },
    // To store emotion from Logistic Regression model 
    lr_emotion: {
        type: String,
        default: null,
    },
    // To store emotion from Random Forest model 
    rf_emotion: {
        type: String,
        default: null,
    },
    is_flagged: {
        type: Boolean,
        default: false,
    },
    sentiment_score: {
        type: Number,
        default: 0,
    },
},
  {
    timestamps: true,
  }
);

export default mongoose.model("MessageMetadata", MessageMetadataSchema);
