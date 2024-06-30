import { NextResponse } from "next/server";
import Anthropic from "@anthropic-ai/sdk";

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

const SYSTEM_PROMPT = `You are an AI mental health therapist, highly trained and empathetic, specializing in all forms of anxiety. Your role is to help users understand their anxiety, its possible sources, and guide them towards small steps to manage it effectively. Remember to always avoid suggesting severe diseases and focus on holistic, proven concepts.`;

export async function POST(request: Request) {
  try {
    const { message } = await request.json();
    console.log("Received message:", message);

    if (!process.env.ANTHROPIC_API_KEY) {
      console.error("ANTHROPIC_API_KEY is not set");
      return NextResponse.json(
        { error: "API key is not configured" },
        { status: 500 }
      );
    }

    const response = await anthropic.messages.create({
      model: "claude-3-5-sonnet-20240620",
      max_tokens: 1024,
      system: SYSTEM_PROMPT,
      messages: [{ role: "user", content: message }],
    });

    console.log("Anthropic API response:", response);

    return NextResponse.json({ content: response.content[0].text });
  } catch (error) {
    console.error("Error in /api/chat:", error);
    return NextResponse.json(
      { error: "Error processing your request" },
      { status: 500 }
    );
  }
}
