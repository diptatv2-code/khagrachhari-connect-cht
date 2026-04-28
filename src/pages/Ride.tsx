import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

const rideTypes = [
  { id: "CNG", emoji: "🛺", label: "CNG" },
  { id: "Motorcycle", emoji: "🏍️", label: "মোটরসাইকেল" },
  { id: "Jeep/Microbus", emoji: "🚙", label: "জীপ / মাইক্রোবাস" },
  { id: "Car", emoji: "🚗", label: "প্রাইভেট কার" },
] as const;

const popularRoutes = [
  { from: "খাগড়াছড়ি", to: "আলুটিলা", fare: "৳৮০-১২০", vehicle: "CNG", emoji: "🕳️" },
  { from: "খাগড়াছড়ি", to: "দীঘিনালা", fare: "৳১৫০-২০০", vehicle: "CNG", emoji: "🌉" },
  { from: "খাগড়াছড়ি", to: "সাজেক", fare: "৳৫০০০-৭০০০", vehicle: "Jeep", emoji: "☁️" },
  { from: "খাগড়াছড়ি", to: "চট্টগ্রাম", fare: "৳১৫০-২০০", vehicle: "Bus", emoji: "🚌" },
  { from: "খাগড়াছড়ি", to: "ঢাকা", fare: "৳৬০০-১১০০", vehicle: "Bus", emoji: "🚌" },
  { from: "খাগড়াছড়ি", to: "পানছড়ি", fare: "৳১২০-১৫০", vehicle: "CNG", emoji: "🛺" },
];

const transportSchedule = [
  { route: "খাগড়াছড়ি ⇌ ঢাকা", operator: "শ্যামলী, হানিফ, এস আলম", time: "রাত ৮টা, ৯টা, ১০টা", phone: "01711-994411" },
  { route: "খাগড়াছড়ি ⇌ চট্টগ্রাম", operator: "শান্তি, সৌদিয়া, এনা", time: "প্রতি ১ ঘণ্টা পর পর", phone: "01711-994412" },
  { route: "খাগড়াছড়ি ⇌ সাজেক", operator: "জীপ স্ট্যান্ড", time: "এস্কর্ট: ১০টা ও ৩টা", phone: "01711-994413" },
];

const Ride = () => {
  const navigate = useNavigate();
  const [submitting, setSubmitting] = useState(false);
  const [form, setForm] = useState({
    passenger_name: "",
    passenger_phone: "",
    pickup_location: "",
    destination: "",
    ride_type: "CNG" as typeof rideTypes[number]["id"],
    notes: "",
  });

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    const { error } = await supabase.from("ride_requests").insert({ ...form });
    setSubmitting(false);
    if (error) {
      toast.error("রাইড রিকোয়েস্ট পাঠানো যায়নি");
      return;
    }
    toast.success("✅ আপনার রাইড রিকোয়েস্ট পাঠানো হয়েছে! ড্রাইভার শীঘ্রই কল করবে।");
    setForm({ passenger_name: "", passenger_phone: "", pickup_location: "", destination: "", ride_type: "CNG", notes: "" });
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="bg-primary py-5 px-4 lg:px-10">
        <div className="max-w-[1280px] mx-auto flex items-center justify-between gap-4">
          <button onClick={() => navigate("/")} className="text-primary-foreground/80 text-sm font-medium hover:text-primary-foreground">← হোম</button>
          <h1 className="font-bangla text-lg lg:text-2xl text-primary-foreground">🚖 রাইড বুকিং</h1>
          <div className="w-12" />
        </div>
      </div>

      <div className="max-w-[1100px] mx-auto px-4 lg:px-10 py-6 grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Booking form */}
        <div className="bg-card rounded-2xl p-5 border border-border">
          <h2 className="font-bangla text-xl text-primary mb-1">রাইড বুক করুন</h2>
          <p className="text-xs text-muted-foreground mb-4">নিচের ফর্ম পূরণ করুন, ড্রাইভার আপনাকে কল করবে।</p>
          <form onSubmit={submit} className="space-y-3">
            <div>
              <label className="text-xs font-semibold text-primary mb-1 block">কোথা থেকে *</label>
              <input required value={form.pickup_location} onChange={(e) => setForm({ ...form, pickup_location: e.target.value })}
                placeholder="যেমন: চেংগী চত্বর, খাগড়াছড়ি"
                className="w-full border border-border rounded-xl px-3 py-2.5 text-sm bg-background" />
            </div>
            <div>
              <label className="text-xs font-semibold text-primary mb-1 block">কোথায় যাবেন *</label>
              <input required value={form.destination} onChange={(e) => setForm({ ...form, destination: e.target.value })}
                placeholder="যেমন: আলুটিলা গুহা"
                className="w-full border border-border rounded-xl px-3 py-2.5 text-sm bg-background" />
            </div>
            <div>
              <label className="text-xs font-semibold text-primary mb-1 block">যানবাহন *</label>
              <div className="grid grid-cols-2 gap-2">
                {rideTypes.map((r) => (
                  <button type="button" key={r.id} onClick={() => setForm({ ...form, ride_type: r.id })}
                    className={`px-3 py-2 rounded-xl text-sm font-bold border transition-all ${
                      form.ride_type === r.id ? "bg-primary text-primary-foreground border-transparent" : "bg-background border-border text-foreground"
                    }`}>
                    {r.emoji} {r.label}
                  </button>
                ))}
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs font-semibold text-primary mb-1 block">আপনার নাম *</label>
                <input required value={form.passenger_name} onChange={(e) => setForm({ ...form, passenger_name: e.target.value })}
                  className="w-full border border-border rounded-xl px-3 py-2.5 text-sm bg-background" />
              </div>
              <div>
                <label className="text-xs font-semibold text-primary mb-1 block">মোবাইল *</label>
                <input required type="tel" value={form.passenger_phone} onChange={(e) => setForm({ ...form, passenger_phone: e.target.value })}
                  className="w-full border border-border rounded-xl px-3 py-2.5 text-sm bg-background" />
              </div>
            </div>
            <div>
              <label className="text-xs font-semibold text-primary mb-1 block">অতিরিক্ত নোট</label>
              <textarea rows={2} value={form.notes} onChange={(e) => setForm({ ...form, notes: e.target.value })}
                className="w-full border border-border rounded-xl px-3 py-2.5 text-sm bg-background resize-none" />
            </div>
            <button type="submit" disabled={submitting}
              className="w-full bg-primary text-primary-foreground py-3 rounded-xl text-sm font-bold disabled:opacity-50">
              {submitting ? "পাঠানো হচ্ছে..." : "🚖 রাইড রিকোয়েস্ট পাঠান"}
            </button>
          </form>
        </div>

        {/* Popular routes & schedule */}
        <div className="space-y-4">
          <div className="bg-card rounded-2xl p-5 border border-border">
            <h2 className="font-bangla text-xl text-primary mb-3">জনপ্রিয় রুট ও আনুমানিক ভাড়া</h2>
            <div className="space-y-2">
              {popularRoutes.map((r, i) => (
                <div key={i} className="flex items-center justify-between gap-3 bg-muted rounded-xl p-3 text-sm">
                  <div className="flex items-center gap-2 flex-1 min-w-0">
                    <span className="text-xl">{r.emoji}</span>
                    <div className="min-w-0">
                      <div className="font-semibold text-foreground truncate">{r.from} → {r.to}</div>
                      <div className="text-[11px] text-muted-foreground">{r.vehicle}</div>
                    </div>
                  </div>
                  <span className="text-primary font-bold whitespace-nowrap">{r.fare}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-card rounded-2xl p-5 border border-border">
            <h2 className="font-bangla text-xl text-primary mb-3">পরিবহন সময়সূচী</h2>
            <div className="space-y-2">
              {transportSchedule.map((s, i) => (
                <div key={i} className="bg-muted rounded-xl p-3 text-sm">
                  <div className="font-bold text-primary">{s.route}</div>
                  <div className="text-xs text-muted-foreground mt-0.5">{s.operator}</div>
                  <div className="text-xs text-muted-foreground">⏰ {s.time}</div>
                  <a href={`tel:${s.phone.replace(/[^0-9]/g, "")}`} className="text-xs text-primary font-semibold mt-1 inline-block">📞 {s.phone}</a>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Ride;
