import axios from "axios";

const analyzeMessage = async (message) => {
  try {
    const response = await axios.post("http://127.0.0.1:8000/analyze/", {
      text: message,
    });
    return response.data.data;
  } catch (error) {
    console.error("Error analyzing sentiment:", error);
    return { error: "Failed to analyze sentiment" };
  }
};

export default analyzeMessage;
// Example usage
// const message = "i my horny";
// const response = await analyzeMessage(message);
// const [bertEmotion, RobertaEmotion, lrEmotion, rfEmotion ] = response;
// console.log(bertEmotion, RobertaEmotion, lrEmotion, rfEmotion);

