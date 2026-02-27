import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ChatBot from "@/components/ChatBot";

interface Doctor {
  name: string;
  specialty: string;
  specialtyKey: string;
  hospital: string;
  upazila: string;
  phone: string;
  experience: string;
  rating: string;
  note?: string;
}

// Placeholder: will be populated with real data from user's doctor file
const doctors: Doctor[] = [
  // User needs to re-upload the khagrachhari-doctors-list.txt file
  // Placeholder entries so the page renders
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
  const [specFilter, setSpecFilter] = useState("সব");
  const [upazilaFilter, setUpazilaFilter] = useState("সব");
  const navigate = useNavigate();

  const filtered = doctors.filter((d) => {
    if (specFilter !== "সব" && d.specialtyKey !== specFilter) return false;
    if (upazilaFilter !== "সব" && d.upazila !== upazilaFilter) return false;
    return true;
  });

  const getInitials = (name: string) => {
    const parts = name.split(" ");
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

      {/* Emergency Bar */}
      <div className="bg-red-900 text-white py-3">
        <div className="max-w-[1280px] mx-auto px-4 lg:px-10 flex flex-wrap items-center justify-center gap-4 lg:gap-8 text-xs lg:text-sm font-semibold">
          <a href="tel:09611530530" className="flex items-center gap-1.5 hover:opacity-80">🚑 ডাক্তার হটলাইন: <span className="font-mono">09611-530530</span></a>
          <a href="tel:01730324772" className="flex items-center gap-1.5 hover:opacity-80">🏥 সদর হাসপাতাল: <span className="font-mono">01730-324772</span></a>
          <a href="tel:01635600835" className="flex items-center gap-1.5 hover:opacity-80">🚑 এম্বুলেন্স: <span className="font-mono">01635-600835</span></a>
        </div>
      </div>

      {/* AI Guidance Banner */}
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
        <h1 className="font-bangla text-2xl lg:text-3xl text-primary mb-2">👨‍⚕️ ডাক্তার তালিকা</h1>
        <p className="text-sm text-muted-foreground mb-6">খাগড়াছড়ির বিশেষজ্ঞ ডাক্তারদের তথ্য ও যোগাযোগ</p>

        {/* Specialty Filter */}
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

        {/* Upazila Filter */}
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

        {/* Doctor Cards */}
        {filtered.length === 0 ? (
          <div className="text-center py-16 bg-card rounded-2xl border border-border">
            <div className="text-5xl mb-3">👨‍⚕️</div>
            <p className="text-muted-foreground text-sm">ডাক্তারের তথ্য শীঘ্রই যোগ করা হবে।</p>
            <p className="text-xs text-muted-foreground mt-2">অনুগ্রহ করে ডাক্তারের তালিকা ফাইলটি আবার আপলোড করুন।</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {filtered.map((doc, i) => {
              const colorCls = specialtyColors[doc.specialtyKey] || "bg-green-100 text-green-800";
              return (
                <div key={i} className="bg-card rounded-2xl border border-border p-4 hover:shadow-md transition-shadow">
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
                        <div>⏳ {doc.experience} বছরের অভিজ্ঞতা</div>
                        <div>⭐ {doc.rating}/৫</div>
                        {doc.note && <div className="italic text-primary/70">💡 {doc.note}</div>}
                      </div>
                    </div>
                  </div>
                  <div className="flex gap-2 mt-3 pt-3 border-t border-border">
                    <a
                      href={`tel:${doc.phone}`}
                      className="flex-1 py-2 rounded-lg text-[11px] font-semibold flex items-center justify-center gap-1 bg-blue-50 text-blue-800 hover:bg-blue-100 transition-colors"
                    >
                      📞 ফোন করুন
                    </a>
                    <a
                      href={makeWaUrl(doc.phone)}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex-1 py-2 rounded-lg text-[11px] font-semibold flex items-center justify-center gap-1 text-white transition-opacity hover:opacity-90"
                      style={{ background: "#25d366" }}
                    >
                      💬 WhatsApp
                    </a>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      <Footer />
    </div>
  );
};

export default Doctors;
