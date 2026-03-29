import { useState } from "react";
import { SheCard } from "@/ui/Card";
import { SheInput } from "@/ui/Input";
import { SheButton } from "@/ui/Button";
import { FiSend, FiZap } from "react-icons/fi";
import { predictCancer } from "@/services/aiService";

interface Message {
  id: number;
  text: string;
  sender: "user" | "ai";
}

const initialMessages: Message[] = [
  {
    id: 1,
    text: "Hello! I'm your SheCare AI assistant 🌸 I can help you with breast cancer risk assessment. Type 'scan' to start a diagnostic, or ask me anything!",
    sender: "ai",
  },
];

const DEFAULT_FEATURES = [
  17.99, 10.38, 122.8, 1001.0, 0.1184, 0.2776, 0.3001, 0.1471,
  0.2419, 0.07871, 1.095, 0.9053, 8.589, 153.4, 0.006399, 0.04904,
  0.05373, 0.01587, 0.03003, 0.006193, 25.38, 17.33, 184.6, 2019.0,
  0.1622, 0.6656, 0.7119, 0.2654, 0.4601, 0.1189,
];

export function AIChatPanel() {
  const [messages, setMessages] = useState<Message[]>(initialMessages);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);

  const addMessage = (text: string, sender: "user" | "ai") => {
    setMessages((prev) => [...prev, { id: Date.now(), text, sender }]);
  };

  const sendMessage = async () => {
    if (!input.trim() || loading) return;
    const userText = input.trim();
    addMessage(userText, "user");
    setInput("");
    setLoading(true);

    try {
      if (userText.toLowerCase().includes("scan") || 
          userText.toLowerCase().includes("diagnostic") ||
          userText.toLowerCase().includes("check")) {
        
        addMessage("🔍 Running your breast cancer risk assessment...", "ai");
        
        const result = await predictCancer(DEFAULT_FEATURES);
        
        const resultLabel = String(result.resultat || result.result || "").toLowerCase();
        const probability = typeof result.probabilite === "number"
          ? result.probabilite
          : typeof result.probability === "number"
            ? result.probability
            : 0;
        const isBenign = ["benin", "benign", "b9", "negative"].some((token) => resultLabel.includes(token));

        const response = isBenign
          ? `Good news. Your assessment result is Benign (probability: ${(probability * 100).toFixed(1)}%).\n\nThis suggests lower risk, but regular follow-up with your doctor is still important. ${result.message || ""}`
          : `Assessment result is Malignant (probability: ${((1 - probability) * 100).toFixed(1)}%).\n\nPlease contact a medical professional as soon as possible for formal diagnosis and next steps. ${result.message || ""}`;
        
        addMessage(response, "ai");

      } else {
        addMessage(
          "I'm here to support you 💜 Type 'scan' to run a breast cancer risk assessment, or ask me about symptoms, prevention, or resources.",
          "ai"
        );
      }
    } catch {
      addMessage(
        "Could not connect to the AI model. Make sure your AI API is running and VITE_AI_API_URL is configured.",
        "ai"
      );
    } finally {
      setLoading(false);
    }
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
            <p className="text-xs text-muted-foreground">
              {loading ? "Analyzing..." : "Always here for you"}
            </p>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {messages.map((msg) => (
            <div
              key={msg.id}
              className={`flex ${msg.sender === "user" ? "justify-end" : "justify-start"}`}
            >
              <div
                className={`max-w-[80%] px-4 py-3 rounded-2xl text-sm leading-relaxed whitespace-pre-line ${
                  msg.sender === "user"
                    ? "shecare-gradient text-primary-foreground rounded-br-md"
                    : "bg-muted text-foreground rounded-bl-md"
                }`}
              >
                {msg.text}
              </div>
            </div>
          ))}
          {loading && (
            <div className="flex justify-start">
              <div className="bg-muted px-4 py-3 rounded-2xl rounded-bl-md text-sm text-muted-foreground">
                SheCare AI is thinking...
              </div>
            </div>
          )}
        </div>

        <div className="p-4 border-t border-border">
          <div className="flex gap-2">
            <SheInput
              placeholder="Type 'scan' for diagnosis or ask anything..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && sendMessage()}
            />
            <SheButton onClick={sendMessage} disabled={!input.trim() || loading}>
              <FiSend className="w-4 h-4" />
            </SheButton>
          </div>
        </div>
      </SheCard>
    </div>
  );
}