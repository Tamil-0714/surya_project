import dotenv from "dotenv";
dotenv.config();
import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GAPI);
const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

const askAi = async (review) => {
  // console.log("at the line of 9 : ", review);
  // console.log("type ", typeof review);

  try {
    const prompt = `Analyze the following Flipkart product reviews and assess the legitimacy of each review on a scale of 0 to 10, where 0 is completely fake and 10 is completely legitimate. Provide a brief justification for your score.

  Focus on identifying potential signs of fake reviews, such as:
  - Overly generic language
  - Excessive positivity or negativity
  - Lack of specific details
  - Suspicious patterns

  Return the response in HTML format with inline styles for clear and structured presentation.

  The JSON data: ${review}

  Format the response as follows:
  - First <p> tag should contian the actual review 
  - Secodn <p> tag should contian  legitimacy of the review from 0 to 10
  - Wrap each review's analysis inside a <div> with padding and border.
  - Display the score in bold.
  - Use a different color for scores (e.g., red for low, green for high, orange for mid-range).
  - Justifications should be in a readable paragraph format.

  Ensure the result contain only a single parent div tag that can contain all the remaining  elements wrapped inside of it.
  `;
    const result = await model.generateContent(prompt);
    return result.response.text();
  } catch (error) {
    return "Error in analysing with AI";
  }
};

export { askAi };
