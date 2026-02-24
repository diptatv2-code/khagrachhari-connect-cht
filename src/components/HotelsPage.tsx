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

interface Props {
  onBack: () => void;
}

const HotelsPage = ({ onBack }: Props) => {
  const [hotels, setHotels] = useState<Business[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      const { data, error } = await supabase
        .from("businesses")
        .select("*")
        .ilike("category", "%হোটেল%")
        .order("created_at", { ascending: false });
      if (!error && data) setHotels(data as Business[]);
      setLoading(false);
    };
    fetchData();
  }, []);

  return (
    <div>
      <div className="flex items-center justify-between mb-[14px]">
        <span className="font-serif-bn text-[15px] lg:text-[17px] font-bold text-foreground flex items-center gap-[7px]">
          <span className="w-1 h-5 bg-secondary rounded-sm" />
          🏨 হোটেল ও আবাসন
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
      ) : hotels.length === 0 ? (
        <div className="text-center py-12 bg-card rounded-2xl shadow-sm">
          <div className="text-4xl mb-3">📭</div>
          <p className="text-sm text-muted-foreground">হোটেল তথ্য পাওয়া যায়নি।</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-[13px]">
          {hotels.map((b) => (
            <BusinessCard key={b.id} biz={b} emoji="🏨" />
          ))}
        </div>
      )}
    </div>
  );
};

export default HotelsPage;
