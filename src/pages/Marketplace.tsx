import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { uploadToCloudinary, optimizeCardUrl } from "@/lib/cloudinary";
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
  const navigate = useNavigate();
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

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      {/* Header */}
      <div className="bg-primary py-8 lg:py-12">
        <div className="max-w-[900px] mx-auto px-4">
          <div className="flex items-start justify-between">
            <div>
              <h1 className="font-bangla text-[26px] lg:text-[36px] text-primary-foreground leading-tight mb-1">
                🛒 ক্রয় ও বিক্রয়
              </h1>
              <p className="text-primary-foreground/70 text-sm max-w-[500px]">
                খাগড়াছড়ির স্থানীয় মার্কেটপ্লেস — পুরনো জিনিস বেচুন, প্রয়োজনীয় জিনিস কিনুন
              </p>
              <div className="flex gap-4 mt-3">
                <div className="text-center">
                  <div className="text-lg font-bold text-secondary">{listings.length}</div>
                  <div className="text-[10px] text-primary-foreground/60">সক্রিয়</div>
                </div>
                <div className="text-center">
                  <div className="text-lg font-bold text-green-400">✓</div>
                  <div className="text-[10px] text-primary-foreground/60">বিনামূল্যে</div>
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

      <div className="max-w-[900px] mx-auto px-4 py-5">
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
        <div className="flex gap-3 mt-2 mb-5">
          <div className="relative flex-1">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">🔍</span>
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="কী খুঁজছেন? মোবাইল, ফার্নিচার..."
              className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-border bg-card text-sm focus:outline-none focus:ring-2 focus:ring-primary/20"
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

        {/* Listings - List View */}
        {loading ? (
          <div className="space-y-3">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="flex bg-card rounded-xl overflow-hidden border border-border">
                <div className="w-[140px] sm:w-[180px] h-[120px] sm:h-[140px] bg-muted animate-pulse flex-shrink-0" />
                <div className="flex-1 p-3 sm:p-4 space-y-2">
                  <div className="h-4 bg-muted animate-pulse rounded w-3/4" />
                  <div className="h-3 bg-muted animate-pulse rounded w-1/2" />
                  <div className="h-5 bg-muted animate-pulse rounded w-1/4 mt-2" />
                </div>
              </div>
            ))}
          </div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-16 bg-card rounded-2xl border border-border">
            <div className="text-5xl mb-3">📭</div>
            <p className="text-muted-foreground mb-4">এখনো কোনো বিজ্ঞাপন নেই।</p>
            <button onClick={() => setShowForm(true)} className="bg-secondary text-primary font-semibold px-5 py-2.5 rounded-xl text-sm">
              প্রথম বিজ্ঞাপন দিন!
            </button>
          </div>
        ) : (
          <div className="space-y-3">
            {filtered.map((listing) => (
              <ListingRow key={listing.id} listing={listing} onClick={() => navigate(`/listing/${listing.id}`)} />
            ))}
          </div>
        )}
      </div>

      {/* Floating post button on mobile */}
      <button
        onClick={() => setShowForm(true)}
        className="fixed bottom-20 left-1/2 -translate-x-1/2 bg-secondary text-primary font-bold px-6 py-3 rounded-full text-sm shadow-lg hover:opacity-90 transition-all z-30 lg:hidden flex items-center gap-1.5"
      >
        ＋ ফ্রি বিজ্ঞাপন দিন
      </button>

      {showForm && <PostForm onClose={() => setShowForm(false)} onPosted={fetchListings} />}
      <Footer />
    </div>
  );
};

/* ── Bikroy-style horizontal listing row ── */
const ListingRow = ({ listing, onClick }: { listing: Listing; onClick: () => void }) => {
  const [imgLoaded, setImgLoaded] = useState(false);
  const cond = conditionLabel[listing.condition] || conditionLabel.used;
  const isFree = listing.price_type === "free";
  const image = listing.image_urls?.[0];
  const imgCount = listing.image_urls?.length || 0;

  return (
    <div
      onClick={onClick}
      className="flex bg-card rounded-xl overflow-hidden border border-border hover:shadow-md hover:border-primary/20 transition-all cursor-pointer group"
    >
      {/* Left image */}
      <div className="w-[140px] sm:w-[180px] h-[120px] sm:h-[140px] relative overflow-hidden flex-shrink-0 bg-muted">
        {!imgLoaded && image && <div className="absolute inset-0 bg-muted animate-pulse" />}
        {image ? (
          <img
            src={optimizeCardUrl(image)}
            alt={listing.title}
            className={`w-full h-full object-cover transition-all duration-300 group-hover:scale-105 ${imgLoaded ? "opacity-100" : "opacity-0"}`}
            loading="lazy"
            onLoad={() => setImgLoaded(true)}
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center" style={{ background: "linear-gradient(135deg, hsl(var(--primary)/0.15), hsl(var(--secondary)/0.2))" }}>
            <span className="text-4xl opacity-60">🛒</span>
          </div>
        )}
        {/* Image count badge */}
        {imgCount > 1 && (
          <span className="absolute bottom-1.5 left-1.5 text-[9px] font-bold bg-black/60 text-white px-1.5 py-0.5 rounded backdrop-blur-sm">
            📷 {imgCount}
          </span>
        )}
        {/* Condition badge */}
        <span className={`absolute top-1.5 left-1.5 text-[9px] font-bold px-1.5 py-0.5 rounded ${cond.cls}`}>
          {cond.text}
        </span>
      </div>

      {/* Right details */}
      <div className="flex-1 p-3 sm:p-4 flex flex-col justify-between min-w-0">
        <div>
          <h3 className="text-sm font-bold text-primary line-clamp-1 group-hover:text-primary/80 transition-colors">
            {listing.title}
          </h3>
          {listing.seller_name && (
            <p className="text-[11px] text-muted-foreground mt-0.5">
              👤 {listing.seller_name}
            </p>
          )}
          <p className="text-[11px] text-muted-foreground mt-0.5">
            📍 {listing.location} • {listing.category}
          </p>
          {listing.description && (
            <p className="text-xs text-muted-foreground mt-1 line-clamp-1 hidden sm:block">{listing.description}</p>
          )}
        </div>

        <div className="flex items-end justify-between mt-2">
          <div>
            <span className={`text-base sm:text-lg font-bold ${isFree ? "text-green-600" : "text-primary"}`}>
              {isFree ? "বিনামূল্যে 🎁" : `৳ ${listing.price.toLocaleString("bn-BD")}`}
            </span>
            {listing.price_type === "negotiable" && (
              <span className="text-[10px] text-muted-foreground ml-1.5">দরদাম চলবে</span>
            )}
          </div>
          <span className="text-[10px] text-muted-foreground flex-shrink-0">
            {timeAgo(listing.created_at)}
          </span>
        </div>
      </div>
    </div>
  );
};

/* ── Post Form ── */
const PostForm = ({ onClose, onPosted }: { onClose: () => void; onPosted: () => void }) => {
  const [step, setStep] = useState(1);
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
    brand: "",
    model: "",
    edition: "",
  });
  const [images, setImages] = useState<File[]>([]);
  const [previews, setPreviews] = useState<string[]>([]);
  const [uploading, setUploading] = useState(false);
  const [uploadStates, setUploadStates] = useState<{ progress: number; status: "pending" | "uploading" | "done" | "error" }[]>([]);
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
    setUploadStates((p) => [...p, ...valid.map(() => ({ progress: 0, status: "pending" as const }))]);
    valid.forEach((f) => {
      const reader = new FileReader();
      reader.onload = (ev) => setPreviews((p) => [...p, ev.target?.result as string]);
      reader.readAsDataURL(f);
    });
  };

  const removeImage = (idx: number) => {
    setImages((p) => p.filter((_, i) => i !== idx));
    setPreviews((p) => p.filter((_, i) => i !== idx));
    setUploadStates((p) => p.filter((_, i) => i !== idx));
  };

  const formatSize = (bytes: number) => {
    if (bytes < 1024) return `${bytes}B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(0)}KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)}MB`;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (images.length === 0) { setError("কমপক্ষে ১টি ছবি আপলোড করুন।"); return; }
    if (form.title.length < 10) { setError("পণ্যের নাম কমপক্ষে ১০ অক্ষর হতে হবে।"); return; }
    if (!/^01\d{9}$/.test(form.phone.replace(/[\s-]/g, ""))) { setError("সঠিক ফোন নম্বর দিন (01XXXXXXXXX)।"); return; }

    setUploading(true);
    try {
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

      const urls: string[] = [];
      for (let i = 0; i < images.length; i++) {
        setUploadStates((p) => p.map((s, j) => j === i ? { ...s, status: "uploading" } : s));
        try {
          const { url } = await uploadToCloudinary(images[i], (pct) => {
            setUploadStates((p) => p.map((s, j) => j === i ? { ...s, progress: pct } : s));
          });
          urls.push(url);
          setUploadStates((p) => p.map((s, j) => j === i ? { progress: 100, status: "done" } : s));
        } catch {
          setUploadStates((p) => p.map((s, j) => j === i ? { ...s, status: "error" } : s));
          throw new Error("ছবি আপলোড ব্যর্থ। আবার চেষ্টা করুন।");
        }
      }

      const priceType = isFree ? "free" : isNegotiable ? "negotiable" : "fixed";

      // Build description with extra details
      let fullDesc = form.description || "";
      const extras: string[] = [];
      if (form.brand) extras.push(`ব্র্যান্ড: ${form.brand}`);
      if (form.model) extras.push(`মডেল: ${form.model}`);
      if (form.edition) extras.push(`সংস্করণ: ${form.edition}`);
      if (extras.length) fullDesc = extras.join("\n") + (fullDesc ? "\n\n" + fullDesc : "");

      const { error: dbErr } = await supabase.from("marketplace_listings").insert({
        title: form.title,
        category: form.category,
        description: fullDesc || null,
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

      alert("✅ আপনার বিজ্ঞাপন জমা হয়েছে! অ্যাডমিন অনুমোদনের পরে প্রকাশিত হবে।");
      onPosted();
      onClose();
    } catch (err: any) {
      setError(err.message || "একটি সমস্যা হয়েছে।");
    }
    setUploading(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4" onClick={onClose}>
      <div className="bg-card rounded-2xl w-full max-w-[550px] max-h-[90vh] overflow-y-auto p-5 sm:p-6 shadow-xl" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-bangla text-xl text-primary">বিজ্ঞাপন দিন</h2>
          <button onClick={onClose} className="text-muted-foreground hover:text-primary text-lg">✕</button>
        </div>

        {/* Step indicators */}
        <div className="flex gap-2 mb-5">
          {[1, 2, 3].map((s) => (
            <div key={s} className={`flex-1 h-1 rounded-full transition-colors ${step >= s ? "bg-primary" : "bg-muted"}`} />
          ))}
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Step 1: Images & Category */}
          {step === 1 && (
            <>
              <div>
                <label className="text-xs font-semibold text-primary mb-1 block">ছবি আপলোড করুন *</label>
                <p className="text-[10px] text-muted-foreground mb-2">সর্বোচ্চ ৪টি ছবি, প্রতিটি ৫MB পর্যন্ত</p>
                <div className="flex gap-2 flex-wrap mb-2">
                  {previews.map((p, i) => (
                    <div key={i} className="relative w-20 h-20 rounded-xl overflow-hidden border border-border">
                      <img src={p} alt="" className="w-full h-full object-cover" />
                      {uploadStates[i]?.status === "uploading" && (
                        <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                          <div className="text-white text-[10px] font-bold">{uploadStates[i].progress}%</div>
                        </div>
                      )}
                      {uploadStates[i]?.status === "done" && (
                        <div className="absolute top-0.5 left-0.5 w-4 h-4 bg-green-500 rounded-full flex items-center justify-center text-white text-[8px]">✓</div>
                      )}
                      {uploadStates[i]?.status === "error" && (
                        <div className="absolute inset-0 bg-red-500/40 flex items-center justify-center"><span className="text-white text-xs">✕</span></div>
                      )}
                      <button type="button" onClick={() => removeImage(i)} className="absolute top-0.5 right-0.5 w-5 h-5 bg-red-500 text-white rounded-full text-xs flex items-center justify-center">✕</button>
                      <div className="absolute bottom-0 left-0 right-0 bg-black/60 text-white text-[8px] text-center py-0.5">{formatSize(images[i]?.size || 0)}</div>
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

              <div>
                <label className="text-xs font-semibold text-primary mb-1 block">ক্যাটাগরি *</label>
                <select required value={form.category} onChange={(e) => set("category", e.target.value)} className="w-full border border-border rounded-xl px-3 py-2.5 text-sm bg-background focus:outline-none">
                  <option value="">নির্বাচন করুন</option>
                  {formCategories.map((c) => <option key={c.value} value={c.value}>{c.label}</option>)}
                </select>
              </div>

              <button
                type="button"
                onClick={() => {
                  if (!form.category) { setError("ক্যাটাগরি নির্বাচন করুন"); return; }
                  if (images.length === 0) { setError("কমপক্ষে ১টি ছবি দিন"); return; }
                  setError("");
                  setStep(2);
                }}
                className="w-full bg-primary text-primary-foreground py-3 rounded-xl text-sm font-semibold hover:opacity-90"
              >
                পরবর্তী →
              </button>
            </>
          )}

          {/* Step 2: Product details */}
          {step === 2 && (
            <>
              <div>
                <label className="text-xs font-semibold text-primary mb-1 block">পণ্যের নাম (কমপক্ষে ১০ অক্ষর) *</label>
                <input required minLength={10} value={form.title} onChange={(e) => set("title", e.target.value)} className="w-full border border-border rounded-xl px-3 py-2.5 text-sm bg-background focus:outline-none focus:ring-2 focus:ring-primary/20" placeholder="যেমন: Samsung Galaxy S24 Ultra 256GB (Used)" />
              </div>

              {/* Brand, Model, Edition */}
              <div className="grid grid-cols-3 gap-2">
                <div>
                  <label className="text-[11px] font-semibold text-primary mb-1 block">ব্র্যান্ড</label>
                  <input value={form.brand} onChange={(e) => set("brand", e.target.value)} className="w-full border border-border rounded-xl px-3 py-2.5 text-sm bg-background focus:outline-none" placeholder="Samsung" />
                </div>
                <div>
                  <label className="text-[11px] font-semibold text-primary mb-1 block">মডেল</label>
                  <input value={form.model} onChange={(e) => set("model", e.target.value)} className="w-full border border-border rounded-xl px-3 py-2.5 text-sm bg-background focus:outline-none" placeholder="Galaxy S24" />
                </div>
                <div>
                  <label className="text-[11px] font-semibold text-primary mb-1 block">সংস্করণ</label>
                  <input value={form.edition} onChange={(e) => set("edition", e.target.value)} className="w-full border border-border rounded-xl px-3 py-2.5 text-sm bg-background focus:outline-none" placeholder="256GB" />
                </div>
              </div>

              <div>
                <label className="text-xs font-semibold text-primary mb-1 block">বিবরণ</label>
                <textarea value={form.description} onChange={(e) => set("description", e.target.value)} rows={3} className="w-full border border-border rounded-xl px-3 py-2.5 text-sm bg-background focus:outline-none resize-none focus:ring-2 focus:ring-primary/20" placeholder="পণ্যের অবস্থা, বিক্রির কারণ, স্পেসিফিকেশন ইত্যাদি..." />
              </div>

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

              <div className="flex gap-2">
                <button type="button" onClick={() => setStep(1)} className="flex-1 border border-border py-3 rounded-xl text-sm font-semibold text-primary hover:bg-muted">
                  ← আগে
                </button>
                <button
                  type="button"
                  onClick={() => {
                    if (form.title.length < 10) { setError("পণ্যের নাম কমপক্ষে ১০ অক্ষর হতে হবে।"); return; }
                    setError("");
                    setStep(3);
                  }}
                  className="flex-1 bg-primary text-primary-foreground py-3 rounded-xl text-sm font-semibold hover:opacity-90"
                >
                  পরবর্তী →
                </button>
              </div>
            </>
          )}

          {/* Step 3: Contact & Submit */}
          {step === 3 && (
            <>
              <div>
                <label className="text-xs font-semibold text-primary mb-1 block">উপজেলা *</label>
                <select required value={form.location} onChange={(e) => set("location", e.target.value)} className="w-full border border-border rounded-xl px-3 py-2.5 text-sm bg-background focus:outline-none">
                  <option value="">নির্বাচন করুন</option>
                  {locations.map((l) => <option key={l} value={l}>{l}</option>)}
                </select>
              </div>

              <div>
                <label className="text-xs font-semibold text-primary mb-1 block">WhatsApp / ফোন নম্বর *</label>
                <input required value={form.phone} onChange={(e) => set("phone", e.target.value)} placeholder="01XXXXXXXXX" className="w-full border border-border rounded-xl px-3 py-2.5 text-sm bg-background focus:outline-none focus:ring-2 focus:ring-primary/20" />
              </div>

              <div>
                <label className="text-xs font-semibold text-primary mb-1 block">আপনার নাম</label>
                <input value={form.seller_name} onChange={(e) => set("seller_name", e.target.value)} className="w-full border border-border rounded-xl px-3 py-2.5 text-sm bg-background focus:outline-none" placeholder="ঐচ্ছিক" />
              </div>

              {error && <p className="text-xs text-red-600 bg-red-50 px-3 py-2 rounded-lg">{error}</p>}

              {uploading && (
                <div className="space-y-1.5">
                  {uploadStates.map((s, i) => (
                    <div key={i} className="flex items-center gap-2">
                      <div className="text-[10px] text-primary w-16">ছবি {i + 1}</div>
                      <div className="flex-1 bg-muted rounded-full h-1.5">
                        <div className={`h-1.5 rounded-full transition-all ${s.status === "error" ? "bg-red-500" : "bg-secondary"}`} style={{ width: `${s.progress}%` }} />
                      </div>
                      <div className="text-[10px] text-muted-foreground w-8">{s.progress}%</div>
                    </div>
                  ))}
                </div>
              )}

              <div className="flex gap-2">
                <button type="button" onClick={() => setStep(2)} className="flex-1 border border-border py-3 rounded-xl text-sm font-semibold text-primary hover:bg-muted">
                  ← আগে
                </button>
                <button type="submit" disabled={uploading} className="flex-1 bg-primary text-primary-foreground py-3 rounded-xl text-sm font-semibold hover:opacity-90 disabled:opacity-50">
                  {uploading ? "আপলোড হচ্ছে..." : "বিজ্ঞাপন জমা দিন"}
                </button>
              </div>
              <p className="text-[10px] text-muted-foreground text-center">
                অ্যাডমিন অনুমোদনের পরে প্রকাশিত হবে। সম্পূর্ণ বিনামূল্যে।
              </p>
            </>
          )}

          {error && step !== 3 && <p className="text-xs text-red-600 bg-red-50 px-3 py-2 rounded-lg">{error}</p>}
        </form>
      </div>
    </div>
  );
};

export default Marketplace;
