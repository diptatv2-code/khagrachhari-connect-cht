import { useState } from "react";

import { mainNav, sidebarGroups, emergencyNumbers } from "@/data/sidebarNav";

interface Props {
  activePage?: string;
  onNavigate?: (id: string, type: "page" | "service") => void;
}

const MobileHeader = ({ activePage = "home", onNavigate }: Props) => {
  const [menuOpen, setMenuOpen] = useState(false);

  const handleNav = (id: string, type: "page" | "service") => {
    onNavigate?.(id, type);
    setMenuOpen(false);
  };

  return (
    <>
      <header className="lg:hidden flex bg-primary px-[14px] h-[54px] items-center justify-between sticky top-0 z-[100] shadow-lg">
        <button onClick={() => { onNavigate?.("home", "page"); }} className="flex items-center gap-2 hover:opacity-90 transition-opacity">
          <div className="w-[33px] h-[33px] bg-secondary rounded-lg flex items-center justify-center text-[17px]">⛰️</div>
          <div className="text-left">
            <div className="font-serif-bn text-[14px] font-bold text-primary-foreground">খাগড়াছড়ি</div>
            <div className="text-[9px] text-accent">আমাদের শহর, আমাদের গর্ব</div>
          </div>
        </button>
        <div className="flex gap-[5px]">
          <button className="w-8 h-8 bg-primary-foreground/10 rounded-[7px] flex items-center justify-center text-primary-foreground text-[14px]">🔔</button>
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="w-8 h-8 bg-primary-foreground/10 rounded-[7px] flex items-center justify-center text-primary-foreground text-[14px]"
          >
            {menuOpen ? "✕" : "☰"}
          </button>
        </div>
      </header>

      <div className="lg:hidden bg-primary px-[14px] pb-[11px]">
        <div className="flex items-center gap-[7px] bg-primary-foreground/12 border border-primary-foreground/18 rounded-[9px] px-[11px]">
          <span className="text-primary-foreground/45 text-[13px]">🔍</span>
          <input
            type="text"
            placeholder="ব্যবসা, সেবা, ডাক্তার খুঁজুন..."
            className="flex-1 bg-transparent border-none outline-none text-primary-foreground font-sans text-[13px] py-[9px] placeholder:text-primary-foreground/42"
          />
        </div>
      </div>

      {/* Mobile Menu Drawer */}
      {menuOpen && (
        <>
          <div
            className="lg:hidden fixed inset-0 bg-black/50 z-[150]"
            onClick={() => setMenuOpen(false)}
          />
          <div className="lg:hidden fixed top-0 right-0 bottom-0 w-[280px] bg-primary z-[151] overflow-y-auto shadow-2xl animate-in slide-in-from-right duration-200">
            <div className="px-4 pt-4 pb-3 border-b" style={{ borderColor: 'rgba(255,255,255,0.1)' }}>
              <div className="flex items-center justify-between">
                <span className="text-white font-bold text-sm">মেনু</span>
                <button onClick={() => setMenuOpen(false)} className="text-white text-lg">✕</button>
              </div>
            </div>

            <div className="py-2">
              <div className="text-[9.5px] font-bold uppercase tracking-widest px-4 py-2" style={{ color: 'rgba(255,255,255,0.5)' }}>
                প্রধান মেনু
              </div>
              {mainNav.map((item) => (
                <button
                  key={item.id}
                  onClick={() => handleNav(item.id, item.type)}
                  className="flex items-center gap-3 px-4 py-[10px] w-full text-left text-[13px] font-medium"
                  style={{
                    color: activePage === item.id ? '#52b788' : 'rgba(255,255,255,0.75)',
                    background: activePage === item.id ? 'rgba(82,183,136,0.15)' : 'transparent',
                  }}
                >
                  <span className="text-base">{item.emoji}</span>
                  {item.label}
                </button>
              ))}

              {sidebarGroups.map((group) => (
                <div key={group.label}>
                  <div className="text-[9.5px] font-bold uppercase tracking-widest px-4 pt-3 pb-1" style={{ color: 'rgba(255,255,255,0.5)' }}>
                    {group.label}
                  </div>
                  {group.items.map((item) => (
                    <button
                      key={item.id}
                      onClick={() => handleNav(item.id, item.type)}
                      className="flex items-center gap-3 px-4 py-[10px] w-full text-left text-[13px] font-medium"
                      style={{
                        color: activePage === item.id ? '#52b788' : 'rgba(255,255,255,0.75)',
                        background: activePage === item.id ? 'rgba(82,183,136,0.15)' : 'transparent',
                      }}
                    >
                      <span className="text-base">{item.emoji}</span>
                      {item.label}
                    </button>
                  ))}
                </div>
              ))}
            </div>

            {/* Emergency */}
            <div className="px-4 py-3 border-t" style={{ borderColor: 'rgba(255,255,255,0.08)' }}>
              <div className="text-[9.5px] font-bold uppercase tracking-widest mb-2" style={{ color: 'rgba(255,255,255,0.5)' }}>জরুরি নম্বর</div>
              <div className="grid grid-cols-2 gap-[5px]">
                {emergencyNumbers.map((em) => (
                  <a
                    key={em.tel}
                    href={`tel:${em.tel}`}
                    className={`flex flex-col items-center py-[7px] px-1 rounded-[7px] text-[10px] font-bold gap-[2px] ${
                      em.colorClass === "bg-blue-900" ? "bg-blue-500/20 text-blue-300" :
                      em.colorClass === "bg-red-700" ? "bg-red-500/20 text-red-300" :
                      em.colorClass === "bg-green-800" ? "bg-green-500/20 text-green-300" :
                      "bg-purple-500/20 text-purple-300"
                    }`}
                  >
                    {em.emoji} {em.label}
                    <span className="text-[13px] font-mono">{em.num}</span>
                  </a>
                ))}
              </div>
            </div>
          </div>
        </>
      )}
    </>
  );
};

export default MobileHeader;
