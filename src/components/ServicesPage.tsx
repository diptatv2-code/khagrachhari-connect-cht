import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import BusinessCard from "./BusinessCard";

interface Business {
  id: string;
  name_bn: string;
  name_en: string | null;
  category: string;
  section: string;
  address: string;
  phone: string;
  whatsapp: string | null;
  description: string | null;
  google_maps_place_id: string | null;
  hours: string | null;
  rating: string | null;
  tag: string | null;
}

// Map sidebar IDs to category search terms and emojis
const categoryMap: Record<string, { search: string; emoji: string }> = {
  health: { search: "হাসপাতাল", emoji: "🏥" },
  medicine: { search: "ওষুধ", emoji: "💊" },
  restaurant: { search: "রেস্তোরাঁ", emoji: "🍽️" },
  grocery: { search: "গ্রোসারি", emoji: "🛒" },
  transport: { search: "গাড়ি ভাড়া", emoji: "🚗" },
  bus: { search: "বাস", emoji: "🚌" },
  banks: { search: "ব্যাংক", emoji: "🏦" },
  atm: { search: "ATM", emoji: "💳" },
  mfs: { search: "বিকাশ", emoji: "📲" },
  school: { search: "স্কুল", emoji: "🏫" },
  college: { search: "কলেজ", emoji: "🎓" },
  training: { search: "কোচিং", emoji: "💻" },
  gents: { search: "জেন্টস", emoji: "💈" },
  ladies: { search: "লেডিজ", emoji: "💅" },
  repair: { search: "মোবাইল রিপেয়ার", emoji: "🔧" },
  community: { search: "কমিউনিটি", emoji: "🏛️" },
  construction: { search: "নির্মাণ", emoji: "🔨" },
};

// Title map
const titleMap: Record<string, string> = {
  health: "🏥 হাসপাতাল ও ক্লিনিক",
  medicine: "💊 ওষুধের দোকান — ফার্মেসি",
  restaurant: "🍽️ রেস্তোরাঁ ও খাবার",
  grocery: "🛒 গ্রোসারি ও মুদি দোকান",
  transport: "🚗 গাড়ি ভাড়া, CNG ও জীপ স্ট্যান্ড",
  bus: "🚌 বাস কাউন্টার — সব রুট",
  banks: "🏦 ব্যাংক শাখা — সকল ব্যাংক",
  atm: "💳 ATM বুথ — সব ব্যাংক",
  mfs: "📲 বিকাশ / নগদ / রকেট এজেন্ট",
  school: "🏫 স্কুল ও মাধ্যমিক শিক্ষা",
  college: "🎓 কলেজ ও উচ্চশিক্ষা",
  training: "💻 কোচিং ও IT ট্রেনিং",
  gents: "💈 জেন্টস সেলুন",
  ladies: "💅 লেডিজ বিউটি পার্লার",
  repair: "🔧 মোবাইল রিপেয়ার শপ",
  community: "🏛️ কমিউনিটি সেন্টার ও কনভেনশন হল",
  construction: "🔨 বাড়ি ও নির্মাণ",
};

interface Props {
  serviceId: string;
  onBack: () => void;
}

const ServicesPage = ({ serviceId, onBack }: Props) => {
  const [businesses, setBusinesses] = useState<Business[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      const catInfo = categoryMap[serviceId];
      if (!catInfo) {
        setBusinesses([]);
        setLoading(false);
        return;
      }
      const { data, error } = await supabase
        .from("businesses")
        .select("*")
        .ilike("category", `%${catInfo.search}%`)
        .order("created_at", { ascending: false });
      if (!error && data) setBusinesses(data as Business[]);
      setLoading(false);
    };
    fetchData();
  }, [serviceId]);

  const catInfo = categoryMap[serviceId] || { emoji: "📍" };
  const title = titleMap[serviceId] || "সেবা";

  return (
    <div>
      <div className="flex items-center justify-between mb-[14px]">
        <span className="font-serif-bn text-[15px] lg:text-[17px] font-bold text-foreground flex items-center gap-[7px]">
          <span className="w-1 h-5 bg-secondary rounded-sm" />
          {title}
        </span>
        <button
          onClick={onBack}
          className="bg-muted text-[hsl(var(--green-mid))] border-none rounded-full px-[13px] py-[5px] text-[11px] font-semibold cursor-pointer"
        >
          ← ফিরে যান
        </button>
      </div>

      {loading ? (
        <div className="text-center py-12 text-muted-foreground text-sm">লোড হচ্ছে...</div>
      ) : businesses.length === 0 ? (
        <div className="text-center py-12 bg-card rounded-2xl shadow-sm">
          <div className="text-4xl mb-3">📭</div>
          <p className="text-sm text-muted-foreground">এই ক্যাটাগরিতে এখনো কোনো তথ্য নেই।</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-[13px]">
          {businesses.map((b) => (
            <BusinessCard key={b.id} biz={b} emoji={catInfo.emoji} />
          ))}
        </div>
      )}
    </div>
  );
};

export default ServicesPage;
