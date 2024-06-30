"use client";
import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { InputWithIcons } from "@Components/CustomInput";
import { useUser, withPageAuthRequired } from "@auth0/nextjs-auth0/client";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

interface Message {
  content: string;
  isUser: boolean;
}

export default withPageAuthRequired(function Home() {
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState<Message[]>([]);
  const [isSessionLoadingLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const { user, error, isLoading } = useUser();

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(scrollToBottom, [messages]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim()) return;

    setMessages((prev) => [...prev, { content: message, isUser: true }]);
    setIsLoading(true);

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message }),
      });

      if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);

      const data = await res.json();
      setMessages((prev) => [
        ...prev,
        { content: data.content, isUser: false },
      ]);
    } catch (error) {
      console.error("Error calling API:", error);
      setMessages((prev) => [
        ...prev,
        {
          content: "An error occurred while processing your request.",
          isUser: false,
        },
      ]);
    } finally {
      setIsLoading(false);
      setMessage("");
    }
  };

  if (isLoading) {
    return <div>Loading...</div>;
  }
  console.log(user);
  if (!user) {
  }

  return (
    <main className="flex flex-col h-screen">
      <div className="flex-grow overflow-auto p-4">
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
              {msg.content}
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>
      <div className="p-4 bg-white">
        {user ? (
          <form
            onSubmit={handleSubmit}
            className="flex justify-center items-center space-x-2 max-w-2xl mx-auto"
          >
            <InputWithIcons
              type="text"
              placeholder="Enter your message"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              className="flex-grow"
            />
            <Button type="submit" disabled={isLoading}>
              {isLoading ? "Sending..." : "Send"}
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
