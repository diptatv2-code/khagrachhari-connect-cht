import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { allLocalFilterLabels, allTouristFilterLabels, localCategories, touristCategories } from "@/data/directoryCategories";
import AddBusinessModal from "@/components/AddBusinessModal";

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
  is_open: boolean | null;
  created_at: string;
  google_maps_place_id: string | null;
  hours: string | null;
  rating: string | null;
  tag: string | null;
}

const FilterPills = ({
  labels,
  active,
  onSelect,
  accentClass,
}: {
  labels: string[];
  active: string;
  onSelect: (l: string) => void;
  accentClass: string;
}) => (
  <div className="flex gap-2 overflow-x-auto scrollbar-hide pb-2">
    {labels.map((l) => (
      <button
        key={l}
        onClick={() => onSelect(l)}
        className={`whitespace-nowrap text-xs font-semibold px-3.5 py-2 rounded-full border transition-all ${
          active === l
            ? `${accentClass} text-primary-foreground border-transparent`
            : "bg-card text-primary border-border hover:border-primary/30"
        }`}
      >
        {l}
      </button>
    ))}
  </div>
);

const BusinessCard = ({ biz }: { biz: Business }) => {
  const mapsUrl = biz.google_maps_place_id
    ? `https://www.google.com/maps/place/?q=place_id:${biz.google_maps_place_id}`
    : null;

  return (
    <div className="bg-card rounded-2xl overflow-hidden shadow-sm border border-border hover:shadow-md transition-all">
      {/* Photo placeholder with Google Maps link */}
      {mapsUrl && (
        <div className="h-24 bg-muted flex items-center justify-center relative">
          <span className="text-4xl opacity-30">
            {localCategories.find(c => biz.category.includes(c.label))?.emoji ||
             touristCategories.find(c => biz.category.includes(c.label))?.emoji || "📍"}
          </span>
          <a
            href={mapsUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="absolute bottom-2 right-2 text-[10px] font-semibold bg-black/60 text-white px-2 py-1 rounded-md backdrop-blur-sm hover:bg-black/80 transition-colors"
          >
            📷 ছবি দেখুন
          </a>
        </div>
      )}

      <div className="p-4">
        <div className="flex items-start justify-between mb-2">
          <div>
            <h3 className="text-[15px] font-bold text-primary">{biz.name_bn}</h3>
            {biz.name_en && <p className="text-xs text-muted-foreground">{biz.name_en}</p>}
          </div>
          {biz.rating && (
            <span className="text-xs font-bold text-secondary-foreground flex items-center gap-1">
              ⭐ {biz.rating}
            </span>
          )}
        </div>

        <div className="flex flex-wrap gap-1.5 mb-2">
          {biz.tag && (
          <span className="text-[10px] font-semibold bg-secondary/20 text-primary px-2 py-0.5 rounded-full">
              {biz.tag}
            </span>
          )}
          {biz.hours && (
            <span className="text-[10px] font-semibold bg-accent text-accent-foreground px-2 py-0.5 rounded-full">
              🕐 {biz.hours}
            </span>
          )}
        </div>

        {biz.description && <p className="text-xs text-muted-foreground mb-2 line-clamp-2">{biz.description}</p>}
        <p className="text-xs text-muted-foreground mb-3">📍 {biz.address}</p>

        <div className="flex items-center gap-2 pt-2 border-t border-border">
          {mapsUrl && (
            <a
              href={mapsUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1 text-xs bg-muted text-primary px-3 py-1.5 rounded-full font-semibold hover:bg-muted/80 transition-opacity"
            >
              📍 ম্যাপ
            </a>
          )}
          {biz.phone && (
            <a
              href={`tel:${biz.phone}`}
              className="flex items-center gap-1 text-xs bg-primary text-primary-foreground px-3 py-1.5 rounded-full font-semibold hover:opacity-90 transition-opacity"
            >
              📞 {biz.phone}
            </a>
          )}
          {biz.whatsapp && (
            <a
              href={`https://wa.me/${biz.whatsapp.replace(/[^0-9]/g, "")}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1 text-xs bg-accent text-accent-foreground px-3 py-1.5 rounded-full font-semibold hover:opacity-90 transition-opacity"
            >
              💬 WhatsApp
            </a>
          )}
        </div>
      </div>
    </div>
  );
};

const Directory = () => {
  const [businesses, setBusinesses] = useState<Business[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [localFilter, setLocalFilter] = useState("সব");
  const [touristFilter, setTouristFilter] = useState("সব");
  const [showAddModal, setShowAddModal] = useState(false);
  const [sort, setSort] = useState<"name" | "category" | "recent">("recent");

  useEffect(() => {
    fetchBusinesses();
  }, []);

  const fetchBusinesses = async () => {
    setLoading(true);
    const { data, error } = await supabase.from("businesses").select("*").order("created_at", { ascending: false });
    if (!error && data) setBusinesses(data as Business[]);
    setLoading(false);
  };

  const filterBiz = (section: string, filter: string) => {
    let filtered = businesses.filter((b) => b.section === section);
    if (filter !== "সব") {
      filtered = filtered.filter((b) => b.category.includes(filter));
    }
    if (search) {
      const q = search.toLowerCase();
      filtered = filtered.filter(
        (b) =>
          b.name_bn.toLowerCase().includes(q) ||
          b.name_en?.toLowerCase().includes(q) ||
          b.category.toLowerCase().includes(q) ||
          b.address.toLowerCase().includes(q) ||
          b.description?.toLowerCase().includes(q)
      );
    }
    if (sort === "name") filtered.sort((a, b) => a.name_bn.localeCompare(b.name_bn));
    else if (sort === "category") filtered.sort((a, b) => a.category.localeCompare(b.category));
    return filtered;
  };

  const localBiz = filterBiz("local", localFilter);
  const touristBiz = filterBiz("tourist", touristFilter);
  const totalCount = localBiz.length + touristBiz.length;

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      {/* Header */}
      <div className="bg-primary py-10 lg:py-14">
        <div className="max-w-[1280px] mx-auto px-4 lg:px-10">
          <h1 className="font-bangla text-[28px] lg:text-[40px] text-primary-foreground leading-tight mb-2">
            ব্যবসা ডিরেক্টরি
          </h1>
          <p className="text-primary-foreground/70 text-sm lg:text-base max-w-[600px]">
            খাগড়াছড়ির সকল ব্যবসা ও সেবা প্রতিষ্ঠানের তথ্য এক জায়গায় — হাসপাতাল, ব্যাংক, রেস্তোরাঁ, হোটেল সহ ৯০+ ব্যবসা
          </p>
        </div>
      </div>

      <div className="max-w-[1280px] mx-auto px-4 lg:px-10 py-6 lg:py-10">
        {/* Search & Controls */}
        <div className="flex flex-col sm:flex-row gap-3 mb-6">
          <div className="relative flex-1">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">🔍</span>
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="ব্যবসার নাম, ক্যাটাগরি বা ঠিকানা লিখুন..."
              className="w-full pl-10 pr-4 py-3 rounded-xl border border-border bg-card text-sm focus:outline-none focus:ring-2 focus:ring-primary/20"
            />
          </div>
          <div className="flex gap-2">
            <select
              value={sort}
              onChange={(e) => setSort(e.target.value as "name" | "category" | "recent")}
              className="text-xs bg-card border border-border rounded-xl px-3 py-2 text-primary focus:outline-none"
            >
              <option value="recent">সম্প্রতি যোগ হয়েছে</option>
              <option value="name">নাম অনুযায়ী</option>
              <option value="category">ক্যাটাগরি অনুযায়ী</option>
            </select>
            <button
              onClick={() => setShowAddModal(true)}
              className="whitespace-nowrap text-xs font-semibold bg-secondary text-primary px-4 py-2 rounded-xl hover:opacity-90 transition-opacity"
            >
              + আপনার ব্যবসা যোগ করুন
            </button>
          </div>
        </div>

        {totalCount > 0 && (
          <p className="text-xs text-muted-foreground mb-6">মোট {totalCount}টি ব্যবসা পাওয়া গেছে</p>
        )}

        {/* SECTION 1: Local Services */}
        <section className="mb-12">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-1.5 h-8 bg-primary rounded-sm" />
            <div>
              <h2 className="font-bangla text-xl lg:text-2xl text-primary">স্থানীয় সেবা</h2>
              <p className="text-xs text-muted-foreground">খাগড়াছড়িবাসীদের জন্য</p>
            </div>
          </div>
          <FilterPills labels={allLocalFilterLabels} active={localFilter} onSelect={setLocalFilter} accentClass="bg-primary" />
          <div className="mt-4">
            {loading ? (
              <div className="text-center py-12 text-muted-foreground text-sm">লোড হচ্ছে...</div>
            ) : localBiz.length === 0 ? (
              <div className="text-center py-12 bg-card rounded-2xl border border-border">
                <div className="text-4xl mb-3">📭</div>
                <p className="text-sm text-muted-foreground mb-2">এই ক্যাটাগরিতে এখনো কোনো তথ্য নেই।</p>
                <button onClick={() => setShowAddModal(true)} className="text-sm text-primary font-semibold hover:underline">
                  আপনি কি এই ব্যবসার তথ্য যোগ করতে চান?
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {localBiz.map((b) => <BusinessCard key={b.id} biz={b} />)}
              </div>
            )}
          </div>
        </section>

        {/* Divider */}
        <div className="border-t border-border mb-12" />

        {/* SECTION 2: Tourist Services */}
        <section className="mb-12">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-1.5 h-8 bg-secondary rounded-sm" />
            <div>
              <h2 className="font-bangla text-xl lg:text-2xl text-primary">পর্যটক সেবা</h2>
              <p className="text-xs text-muted-foreground">ভ্রমণকারীদের জন্য</p>
            </div>
          </div>
          <FilterPills labels={allTouristFilterLabels} active={touristFilter} onSelect={setTouristFilter} accentClass="bg-secondary" />
          <div className="mt-4">
            {loading ? (
              <div className="text-center py-12 text-muted-foreground text-sm">লোড হচ্ছে...</div>
            ) : touristBiz.length === 0 ? (
              <div className="text-center py-12 bg-card rounded-2xl border border-border">
                <div className="text-4xl mb-3">📭</div>
                <p className="text-sm text-muted-foreground mb-2">এই ক্যাটাগরিতে এখনো কোনো তথ্য নেই।</p>
                <button onClick={() => setShowAddModal(true)} className="text-sm text-secondary font-semibold hover:underline">
                  আপনি কি এই ব্যবসার তথ্য যোগ করতে চান?
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {touristBiz.map((b) => <BusinessCard key={b.id} biz={b} />)}
              </div>
            )}
          </div>
        </section>
      </div>

      {showAddModal && <AddBusinessModal onClose={() => setShowAddModal(false)} onAdded={fetchBusinesses} />}
      <Footer />
    </div>
  );
};

export default Directory;
