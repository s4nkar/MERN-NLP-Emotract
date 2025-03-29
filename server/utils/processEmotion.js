import Messages from "../models/Messages.js";
import analyzeMessage from "./analyze-emotion.js";
import MessageMetadata from "../models/MessageMetadata.js"; 

const processEmotion = async (messageId, text) => {
  try {  
    // Get emotions from FastAPI 
    // Analyze the message to get emotions and sentiments from 4 different models
    const { bert, roberta, rf, lr } = await analyzeMessage(text);

    // Initialize the sentiment score and flagged status
    let sentiment_score = 0;  // This will hold the overall sentiment score based on the analysis
    let is_flagged = false;   // This flag indicates whether the message should be flagged or not

    // Threshold for considering negative sentiment as significant
    const NEGATIVE_PROB_THRESHOLD = 0.7;  // We only flag negative sentiments if their probability is higher than 70%

    // Sensitive emotions that need extra attention (e.g., "lust")
    const SENSITIVE_EMOTIONS = ["lust"];  // Emotions like "lust" might need special handling, so we track them

    // We will go through each model's results (BERT, RoBERTa, Random Forest, Logistic Regression)
    Object.values({ bert, roberta, rf, lr }).forEach(({ emotion, sentiment, probability }) => {
        
        // Check if the sentiment is "positive"
        if (sentiment === "positive") {
            sentiment_score += 1;  // If the sentiment is positive, increase the score by 1
        }
        
        // Check if the sentiment is "negative" and has a high probability (above 70%)
        else if (sentiment === "negative" && probability > NEGATIVE_PROB_THRESHOLD) {
            sentiment_score -= 0.5;  // If negative sentiment is highly confident, reduce the score by 0.5 (penalty)
        }

        // If the sentiment is negative and the probability is high, we mark the message as flagged
        if (sentiment === "negative" && probability > NEGATIVE_PROB_THRESHOLD) {
            is_flagged = true;  // Set the message as flagged (likely to be inappropriate or needs review)
        }

        // If the emotion is something sensitive like "lust" and has a high probability, flag the message
        if (SENSITIVE_EMOTIONS.includes(emotion) && probability > 0.75) {
            is_flagged = true;  // Flag the message for special attention due to sensitive content
        }
    });

    // At the end of the loop, we will have the total sentiment score and whether the message is flagged
    // console.log({ sentiment_score, is_flagged });

    // Insert the detected emotions into the MessageMetadata collection
    const messageMetadata = new MessageMetadata({
      message_id: messageId,  // The message ID
      bert: bert,  // Emotion from BERT
      roberta: roberta,  // Emotion from RoBERTa
      logistic_regression: lr,  // Emotion from Logistic Regression
      random_forest: rf,  // Emotion from Random Forest
      sentiment_score,  // Calculated sentiment score
      is_flagged  // Whether the message is flagged or not
    });

    // Save the metadata to the database
    await messageMetadata.save();

    // Update the processing status in the Messages collection
    await Messages.findByIdAndUpdate(
      messageId,  // The message ID
      { processing_status: 'processed', is_flagged },  // Set the processing status to 'processed'
      { new: true }  // Return the updated document
    );

  } catch (error) {
    console.error("Error processing message:", error);
    return { error: "Failed to analyze sentiment" };
  }
};


// Run the cron job every 5 seconds to process new messages
let isProcessing = false;  // Flag to track if processing is happening

const handleProcessingMessages = async () => {
  // Prevent multiple concurrent executions
  if (isProcessing) {
    return;  // If it's already running, don't execute again
  }

  isProcessing = true;  // Set flag to indicate that the processing is in progress

  try {
    // Get messages that are still being processed (status = 'processing')
    const messagesToProcess = await Messages.find({ processing_status: 'processing' });
    // console.log({ messagesToProcess });

    for (const message of messagesToProcess) {
      await processEmotion(message._id, message.text);
    }
  } catch (error) {
    console.error("Error processing messages:", error);
  } finally {
    // Reset the flag after processing is complete
    isProcessing = false;
  }
};

export default function handleTime() {
  // Run the cron job every 5 seconds
  setInterval(handleProcessingMessages, 10000);
}
