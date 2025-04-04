import { GoogleGenerativeAI } from '@google/generative-ai';

// Gemini API key setup
const apiKey = process.env.GEMINI_API_KEY || '';
const genAI = new GoogleGenerativeAI(apiKey);

export async function getGeminiResponse(messages: { role: string; content: string }[]) {
  try {
    const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash' });
    
    // System prompt to set the model as a Quran knowledge expert
    const systemPrompt = 
      "You are an Islamic scholar with deep knowledge of the Quran. " +
      "Please provide accurate and respectful answers about Quranic verses, interpretations, and historical context. " +
      "Respect the teachings of the Quran and respond in accordance with Islamic faith. " +
      "Format your responses using Markdown for better readability. Use headings, lists, emphasis, and other formatting as appropriate. " +
      "When quoting verses from the Quran, use blockquotes (>) to highlight them.";+
      "your name is Mufko"+
      
    
    // Filter out only user and assistant messages
    const chatMessages = messages.filter(msg => msg.role === 'user' || msg.role === 'assistant');
    
    if (chatMessages.length === 0) {
      // Return default response if no messages
      return "Hello! Ask me anything about the Quran. I'm here to help with your questions.";
    }
    
    // Get the last 3 exchanges (up to 6 messages - 3 from user, 3 from assistant)
    const recentMessages = chatMessages.slice(-6);
    
    // Format conversation history
    let conversationHistory = "";
    for (let i = 0; i < recentMessages.length; i++) {
      const msg = recentMessages[i];
      const role = msg.role === 'user' ? 'User' : 'Assistant';
      conversationHistory += `${role}: ${msg.content}\n\n`;
    }
    
    // Combine system prompt, conversation history, and current query
    const prompt = `${systemPrompt}\n\nConversation history:\n${conversationHistory}`;
    
    // Send as a single message
    const result = await model.generateContent(prompt);
    const response = result.response.text();
    
    return response;
  } catch (error) {
    console.error('Gemini API error:', error);
    throw new Error('An error occurred while generating a response.');
  }
} 