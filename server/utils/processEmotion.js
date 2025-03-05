import Messages from "../models/Messages.js";
import analyzeMessage from "./processEmotion.js";

const processEmotion = async (messageId, text) => {
  try {  
    // get emotions from fast api 
    const [bertEmotion, RobertaEmotion, lrEmotion, rfEmotion ] = await analyzeMessage(text);
  
  
    // // Update the message with the emotion result
    // await Message.findByIdAndUpdate(messageId, {
    //   emotion: result.emotion,
    //   sentiment_score: result.sentiment_score,
    //   status: 'processed' // Mark the message as processed
    // });
  
    console.log(`Message ${messageId} emotion detected: ${bertEmotion, RobertaEmotion, lrEmotion, rfEmotion}`);
  } catch (error) {
    console.error("Error Processing Message:", error);
    return { error: "Failed to analyze sentiment" };
  }
};

// Run the cron job every 5 seconds to process new messages
const handleprocessingMessages = async () => {
  // Get messages that are still being processed (status = 'processing')
  const messagesToProcess = await Messages.find({ status: 'processing' });

  for (const message of messagesToProcess) {
    await processEmotion(message._id, message.text);
  }
}

export default handleprocessingMessages;

