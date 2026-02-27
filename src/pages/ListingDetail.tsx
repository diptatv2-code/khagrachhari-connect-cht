import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { optimizeCloudinaryUrl } from "@/lib/cloudinary";
import ImageLightbox from "@/components/ImageLightbox";
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

const conditionLabel: Record<string, string> = {
  new: "নতুন",
  used: "ব্যবহৃত",
  good: "ভালো কন্ডিশন",
};

const timeAgo = (dateStr: string) => {
  const diff = Date.now() - new Date(dateStr).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 60) return `${mins} মিনিট আগে`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs} ঘণ্টা আগে`;
  const days = Math.floor(hrs / 24);
  return `${days} দিন আগে`;
};

const ListingDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [listing, setListing] = useState<Listing | null>(null);
  const [loading, setLoading] = useState(true);
  const [imgIdx, setImgIdx] = useState(0);
  const [lightbox, setLightbox] = useState<number | null>(null);
  const [showReport, setShowReport] = useState(false);

  useEffect(() => {
    if (!id) return;
    (async () => {
      const { data } = await supabase
        .from("marketplace_listings")
        .select("*")
        .eq("id", id)
        .eq("status", "active")
        .single();
      if (data) setListing(data as unknown as Listing);
      setLoading(false);
    })();
  }, [id]);

  const handleReport = async (reason: string) => {
    if (!listing) return;
    await supabase.from("marketplace_reports").insert({ listing_id: listing.id, reason });
    await supabase
      .from("marketplace_listings")
      .update({ report_count: ((listing as any).report_count || 0) + 1 } as any)
      .eq("id", listing.id);
    alert("রিপোর্ট করা হয়েছে। ধন্যবাদ।");
    setShowReport(false);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="max-w-3xl mx-auto px-4 py-10">
          <div className="animate-pulse space-y-4">
            <div className="h-72 bg-muted rounded-2xl" />
            <div className="h-6 bg-muted rounded w-3/4" />
            <div className="h-4 bg-muted rounded w-1/2" />
            <div className="h-8 bg-muted rounded w-1/3" />
          </div>
        </div>
      </div>
    );
  }

  if (!listing) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="max-w-3xl mx-auto px-4 py-20 text-center">
          <div className="text-5xl mb-4">😕</div>
          <p className="text-muted-foreground mb-4">বিজ্ঞাপনটি পাওয়া যায়নি।</p>
          <button onClick={() => navigate("/marketplace")} className="bg-primary text-primary-foreground px-5 py-2.5 rounded-xl text-sm font-semibold">
            ← মার্কেটপ্লেসে ফিরুন
          </button>
        </div>
      </div>
    );
  }

  const images = listing.image_urls?.length ? listing.image_urls : [];
  const isFree = listing.price_type === "free";
  const whatsappNum = (listing.whatsapp || listing.phone).replace(/[^0-9]/g, "");
  const waUrl = `https://wa.me/${whatsappNum.startsWith("880") ? whatsappNum : "880" + whatsappNum}?text=${encodeURIComponent("আমি amarkgc.com থেকে আপনার \"" + listing.title + "\" বিজ্ঞাপনটি দেখেছি।")}`;

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <div className="max-w-3xl mx-auto px-4 py-6">
        {/* Back */}
        <button onClick={() => navigate("/marketplace")} className="text-sm text-muted-foreground hover:text-primary mb-4 flex items-center gap-1">
          ← মার্কেটপ্লেসে ফিরুন
        </button>

        {/* Image gallery */}
        <div className="bg-card rounded-2xl overflow-hidden border border-border mb-4">
          <div className="relative aspect-[4/3] max-h-[400px] bg-muted cursor-pointer" onClick={() => setLightbox(imgIdx)}>
            {images[imgIdx] ? (
              <img
                src={optimizeCloudinaryUrl(images[imgIdx], 800)}
                alt={listing.title}
                className="w-full h-full object-contain"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-6xl">🛒</div>
            )}
            {images.length > 1 && (
              <>
                <button onClick={(e) => { e.stopPropagation(); setImgIdx((p) => (p - 1 + images.length) % images.length); }} className="absolute left-2 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-black/50 text-white flex items-center justify-center text-lg backdrop-blur-sm">‹</button>
                <button onClick={(e) => { e.stopPropagation(); setImgIdx((p) => (p + 1) % images.length); }} className="absolute right-2 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-black/50 text-white flex items-center justify-center text-lg backdrop-blur-sm">›</button>
                <span className="absolute bottom-2 left-1/2 -translate-x-1/2 text-xs font-bold bg-black/60 text-white px-2.5 py-1 rounded-full backdrop-blur-sm">
                  {imgIdx + 1}/{images.length}
                </span>
              </>
            )}
          </div>
          {/* Thumbnails */}
          {images.length > 1 && (
            <div className="flex gap-2 p-3 overflow-x-auto scrollbar-hide">
              {images.map((img, i) => (
                <button
                  key={i}
                  onClick={() => setImgIdx(i)}
                  className={`w-16 h-16 rounded-lg overflow-hidden flex-shrink-0 border-2 transition-all ${i === imgIdx ? "border-primary" : "border-transparent opacity-60"}`}
                >
                  <img src={optimizeCloudinaryUrl(img, 100)} alt="" className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Title & info */}
        <div className="bg-card rounded-2xl border border-border p-5 mb-4">
          <h1 className="font-bangla text-xl font-bold text-primary mb-1">{listing.title}</h1>
          <p className="text-xs text-muted-foreground mb-3">
            পোস্ট করা হয়েছে {timeAgo(listing.created_at)} • {listing.location}
          </p>

          <div className="border-t border-border pt-3 mb-4">
            <div className={`text-2xl font-bold ${isFree ? "text-green-600" : "text-primary"}`}>
              {isFree ? "বিনামূল্যে 🎁" : `৳ ${listing.price.toLocaleString("bn-BD")}`}
            </div>
            {listing.price_type === "negotiable" && (
              <span className="text-xs text-muted-foreground">দরদাম চলবে</span>
            )}
          </div>

          {/* Details table */}
          <div className="border-t border-border pt-3 space-y-2">
            <div className="grid grid-cols-2 text-sm">
              <span className="text-muted-foreground">কন্ডিশন:</span>
              <span className="text-primary font-medium">{conditionLabel[listing.condition] || listing.condition}</span>
            </div>
            <div className="grid grid-cols-2 text-sm">
              <span className="text-muted-foreground">ক্যাটাগরি:</span>
              <span className="text-primary font-medium">{listing.category}</span>
            </div>
            <div className="grid grid-cols-2 text-sm">
              <span className="text-muted-foreground">অবস্থান:</span>
              <span className="text-primary font-medium">📍 {listing.location}</span>
            </div>
            {listing.seller_name && (
              <div className="grid grid-cols-2 text-sm">
                <span className="text-muted-foreground">বিক্রেতা:</span>
                <span className="text-primary font-medium">👤 {listing.seller_name}</span>
              </div>
            )}
          </div>
        </div>

        {/* Description */}
        {listing.description && (
          <div className="bg-card rounded-2xl border border-border p-5 mb-4">
            <h2 className="font-bangla text-sm font-bold text-primary mb-2">বর্ণনা</h2>
            <p className="text-sm text-muted-foreground whitespace-pre-line">{listing.description}</p>
          </div>
        )}

        {/* Report */}
        <div className="bg-card rounded-2xl border border-border p-4 mb-4 text-center">
          <button onClick={() => setShowReport(!showReport)} className="text-xs text-muted-foreground hover:text-red-600 transition-colors">
            🚩 বিজ্ঞাপনটি রিপোর্ট করুন
          </button>
          {showReport && (
            <div className="flex flex-wrap gap-2 justify-center mt-3">
              {["ভুয়া বিজ্ঞাপন", "স্প্যাম", "অশ্লীল", "অন্যান্য"].map((r) => (
                <button key={r} onClick={() => handleReport(r)} className="text-xs px-3 py-1.5 bg-red-50 text-red-700 rounded-lg hover:bg-red-100">
                  {r}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Sticky contact bar */}
        <div className="fixed bottom-0 left-0 right-0 bg-card border-t border-border p-3 flex gap-2 z-40 lg:static lg:border-t-0 lg:p-0 lg:mb-6">
          <a
            href={`tel:${listing.phone}`}
            className="flex-1 py-3 rounded-xl text-sm font-semibold flex items-center justify-center gap-1.5 bg-blue-600 text-white hover:opacity-90 transition-opacity"
          >
            📞 কল করুন
          </a>
          <a
            href={waUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex-1 py-3 rounded-xl text-sm font-semibold flex items-center justify-center gap-1.5 text-white hover:opacity-90 transition-opacity"
            style={{ background: "#25d366" }}
          >
            💬 হোয়াটসঅ্যাপ
          </a>
        </div>

        {/* Spacer for fixed bottom bar on mobile */}
        <div className="h-16 lg:hidden" />
      </div>

      {lightbox !== null && (
        <ImageLightbox images={images} initialIndex={lightbox} onClose={() => setLightbox(null)} />
      )}
      <Footer />
    </div>
  );
};

export default ListingDetail;
