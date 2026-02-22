import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
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

const BusinessCard = ({ biz }: { biz: Business }) => (
  <div className="bg-card rounded-2xl p-4 shadow-sm border border-border hover:shadow-md transition-all">
    <div className="flex items-start justify-between mb-2">
      <div>
        <h3 className="text-[15px] font-bold text-primary">{biz.name_bn}</h3>
        {biz.name_en && <p className="text-xs text-muted-foreground">{biz.name_en}</p>}
      </div>
      <span
        className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
          biz.is_open ? "bg-green-100 text-green-700" : "bg-red-100 text-red-600"
        }`}
      >
        {biz.is_open ? "খোলা" : "বন্ধ"}
      </span>
    </div>
    <span className="inline-block text-[10px] bg-muted text-primary font-semibold px-2 py-0.5 rounded-full mb-2">
      {biz.category}
    </span>
    {biz.description && <p className="text-xs text-muted-foreground mb-2 line-clamp-1">{biz.description}</p>}
    <p className="text-xs text-muted-foreground mb-2">📍 {biz.address}</p>
    <div className="flex items-center gap-2">
      <a
        href={`tel:${biz.phone}`}
        className="flex items-center gap-1 text-xs bg-primary text-primary-foreground px-3 py-1.5 rounded-full font-semibold hover:opacity-90 transition-opacity"
      >
        📞 {biz.phone}
      </a>
      {biz.whatsapp && (
        <a
          href={`https://wa.me/${biz.whatsapp.replace(/[^0-9]/g, "")}`}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-1 text-xs bg-green-600 text-white px-3 py-1.5 rounded-full font-semibold hover:opacity-90 transition-opacity"
        >
          💬 WhatsApp
        </a>
      )}
    </div>
  </div>
);

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
    if (!error && data) setBusinesses(data);
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
          b.address.toLowerCase().includes(q)
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
            খাগড়াছড়ির সকল ব্যবসা ও সেবা প্রতিষ্ঠানের তথ্য এক জায়গায়
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
              className="w-full pl-10 pr-4 py-3 rounded-xl border border-border bg-card text-sm focus:outline-none focus:ring-2 focus:ring-forest-light/30"
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
              className="whitespace-nowrap text-xs font-semibold bg-secondary text-primary px-4 py-2 rounded-xl hover:bg-bamboo-light transition-colors"
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
                <button onClick={() => setShowAddModal(true)} className="text-sm text-forest-light font-semibold hover:underline">
                  আপনি কি এই ব্যবসার তথ্য যোগ করতে চান?
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                {localBiz.map((b) => <BusinessCard key={b.id} biz={b} />)}
              </div>
            )}
          </div>

          {/* Category overview when empty */}
          {localBiz.length === 0 && !loading && (
            <div className="mt-6 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
              {localCategories.map((cat) => (
                <div key={cat.id} className="bg-card rounded-xl p-4 border border-border text-center">
                  <div className="text-2xl mb-1">{cat.emoji}</div>
                  <div className="text-xs font-semibold text-primary">{cat.label}</div>
                  <div className="text-[10px] text-muted-foreground mt-1">
                    {cat.subcategories?.map((s) => s.label).join(", ")}
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>

        {/* Divider */}
        <div className="cht-divider mb-12" />

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
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                {touristBiz.map((b) => <BusinessCard key={b.id} biz={b} />)}
              </div>
            )}
          </div>

          {touristBiz.length === 0 && !loading && (
            <div className="mt-6 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
              {touristCategories.map((cat) => (
                <div key={cat.id} className="bg-card rounded-xl p-4 border border-border text-center">
                  <div className="text-2xl mb-1">{cat.emoji}</div>
                  <div className="text-xs font-semibold text-primary">{cat.label}</div>
                  <div className="text-[10px] text-muted-foreground mt-1">
                    {cat.subcategories?.map((s) => s.label).join(", ")}
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>
      </div>

      {showAddModal && <AddBusinessModal onClose={() => setShowAddModal(false)} onAdded={fetchBusinesses} />}
      <Footer />
    </div>
  );
};

export default Directory;
