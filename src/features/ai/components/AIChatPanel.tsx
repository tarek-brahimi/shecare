import { useState } from "react";
import { SheCard } from "@/ui/Card";
import { SheInput } from "@/ui/Input";
import { SheButton } from "@/ui/Button";
import { FiSend, FiZap } from "react-icons/fi";

interface Message {
  id: number;
  text: string;
  sender: "user" | "ai";
}

const initialMessages: Message[] = [
  { id: 1, text: "Hello! I'm your SheCare AI assistant. I'm here to support you with information, emotional guidance, and helpful resources. How can I help you today? 🌸", sender: "ai" },
];

export function AIChatPanel() {
  const [messages, setMessages] = useState<Message[]>(initialMessages);
  const [input, setInput] = useState("");

  const sendMessage = () => {
    if (!input.trim()) return;
    const userMsg: Message = { id: Date.now(), text: input, sender: "user" };
    setMessages((prev) => [...prev, userMsg]);
    setInput("");

    setTimeout(() => {
      const aiMsg: Message = {
        id: Date.now() + 1,
        text: "Thank you for sharing that with me. I understand this can be challenging. Remember, you're not alone in this journey. Would you like me to suggest some resources or connect you with community support?",
        sender: "ai",
      };
      setMessages((prev) => [...prev, aiMsg]);
    }, 1000);
  };

  return (
    <div className="flex flex-col h-[calc(100vh-8rem)]">
      <SheCard className="flex-1 flex flex-col overflow-hidden" noPadding>
        <div className="p-4 border-b border-border flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl shecare-gradient flex items-center justify-center">
            <FiZap className="w-5 h-5 text-primary-foreground" />
          </div>
          <div>
            <h3 className="text-sm font-semibold text-foreground">SheCare AI</h3>
            <p className="text-xs text-muted-foreground">Always here for you</p>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {messages.map((msg) => (
            <div key={msg.id} className={`flex ${msg.sender === "user" ? "justify-end" : "justify-start"}`}>
              <div className={`max-w-[80%] px-4 py-3 rounded-2xl text-sm leading-relaxed ${
                msg.sender === "user"
                  ? "shecare-gradient text-primary-foreground rounded-br-md"
                  : "bg-muted text-foreground rounded-bl-md"
              }`}>
                {msg.text}
              </div>
            </div>
          ))}
        </div>

        <div className="p-4 border-t border-border">
          <div className="flex gap-2">
            <SheInput
              placeholder="Type your message..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && sendMessage()}
            />
            <SheButton onClick={sendMessage} disabled={!input.trim()}>
              <FiSend className="w-4 h-4" />
            </SheButton>
          </div>
        </div>
      </SheCard>
    </div>
  );
}
