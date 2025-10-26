import { NextRequest, NextResponse } from "next/server";
import { GoogleGenAI } from "@google/genai";

export const dynamic = "force-dynamic";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY || "" });

const SYSTEM_PROMPT = `You are a helpful real estate assistant for a fractional ownership platform. 
Your role is to help users find suitable properties and answer legal questions about fractional real estate ownership.

Key information about the platform:
- We tokenize real estate properties into fractional shares using ERC-1155 tokens on Status Network Sepolia blockchain
- Users can buy fractions of properties with ETH (Ethereum)
- Each property is divided into 100 equal shares
- Prices are shown in ETH (1 ETH ≈ $2,500 USD)
- Users own blockchain-verified fractional shares of physical real estate

When helping users:
1. Ask about their budget, preferred location, number of rooms, and property type
2. Explain legal aspects of fractional ownership clearly
3. Explain blockchain benefits: transparency, immutability, easy transfer
4. Be friendly, professional, and concise

Legal aspects to mention when relevant:
- Fractional ownership gives proportional rights to property income and appreciation
- Each shareholder has voting rights proportional to their ownership
- Shares can be sold or transferred on blockchain
- Property management is handled by the platform
- Legal documents are stored on-chain via smart contracts`;

export async function POST(request: NextRequest) {
  try {
    const { message, chatHistory } = await request.json();

    if (!message) {
      return NextResponse.json({ error: "Message is required" }, { status: 400 });
    }

    const contents = [
      {
        role: "user",
        parts: [{ text: message }],
      },
    ];

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: contents,
      config: {
        systemInstruction: SYSTEM_PROMPT,
        temperature: 0.7,
        maxOutputTokens: 1024,
      },
    });

    const reply = response.response?.text() || "I'm sorry, I couldn't process that request.";

    return NextResponse.json({ reply });
  } catch (error) {
    console.error("Chat API error:", error);
    return NextResponse.json({ error: "Failed to generate response" }, { status: 500 });
  }
}
