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
  const [isSessionLoading, setIsLoading] = useState(false);
  const [previousChats, setPreviousChats] = useState<Message[]>([]);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const { user, error, isLoading } = useUser();

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(scrollToBottom, [messages]);

  useEffect(() => {
    if (user) {
      fetchPreviousChats(user.sub);
    }
  }, [user]);

  const fetchPreviousChats = async (userId: string) => {
    try {
      const response = await fetch(`/api/get-chats?userId=${userId}`);
      const data = await response.json();
      setPreviousChats(data.chats);
    } catch (error) {
      console.error("Error fetching previous chats:", error);
    }
  };

  const saveMessage = async (content: string, isUser: boolean) => {
    if (!user?.sub) {
      console.error("User ID not available");
      return;
    }

    try {
      const response = await fetch("/api/save-chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId: user.sub,
          content,
          isUser,
          email: user.email,
          name: user.name,
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      console.log("Message saved:", result);
    } catch (error) {
      console.error("Error saving message:", error);
    }
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
    <main className="flex flex-col h-screen">
      <div className="p-4 bg-white">
        {user ? (
          <form
            onSubmit={handleSubmit}
            className="flex flex-col justify-center items-center space-y-2 max-w-2xl mx-auto"
          >
            <InputWithIcons
              type="text"
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
