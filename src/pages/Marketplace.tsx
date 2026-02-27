import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { uploadToCloudinary } from "@/lib/cloudinary";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

interface Listing {
  id: string;
  title: string;
  category: string;
  description: string | null;
  price: number;
  price_type: string;
  condition: string;
  location: string;
  phone: string;
  whatsapp: string | null;
  seller_name: string | null;
  image_urls: string[];
  status: string;
  created_at: string;
  expires_at: string;
}

const categories = [
  { id: "সব", emoji: "" },
  { id: "ইলেকট্রনিক্স", emoji: "📱" },
  { id: "ফার্নিচার", emoji: "🛋️" },
  { id: "যানবাহন", emoji: "🏍️" },
  { id: "কৃষি ও খাদ্য", emoji: "🌾" },
  { id: "ট্রেকিং গিয়ার", emoji: "🎒" },
  { id: "পোশাক", emoji: "👗" },
  { id: "বিনামূল্যে", emoji: "🆓" },
];

const formCategories = [
  { value: "ইলেকট্রনিক্স", label: "📱 ইলেকট্রনিক্স" },
  { value: "ফার্নিচার", label: "🛋️ ফার্নিচার" },
  { value: "যানবাহন", label: "🏍️ যানবাহন" },
  { value: "কৃষি ও খাদ্য", label: "🌾 কৃষি ও খাদ্য" },
  { value: "ট্রেকিং গিয়ার", label: "🎒 ট্রেকিং গিয়ার" },
  { value: "পোশাক ও পরিধান", label: "👗 পোশাক ও পরিধান" },
  { value: "জমি ও বাড়ি", label: "🏠 জমি ও বাড়ি" },
  { value: "বিনামূল্যে", label: "🆓 বিনামূল্যে দিতে চাই" },
  { value: "অন্যান্য", label: "অন্যান্য" },
];

const locations = [
  "খাগড়াছড়ি সদর", "মাটিরাঙ্গা", "দীঘিনালা",
  "পানছড়ি", "মহালছড়ি", "রামগড়", "গুইমারা",
];

const timeAgo = (dateStr: string) => {
  const diff = Date.now() - new Date(dateStr).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 60) return `${mins} মিনিট আগে`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs} ঘণ্টা আগে`;
  const days = Math.floor(hrs / 24);
  return `${days} দিন আগে`;
};

const conditionLabel: Record<string, { text: string; cls: string }> = {
  new: { text: "নতুন", cls: "bg-green-100 text-green-800" },
  used: { text: "ব্যবহৃত", cls: "bg-amber-100 text-amber-800" },
  good: { text: "ভালো কন্ডিশন", cls: "bg-blue-100 text-blue-800" },
};

const Marketplace = () => {
  const [listings, setListings] = useState<Listing[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("সব");
  const [search, setSearch] = useState("");
  const [sort, setSort] = useState<"new" | "low" | "high">("new");
  const [showForm, setShowForm] = useState(false);

  useEffect(() => {
    fetchListings();
  }, []);

  const fetchListings = async () => {
    setLoading(true);
    const { data } = await supabase
      .from("marketplace_listings")
      .select("*")
      .eq("status", "active")
      .order("created_at", { ascending: false });
    if (data) setListings(data as unknown as Listing[]);
    setLoading(false);
  };

  const filtered = listings
    .filter((l) => {
      if (filter !== "সব") {
        if (filter === "বিনামূল্যে") return l.price_type === "free";
        if (!l.category.includes(filter)) return false;
      }
      if (search) {
        const q = search.toLowerCase();
        return l.title.toLowerCase().includes(q) || l.description?.toLowerCase().includes(q);
      }
      return true;
    })
    .sort((a, b) => {
      if (sort === "low") return a.price - b.price;
      if (sort === "high") return b.price - a.price;
      return 0;
    });

  const handleReport = async (id: string, reason: string) => {
    await supabase.from("marketplace_reports").insert({ listing_id: id, reason });
    const listing = listings.find(l => l.id === id);
    if (listing) {
      await supabase.from("marketplace_listings").update({ report_count: (listing as any).report_count + 1 } as any).eq("id", id);
    }
    alert("রিপোর্ট করা হয়েছে। ধন্যবাদ।");
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      {/* Header */}
      <div className="bg-primary py-10 lg:py-14">
        <div className="max-w-[1280px] mx-auto px-4 lg:px-10">
          <div className="flex items-start justify-between">
            <div>
              <h1 className="font-bangla text-[28px] lg:text-[40px] text-primary-foreground leading-tight mb-2">
                🛒 ক্রয় ও বিক্রয়
              </h1>
              <p className="text-primary-foreground/70 text-sm lg:text-base max-w-[600px]">
                খাগড়াছড়ির স্থানীয় মার্কেটপ্লেস — পুরনো জিনিস বেচুন, প্রয়োজনীয় জিনিস কিনুন
              </p>
              <div className="flex gap-4 mt-4">
                <div className="text-center">
                  <div className="text-xl font-bold text-secondary">{listings.length}</div>
                  <div className="text-[10px] text-primary-foreground/60">সক্রিয় বিজ্ঞাপন</div>
                </div>
                <div className="text-center">
                  <div className="text-xl font-bold text-secondary">—</div>
                  <div className="text-[10px] text-primary-foreground/60">বিক্রয় সম্পন্ন</div>
                </div>
                <div className="text-center">
                  <div className="text-xl font-bold text-green-400">✓</div>
                  <div className="text-[10px] text-primary-foreground/60">বিনামূল্যে পোস্ট</div>
                </div>
              </div>
            </div>
            <button
              onClick={() => setShowForm(true)}
              className="bg-secondary text-primary font-bold px-5 py-3 rounded-xl text-sm hover:opacity-90 transition-opacity whitespace-nowrap"
            >
              ＋ বিজ্ঞাপন দিন
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-[1280px] mx-auto px-4 lg:px-10 py-6">
        {/* Filters */}
        <div className="flex gap-2 overflow-x-auto scrollbar-hide pb-3">
          {categories.map((c) => (
            <button
              key={c.id}
              onClick={() => setFilter(c.id)}
              className={`whitespace-nowrap text-xs font-semibold px-3.5 py-2 rounded-full border transition-all ${
                filter === c.id
                  ? "bg-primary text-primary-foreground border-transparent"
                  : "bg-card text-primary border-border hover:border-primary/30"
              }`}
            >
              {c.emoji} {c.id}
            </button>
          ))}
        </div>

        {/* Search & Sort */}
        <div className="flex gap-3 mt-3 mb-6">
          <div className="relative flex-1">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">🔍</span>
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="কী খুঁজছেন? মোবাইল, ফার্নিচার..."
              className="w-full pl-10 pr-4 py-3 rounded-xl border border-border bg-card text-sm focus:outline-none focus:ring-2 focus:ring-primary/20"
            />
          </div>
          <select
            value={sort}
            onChange={(e) => setSort(e.target.value as any)}
            className="text-xs bg-card border border-border rounded-xl px-3 py-2 text-primary focus:outline-none"
          >
            <option value="new">নতুন আগে</option>
            <option value="low">কম দামে</option>
            <option value="high">বেশি দামে</option>
          </select>
        </div>

        {/* Listings */}
        {loading ? (
          <div className="text-center py-12 text-muted-foreground">লোড হচ্ছে...</div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-16 bg-card rounded-2xl border border-border">
            <div className="text-5xl mb-3">📭</div>
            <p className="text-muted-foreground mb-4">এখনো কোনো বিজ্ঞাপন নেই।</p>
            <button onClick={() => setShowForm(true)} className="bg-secondary text-primary font-semibold px-5 py-2.5 rounded-xl text-sm">
              প্রথম বিজ্ঞাপন দিন!
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {filtered.map((listing) => (
              <ListingCard key={listing.id} listing={listing} onReport={handleReport} />
            ))}
          </div>
        )}
      </div>

      {showForm && <PostForm onClose={() => setShowForm(false)} onPosted={fetchListings} />}
      <Footer />
    </div>
  );
};

const ListingCard = ({ listing, onReport }: { listing: Listing; onReport: (id: string, reason: string) => void }) => {
  const [imgError, setImgError] = useState(false);
  const [showReport, setShowReport] = useState(false);
  const cond = conditionLabel[listing.condition] || conditionLabel.used;
  const isFree = listing.price_type === "free";
  const whatsappNum = (listing.whatsapp || listing.phone).replace(/[^0-9]/g, "");
  const waUrl = `https://wa.me/${whatsappNum.startsWith("880") ? whatsappNum : "880" + whatsappNum}?text=${encodeURIComponent("আমি amarkgc.com থেকে আপনার \"" + listing.title + "\" বিজ্ঞাপনটি দেখেছি।")}`;

  return (
    <div className="bg-card rounded-2xl overflow-hidden shadow-sm border border-border hover:shadow-md transition-all">
      {/* Image */}
      <div className="h-[180px] relative overflow-hidden" style={!listing.image_urls?.[0] || imgError ? { background: "linear-gradient(135deg, #1a3d2b, #c9a84c)" } : undefined}>
        {listing.image_urls?.[0] && !imgError ? (
          <img src={listing.image_urls[0]} alt={listing.title} className="w-full h-full object-cover" loading="lazy" onError={() => setImgError(true)} />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <span className="text-[52px] opacity-80">🛒</span>
          </div>
        )}
        <div className="absolute top-2 left-2 flex gap-1">
          <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${cond.cls}`}>{cond.text}</span>
          {isFree && <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-green-100 text-green-800">বিনামূল্যে 🎁</span>}
        </div>
        {listing.category && (
          <span className="absolute top-2 right-2 text-[10px] font-semibold bg-black/50 text-white px-2 py-0.5 rounded-full backdrop-blur-sm">
            {listing.category}
          </span>
        )}
      </div>

      <div className="p-3.5">
        <h3 className="text-sm font-bold text-primary mb-1 line-clamp-1">{listing.title}</h3>
        {listing.description && <p className="text-xs text-muted-foreground line-clamp-2 mb-2">{listing.description}</p>}
        
        <div className="flex items-center justify-between mb-2">
          <span className={`text-lg font-bold ${isFree ? "text-green-600" : "text-primary"}`}>
            {isFree ? "বিনামূল্যে 🎁" : `৳${listing.price.toLocaleString("bn-BD")}`}
          </span>
          {listing.price_type === "negotiable" && <span className="text-[10px] text-muted-foreground">দরদাম চলবে</span>}
        </div>

        <div className="flex items-center justify-between text-[10px] text-muted-foreground mb-3">
          <span>📍 {listing.location}</span>
          <span>{timeAgo(listing.created_at)}</span>
        </div>

        {listing.seller_name && (
          <div className="text-[11px] text-muted-foreground mb-2">👤 {listing.seller_name}</div>
        )}

        <div className="flex gap-1.5 pt-2 border-t border-border">
          <a
            href={waUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex-1 py-2 rounded-lg text-[11px] font-semibold flex items-center justify-center gap-1 text-white transition-opacity hover:opacity-90"
            style={{ background: "#25d366" }}
          >
            💬 WhatsApp
          </a>
          <a
            href={`tel:${listing.phone}`}
            className="py-2 px-3 rounded-lg text-[11px] font-semibold bg-blue-50 text-blue-800 hover:opacity-80"
          >
            📞
          </a>
          <div className="relative">
            <button
              onClick={() => setShowReport(!showReport)}
              className="py-2 px-3 rounded-lg text-[11px] bg-muted text-muted-foreground hover:opacity-80"
            >
              🚩
            </button>
            {showReport && (
              <div className="absolute bottom-full right-0 mb-1 bg-card border border-border rounded-xl shadow-lg p-2 w-40 z-10">
                {["ভুয়া বিজ্ঞাপন", "স্প্যাম", "অশ্লীল", "অন্যান্য"].map((r) => (
                  <button key={r} onClick={() => { onReport(listing.id, r); setShowReport(false); }} className="block w-full text-left text-xs px-2 py-1.5 hover:bg-muted rounded-lg text-primary">
                    {r}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

const PostForm = ({ onClose, onPosted }: { onClose: () => void; onPosted: () => void }) => {
  const [form, setForm] = useState({
    title: "",
    category: "",
    description: "",
    price: "",
    price_type: "fixed",
    condition: "used",
    location: "",
    phone: "",
    whatsapp: "",
    seller_name: "",
  });
  const [images, setImages] = useState<File[]>([]);
  const [previews, setPreviews] = useState<string[]>([]);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [error, setError] = useState("");
  const [isFree, setIsFree] = useState(false);
  const [isNegotiable, setIsNegotiable] = useState(false);

  const set = (k: string, v: string) => setForm((p) => ({ ...p, [k]: v }));

  const handleImages = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (images.length + files.length > 4) {
      setError("সর্বোচ্চ ৪টি ছবি আপলোড করতে পারবেন।");
      return;
    }
    const valid = files.filter((f) => f.size <= 5 * 1024 * 1024);
    if (valid.length < files.length) setError("৫MB এর বেশি ফাইল বাদ দেওয়া হয়েছে।");
    setImages((p) => [...p, ...valid]);
    valid.forEach((f) => {
      const reader = new FileReader();
      reader.onload = (ev) => setPreviews((p) => [...p, ev.target?.result as string]);
      reader.readAsDataURL(f);
    });
  };

  const removeImage = (idx: number) => {
    setImages((p) => p.filter((_, i) => i !== idx));
    setPreviews((p) => p.filter((_, i) => i !== idx));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (images.length === 0) { setError("কমপক্ষে ১টি ছবি আপলোড করুন।"); return; }
    if (form.title.length < 10) { setError("পণ্যের নাম কমপক্ষে ১০ অক্ষর হতে হবে।"); return; }
    if (!/^01\d{9}$/.test(form.phone.replace(/[\s-]/g, ""))) { setError("সঠিক ফোন নম্বর দিন (01XXXXXXXXX)।"); return; }

    setUploading(true);
    try {
      // Check daily limit
      const today = new Date().toISOString().split("T")[0];
      const { count } = await supabase
        .from("marketplace_listings")
        .select("*", { count: "exact", head: true })
        .eq("phone", form.phone)
        .gte("created_at", today + "T00:00:00Z") as any;
      
      if (count >= 3) {
        setError("আজকের সর্বোচ্চ পোস্ট সীমা (৩টি) শেষ হয়েছে।");
        setUploading(false);
        return;
      }

      // Upload images
      const urls: string[] = [];
      for (let i = 0; i < images.length; i++) {
        setUploadProgress(Math.round(((i) / images.length) * 100));
        const { url } = await uploadToCloudinary(images[i], (p) => {
          setUploadProgress(Math.round(((i + p / 100) / images.length) * 100));
        });
        urls.push(url);
      }
      setUploadProgress(100);

      const priceType = isFree ? "free" : isNegotiable ? "negotiable" : "fixed";

      const { error: dbErr } = await supabase.from("marketplace_listings").insert({
        title: form.title,
        category: form.category,
        description: form.description || null,
        price: isFree ? 0 : Number(form.price) || 0,
        price_type: priceType,
        condition: form.condition,
        location: form.location,
        phone: form.phone,
        whatsapp: form.whatsapp || form.phone,
        seller_name: form.seller_name || null,
        image_urls: urls,
        status: "pending",
      });

      if (dbErr) throw dbErr;
      
      alert("✅ বিজ্ঞাপন জমা হয়েছে! অ্যাডমিন অনুমোদন করলে প্রকাশিত হবে।");
      onPosted();
      onClose();
    } catch (err: any) {
      setError(err.message || "একটি সমস্যা হয়েছে।");
    }
    setUploading(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4" onClick={onClose}>
      <div className="bg-card rounded-2xl w-full max-w-[550px] max-h-[90vh] overflow-y-auto p-6 shadow-xl" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center justify-between mb-5">
          <h2 className="font-bangla text-xl text-primary">বিজ্ঞাপন দিন</h2>
          <button onClick={onClose} className="text-muted-foreground hover:text-primary text-lg">✕</button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Images */}
          <div>
            <label className="text-xs font-semibold text-primary mb-1 block">ছবি আপলোড করুন (সর্বোচ্চ ৪টি) *</label>
            <div className="flex gap-2 flex-wrap mb-2">
              {previews.map((p, i) => (
                <div key={i} className="relative w-20 h-20 rounded-xl overflow-hidden border border-border">
                  <img src={p} alt="" className="w-full h-full object-cover" />
                  <button type="button" onClick={() => removeImage(i)} className="absolute top-0.5 right-0.5 w-5 h-5 bg-red-500 text-white rounded-full text-xs flex items-center justify-center">✕</button>
                </div>
              ))}
              {images.length < 4 && (
                <label className="w-20 h-20 rounded-xl border-2 border-dashed border-border flex items-center justify-center cursor-pointer hover:border-primary/40">
                  <span className="text-2xl text-muted-foreground">+</span>
                  <input type="file" accept="image/*" multiple onChange={handleImages} className="hidden" />
                </label>
              )}
            </div>
          </div>

          {/* Category */}
          <div>
            <label className="text-xs font-semibold text-primary mb-1 block">ক্যাটাগরি *</label>
            <select required value={form.category} onChange={(e) => set("category", e.target.value)} className="w-full border border-border rounded-xl px-3 py-2.5 text-sm bg-background focus:outline-none">
              <option value="">নির্বাচন করুন</option>
              {formCategories.map((c) => <option key={c.value} value={c.value}>{c.label}</option>)}
            </select>
          </div>

          {/* Title */}
          <div>
            <label className="text-xs font-semibold text-primary mb-1 block">পণ্যের নাম (কমপক্ষে ১০ অক্ষর) *</label>
            <input required minLength={10} value={form.title} onChange={(e) => set("title", e.target.value)} className="w-full border border-border rounded-xl px-3 py-2.5 text-sm bg-background focus:outline-none focus:ring-2 focus:ring-primary/20" />
          </div>

          {/* Description */}
          <div>
            <label className="text-xs font-semibold text-primary mb-1 block">বিবরণ</label>
            <textarea value={form.description} onChange={(e) => set("description", e.target.value)} rows={3} className="w-full border border-border rounded-xl px-3 py-2.5 text-sm bg-background focus:outline-none resize-none focus:ring-2 focus:ring-primary/20" placeholder="পণ্যের অবস্থা, বিক্রির কারণ ইত্যাদি..." />
          </div>

          {/* Price */}
          <div>
            <label className="text-xs font-semibold text-primary mb-1 block">দাম (টাকা)</label>
            <input type="number" value={form.price} onChange={(e) => set("price", e.target.value)} disabled={isFree} className="w-full border border-border rounded-xl px-3 py-2.5 text-sm bg-background focus:outline-none disabled:opacity-50" placeholder="৳" />
            <div className="flex gap-4 mt-2">
              <label className="flex items-center gap-1.5 text-xs text-primary cursor-pointer">
                <input type="checkbox" checked={isNegotiable} onChange={(e) => setIsNegotiable(e.target.checked)} className="rounded" /> দরদাম চলবে
              </label>
              <label className="flex items-center gap-1.5 text-xs text-primary cursor-pointer">
                <input type="checkbox" checked={isFree} onChange={(e) => { setIsFree(e.target.checked); if (e.target.checked) set("price", "0"); }} className="rounded" /> বিনামূল্যে
              </label>
            </div>
          </div>

          {/* Condition */}
          <div>
            <label className="text-xs font-semibold text-primary mb-1 block">অবস্থা *</label>
            <div className="flex gap-2">
              {[{ v: "new", l: "নতুন" }, { v: "used", l: "ব্যবহৃত" }, { v: "good", l: "ভালো কন্ডিশন" }].map((c) => (
                <button key={c.v} type="button" onClick={() => set("condition", c.v)} className={`text-xs px-3 py-2 rounded-lg border transition-all ${form.condition === c.v ? "bg-primary text-primary-foreground border-primary" : "border-border text-primary"}`}>
                  {c.l}
                </button>
              ))}
            </div>
          </div>

          {/* Location */}
          <div>
            <label className="text-xs font-semibold text-primary mb-1 block">উপজেলা *</label>
            <select required value={form.location} onChange={(e) => set("location", e.target.value)} className="w-full border border-border rounded-xl px-3 py-2.5 text-sm bg-background focus:outline-none">
              <option value="">নির্বাচন করুন</option>
              {locations.map((l) => <option key={l} value={l}>{l}</option>)}
            </select>
          </div>

          {/* Phone */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-semibold text-primary mb-1 block">WhatsApp নম্বর *</label>
              <input required value={form.phone} onChange={(e) => set("phone", e.target.value)} placeholder="01XXXXXXXXX" className="w-full border border-border rounded-xl px-3 py-2.5 text-sm bg-background focus:outline-none focus:ring-2 focus:ring-primary/20" />
            </div>
            <div>
              <label className="text-xs font-semibold text-primary mb-1 block">আপনার নাম</label>
              <input value={form.seller_name} onChange={(e) => set("seller_name", e.target.value)} className="w-full border border-border rounded-xl px-3 py-2.5 text-sm bg-background focus:outline-none" />
            </div>
          </div>

          {error && <p className="text-xs text-red-600 bg-red-50 px-3 py-2 rounded-lg">{error}</p>}

          {uploading && (
            <div className="space-y-1">
              <div className="text-xs text-primary font-semibold">আপলোড হচ্ছে... {uploadProgress}%</div>
              <div className="w-full bg-muted rounded-full h-2">
                <div className="bg-secondary h-2 rounded-full transition-all" style={{ width: `${uploadProgress}%` }} />
              </div>
            </div>
          )}

          <button type="submit" disabled={uploading} className="w-full bg-primary text-primary-foreground py-3 rounded-xl text-sm font-semibold hover:opacity-90 disabled:opacity-50">
            {uploading ? "জমা হচ্ছে..." : "বিজ্ঞাপন জমা দিন"}
          </button>
          <p className="text-[10px] text-muted-foreground text-center">
            বিজ্ঞাপন জমা দেওয়ার পরে অ্যাডমিন অনুমোদন করলে প্রকাশিত হবে। সম্পূর্ণ বিনামূল্যে।
          </p>
        </form>
      </div>
    </div>
  );
};

export default Marketplace;
