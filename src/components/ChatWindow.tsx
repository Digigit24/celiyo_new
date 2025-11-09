import { useRef, useEffect, useState } from "react";
import {
  Send,
  ArrowLeft,
  Bold,
  Italic,
  List,
  Link as LinkIcon,
  Smile,
  Plus,
  Mic,
  Bot,
  AlertCircle
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { useMessages } from "@/hooks/whatsapp/useMessages";

const messagesData: Record<string, Array<{ from: "me" | "them"; text: string; time: string }>> = {
  "1": [
    { from: "them", text: "I didn’t like it", time: "3:30 PM" },
    { from: "me", text: "Sorry to hear that! Can you tell me more?", time: "3:31 PM" },
  ],
  "2": [
    { from: "me", text: "Send it 🏀", time: "3:30 PM" },
    { from: "them", text: "Here you go!", time: "3:31 PM" },
  ],
  "3": [
    { from: "them", text: "I am free now, if you can do the...", time: "3:30 PM" },
    { from: "me", text: "Sure, let's do it!", time: "3:31 PM" },
  ],
  "4": [
    { from: "them", text: "Where should we go now?", time: "3:30 PM" },
    { from: "me", text: "Let's decide together.", time: "3:31 PM" },
  ],
  "5": [
    { from: "them", text: "Good luck with everything", time: "3:30 PM" },
    { from: "me", text: "Thank you!", time: "3:31 PM" },
  ],
};

type Props = {
  conversationId: string;
  selectedConversation?: {
    phone: string;
    name: string;
    last_message: string;
    last_timestamp: string;
    message_count: number;
    direction: 'incoming' | 'outgoing';
  };
  isMobile?: boolean;
  onBack?: () => void;
};

const botFlows = [
  { label: "FAQ Bot", value: "faq" },
  { label: "Order Status", value: "order" },
  { label: "Custom Flow", value: "custom" },
];

export const ChatWindow = ({ conversationId, selectedConversation, isMobile, onBack }: Props) => {
  const { messages, isLoading, error, sendMessage, isSending } = useMessages(selectedConversation?.phone || null);
  
  // Transform WhatsApp messages to match the expected format
  const transformedMessages = messages.map(msg => ({
    from: msg.direction === 'outgoing' ? 'me' : 'them',
    text: msg.text,
    time: new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
  }));
  
  const endRef = useRef<HTMLDivElement>(null);
  const [tab, setTab] = useState<"reply" | "ai">("reply");
  const [input, setInput] = useState("");
  const [selectedFlow, setSelectedFlow] = useState<string | null>(null);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isSending) return;

    const messageText = input.trim();
    setInput("");

    try {
      await sendMessage(messageText);
    } catch (error) {
      // Error is already handled in the hook, just restore input
      setInput(messageText);
    }
  };

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [transformedMessages.length]);

  // Compact rich icons for header
  const richIcons = (
    <div className="flex gap-0.5 sm:gap-1">
      <Button type="button" variant="ghost" size="icon" className="rounded p-1 sm:p-2" aria-label="Bold">
        <Bold size={15} />
      </Button>
      <Button type="button" variant="ghost" size="icon" className="rounded p-1 sm:p-2" aria-label="Italic">
        <Italic size={15} />
      </Button>
      <Button type="button" variant="ghost" size="icon" className="rounded p-1 sm:p-2" aria-label="List">
        <List size={15} />
      </Button>
      <Button type="button" variant="ghost" size="icon" className="rounded p-1 sm:p-2" aria-label="Link">
        <LinkIcon size={15} />
      </Button>
    </div>
  );

  return (
    <section className="flex flex-col flex-1 min-w-0 bg-background min-h-screen">
      {/* Chat header */}
      <div className="flex items-center justify-between h-16 border-b border-border px-4">
        <div className="flex items-center gap-2">
          {isMobile && (
            <Button
              variant="ghost"
              size="icon"
              className="mr-2"
              onClick={onBack}
              aria-label="Back"
            >
              <ArrowLeft size={20} />
            </Button>
          )}
          <span className="font-semibold text-lg">
            {selectedConversation?.name || conversationId}
          </span>
        </div>
        <Button variant="outline" className="px-4 py-1 rounded-full text-xs font-medium">
          Start a Call
        </Button>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-4 py-4 space-y-4">
        {isLoading ? (
          <div className="flex items-center justify-center h-full">
            <div className="text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-2"></div>
              <div className="text-sm text-muted-foreground">Loading messages...</div>
            </div>
          </div>
        ) : error ? (
          <div className="flex items-center justify-center h-full">
            <div className="text-center text-destructive">
              <AlertCircle className="h-8 w-8 mx-auto mb-2" />
              <div className="text-lg font-semibold mb-2">Error loading messages</div>
              <div className="text-sm">{error}</div>
            </div>
          </div>
        ) : transformedMessages.length === 0 ? (
          <div className="flex items-center justify-center h-full">
            <div className="text-center text-muted-foreground">
              <div className="text-lg font-semibold mb-2">No messages yet</div>
              <div className="text-sm">Start a conversation by sending a message</div>
            </div>
          </div>
        ) : (
          transformedMessages.map((msg, idx) => (
            <div
              key={idx}
              className={`flex ${msg.from === "me" ? "justify-end" : "justify-start"}`}
            >
              <div
                className={cn(
                  "rounded-lg px-4 py-2 max-w-xs text-sm",
                  msg.from === "me"
                    ? "bg-primary text-primary-foreground ml-8"
                    : "bg-muted text-foreground mr-8"
                )}
              >
                {msg.text}
                <div className="text-[10px] text-muted-foreground mt-1 text-right">{msg.time}</div>
              </div>
            </div>
          ))
        )}
        <div ref={endRef} />
      </div>

      {/* Chat input area */}
      <form
        className="flex flex-col gap-0 border-t border-border bg-background"
        onSubmit={handleSendMessage}
      >
        {/* Input header: Tabs, rich icons, bot flow */}
        <div className="flex flex-wrap items-center justify-between gap-2 px-2 pt-2 pb-1">
          {/* Tabs */}
          <Tabs value={tab} onValueChange={v => setTab(v as "reply" | "ai")}>
            <TabsList className="flex bg-muted p-0.5" style={{ borderRadius: 5 }}>
              <TabsTrigger
                value="reply"
                className="text-xs px-2 py-1"
                style={{ borderRadius: 5 }}
              >
                Your Reply
              </TabsTrigger>
              <TabsTrigger
                value="ai"
                className="text-xs px-2 py-1"
                style={{ borderRadius: 5 }}
              >
                Use AI
              </TabsTrigger>
            </TabsList>
          </Tabs>
          {/* Rich text icons */}
          <div className="flex-1 flex justify-center min-w-[100px]">
            {richIcons}
          </div>
          {/* Bot flow trigger */}
          <Popover>
            <PopoverTrigger asChild>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="flex items-center gap-1 text-xs px-2"
                aria-label="Trigger Bot Flow"
              >
                <Bot size={15} className="mr-1" />
                <span className="hidden sm:inline">
                  {selectedFlow ? botFlows.find(f => f.value === selectedFlow)?.label : "Bot Flow"}
                </span>
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-40 p-0">
              <ul>
                {botFlows.map(flow => (
                  <li key={flow.value}>
                    <Button
                      variant="ghost"
                      className="w-full justify-start px-3 py-2 text-sm"
                      onClick={() => setSelectedFlow(flow.value)}
                    >
                      {flow.label}
                    </Button>
                  </li>
                ))}
              </ul>
            </PopoverContent>
          </Popover>
        </div>
        {/* Typing area with + and emoji icons before input */}
        <div className="flex items-center gap-1 px-2 pb-2">
          <label className="relative flex-shrink-0">
            <Button
              type="button"
              variant="ghost"
              size="icon"
              className="rounded"
              aria-label="Upload"
              tabIndex={-1}
            >
              <Plus size={20} />
            </Button>
            <input
              type="file"
              className="absolute inset-0 opacity-0 cursor-pointer"
              tabIndex={-1}
              style={{ width: "100%", height: "100%" }}
              onClick={e => e.stopPropagation()}
            />
          </label>
          <Button
            type="button"
            variant="ghost"
            size="icon"
            className="rounded flex-shrink-0"
            aria-label="Emoji"
          >
            <Smile size={20} />
          </Button>
          <Input
            placeholder="Type in your message..."
            className="flex-1 bg-muted border-0"
            value={input}
            onChange={e => setInput(e.target.value)}
          />
          <Button
            type="submit"
            className="rounded-full px-4 py-2"
            aria-label="Send"
            disabled={isSending || !input.trim()}
          >
            {isSending ? (
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
            ) : (
              isMobile ? <Mic size={16} /> : <Send size={16} />
            )}
          </Button>
        </div>
      </form>
    </section>
  );
};