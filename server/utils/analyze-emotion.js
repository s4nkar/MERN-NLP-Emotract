import axios from "axios";
import dotenv from "dotenv";

dotenv.config();

const analyzeMessage = async (message) => {
  try {
    const response = await axios.post(`${process.env.FASTAPI_URL}/api/v1/analyze/`, {
      text: message,
    });
    // console.log(response);
    return await response.data.data;
  } catch (error) {
    // console.error("Error analyzing sentiment:", error);
    return { error: "Failed to analyze sentiment" };
  }
};

export default analyzeMessage;

