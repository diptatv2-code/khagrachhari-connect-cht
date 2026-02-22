import heroBg from "@/assets/hero-bg.jpg";

const Hero = () => {
  return (
    <section id="home" className="relative overflow-hidden">
      {/* Desktop Hero */}
      <div className="hidden lg:block bg-gradient-to-br from-primary via-[hsl(150,30%,22%)] to-forest-light min-h-[520px] relative">
        {/* Background image overlay */}
        <div
          className="absolute inset-0 opacity-15 bg-cover bg-center"
          style={{ backgroundImage: `url(${heroBg})` }}
        />
        {/* Decorative circles */}
        <div className="absolute -top-[100px] -right-[100px] w-[500px] h-[500px] bg-[radial-gradient(circle,rgba(201,168,76,0.12)_0%,transparent_70%)] rounded-full" />
        <div className="absolute -bottom-[80px] left-[200px] w-[300px] h-[300px] bg-[radial-gradient(circle,rgba(45,106,79,0.3)_0%,transparent_70%)] rounded-full" />

        {/* CHT geometric pattern */}
        <div className="absolute right-0 top-0 bottom-0 w-[420px] opacity-[0.07]"
          style={{
            background: `
              repeating-linear-gradient(45deg, hsl(42,64%,54%) 0, hsl(42,64%,54%) 2px, transparent 0, transparent 50%),
              repeating-linear-gradient(-45deg, hsl(42,64%,54%) 0, hsl(42,64%,54%) 2px, transparent 0, transparent 50%)`,
            backgroundSize: '30px 30px',
          }}
        />

        <div className="max-w-[1280px] mx-auto px-10 py-20 grid grid-cols-2 gap-[60px] items-center relative z-10 animate-fade-up">
          <div>
            <div className="inline-flex items-center gap-2 bg-secondary/15 border border-secondary/30 px-4 py-1.5 rounded-full text-xs text-bamboo-light tracking-wider uppercase mb-5">
              🌿 পার্বত্য চট্টগ্রাম · খাগড়াছড়ি জেলা
            </div>
            <h1 className="font-bangla text-[52px] leading-[1.2] text-primary-foreground mb-4">
              পাহাড়ের কোলে<br /><span className="text-bamboo-light">সবকিছু এক জায়গায়</span>
            </h1>
            <p className="text-base text-primary-foreground/70 leading-relaxed mb-9 max-w-[480px]">
              ওষুধ থেকে বাজার, পর্যটন থেকে জরুরি সেবা — খাগড়াছড়ির বাসিন্দা ও পর্যটকদের জন্য বাংলাদেশের প্রথম পার্বত্য কমিউনিটি প্ল্যাটফর্ম।
            </p>
            <div className="flex gap-3.5 items-center">
              <a href="#services" className="px-7 py-3.5 rounded-xl text-[15px] font-bold bg-gradient-to-br from-secondary to-accent text-primary shadow-lg hover:-translate-y-0.5 hover:shadow-xl transition-all">
                🛒 অর্ডার করুন
              </a>
              <a href="#tourism" className="px-7 py-3.5 rounded-xl text-[15px] font-bold bg-primary-foreground/10 text-primary-foreground border border-primary-foreground/25 hover:bg-primary-foreground/[0.18] transition-all">
                🗺️ দর্শনীয় স্থান দেখুন
              </a>
            </div>

            <div className="flex gap-9 mt-10 pt-8 border-t border-primary-foreground/10">
              {[
                { num: "১০+", label: "দর্শনীয় স্থান" },
                { num: "৫০+", label: "স্থানীয় ব্যবসা" },
                { num: "২৪/৭", label: "জরুরি তথ্য" },
                { num: "৩টি", label: "নদী ও পাহাড়" },
              ].map((s) => (
                <div key={s.label}>
                  <div className="font-bangla text-[28px] text-bamboo-light font-bold leading-none">{s.num}</div>
                  <div className="text-xs text-primary-foreground/55 mt-1">{s.label}</div>
                </div>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3.5 animate-fade-up-delay-1">
            {[
              { icon: "💊", title: "ওষুধ ডেলিভারি", sub: "স্থানীয় ফার্মেসি থেকে দ্রুত ডেলিভারি", badge: "✓ সক্রিয়" },
              { icon: "🛒", title: "মুদিখানা বাজার", sub: "নিত্যপ্রয়োজনীয় পণ্য ঘরে পৌঁছে দেই", badge: "নতুন" },
            ].map((c) => (
              <div key={c.title} className="bg-primary-foreground/[0.09] backdrop-blur-md border border-primary-foreground/[0.13] rounded-[18px] p-5 cursor-pointer hover:bg-primary-foreground/15 hover:-translate-y-1 transition-all">
                <div className="text-[34px] mb-3">{c.icon}</div>
                <div className="text-[15px] font-bold text-primary-foreground mb-1">{c.title}</div>
                <div className="text-xs text-primary-foreground/60">{c.sub}</div>
                <div className="mt-2.5 inline-block bg-secondary/25 text-bamboo-light text-[10px] font-bold px-2.5 py-0.5 rounded-full">{c.badge}</div>
              </div>
            ))}
            <div className="col-span-2 bg-primary-foreground/[0.09] backdrop-blur-md border border-primary-foreground/[0.13] rounded-[18px] px-5 py-4 flex items-center gap-5 cursor-pointer hover:bg-primary-foreground/15 transition-all">
              <div className="text-[38px]">🚨</div>
              <div>
                <div className="text-[15px] font-bold text-primary-foreground mb-1">জরুরি সেবা — 999</div>
                <div className="text-xs text-primary-foreground/60">হাসপাতাল · পুলিশ · ফায়ার সার্ভিস · অ্যাম্বুলেন্স সব এক জায়গায়</div>
              </div>
            </div>
            {[
              { icon: "🌄", title: "পর্যটন গাইড", sub: "আলুটিলা · সাজেক · রিচ্ছং", badge: "১০+ স্থান" },
              { icon: "🏪", title: "ব্যবসা ডিরেক্টরি", sub: "স্থানীয় দোকান ও সেবা খুঁজুন", badge: "৫০+ তালিকা" },
            ].map((c) => (
              <div key={c.title} className="bg-primary-foreground/[0.09] backdrop-blur-md border border-primary-foreground/[0.13] rounded-[18px] p-5 cursor-pointer hover:bg-primary-foreground/15 hover:-translate-y-1 transition-all">
                <div className="text-[34px] mb-3">{c.icon}</div>
                <div className="text-[15px] font-bold text-primary-foreground mb-1">{c.title}</div>
                <div className="text-xs text-primary-foreground/60">{c.sub}</div>
                <div className="mt-2.5 inline-block bg-secondary/25 text-bamboo-light text-[10px] font-bold px-2.5 py-0.5 rounded-full">{c.badge}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Mobile Hero */}
      <div className="lg:hidden bg-gradient-to-br from-primary to-forest-light relative overflow-hidden px-[18px] py-6">
        <div className="absolute -top-[30px] -right-[40px] w-[180px] h-[180px] bg-[radial-gradient(circle,rgba(201,168,76,0.15)_0%,transparent_70%)] rounded-full" />
        <p className="text-[13px] text-bamboo-light tracking-wider uppercase mb-1.5">স্বাগতম</p>
        <h2 className="font-bangla text-[26px] text-primary-foreground leading-[1.3] mb-2.5">
          খাগড়াছড়িতে<br /><span className="text-bamboo-light">সবকিছু এক জায়গায়</span>
        </h2>
        <p className="text-[13px] text-primary-foreground/70 leading-relaxed mb-4">
          ওষুধ, বাজার, পর্যটন — সব তথ্য এখন আপনার হাতের মুঠোয়।
        </p>
        <div className="inline-flex items-center gap-2 bg-primary-foreground/10 px-3.5 py-2 rounded-full border border-primary-foreground/15 text-[13px] text-primary-foreground">
          <span>⛅</span>
          <span>২৬°সে · আজ মেঘলা · খাগড়াছড়ি</span>
        </div>
      </div>
    </section>
  );
};

export default Hero;
