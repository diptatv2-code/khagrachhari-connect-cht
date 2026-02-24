import { emergencyNumbers, categoryGrid, notices, touristSpotsList } from "@/data/sidebarNav";

interface Props {
  onNavigate: (id: string, type: "page" | "service") => void;
}

const HomePage = ({ onNavigate }: Props) => {
  return (
    <div>
      {/* Hero */}
      <div className="bg-gradient-to-br from-[hsl(var(--green-mid))] to-primary rounded-[18px] p-7 lg:p-8 text-primary-foreground flex flex-col lg:flex-row justify-between lg:items-center mb-6 relative overflow-hidden animate-fade-up">
        <div className="absolute -right-10 -top-10 w-[200px] h-[200px] bg-primary-foreground/5 rounded-full" />
        <div className="relative z-10">
          <span className="inline-block bg-secondary text-primary text-[11px] font-bold px-[11px] py-[3px] rounded-full mb-[10px]">
            🏔️ পার্বত্য চট্টগ্রাম
          </span>
          <h2 className="font-serif-bn text-[19px] lg:text-[26px] font-bold leading-tight mb-[7px]">
            আপনার সব সেবা,<br />এক জায়গায়
          </h2>
          <p className="text-[12px] lg:text-[13px] text-primary-foreground/73 max-w-[400px] leading-relaxed">
            হাসপাতাল, রেস্তোরাঁ, পরিবহন, ব্যাংক, স্কুল — খাগড়াছড়ির সব তথ্য এখানে।
          </p>
          <div className="flex gap-[18px] lg:gap-7 pt-[18px] mt-[18px] border-t border-primary-foreground/14">
            <div>
              <div className="font-serif-bn text-xl lg:text-2xl font-bold text-accent">৯০+</div>
              <div className="text-[11px] text-primary-foreground/58">ব্যবসা তালিকা</div>
            </div>
            <div>
              <div className="font-serif-bn text-xl lg:text-2xl font-bold text-accent">১৮টি</div>
              <div className="text-[11px] text-primary-foreground/58">সেবা বিভাগ</div>
            </div>
            <div>
              <div className="font-serif-bn text-xl lg:text-2xl font-bold text-accent">১৫টি</div>
              <div className="text-[11px] text-primary-foreground/58">হোটেল</div>
            </div>
          </div>
        </div>
      </div>

      {/* Emergency */}
      <SectionHeader title="জরুরি নম্বর" className="animate-fade-up-delay-1" />
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-[9px] lg:gap-[11px] mb-6 animate-fade-up-delay-1">
        {emergencyNumbers.map((em) => (
          <a
            key={em.tel}
            href={`tel:${em.tel}`}
            className={`rounded-xl p-4 lg:p-[16px] flex items-center gap-[11px] text-primary-foreground transition-opacity hover:opacity-85 ${
              em.colorClass === "bg-blue-900" ? "bg-blue-900" :
              em.colorClass === "bg-red-700" ? "bg-red-700" :
              em.colorClass === "bg-green-800" ? "bg-green-800" :
              "bg-purple-700"
            }`}
          >
            <span className="text-[26px]">{em.emoji}</span>
            <div>
              <div className="text-[11px] opacity-80">{em.label}</div>
              <div className="text-xl font-bold font-mono">{em.num}</div>
            </div>
          </a>
        ))}
      </div>

      {/* Category Grid */}
      <SectionHeader title="সকল সেবা বিভাগ" className="animate-fade-up-delay-2" />
      <div className="grid grid-cols-3 lg:grid-cols-5 gap-[9px] lg:gap-3 mb-7 animate-fade-up-delay-2">
        {categoryGrid.map((cat) => (
          <button
            key={cat.id}
            onClick={() => onNavigate(cat.id, cat.type || "service")}
            className="bg-card rounded-xl p-[13px] lg:p-[18px] lg:pb-[14px] text-center shadow-sm border-2 border-transparent hover:border-[hsl(var(--green-light))] hover:shadow-md hover:-translate-y-[3px] transition-all cursor-pointer"
          >
            <span className="text-[24px] lg:text-[30px] block mb-[6px] lg:mb-2">{cat.emoji}</span>
            <div className="text-[11px] lg:text-[12px] font-bold text-foreground leading-tight">{cat.label}</div>
            <div className="text-[10px] text-muted-foreground mt-[3px] leading-tight">{cat.sub}</div>
          </button>
        ))}
      </div>

      {/* Bottom 2-col: Notices + Tourist */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-[22px] animate-fade-up-delay-3">
        <div>
          <SectionHeader title="নোটিশ বোর্ড" />
          {notices.map((n, i) => (
            <div key={i} className="bg-card rounded-xl p-[14px] px-4 shadow-sm border-l-4 border-l-secondary mb-[10px]">
              <div className="text-[10px] text-muted-foreground mb-1">📅 {n.date}</div>
              <div className="text-[13px] font-semibold text-foreground leading-relaxed">{n.text}</div>
            </div>
          ))}
        </div>
        <div>
          <SectionHeader title="দর্শনীয় স্থান" />
          <div className="grid grid-cols-2 gap-[9px]">
            {touristSpotsList.slice(0, 4).map((spot) => (
              <a
                key={spot.name}
                href={spot.url}
                target="_blank"
                rel="noopener noreferrer"
                className="bg-card rounded-xl overflow-hidden shadow-sm hover:-translate-y-[3px] transition-transform block"
              >
                <div className={`h-[100px] flex items-center justify-center text-[40px] ${spot.gradient}`}>
                  {spot.emoji}
                </div>
                <div className="p-[10px] px-3">
                  <div className="text-[12px] font-bold text-foreground mb-[2px]">{spot.name}</div>
                  <div className="text-[10px] text-muted-foreground">{spot.meta}</div>
                </div>
              </a>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

const SectionHeader = ({ title, className = "" }: { title: string; className?: string }) => (
  <div className={`flex items-center justify-between mb-[14px] mt-[6px] ${className}`}>
    <span className="font-serif-bn text-[15px] lg:text-[17px] font-bold text-foreground flex items-center gap-[7px]">
      <span className="w-1 h-5 bg-secondary rounded-sm" />
      {title}
    </span>
  </div>
);

export default HomePage;
