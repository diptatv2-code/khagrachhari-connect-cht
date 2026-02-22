const services = [
  {
    icon: "💊",
    title: "ওষুধ ডেলিভারি",
    desc: "স্থানীয় ফার্মেসি থেকে ওষুধ সরাসরি আপনার দরজায়। প্রেসক্রিপশন ছবি তুলে পাঠান, আমরা বাকি কাজ করব।",
    action: "অর্ডার করুন →",
    bgClass: "bg-gradient-to-br from-forest-light/60 to-primary/80",
    pattern: "💊",
    mobileBg: "bg-gradient-to-br from-primary to-forest-light",
    mobileLabel: "ওষুধ ডেলিভারি",
    mobileSub: "স্থানীয় ফার্মেসি থেকে",
    badgeText: "✓ লাইভ",
  },
  {
    icon: "🛒",
    title: "মুদিখানা বাজার",
    desc: "চাল, ডাল, তেল থেকে শুরু করে সব নিত্যপ্রয়োজনীয় পণ্য। স্থানীয় দোকান থেকে সংগ্রহ করে ডেলিভারি।",
    action: "বাজার করুন →",
    bgClass: "bg-gradient-to-br from-earth/60 to-secondary/40",
    pattern: "🛒",
    mobileBg: "bg-gradient-to-br from-earth to-secondary",
    mobileLabel: "মুদিখানা",
    mobileSub: "বাজার ডেলিভারি",
  },
  {
    icon: "🏪",
    title: "ব্যবসা ডিরেক্টরি",
    desc: "খাগড়াছড়ির সব ধরনের ব্যবসা এক জায়গায়। দোকান, ক্লিনিক, ব্যাংক, স্কুল সব খুঁজে পাবেন এখানে।",
    action: "খুঁজুন →",
    bgClass: "bg-gradient-to-br from-purple-900/60 to-purple-600/40",
    pattern: "🏪",
  },
];

const ServicesSection = () => {
  return (
    <section id="services">
      {/* Desktop */}
      <div className="hidden lg:block bg-primary relative overflow-hidden py-[70px]">
        <div className="cht-pattern absolute top-0 left-0 right-0" />
        <div className="max-w-[1280px] mx-auto px-10">
          <div className="mb-10">
            <div className="text-xs text-bamboo-light font-bold tracking-[2px] uppercase mb-1.5">আমাদের সেবা</div>
            <div className="font-bangla text-[32px] text-primary-foreground">যা যা পাবেন এই প্ল্যাটফর্মে</div>
          </div>

          <div className="grid grid-cols-3 gap-5">
            {services.map((s) => (
              <div key={s.title} className={`${s.bgClass} rounded-[20px] p-8 cursor-pointer relative overflow-hidden border border-primary-foreground/[0.08] hover:-translate-y-1 hover:shadow-2xl transition-all`}>
                <div className="text-[44px] mb-4">{s.icon}</div>
                <div className="font-bangla text-[22px] text-primary-foreground mb-2.5">{s.title}</div>
                <div className="text-[13px] text-primary-foreground/65 leading-relaxed mb-5">{s.desc}</div>
                <div className="inline-flex items-center gap-2 bg-primary-foreground/15 text-primary-foreground text-[13px] font-semibold px-4 py-2.5 rounded-[10px] hover:bg-primary-foreground/25 transition-colors">
                  {s.action}
                </div>
                <div className="absolute -bottom-5 -right-5 text-[100px] opacity-[0.08]">{s.pattern}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Mobile */}
      <div className="lg:hidden">
        <div className="flex items-center px-[18px] pt-5 pb-3">
          <h2 className="font-bangla text-[17px] text-primary flex items-center gap-2">
            <span className="w-1 h-5 bg-secondary rounded-sm block" />
            আমাদের সেবাসমূহ
          </h2>
        </div>

        <div className="grid grid-cols-2 gap-3 px-4">
          {/* Medicine card */}
          <div className="bg-gradient-to-br from-primary to-forest-light rounded-2xl p-4 cursor-pointer relative overflow-hidden min-h-[130px] flex flex-col justify-between shadow-lg active:scale-[0.97] transition-transform">
            <div className="absolute top-3 right-3 bg-primary-foreground/20 rounded-full px-2 py-0.5 text-[10px] text-primary-foreground font-semibold">✓ লাইভ</div>
            <div className="text-[32px] mb-2">💊</div>
            <div>
              <div className="text-[15px] font-bold text-primary-foreground leading-tight mb-1">ওষুধ ডেলিভারি</div>
              <div className="text-[11px] text-primary-foreground/70">স্থানীয় ফার্মেসি থেকে</div>
            </div>
          </div>

          {/* Grocery card */}
          <div className="bg-gradient-to-br from-earth to-secondary rounded-2xl p-4 cursor-pointer min-h-[130px] flex flex-col justify-between shadow-lg active:scale-[0.97] transition-transform">
            <div className="text-[32px] mb-2">🛒</div>
            <div>
              <div className="text-[15px] font-bold text-primary-foreground leading-tight mb-1">মুদিখানা</div>
              <div className="text-[11px] text-primary-foreground/70">বাজার ডেলিভারি</div>
            </div>
          </div>

          {/* Tourist guide - full width */}
          <div className="col-span-2 bg-gradient-to-br from-blue-800 to-blue-500 rounded-2xl p-4 cursor-pointer flex items-center gap-4 min-h-[90px] shadow-lg active:scale-[0.97] transition-transform">
            <div className="text-[36px] flex-shrink-0">🌄</div>
            <div className="flex-1">
              <div className="text-[15px] font-bold text-primary-foreground leading-tight mb-1">পর্যটন গাইড</div>
              <div className="text-[11px] text-primary-foreground/70">আলুটিলা · রিচ্ছং · সাজেক ও আরও...</div>
            </div>
            <div className="text-primary-foreground/70 text-[22px]">›</div>
          </div>

          {/* Business directory - full width */}
          <div className="col-span-2 bg-gradient-to-br from-purple-900 to-purple-500 rounded-2xl p-4 cursor-pointer flex items-center gap-4 min-h-[90px] shadow-lg active:scale-[0.97] transition-transform">
            <div className="text-[36px] flex-shrink-0">🏪</div>
            <div className="flex-1">
              <div className="text-[15px] font-bold text-primary-foreground leading-tight mb-1">ব্যবসা ডিরেক্টরি</div>
              <div className="text-[11px] text-primary-foreground/70">স্থানীয় দোকান ও সেবা খুঁজুন</div>
            </div>
            <div className="text-primary-foreground/70 text-[22px]">›</div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ServicesSection;
