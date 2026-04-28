import { useEffect, useMemo, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { touristSpotsList } from "@/data/sidebarNav";

type ResultItem = {
  id: string;
  title: string;
  subtitle: string;
  type: "ব্যবসা" | "ডাক্তার" | "পর্যটন" | "চাকরি";
  emoji: string;
  onSelect: () => void;
};

interface Props {
  variant?: "sidebar" | "mobile";
}

const GlobalSearch = ({ variant = "sidebar" }: Props) => {
  const navigate = useNavigate();
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<ResultItem[]>([]);
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  useEffect(() => {
    const q = query.trim();
    if (q.length < 2) {
      setResults([]);
      return;
    }
    setLoading(true);
    const t = setTimeout(async () => {
      const lower = q.toLowerCase();
      const found: ResultItem[] = [];

      const [bizRes, docRes, jobRes] = await Promise.all([
        supabase.from("businesses").select("id, name_bn, name_en, category, address").or(`name_bn.ilike.%${q}%,name_en.ilike.%${q}%,category.ilike.%${q}%`).limit(5),
        supabase.from("doctors").select("id, name, specialty, hospital").or(`name.ilike.%${q}%,specialty.ilike.%${q}%,hospital.ilike.%${q}%`).limit(5),
        supabase.from("jobs").select("id, title, company").or(`title.ilike.%${q}%,company.ilike.%${q}%`).eq("status", "active").limit(5),
      ]);

      (bizRes.data ?? []).forEach((b: { id: string; name_bn: string; category: string; address: string }) => {
        found.push({
          id: `biz-${b.id}`,
          title: b.name_bn,
          subtitle: `${b.category} • ${b.address}`,
          type: "ব্যবসা",
          emoji: "🏪",
          onSelect: () => navigate(`/listing/${b.id}`),
        });
      });
      (docRes.data ?? []).forEach((d: { id: string; name: string; specialty: string; hospital: string }) => {
        found.push({
          id: `doc-${d.id}`,
          title: d.name,
          subtitle: `${d.specialty} • ${d.hospital ?? ""}`,
          type: "ডাক্তার",
          emoji: "👨‍⚕️",
          onSelect: () => navigate("/doctors"),
        });
      });
      (jobRes.data ?? []).forEach((j: { id: string; title: string; company: string }) => {
        found.push({
          id: `job-${j.id}`,
          title: j.title,
          subtitle: j.company,
          type: "চাকরি",
          emoji: "💼",
          onSelect: () => navigate("/jobs"),
        });
      });

      touristSpotsList.forEach((s) => {
        if (s.name.toLowerCase().includes(lower)) {
          found.push({
            id: `tour-${s.name}`,
            title: s.name,
            subtitle: s.meta,
            type: "পর্যটন",
            emoji: s.emoji,
            onSelect: () => window.open(s.url, "_blank"),
          });
        }
      });

      setResults(found);
      setLoading(false);
    }, 300);
    return () => clearTimeout(t);
  }, [query, navigate]);

  const inputCls = useMemo(() =>
    variant === "mobile"
      ? "flex-1 bg-transparent border-none outline-none text-primary-foreground font-sans text-[13px] py-[9px] placeholder:text-primary-foreground/42"
      : "flex-1 bg-transparent border-none outline-none text-white font-sans text-[13px]"
    , [variant]);

  const wrapCls = variant === "mobile"
    ? "flex items-center gap-[7px] bg-primary-foreground/12 border border-primary-foreground/18 rounded-[9px] px-[11px]"
    : "flex items-center gap-[7px] rounded-[9px] px-[11px] py-2";

  const wrapStyle: React.CSSProperties = variant === "mobile"
    ? {}
    : { background: "rgba(255,255,255,0.1)", border: "1px solid rgba(255,255,255,0.14)" };

  return (
    <div ref={containerRef} className="relative w-full">
      <div className={wrapCls} style={wrapStyle}>
        <span className={variant === "mobile" ? "text-primary-foreground/45 text-[13px]" : "text-[13px]"} style={variant === "sidebar" ? { color: "rgba(255,255,255,0.45)" } : undefined}>🔍</span>
        <input
          value={query}
          onChange={(e) => { setQuery(e.target.value); setOpen(true); }}
          onFocus={() => setOpen(true)}
          type="text"
          placeholder={variant === "mobile" ? "ব্যবসা, ডাক্তার, চাকরি খুঁজুন..." : "সেবা বা স্থান খুঁজুন..."}
          className={inputCls}
          style={variant === "sidebar" ? { color: "#fff" } : undefined}
        />
      </div>

      {open && query.trim().length >= 2 && (
        <div className="absolute left-0 right-0 top-full mt-2 bg-card text-foreground rounded-xl shadow-2xl border border-border max-h-[360px] overflow-y-auto z-[400]">
          {loading ? (
            <div className="p-3 text-xs text-muted-foreground text-center">খুঁজছি...</div>
          ) : results.length === 0 ? (
            <div className="p-3 text-xs text-muted-foreground text-center">কোনো ফলাফল পাওয়া যায়নি।</div>
          ) : (
            results.map((r) => (
              <button
                key={r.id}
                onClick={() => { r.onSelect(); setOpen(false); setQuery(""); }}
                className="w-full text-left px-3 py-2 hover:bg-muted flex items-start gap-2 border-b border-border last:border-b-0"
              >
                <span className="text-lg">{r.emoji}</span>
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-semibold text-foreground truncate">{r.title}</div>
                  <div className="text-[10px] text-muted-foreground truncate">{r.subtitle}</div>
                </div>
                <span className="text-[10px] text-primary font-bold bg-primary/10 px-2 py-0.5 rounded-full">{r.type}</span>
              </button>
            ))
          )}
        </div>
      )}
    </div>
  );
};

export default GlobalSearch;
