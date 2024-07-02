"use client";
import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { useUser, withPageAuthRequired } from "@auth0/nextjs-auth0/client";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import saveMessageToDB from "../utils/saveMessageToDB";
import { Textarea } from "@/components/ui/textarea";
import { formatText } from "../utils/formatText";

interface Message {
  content: string;
  isUser: boolean;
}

export default withPageAuthRequired(function Home() {
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState<Message[]>([]);
  const [isSessionLoading, setIsLoading] = useState(false);
  const [previousChats, setPreviousChats] = useState<Message[]>([]);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const { user, error, isLoading } = useUser();

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(scrollToBottom, [messages]);

  const saveMessage = async (content: string, isUser: boolean) => {
    if (!user?.sub) {
      console.error("User ID not available");
      return;
    }

    const messageSaved = saveMessageToDB(user, content, isUser);
    console.log(messageSaved);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim()) return;

    const userMessage = { content: message, isUser: true };
    setMessages((prev) => [...prev, userMessage]);
    setIsLoading(true);

    try {
      // Save user message
      await saveMessage(message, true);

      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message }),
      });

      if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);

      const data = await res.json();
      const aiMessage = { content: data.content, isUser: false };
      setMessages((prev) => [...prev, aiMessage]);

      // Save AI message
      await saveMessage(data.content, false);
    } catch (error) {
      console.error("Error calling API:", error);
      const errorMessage = {
        content: "An error occurred while processing your request.",
        isUser: false,
      };
      setMessages((prev) => [...prev, errorMessage]);
      await saveMessage(errorMessage.content, false);
    } finally {
      setIsLoading(false);
      setMessage("");
    }
  };

  if (isLoading) return <div>Loading...</div>;

  return (
    <main className="flex flex-col h-screen items-center justify-center">
      <div className="flex-grow overflow-auto p-4 w-full max-w-2xl border-2 mt-12">
        {messages.map((msg, index) => (
          <div
            key={index}
            className={`mb-4 ${msg.isUser ? "text-right" : "text-left"}`}
          >
            <div
              className={`inline-block p-2 rounded-lg ${
                msg.isUser ? "bg-blue-500 text-white" : "bg-gray-200"
              }`}
            >
              {formatText(msg.content)}
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>
      <div className="p-4 bg-white w-full max-w-2xl">
        {user ? (
          <form onSubmit={handleSubmit} className="grid w-full gap-2">
            <Textarea
              placeholder="Enter your message"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              className="w-full p-4 text-lg"
            />
            <Button type="submit" disabled={isSessionLoading}>
              {isSessionLoading ? "Sending..." : "Send"}
            </Button>
          </form>
        ) : (
          <Popover>
            <PopoverTrigger asChild>
              <Button className="w-full max-w-2xl mx-auto">
                Login to Start Chatting
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-80">
              <div className="grid gap-4">
                <h3 className="font-medium leading-none">Login Required</h3>
                <p className="text-sm text-muted-foreground">
                  Please log in to use the chat feature.
                </p>
                <Button
                  onClick={() => (window.location.href = "/api/auth/login")}
                >
                  Login
                </Button>
              </div>
            </PopoverContent>
          </Popover>
        )}
      </div>
    </main>
  );
});
