import { GoogleGenerativeAI } from "@google/generative-ai";
import { GEMINI_KEY } from "./constant";

const genAI = new GoogleGenerativeAI(GEMINI_KEY);

const generateContent = async (prompt) => {
  try {
    const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });
    const result = await model.generateContent([prompt]);
    const responseText = result.response.text().trim();
    return {
      message: {
        content: responseText,
      },
    };
  } catch (error) {
    console.error("Error in Gemini API:", error);
    throw error;
  }
};

export default { genAI, generateContent };
