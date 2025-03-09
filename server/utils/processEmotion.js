import Messages from "../models/Messages.js";
import analyzeMessage from "./analyze.js";
import MessageMetadata from "../models/MessageMetadata.js"; 

const processEmotion = async (messageId, text) => {
  try {  
    // Get emotions from FastAPI 
    const [bertEmotion, RobertaEmotion, lrEmotion, rfEmotion] = await analyzeMessage(text);



    // Insert the detected emotions into the MessageMetadata collection
    const messageMetadata = new MessageMetadata({
      message_id: messageId,  // The message ID
      bert_emotion: bertEmotion,  // Emotion from BERT
      roberta_emotion: RobertaEmotion,  // Emotion from RoBERTa
      lr_emotion: lrEmotion,  // Emotion from Logistic Regression
      rf_emotion: rfEmotion,  // Emotion from Random Forest
      sentiment_score
    });

    // Save the metadata to the database
    await messageMetadata.save();

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
