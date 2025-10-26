"use client";

import { useState, useRef, useEffect } from "react";
import { XMarkIcon, ChatBubbleLeftRightIcon } from "@heroicons/react/24/outline";

interface Message {
  role: "user" | "assistant";
  content: string;
}

export const ChatAssistant = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      role: "assistant",
      content:
        "Hello! I'm your real estate assistant. I can help you find the perfect property and answer questions about fractional ownership. How can I help you today?",
    },
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    const userMessage = input.trim();
    setInput("");
    setMessages(prev => [...prev, { role: "user", content: userMessage }]);
    setIsLoading(true);

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: userMessage }),
      });

      const data = await response.json();

      if (data.reply) {
        setMessages(prev => [...prev, { role: "assistant", content: data.reply }]);
      } else {
        setMessages(prev => [
          ...prev,
          { role: "assistant", content: "Sorry, I couldn't process that. Please try again." },
        ]);
      }
    } catch (error) {
      console.error("Chat error:", error);
      setMessages(prev => [
        ...prev,
        { role: "assistant", content: "An error occurred. Please try again later." },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <>
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="fixed bottom-6 right-6 btn btn-circle btn-lg btn-primary shadow-lg z-50 hover:scale-110 transition-transform"
          aria-label="Open chat assistant"
        >
          <ChatBubbleLeftRightIcon className="h-6 w-6" />
        </button>
      )}

      {isOpen && (
        <div className="fixed bottom-6 right-6 w-96 h-[600px] bg-base-100 rounded-lg shadow-2xl z-50 flex flex-col border border-base-300">
          <div className="bg-primary text-primary-content p-4 rounded-t-lg flex justify-between items-center">
            <div>
              <h3 className="font-bold">Real Estate Assistant</h3>
              <p className="text-xs opacity-90">Powered by Gemini AI</p>
            </div>
            <button onClick={() => setIsOpen(false)} className="btn btn-ghost btn-sm btn-circle">
              <XMarkIcon className="h-5 w-5" />
            </button>
          </div>

          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {messages.map((msg, idx) => (
              <div key={idx} className={`chat ${msg.role === "user" ? "chat-end" : "chat-start"}`}>
                <div className="chat-bubble chat-bubble-primary">{msg.content}</div>
              </div>
            ))}
            {isLoading && (
              <div className="chat chat-start">
                <div className="chat-bubble">
                  <span className="loading loading-dots loading-sm"></span>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          <div className="p-4 border-t border-base-300">
            <div className="flex gap-2">
              <textarea
                value={input}
                onChange={e => setInput(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Ask about properties or legal questions..."
                className="textarea textarea-bordered flex-1 resize-none"
                rows={2}
                disabled={isLoading}
              />
              <button onClick={handleSend} className="btn btn-primary" disabled={isLoading || !input.trim()}>
                Send
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
