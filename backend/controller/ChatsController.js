import User from "../models/User.js";
import { GoogleGenerativeAI } from "@google/generative-ai";  

// Initialize Google Generative AI with your API key
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

class ChatsController {
  static async generateChatCompletion(req, res) {
    const { message } = req.body;
    if (!message) {
      return res.status(400).json({ message: "Message is required." });
    }
  
    try {
      const id = req.user.userId;
  
      const user = await User.findById(id);
      if (!user) {
        return res.status(401).json({ message: "User not registered OR Token malfunctioned" });
      }
  
      const chats = user.chats.map(({ role, content }) => ({ role, content }));
      chats.push({ role: "user", content: message });
      user.chats.push({ role: "user", content: message });
  
      console.log("Chats sent to Gemini API:", chats);
  
      const prompt = message;
      const result = await model.generateContent(prompt);

      console.log(result.response.text())
      const assistantMessage = result.response.text();
  
       user.chats.push({ role: "assistant", content: assistantMessage });
      await user.save();
  
      res.status(200).json({
        message: "Chat response generated successfully",
        chatResponse:assistantMessage
      });
    } catch (error) {
      console.error("Error generating chat response:", error);
      res.status(500).json({
        message: error.message || "Internal Server Error",
      });
    }
  }
  

  static async SendChattoUser(req, res) {
    try {
      const user = await User.findById(req.user.userId);
      if (!user) {
        return res.status(401).send("User not registered OR Token malfunctioned");
      }

      // This check seems odd; it seems to be comparing the same user twice
      if (user._id.toString() !== req.user.userId) {
        return res.status(401).send("Permissions didn't match");
      }

      return res.status(200).json({ message: "OK", chats: user.chats , timestamps: user.timeStamp });
    } catch (error) {
      console.error("Error sending chat to user:", error);
      res.status(500).json({ message: error.message || "Internal Server Error" });
    }
  }

  static async deleteUser(req, res) {
    try {
      const user = await User.findById(req.user.userId);
      if (!user) {
        return res.status(401).send("User not registered OR Token malfunctioned");
      }

      // You seem to be doing the same check here again
      if (user._id.toString() !== req.user.userId) {
        return res.status(401).send("Permissions didn't match");
      }

      user.chats = []; // Clear the chats
      await user.save();
      
      return res.status(200).json({ message: "OK" });
    } catch (error) {
      console.error("Error deleting chats:", error);
      res.status(500).json({ message: error.message || "Internal Server Error" });
    }
  }
}

export default ChatsController;
