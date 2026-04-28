import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ChatBot from "@/components/ChatBot";
import { supabase } from "@/integrations/supabase/client";

interface Doctor {
  id?: string;
  name: string;
  specialty: string;
  specialty_key: string | null;
  hospital: string | null;
  upazila: string | null;
  phone: string | null;
  experience_years: number | null;
  rating: number | null;
  note?: string | null;
}

const fallbackDoctors: Doctor[] = [
  { name: "ডা. মো. শাহ আলম", specialty: "সাধারণ চিকিৎসা", specialty_key: "সাধারণ", hospital: "খাগড়াছড়ি সদর হাসপাতাল", upazila: "খাগড়াছড়ি সদর", phone: "01711-223344", experience_years: 12, rating: 4.8 },
  { name: "ডা. রিপল বাপ্পি চাকমা", specialty: "সাধারণ চিকিৎসা", specialty_key: "সাধারণ", hospital: "খাগড়াছড়ি সদর হাসপাতাল", upazila: "খাগড়াছড়ি সদর", phone: "01716-802488", experience_years: 5, rating: 4.6 },
  { name: "ডা. মিল্টন বড়ুয়া", specialty: "সাধারণ চিকিৎসা", specialty_key: "সাধারণ", hospital: "প্রাইভেট চেম্বার", upazila: "খাগড়াছড়ি সদর", phone: "01911-771116", experience_years: 15, rating: 4.9 },
  { name: "ডা. পূর্ণ জীবন চাকমা", specialty: "সাধারণ চিকিৎসা", specialty_key: "সাধারণ", hospital: "প্রাইভেট চেম্বার", upazila: "খাগড়াছড়ি সদর", phone: "01926-005043", experience_years: 10, rating: 4.8 },
  { name: "ডা. করাইশী", specialty: "সাধারণ চিকিৎসা", specialty_key: "সাধারণ", hospital: "প্রাইভেট চেম্বার", upazila: "খাগড়াছড়ি সদর", phone: "01814-388489", experience_years: 8, rating: 4.7 },
  { name: "ডা. অনুতোষ চাকমা", specialty: "সাধারণ চিকিৎসা", specialty_key: "সাধারণ", hospital: "পানছড়ি উপজেলা স্বাস্থ্য কমপ্লেক্স", upazila: "পানছড়ি", phone: "01553457605", experience_years: 6, rating: 4.5 },
  { name: "ডা. সুমন চাকমা", specialty: "সাধারণ চিকিৎসা", specialty_key: "সাধারণ", hospital: "প্রাইভেট চেম্বার", upazila: "খাগড়াছড়ি সদর", phone: "01748-851318", experience_years: 7, rating: 4.6 },
  { name: "ডা. বিজন চন্দ্র তালুকদার", specialty: "সাধারণ চিকিৎসা", specialty_key: "সাধারণ", hospital: "পার্কহিল ক্লিনিক", upazila: "খাগড়াছড়ি সদর", phone: "01715-678901", experience_years: 14, rating: 4.9, note: "লিভার ও গ্যাস্ট্রোএন্টারোলজি" },
  { name: "ডা. সংগীতা চাকমা", specialty: "সাধারণ চিকিৎসা", specialty_key: "সাধারণ", hospital: "খাগড়াছড়ি স্কিন কেয়ার সেন্টার", upazila: "খাগড়াছড়ি সদর", phone: "01823-456789", experience_years: 8, rating: 4.7, note: "চর্ম রোগ" },
  { name: "ডা. জয়া চাকমা", specialty: "গাইনি বিশেষজ্ঞ", specialty_key: "গাইনি", hospital: "দীঘিনালা উপজেলা স্বাস্থ্য কমপ্লেক্স", upazila: "দীঘিনালা", phone: "01556-565202", experience_years: 11, rating: 4.9 },
  { name: "ডা. অশুতোষ চাকমা", specialty: "গাইনি বিশেষজ্ঞ", specialty_key: "গাইনি", hospital: "প্রাইভেট চেম্বার", upazila: "খাগড়াছড়ি সদর", phone: "01556-771746", experience_years: 9, rating: 4.7 },
  { name: "ডা. রোশন আরা বেগম", specialty: "গাইনি বিশেষজ্ঞ", specialty_key: "গাইনি", hospital: "খাগড়াছড়ি মহিলা হাসপাতাল", upazila: "খাগড়াছড়ি সদর", phone: "01713-453244", experience_years: 10, rating: 4.8 },
  { name: "ডা. রাজেন্দ্র ত্রিপুরা", specialty: "শিশু রোগ বিশেষজ্ঞ", specialty_key: "শিশু", hospital: "প্রাইভেট চেম্বার", upazila: "খাগড়াছড়ি সদর", phone: "01557-381966", experience_years: 14, rating: 4.9 },
  { name: "ডা. ওমর ফারুক", specialty: "শিশু রোগ বিশেষজ্ঞ", specialty_key: "শিশু", hospital: "মাটিরাঙ্গা উপজেলা স্বাস্থ্য কমপ্লেক্স", upazila: "মাটিরাঙ্গা", phone: "01823-105034", experience_years: 8, rating: 4.7 },
  { name: "ডা. সমাদ", specialty: "শিশু রোগ বিশেষজ্ঞ", specialty_key: "শিশু", hospital: "প্রাইভেট চেম্বার", upazila: "খাগড়াছড়ি সদর", phone: "01711-134674", experience_years: 7, rating: 4.6 },
  { name: "ডা. তুতুল চাকমা", specialty: "সার্জারি বিশেষজ্ঞ", specialty_key: "সার্জারি", hospital: "খাগড়াছড়ি সদর হাসপাতাল", upazila: "খাগড়াছড়ি সদর", phone: "01557-198040", experience_years: 13, rating: 4.8, note: "BMA General Secretary" },
  { name: "ডা. দিগন্ত চাকমা", specialty: "সার্জারি বিশেষজ্ঞ", specialty_key: "সার্জারি", hospital: "প্রাইভেট চেম্বার", upazila: "খাগড়াছড়ি সদর", phone: "01760-376056", experience_years: 9, rating: 4.7 },
  { name: "ডা. নয়ন ময় ত্রিপুরা", specialty: "অর্থোপেডিক বিশেষজ্ঞ", specialty_key: "অর্থোপেডিক", hospital: "প্রাইভেট চেম্বার", upazila: "খাগড়াছড়ি সদর", phone: "01814-160039", experience_years: 12, rating: 4.9, note: "অর্থোপেডিক ও পেডিয়াট্রিক ট্রমা সার্জন" },
  { name: "ডা. শুভল জ্যোতি চাকমা", specialty: "অর্থোপেডিক বিশেষজ্ঞ", specialty_key: "অর্থোপেডিক", hospital: "প্রাইভেট চেম্বার", upazila: "খাগড়াছড়ি সদর", phone: "01818-233381", experience_years: 11, rating: 4.8, note: "অর্থোপেডিক ও প্লাস্টিক সার্জন" },
  { name: "ডা. মিটন চাকমা", specialty: "নাক-কান-গলা বিশেষজ্ঞ", specialty_key: "নাক-কান-গলা", hospital: "খাগড়াছড়ি সদর হাসপাতাল", upazila: "খাগড়াছড়ি সদর", phone: "01715-298247", experience_years: 12, rating: 4.8, note: "Head Neck Surgeon, Deputy Civil Surgeon" },
  { name: "ডা. আলাউদ্দিন", specialty: "চক্ষু বিশেষজ্ঞ", specialty_key: "চক্ষু", hospital: "প্রাইভেট চেম্বার", upazila: "খাগড়াছড়ি সদর", phone: "01816-237970", experience_years: 10, rating: 4.7 },
  { name: "ডা. রতন খিসা", specialty: "চক্ষু বিশেষজ্ঞ", specialty_key: "চক্ষু", hospital: "প্রাইভেট চেম্বার", upazila: "খাগড়াছড়ি সদর", phone: "01819-724807", experience_years: 7, rating: 4.6 },
  { name: "ডা. সুপর্ণা খিসা", specialty: "দাঁতের চিকিৎসা", specialty_key: "দাঁত", hospital: "প্রাইভেট চেম্বার", upazila: "খাগড়াছড়ি সদর", phone: "01553-493603", experience_years: 9, rating: 4.8 },
  { name: "ডা. মৃদুল কান্তি ত্রিপুরা", specialty: "দাঁতের চিকিৎসা", specialty_key: "দাঁত", hospital: "প্রাইভেট চেম্বার", upazila: "খাগড়াছড়ি সদর", phone: "01553-322249", experience_years: 8, rating: 4.7 },
  { name: "ডা. নিউটন চাকমা", specialty: "দাঁতের চিকিৎসা", specialty_key: "দাঁত", hospital: "প্রাইভেট চেম্বার", upazila: "খাগড়াছড়ি সদর", phone: "01830-579121", experience_years: 6, rating: 4.6 },
];

const specialties = [
  { id: "সব", emoji: "" },
  { id: "সাধারণ", emoji: "🩺" },
  { id: "গাইনি", emoji: "🤰" },
  { id: "শিশু", emoji: "👶" },
  { id: "সার্জারি", emoji: "🔪" },
  { id: "অর্থোপেডিক", emoji: "🦴" },
  { id: "নাক-কান-গলা", emoji: "👂" },
  { id: "চক্ষু", emoji: "👁️" },
  { id: "দাঁত", emoji: "🦷" },
];

const upazilas = ["সব", "খাগড়াছড়ি সদর", "দীঘিনালা", "পানছড়ি", "মাটিরাঙ্গা"];

const specialtyColors: Record<string, string> = {
  সাধারণ: "bg-green-100 text-green-800",
  গাইনি: "bg-pink-100 text-pink-800",
  শিশু: "bg-blue-100 text-blue-800",
  সার্জারি: "bg-red-100 text-red-800",
  অর্থোপেডিক: "bg-orange-100 text-orange-800",
  "নাক-কান-গলা": "bg-purple-100 text-purple-800",
  চক্ষু: "bg-teal-100 text-teal-800",
  দাঁত: "bg-yellow-100 text-yellow-800",
};

const Doctors = () => {
  const navigate = useNavigate();
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [loading, setLoading] = useState(true);
  const [specFilter, setSpecFilter] = useState("সব");
  const [upazilaFilter, setUpazilaFilter] = useState("সব");
  const [search, setSearch] = useState("");
  const [active, setActive] = useState<Doctor | null>(null);

  useEffect(() => {
    (async () => {
      setLoading(true);
      const { data, error } = await supabase
        .from("doctors")
        .select("*")
        .eq("is_active", true)
        .order("rating", { ascending: false });
      if (error || !data || data.length === 0) {
        setDoctors(fallbackDoctors);
      } else {
        setDoctors(data as Doctor[]);
      }
      setLoading(false);
    })();
  }, []);

  const filtered = useMemo(() => {
    return doctors.filter((d) => {
      if (specFilter !== "সব" && d.specialty_key !== specFilter) return false;
      if (upazilaFilter !== "সব" && d.upazila !== upazilaFilter) return false;
      if (search) {
        const q = search.toLowerCase();
        if (!d.name.toLowerCase().includes(q) && !(d.hospital ?? "").toLowerCase().includes(q)) return false;
      }
      return true;
    });
  }, [doctors, specFilter, upazilaFilter, search]);

  const getInitials = (name: string) => {
    const parts = name.replace(/ডা\.\s*/, "").split(" ");
    return parts.length > 1 ? parts[0][0] + parts[parts.length - 1][0] : name.slice(0, 2);
  };

  const makeWaUrl = (phone: string) => {
    const num = phone.replace(/[^0-9]/g, "");
    const intl = num.startsWith("880") ? num : "880" + num;
    return `https://wa.me/${intl}`;
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <div className="bg-red-900 text-white py-3">
        <div className="max-w-[1280px] mx-auto px-4 lg:px-10 flex flex-wrap items-center justify-center gap-4 lg:gap-8 text-xs lg:text-sm font-semibold">
          <a href="tel:09611530530" className="flex items-center gap-1.5 hover:opacity-80">🚑 ডাক্তার হটলাইন: <span className="font-mono">09611-530530</span></a>
          <a href="tel:01730324772" className="flex items-center gap-1.5 hover:opacity-80">🏥 সদর হাসপাতাল: <span className="font-mono">01730-324772</span></a>
          <a href="tel:01635600835" className="flex items-center gap-1.5 hover:opacity-80">🚑 এম্বুলেন্স: <span className="font-mono">01635-600835</span></a>
        </div>
      </div>

      <div className="bg-gradient-to-r from-primary to-[hsl(var(--green-mid))] py-6">
        <div className="max-w-[1280px] mx-auto px-4 lg:px-10 flex flex-col lg:flex-row items-center justify-between gap-4">
          <div className="text-primary-foreground text-center lg:text-left">
            <p className="text-sm lg:text-base font-semibold">🤖 কোন ডাক্তার দেখাবেন বুঝতে পারছেন না?</p>
            <p className="text-xs lg:text-sm opacity-80 mt-1">আমাদের AI সহকারীকে আপনার সমস্যা বলুন — সঠিক ডাক্তার খুঁজে পেতে সাহায্য করবে</p>
          </div>
          <button
            onClick={() => navigate("/")}
            className="bg-secondary text-primary font-bold px-5 py-2.5 rounded-xl text-sm hover:opacity-90 transition-opacity whitespace-nowrap"
          >
            AI-এর সাথে কথা বলুন →
          </button>
        </div>
      </div>

      <div className="max-w-[1280px] mx-auto px-4 lg:px-10 py-6">
        <h1 className="font-bangla text-2xl lg:text-3xl text-primary mb-2">👨‍⚕️ ডাক্তার তালিকা — খাগড়াছড়ি</h1>
        <p className="text-sm text-muted-foreground mb-4">মোট {doctors.length} জন বিশেষজ্ঞ ডাক্তারের তথ্য ও যোগাযোগ</p>

        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="ডাক্তারের নাম বা হাসপাতাল খুঁজুন..."
          className="w-full bg-card border border-border rounded-xl px-4 py-3 text-sm mb-4 focus:outline-none focus:ring-2 focus:ring-primary/30"
        />

        <div className="flex gap-2 overflow-x-auto scrollbar-hide pb-3">
          {specialties.map((s) => (
            <button
              key={s.id}
              onClick={() => setSpecFilter(s.id)}
              className={`whitespace-nowrap text-xs font-semibold px-3.5 py-2 rounded-full border transition-all ${
                specFilter === s.id
                  ? "bg-primary text-primary-foreground border-transparent"
                  : "bg-card text-primary border-border hover:border-primary/30"
              }`}
            >
              {s.emoji} {s.id}
            </button>
          ))}
        </div>

        <div className="flex gap-2 overflow-x-auto scrollbar-hide pb-4 mt-2">
          {upazilas.map((u) => (
            <button
              key={u}
              onClick={() => setUpazilaFilter(u)}
              className={`whitespace-nowrap text-[11px] font-semibold px-3 py-1.5 rounded-full border transition-all ${
                upazilaFilter === u
                  ? "bg-secondary text-primary border-transparent"
                  : "bg-card text-muted-foreground border-border hover:border-secondary/30"
              }`}
            >
              📍 {u}
            </button>
          ))}
        </div>

        <p className="text-xs text-muted-foreground mb-4">ফলাফল: {filtered.length} জন ডাক্তার</p>

        {loading ? (
          <div className="text-center py-12 text-muted-foreground text-sm">লোড হচ্ছে...</div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {filtered.map((doc, i) => {
              const colorCls = specialtyColors[doc.specialty_key ?? ""] || "bg-green-100 text-green-800";
              return (
                <div key={doc.id ?? i} className="bg-card rounded-2xl border border-border p-4 hover:shadow-md transition-shadow">
                  <div className="flex items-start gap-3.5">
                    <div className="w-14 h-14 rounded-full bg-primary/10 flex items-center justify-center text-lg font-bold text-primary flex-shrink-0">
                      {getInitials(doc.name)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="text-base font-bold text-primary">{doc.name}</h3>
                      <span className={`inline-block text-[10px] font-bold px-2 py-0.5 rounded-full mt-1 ${colorCls}`}>
                        {doc.specialty}
                      </span>
                      <div className="mt-2 space-y-1 text-xs text-muted-foreground">
                        <div>🏥 {doc.hospital}</div>
                        <div>📍 {doc.upazila}</div>
                        {doc.experience_years != null && <div>⏳ {doc.experience_years} বছরের অভিজ্ঞতা</div>}
                        {doc.rating != null && <div>⭐ {doc.rating}/৫</div>}
                        {doc.note && <div className="italic text-primary/70">💡 {doc.note}</div>}
                      </div>
                    </div>
                  </div>
                  <div className="flex gap-2 mt-3 pt-3 border-t border-border">
                    <button onClick={() => setActive(doc)}
                      className="flex-1 py-2 rounded-lg text-[11px] font-semibold flex items-center justify-center gap-1 bg-amber-50 text-amber-800 hover:bg-amber-100 transition-colors">
                      📅 অ্যাপয়েন্টমেন্ট
                    </button>
                    {doc.phone && (
                      <a href={`tel:${doc.phone.replace(/[^0-9]/g, "")}`}
                        className="flex-1 py-2 rounded-lg text-[11px] font-semibold flex items-center justify-center gap-1 bg-blue-50 text-blue-800 hover:bg-blue-100 transition-colors">
                        📞 ফোন করুন
                      </a>
                    )}
                    {doc.phone && (
                      <a href={makeWaUrl(doc.phone)} target="_blank" rel="noopener noreferrer"
                        className="flex-1 py-2 rounded-lg text-[11px] font-semibold flex items-center justify-center gap-1 text-white transition-opacity hover:opacity-90"
                        style={{ background: "#25d366" }}>
                        💬 WhatsApp
                      </a>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {active && (
        <div className="fixed inset-0 z-[300] bg-black/60 flex items-end lg:items-center justify-center p-0 lg:p-4" onClick={() => setActive(null)}>
          <div onClick={(e) => e.stopPropagation()} className="bg-card w-full lg:max-w-[480px] rounded-t-3xl lg:rounded-2xl p-5">
            <div className="flex items-center justify-between mb-3">
              <h2 className="font-bangla text-lg text-primary">{active.name}</h2>
              <button onClick={() => setActive(null)} className="text-muted-foreground text-lg">✕</button>
            </div>
            <p className="text-sm text-muted-foreground mb-3">অ্যাপয়েন্টমেন্ট নিতে নিচের নম্বরে কল বা WhatsApp করুন:</p>
            <div className="bg-muted rounded-xl p-3 text-sm space-y-1 mb-4">
              <div>🏥 {active.hospital}</div>
              <div>📍 {active.upazila}</div>
              <div>📞 <strong className="font-mono">{active.phone}</strong></div>
            </div>
            <div className="flex gap-2">
              {active.phone && (
                <>
                  <a href={`tel:${active.phone.replace(/[^0-9]/g, "")}`}
                    className="flex-1 py-3 rounded-xl bg-primary text-primary-foreground text-sm font-bold text-center">
                    📞 ফোন করুন
                  </a>
                  <a href={makeWaUrl(active.phone)} target="_blank" rel="noopener noreferrer"
                    className="flex-1 py-3 rounded-xl text-white text-sm font-bold text-center" style={{ background: "#25d366" }}>
                    💬 WhatsApp
                  </a>
                </>
              )}
            </div>
          </div>
        </div>
      )}

      <Footer />
      <ChatBot />
    </div>
  );
};

export default Doctors;
