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

const adminApi = async (action: string, extra: Record<string, string> = {}) => {
  const password = sessionStorage.getItem("adminPassword") || "";
  const res = await supabase.functions.invoke("admin-api", {
    body: { action, password, ...extra },
  });
  if (res.error) throw new Error(res.error.message);
  if (res.data?.error === "unauthorized") throw new Error("unauthorized");
  return res.data;
};

/* ─── Login Gate ─── */
const AdminLogin = ({ onLogin }: { onLogin: () => void }) => {
  const [pw, setPw] = useState("");
  const [error, setError] = useState("");
  const [shake, setShake] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      sessionStorage.setItem("adminPassword", pw);
      await adminApi("verify");
      sessionStorage.setItem("adminAuth", "true");
      onLogin();
    } catch {
      sessionStorage.removeItem("adminPassword");
      sessionStorage.removeItem("adminAuth");
      setError("পাসওয়ার্ড সঠিক নয়। আবার চেষ্টা করুন।");
      setShake(true);
      setTimeout(() => setShake(false), 600);
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center" style={{ background: "#1a3d2b" }}>
      <form
        onSubmit={handleSubmit}
        className={`bg-white rounded-2xl shadow-2xl p-8 w-full max-w-sm text-center transition-transform ${shake ? "animate-shake" : ""}`}
        style={{ animation: shake ? "shake 0.4s ease-in-out" : undefined }}
      >
        <div className="text-4xl mb-2">🔐</div>
        <h1 className="font-bangla text-xl font-bold text-primary mb-1">অ্যাডমিন লগইন</h1>
        <p className="text-xs text-muted-foreground mb-6">খাগড়াছড়ি কমিউনিটি — অ্যাডমিন প্যানেল</p>
        <input
          type="password"
          value={pw}
          onChange={(e) => setPw(e.target.value)}
          placeholder="পাসওয়ার্ড দিন"
          className="w-full border border-border rounded-xl px-4 py-3 text-sm mb-3 focus:outline-none focus:ring-2 focus:ring-primary"
        />
        {error && <p className="text-red-600 text-xs mb-3">{error}</p>}
        <button
          type="submit"
          disabled={loading || !pw}
          className="w-full py-3 rounded-xl font-semibold text-sm text-white disabled:opacity-50"
          style={{ background: "#1a3d2b" }}
        >
          {loading ? "যাচাই হচ্ছে..." : "প্রবেশ করুন"}
        </button>
      </form>
      <style>{`
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          20%, 60% { transform: translateX(-8px); }
          40%, 80% { transform: translateX(8px); }
        }
        .animate-shake { animation: shake 0.4s ease-in-out; }
      `}</style>
    </div>
  );
};

/* ─── Main Admin ─── */
const Admin = () => {
  const [authed, setAuthed] = useState(false);
  const [tab, setTab] = useState<"pending" | "reported" | "images">("pending");
  const [pendingListings, setPending] = useState<Listing[]>([]);
  const [reportedListings, setReported] = useState<Listing[]>([]);
  const [businesses, setBusinesses] = useState<Business[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (sessionStorage.getItem("adminAuth") === "true" && sessionStorage.getItem("adminPassword")) {
      // Verify stored password is still valid
      adminApi("verify").then(() => setAuthed(true)).catch(() => {
        sessionStorage.removeItem("adminAuth");
        sessionStorage.removeItem("adminPassword");
      });
    }
  }, []);

  useEffect(() => {
    if (authed) fetchData();
  }, [authed]);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [pendRes, repRes, bizRes] = await Promise.all([
        adminApi("pending"),
        adminApi("reported"),
        adminApi("businesses"),
      ]);
      setPending((pendRes?.data || []) as Listing[]);
      setReported((repRes?.data || []) as Listing[]);
      setBusinesses((bizRes?.data || []) as Business[]);
    } catch (err) {
      console.error("Admin fetch error:", err);
    }
    setLoading(false);
  };

  const approveListing = async (listing: Listing) => {
    await adminApi("update_status", { listingId: listing.id, status: "active" });
    const msg = `✅ আপনার বিজ্ঞাপন "${listing.title}" amarkgc.com-এ প্রকাশিত হয়েছে! এখন সবাই দেখতে পাচ্ছে। ধন্যবাদ 🙏`;
    const phone = (listing.whatsapp || listing.phone).replace(/[^0-9]/g, "");
    const waNum = phone.startsWith("880") ? phone : "880" + phone;
    window.open(`https://wa.me/${waNum}?text=${encodeURIComponent(msg)}`, "_blank");
    fetchData();
  };

  const rejectListing = async (listing: Listing) => {
    await adminApi("update_status", { listingId: listing.id, status: "rejected" });
    const msg = `❌ দুঃখিত, আপনার বিজ্ঞাপন "${listing.title}" অনুমোদিত হয়নি। সঠিক তথ্য দিয়ে আবার পোস্ট করতে পারবেন।`;
    const phone = (listing.whatsapp || listing.phone).replace(/[^0-9]/g, "");
    const waNum = phone.startsWith("880") ? phone : "880" + phone;
    window.open(`https://wa.me/${waNum}?text=${encodeURIComponent(msg)}`, "_blank");
    fetchData();
  };

  const hideListing = async (id: string) => {
    await adminApi("update_status", { listingId: id, status: "hidden" });
    fetchData();
  };

  const deleteListing = async (id: string) => {
    await adminApi("delete", { listingId: id });
    fetchData();
  };

  const logout = () => {
    sessionStorage.removeItem("adminAuth");
    sessionStorage.removeItem("adminPassword");
    setAuthed(false);
  };

  if (!authed) return <AdminLogin onLogin={() => setAuthed(true)} />;

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="max-w-[1280px] mx-auto px-4 lg:px-10 py-8">
        <div className="flex items-center justify-between mb-6">
          <h1 className="font-bangla text-2xl lg:text-3xl text-primary">🔧 অ্যাডমিন প্যানেল</h1>
          <div className="flex items-center gap-3">
            <span className="text-xs font-semibold bg-amber-100 text-amber-800 px-3 py-1.5 rounded-full">
              ⏳ পেন্ডিং: {pendingListings.length}টি
            </span>
            <button onClick={logout} className="text-xs font-semibold bg-red-100 text-red-800 px-3 py-1.5 rounded-xl hover:bg-red-200">
              🚪 লগআউট
            </button>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-2 mb-6 flex-wrap">
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

/* ─── Sub-components ─── */

const PendingTab = ({ listings, onApprove, onReject }: { listings: Listing[]; onApprove: (l: Listing) => void; onReject: (l: Listing) => void }) => {
  if (listings.length === 0) return <div className="text-center py-12 bg-card rounded-2xl border border-border text-muted-foreground">কোনো পেন্ডিং বিজ্ঞাপন নেই ✅</div>;

  return (
    <div className="space-y-4">
      {listings.map((l) => (
        <div key={l.id} className="bg-card rounded-2xl border border-border p-4 flex flex-col sm:flex-row gap-4 items-start">
          <div className="w-20 h-20 rounded-xl overflow-hidden flex-shrink-0 bg-muted">
            {l.image_urls?.[0] ? (
              <img src={l.image_urls[0]} alt="" className="w-full h-full object-cover" loading="lazy" />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-2xl">🛒</div>
            )}
          </div>
          <div className="flex-1 min-w-0">
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
        <div key={l.id} className="bg-card rounded-2xl border border-border p-4 flex flex-col sm:flex-row gap-4 items-start">
          <div className="w-20 h-20 rounded-xl overflow-hidden flex-shrink-0 bg-muted">
            {l.image_urls?.[0] ? <img src={l.image_urls[0]} alt="" className="w-full h-full object-cover" loading="lazy" /> : <div className="w-full h-full flex items-center justify-center text-2xl">🛒</div>}
          </div>
          <div className="flex-1 min-w-0">
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
      // Use edge function to update business image (bypasses RLS)
      await adminApi("update_business_image", { listingId: bizId, status: url });
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
              <img src={b.image_url} alt={b.name_bn} className="w-full h-full object-cover" loading="lazy" />
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
