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
  report_count: number;
  created_at: string;
}

interface Business {
  id: string;
  name_bn: string;
  category: string;
  image_url: string | null;
}

const ADMIN_WA = "8801891656488";

const Admin = () => {
  const [tab, setTab] = useState<"pending" | "reported" | "images">("pending");
  const [pendingListings, setPending] = useState<Listing[]>([]);
  const [reportedListings, setReported] = useState<Listing[]>([]);
  const [businesses, setBusinesses] = useState<Business[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    // Fetch all listings (bypass RLS by fetching all statuses - admin reads all)
    const [pendRes, repRes, bizRes] = await Promise.all([
      supabase.from("marketplace_listings").select("*").eq("status", "pending").order("created_at", { ascending: false }),
      supabase.from("marketplace_listings").select("*").gt("report_count", 0).order("report_count", { ascending: false }),
      supabase.from("businesses").select("id, name_bn, category, image_url").order("name_bn"),
    ]);
    if (pendRes.data) setPending(pendRes.data as unknown as Listing[]);
    if (repRes.data) setReported(repRes.data as unknown as Listing[]);
    if (bizRes.data) setBusinesses(bizRes.data as unknown as Business[]);
    setLoading(false);
  };

  const approveListing = async (listing: Listing) => {
    await supabase.from("marketplace_listings").update({ status: "active" }).eq("id", listing.id);
    const msg = `✅ আপনার বিজ্ঞাপন "${listing.title}" amarkgc.com-এ প্রকাশিত হয়েছে! এখন সবাই দেখতে পাচ্ছে। ধন্যবাদ 🙏`;
    const phone = (listing.whatsapp || listing.phone).replace(/[^0-9]/g, "");
    const waNum = phone.startsWith("880") ? phone : "880" + phone;
    window.open(`https://wa.me/${waNum}?text=${encodeURIComponent(msg)}`, "_blank");
    fetchData();
  };

  const rejectListing = async (listing: Listing) => {
    await supabase.from("marketplace_listings").update({ status: "rejected" }).eq("id", listing.id);
    const msg = `❌ দুঃখিত, আপনার বিজ্ঞাপন "${listing.title}" অনুমোদিত হয়নি। সঠিক তথ্য দিয়ে আবার পোস্ট করতে পারবেন।`;
    const phone = (listing.whatsapp || listing.phone).replace(/[^0-9]/g, "");
    const waNum = phone.startsWith("880") ? phone : "880" + phone;
    window.open(`https://wa.me/${waNum}?text=${encodeURIComponent(msg)}`, "_blank");
    fetchData();
  };

  const hideListing = async (id: string) => {
    await supabase.from("marketplace_listings").update({ status: "hidden" }).eq("id", id);
    fetchData();
  };

  const deleteListing = async (id: string) => {
    await supabase.from("marketplace_listings").delete().eq("id", id);
    fetchData();
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="max-w-[1280px] mx-auto px-4 lg:px-10 py-8">
        <h1 className="font-bangla text-2xl lg:text-3xl text-primary mb-6">🔧 অ্যাডমিন প্যানেল</h1>

        {/* Tabs */}
        <div className="flex gap-2 mb-6">
          {[
            { id: "pending" as const, label: "🛒 মার্কেটপ্লেস অনুমোদন", count: pendingListings.length },
            { id: "reported" as const, label: "🚩 রিপোর্টেড পোস্ট", count: reportedListings.length },
            { id: "images" as const, label: "📷 ব্যবসার ছবি আপলোড", count: 0 },
          ].map((t) => (
            <button
              key={t.id}
              onClick={() => setTab(t.id)}
              className={`text-xs font-semibold px-4 py-2.5 rounded-xl transition-all ${
                tab === t.id ? "bg-primary text-primary-foreground" : "bg-card border border-border text-primary"
              }`}
            >
              {t.label} {t.count > 0 && <span className="ml-1 bg-red-500 text-white text-[10px] px-1.5 py-0.5 rounded-full">{t.count}</span>}
            </button>
          ))}
        </div>

        {loading ? (
          <div className="text-center py-12 text-muted-foreground">লোড হচ্ছে...</div>
        ) : tab === "pending" ? (
          <PendingTab listings={pendingListings} onApprove={approveListing} onReject={rejectListing} />
        ) : tab === "reported" ? (
          <ReportedTab listings={reportedListings} onHide={hideListing} onDelete={deleteListing} onKeep={fetchData} />
        ) : (
          <ImageUploadTab businesses={businesses} onUpdated={fetchData} />
        )}
      </div>
      <Footer />
    </div>
  );
};

const PendingTab = ({ listings, onApprove, onReject }: { listings: Listing[]; onApprove: (l: Listing) => void; onReject: (l: Listing) => void }) => {
  if (listings.length === 0) return <div className="text-center py-12 bg-card rounded-2xl border border-border text-muted-foreground">কোনো পেন্ডিং বিজ্ঞাপন নেই ✅</div>;
  
  return (
    <div className="space-y-4">
      {listings.map((l) => (
        <div key={l.id} className="bg-card rounded-2xl border border-border p-4 flex gap-4 items-start">
          <div className="w-20 h-20 rounded-xl overflow-hidden flex-shrink-0 bg-muted">
            {l.image_urls?.[0] ? (
              <img src={l.image_urls[0]} alt="" className="w-full h-full object-cover" />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-2xl">🛒</div>
            )}
          </div>
          <div className="flex-1">
            <h3 className="text-sm font-bold text-primary">{l.title}</h3>
            <p className="text-xs text-muted-foreground">{l.category} • ৳{l.price} • {l.location}</p>
            <p className="text-xs text-muted-foreground">📞 {l.phone} • {l.seller_name || "—"}</p>
            <p className="text-[10px] text-muted-foreground mt-1">{new Date(l.created_at).toLocaleString("bn-BD")}</p>
          </div>
          <div className="flex gap-2 flex-shrink-0">
            <button onClick={() => onApprove(l)} className="text-xs font-semibold bg-green-100 text-green-800 px-3 py-2 rounded-xl hover:bg-green-200">✅ অনুমোদন</button>
            <button onClick={() => onReject(l)} className="text-xs font-semibold bg-red-100 text-red-800 px-3 py-2 rounded-xl hover:bg-red-200">❌ বাতিল</button>
          </div>
        </div>
      ))}
    </div>
  );
};

const ReportedTab = ({ listings, onHide, onDelete, onKeep }: { listings: Listing[]; onHide: (id: string) => void; onDelete: (id: string) => void; onKeep: () => void }) => {
  if (listings.length === 0) return <div className="text-center py-12 bg-card rounded-2xl border border-border text-muted-foreground">কোনো রিপোর্ট নেই ✅</div>;
  
  return (
    <div className="space-y-4">
      {listings.map((l) => (
        <div key={l.id} className="bg-card rounded-2xl border border-border p-4 flex gap-4 items-start">
          <div className="w-20 h-20 rounded-xl overflow-hidden flex-shrink-0 bg-muted">
            {l.image_urls?.[0] ? <img src={l.image_urls[0]} alt="" className="w-full h-full object-cover" /> : <div className="w-full h-full flex items-center justify-center text-2xl">🛒</div>}
          </div>
          <div className="flex-1">
            <h3 className="text-sm font-bold text-primary">{l.title}</h3>
            <p className="text-xs text-muted-foreground">{l.category} • রিপোর্ট: <span className="text-red-600 font-bold">{l.report_count}</span></p>
          </div>
          <div className="flex gap-2 flex-shrink-0">
            <button onClick={onKeep} className="text-xs font-semibold bg-green-100 text-green-800 px-3 py-2 rounded-xl">রাখুন</button>
            <button onClick={() => onHide(l.id)} className="text-xs font-semibold bg-amber-100 text-amber-800 px-3 py-2 rounded-xl">লুকান</button>
            <button onClick={() => onDelete(l.id)} className="text-xs font-semibold bg-red-100 text-red-800 px-3 py-2 rounded-xl">মুছুন</button>
          </div>
        </div>
      ))}
    </div>
  );
};

const ImageUploadTab = ({ businesses, onUpdated }: { businesses: Business[]; onUpdated: () => void }) => {
  const [uploading, setUploading] = useState<string | null>(null);
  const [progress, setProgress] = useState(0);

  const handleUpload = async (bizId: string, file: File) => {
    setUploading(bizId);
    setProgress(0);
    try {
      const { url } = await uploadToCloudinary(file, setProgress);
      await supabase.from("businesses").update({ image_url: url }).eq("id", bizId);
      alert("ছবি সফলভাবে আপলোড হয়েছে ✅");
      onUpdated();
    } catch (err: any) {
      alert(err.message);
    }
    setUploading(null);
  };

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      {businesses.map((b) => (
        <div key={b.id} className="bg-card rounded-2xl border border-border p-4">
          <div className="h-24 rounded-xl overflow-hidden mb-3 bg-muted flex items-center justify-center">
            {b.image_url ? (
              <img src={b.image_url} alt={b.name_bn} className="w-full h-full object-cover" />
            ) : (
              <span className="text-3xl opacity-40">📷</span>
            )}
          </div>
          <h3 className="text-sm font-bold text-primary mb-1">{b.name_bn}</h3>
          <p className="text-[10px] text-muted-foreground mb-3">{b.category}</p>
          
          {uploading === b.id ? (
            <div className="space-y-1">
              <div className="text-xs text-primary">আপলোড হচ্ছে... {progress}%</div>
              <div className="w-full bg-muted rounded-full h-1.5">
                <div className="bg-secondary h-1.5 rounded-full transition-all" style={{ width: `${progress}%` }} />
              </div>
            </div>
          ) : (
            <label className="block w-full text-center py-2 rounded-xl text-xs font-semibold bg-primary text-primary-foreground cursor-pointer hover:opacity-90">
              📷 ছবি আপলোড করুন
              <input type="file" accept="image/*" className="hidden" onChange={(e) => e.target.files?.[0] && handleUpload(b.id, e.target.files[0])} />
            </label>
          )}
        </div>
      ))}
    </div>
  );
};

export default Admin;
