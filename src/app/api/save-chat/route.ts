import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(request: Request) {
  try {
    const { userId, content, isUser, email, name } = await request.json();

    // Ensure the user exists
    let user = await prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      // Optionally, create the user if they don't exist
      // This assumes you have additional user data like email and name
      user = await prisma.user.create({
        data: {
          id: userId,
          email, 
          name, 
        },
      });
    }

    // Get the current date
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    // Find or create a session for today
    let session = await prisma.session.findFirst({
      where: {
        userId: userId,
        createdAt: {
          gte: today,
          lt: new Date(today.getTime() + 24 * 60 * 60 * 1000),
        },
      },
    });

    if (!session) {
      session = await prisma.session.create({
        data: {
          userId: userId,
        },
      });
    }

    // Save the message
    const message = await prisma.message.create({
      data: {
        content: content,
        isUser: isUser,
        sessionId: session.id,
      },
    });

    return NextResponse.json({ message: "Chat saved successfully" });
  } catch (error) {
    console.error("Error in /api/save-chat:", error);
    return NextResponse.json({ error: "Error saving chat" }, { status: 500 });
  }
}
