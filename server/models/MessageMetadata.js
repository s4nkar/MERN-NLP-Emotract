import mongoose from "mongoose";

const MessageMetadataSchema = new mongoose.Schema(
  {
    message_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Messages",
      required: true,
      index: true, // ✅ Faster queries
    },
    // To store emotion from BERT model 
    bert: {
      emotion: { type: String},
      probability: { type: Number, min: 0, max: 1 },
      sentiment: { type: String, enum: ["positive", "negative", "neutral"] },
    },
    // To store emotion from RoBERTa model 
    roberta: {
      emotion: { type: String },
      probability: { type: Number, min: 0, max: 1 },
      sentiment: { type: String, enum: ["positive", "negative", "neutral"] },
    },
    // To store emotion from Logistic Regression model 
    logistic_regression: {
      emotion: { type: String},
      probability: { type: Number, min: 0, max: 1 },
      sentiment: { type: String, enum: ["positive", "negative", "neutral"] },
    },
    // To store emotion from Random Forest model 
    random_forest: {
      emotion: { type: String },
      probability: { type: Number, min: 0, max: 1 },
      sentiment: { type: String, enum: ["positive", "negative", "neutral"] },
    },
    is_flagged: {
      type: Boolean,
      default: false,
    },
    // Aggregate sentiment score
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
