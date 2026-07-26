import { GoogleGenerativeAI } from "@google/generative-ai";

export async function POST(req) {
  try {
    const apiKey = process.env.GEMINI_API_KEY;

    if (!apiKey) {
      return Response.json(
        { reply: "❌ GEMINI_API_KEY not found in .env.local" },
        { status: 500 }
      );
    }

    const genAI = new GoogleGenerativeAI(apiKey);
    const { messages } = await req.json();

    const model = genAI.getGenerativeModel({
      model: "gemini-2.0-flash",
    });

    // Remove the first assistant welcome message from history
    // Gemini requires history to start with 'user' role
    const allMessages = messages.filter((m) => m.role !== "assistant" || messages.indexOf(m) !== 0);

    // Build history — everything except the last user message
    const historyMessages = allMessages.slice(0, -1).filter((m) => m.role !== "assistant" || allMessages.indexOf(m) !== 0);

    const history = historyMessages
      .filter((m) => !(m.role === "assistant" && historyMessages.indexOf(m) === 0))
      .map((m) => ({
        role: m.role === "assistant" ? "model" : "user",
        parts: [{ text: m.content }],
      }));

    // Only keep history if it starts with user
    const cleanHistory = history[0]?.role === "user" ? history : [];

    const chat = model.startChat({ history: cleanHistory });

    // Last message is always the new user input
    const lastMessage = messages[messages.length - 1].content;
    const result = await chat.sendMessage(lastMessage);
    const reply = result.response.text();

    return Response.json({ reply });

  } catch (error) {
    console.error("Gemini API Error:", error.message);
    return Response.json(
      { reply: `Error: ${error.message}` },
      { status: 500 }
    );
  }
}