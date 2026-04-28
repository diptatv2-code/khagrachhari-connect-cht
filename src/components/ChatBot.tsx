import { useState, useRef, useEffect } from "react";

type Msg = { role: "user" | "assistant"; content: string };

const CHAT_URL = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/chat-assistant`;

type FaqRule = { keywords: string[]; reply: string };

const faqRules: FaqRule[] = [
  { keywords: ["জ্বর", "অসুস্থ", "ডাক্তার", "চিকিৎসা", "রোগ", "doctor"], reply: "ডাক্তার বা চিকিৎসা প্রয়োজন? এখানে দেখুন: [ACTION:doctors] অথবা ডাক্তার হটলাইন: 09611-530530" },
  { keywords: ["জরুরি", "এম্বুলেন্স", "ambulance", "emergency", "999"], reply: "জরুরি নম্বরসমূহ:\n• পুলিশ: 999\n• এম্বুলেন্স: 01635-600835\n• সদর হাসপাতাল: 01730-324772\n• ফায়ার সার্ভিস: 02333343966" },
  { keywords: ["হোটেল", "থাকার", "আবাসন", "হোস্টেল", "hotel", "stay"], reply: "খাগড়াছড়ির হোটেল ও আবাসন তালিকা: [ACTION:hotels]" },
  { keywords: ["খাবার", "রেস্তোরাঁ", "রেস্টুরেন্ট", "অর্ডার", "food", "restaurant"], reply: "আপনি অনলাইনে খাবার অর্ডার করতে পারেন: [ACTION:food]" },
  { keywords: ["চাকরি", "জব", "job", "vacancy", "নিয়োগ"], reply: "খাগড়াছড়ির চাকরির বিজ্ঞাপন দেখুন: [ACTION:jobs]" },
  { keywords: ["সিএনজি", "cng", "গাড়ি", "জীপ", "মাইক্রো", "ride", "transport"], reply: "রাইড বুক করতে চান? CNG, জীপ, মাইক্রোবাস বুকিং: [ACTION:ride]" },
  { keywords: ["সাজেক", "আলুটিলা", "রিসাং", "পর্যটন", "ভ্রমণ", "tourist", "tour"], reply: "খাগড়াছড়ির পর্যটন স্থানের তথ্য: [ACTION:tourist]" },
  { keywords: ["বিকাশ", "নগদ", "রকেট", "mfs", "মোবাইল ব্যাংকিং"], reply: "মোবাইল ব্যাংকিং (বিকাশ/নগদ) এজেন্ট: [ACTION:mfs]" },
  { keywords: ["ব্যাংক", "atm", "এটিএম", "bank"], reply: "ব্যাংক শাখা ও ATM তালিকা: [ACTION:banks] বা [ACTION:atm]" },
  { keywords: ["স্কুল", "কলেজ", "school", "college", "কোচিং", "ভর্তি"], reply: "শিক্ষাপ্রতিষ্ঠানের তালিকা: [ACTION:school] বা [ACTION:college]" },
  { keywords: ["ওষুধ", "ফার্মেসি", "pharmacy", "medicine"], reply: "ফার্মেসি ও ওষুধের দোকান: [ACTION:medicine]" },
  { keywords: ["কেনাবেচা", "মার্কেটপ্লেস", "marketplace", "পুরনো", "বিক্রয়"], reply: "খাগড়াছড়ির ক্রয়-বিক্রয় মার্কেটপ্লেস: [ACTION:marketplace]" },
  { keywords: ["কমিউনিটি", "আলোচনা", "খবর", "community", "news"], reply: "কমিউনিটি হাবে আলোচনা ও খবর দেখুন: [ACTION:communityHub]" },
];

const FALLBACK_REPLY = "এই প্রশ্নের উত্তর আমার কাছে নেই। সরাসরি 01730-324772 (সদর হাসপাতাল) বা 999 (জরুরি) নম্বরে যোগাযোগ করুন।";

const matchFaq = (text: string): string | null => {
  const lower = text.toLowerCase();
  for (const rule of faqRules) {
    for (const kw of rule.keywords) {
      if (lower.includes(kw.toLowerCase())) return rule.reply;
    }
  }
  return null;
};

const serviceLabels: Record<string, { label: string; emoji: string }> = {
  health: { label: "হাসপাতাল ও ক্লিনিক", emoji: "🏥" },
  medicine: { label: "ওষুধের দোকান", emoji: "💊" },
  grocery: { label: "গ্রোসারি", emoji: "🛒" },
  banks: { label: "ব্যাংক", emoji: "🏦" },
  atm: { label: "ATM বুথ", emoji: "💳" },
  mfs: { label: "বিকাশ / নগদ", emoji: "📲" },
  school: { label: "স্কুল", emoji: "🏫" },
  college: { label: "কলেজ", emoji: "🎓" },
  training: { label: "IT ট্রেনিং", emoji: "💻" },
  gents: { label: "জেন্টস সেলুন", emoji: "💈" },
  ladies: { label: "লেডিজ পার্লার", emoji: "💅" },
  repair: { label: "মোবাইল রিপেয়ার", emoji: "🔧" },
  community: { label: "কমিউনিটি সেন্টার", emoji: "🏛️" },
  hotels: { label: "হোটেল ও আবাসন", emoji: "🏨" },
  restaurant: { label: "রেস্তোরাঁ", emoji: "🍽️" },
  transport: { label: "গাড়ি ভাড়া", emoji: "🚗" },
  bus: { label: "বাস কাউন্টার", emoji: "🚌" },
  tourist: { label: "পর্যটন স্থান", emoji: "🗺️" },
  doctors: { label: "ডাক্তার তালিকা", emoji: "👨‍⚕️" },
  marketplace: { label: "ক্রয় ও বিক্রয়", emoji: "🛒" },
  food: { label: "খাবার অর্ডার", emoji: "🍽️" },
  jobs: { label: "চাকরির সুযোগ", emoji: "💼" },
  communityHub: { label: "কমিউনিটি হাব", emoji: "💬" },
  ride: { label: "রাইড বুকিং", emoji: "🚖" },
};

interface ChatBotProps {
  onNavigate?: (id: string, type: "page" | "service") => void;
}

const ChatBot = ({ onNavigate }: ChatBotProps) => {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<Msg[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, open]);

  const handleNavigate = (id: string) => {
    const pageIds = ["hotels", "tourist", "home", "doctors", "marketplace", "food", "jobs", "communityHub", "ride"];
    if (onNavigate) {
      onNavigate(id, pageIds.includes(id) ? "page" : "service");
      setOpen(false);
    }
  };

  const renderContent = (text: string) => {
    const parts = text.split(/(\[ACTION:[a-z_]+\])/g);
    return parts.map((part, i) => {
      const match = part.match(/\[ACTION:([a-z_]+)\]/);
      if (match) {
        const id = match[1];
        const info = serviceLabels[id];
        if (info) {
          return (
            <button
              key={i}
              onClick={() => handleNavigate(id)}
              className="inline-flex items-center gap-1 bg-primary/10 text-primary font-semibold text-xs px-2.5 py-1 rounded-lg hover:bg-primary/20 transition-colors my-0.5"
            >
              {info.emoji} {info.label}
            </button>
          );
        }
      }
      return <span key={i}>{part}</span>;
    });
  };

  const send = async () => {
    const trimmed = input.trim();
    if (!trimmed || isLoading) return;

    const userMsg: Msg = { role: "user", content: trimmed };
    const allMessages = [...messages, userMsg];
    setMessages(allMessages);
    setInput("");
    setIsLoading(true);

    let assistantSoFar = "";
    const upsertAssistant = (chunk: string) => {
      assistantSoFar += chunk;
      setMessages((prev) => {
        const last = prev[prev.length - 1];
        if (last?.role === "assistant") {
          return prev.map((m, i) => (i === prev.length - 1 ? { ...m, content: assistantSoFar } : m));
        }
        return [...prev, { role: "assistant", content: assistantSoFar }];
      });
    };

    try {
      const resp = await fetch(CHAT_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY}`,
        },
        body: JSON.stringify({ messages: allMessages }),
      });

      if (!resp.ok || !resp.body) {
        const faq = matchFaq(trimmed);
        upsertAssistant(faq ?? FALLBACK_REPLY);
        setIsLoading(false);
        return;
      }

      const reader = resp.body.getReader();
      const decoder = new TextDecoder();
      let textBuffer = "";

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        textBuffer += decoder.decode(value, { stream: true });

        let newlineIndex: number;
        while ((newlineIndex = textBuffer.indexOf("\n")) !== -1) {
          let line = textBuffer.slice(0, newlineIndex);
          textBuffer = textBuffer.slice(newlineIndex + 1);
          if (line.endsWith("\r")) line = line.slice(0, -1);
          if (line.startsWith(":") || line.trim() === "") continue;
          if (!line.startsWith("data: ")) continue;
          const jsonStr = line.slice(6).trim();
          if (jsonStr === "[DONE]") break;
          try {
            const parsed = JSON.parse(jsonStr);
            const content = parsed.choices?.[0]?.delta?.content as string | undefined;
            if (content) upsertAssistant(content);
          } catch {
            textBuffer = line + "\n" + textBuffer;
            break;
          }
        }
      }
    } catch (e) {
      console.error(e);
      const faq = matchFaq(trimmed);
      upsertAssistant(faq ?? FALLBACK_REPLY);
    }
    setIsLoading(false);
  };

  return (
    <>
      {/* Floating bubble */}
      <button
        onClick={() => setOpen(!open)}
        className="fixed bottom-20 right-4 lg:bottom-6 lg:right-6 z-[200] w-14 h-14 bg-primary text-primary-foreground rounded-full shadow-lg flex items-center justify-center text-2xl hover:scale-110 transition-transform"
        aria-label="চ্যাটবট খুলুন"
      >
        {open ? "✕" : "💬"}
      </button>

      {/* Chat window */}
      {open && (
        <div className="fixed bottom-36 right-4 lg:bottom-[88px] lg:right-6 z-[200] w-[340px] max-h-[480px] bg-card border border-border rounded-2xl shadow-2xl flex flex-col overflow-hidden">
          {/* Header */}
          <div className="bg-primary px-4 py-3 flex items-center gap-2">
            <div className="w-8 h-8 bg-secondary rounded-full flex items-center justify-center text-sm">🤖</div>
            <div>
              <div className="text-primary-foreground text-sm font-bold">খাগড়াছড়ি হেল্পার</div>
              <div className="text-primary-foreground/60 text-[10px]">আপনার কী দরকার বলুন!</div>
            </div>
          </div>

          {/* Messages */}
          <div ref={scrollRef} className="flex-1 overflow-y-auto p-3 space-y-2 max-h-[320px]">
            {messages.length === 0 && (
              <div className="text-center py-6">
                <div className="text-3xl mb-2">👋</div>
                <p className="text-sm text-muted-foreground">আসসালামু আলাইকুম! আমি আপনাকে সাহায্য করতে পারি।</p>
                <p className="text-xs text-muted-foreground mt-1">যেমন: "আমার জ্বর হয়েছে" বা "হোটেল দরকার"</p>
              </div>
            )}
            {messages.map((m, i) => (
              <div key={i} className={`flex ${m.role === "user" ? "justify-end" : "justify-start"}`}>
                <div
                  className={`max-w-[85%] px-3 py-2 rounded-xl text-sm leading-relaxed ${
                    m.role === "user"
                      ? "bg-primary text-primary-foreground rounded-br-sm"
                      : "bg-muted text-foreground rounded-bl-sm"
                  }`}
                >
                  {m.role === "assistant" ? renderContent(m.content) : m.content}
                </div>
              </div>
            ))}
            {isLoading && messages[messages.length - 1]?.role !== "assistant" && (
              <div className="flex justify-start">
                <div className="bg-muted text-muted-foreground px-3 py-2 rounded-xl text-sm">
                  <span className="animate-pulse">টাইপ করছে...</span>
                </div>
              </div>
            )}
          </div>

          {/* Input */}
          <div className="border-t border-border p-2 flex gap-2">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && send()}
              placeholder="আপনার প্রশ্ন লিখুন..."
              className="flex-1 bg-muted rounded-lg px-3 py-2 text-sm outline-none text-foreground placeholder:text-muted-foreground"
            />
            <button
              onClick={send}
              disabled={isLoading || !input.trim()}
              className="bg-primary text-primary-foreground px-3 py-2 rounded-lg text-sm font-semibold disabled:opacity-50"
            >
              ➤
            </button>
          </div>
        </div>
      )}
    </>
  );
};

export default ChatBot;
