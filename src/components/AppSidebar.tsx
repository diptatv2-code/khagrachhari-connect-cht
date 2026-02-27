import { Link } from "react-router-dom";
import { mainNav, sidebarGroups, emergencyNumbers } from "@/data/sidebarNav";

interface Props {
  activePage: string;
  onNavigate: (id: string, type: "page" | "service") => void;
}

const AppSidebar = ({ activePage, onNavigate }: Props) => {
  return (
    <nav className="hidden lg:flex w-[268px] bg-primary fixed top-0 left-0 bottom-0 flex-col z-[200] overflow-y-auto">
      {/* Logo */}
      <Link to="/" className="block px-[18px] pt-[22px] pb-[14px] border-b hover:opacity-90 transition-opacity" style={{ borderColor: 'rgba(255,255,255,0.1)' }}>
        <div className="flex items-center gap-[10px]">
          <div className="w-10 h-10 bg-secondary rounded-[10px] flex items-center justify-center text-xl flex-shrink-0">⛰️</div>
          <div>
            <div className="font-serif-bn text-[17px] font-bold text-white leading-tight">খাগড়াছড়ি</div>
            <div className="text-[10px] text-accent mt-[1px]">আমাদের শহর, আমাদের গর্ব</div>
          </div>
        </div>
        <div className="mt-[7px] text-[10px] tracking-wider" style={{ color: 'rgba(255,255,255,0.35)' }}>amarkgc.com</div>
      </Link>

      {/* Search */}
      <div className="px-4 py-3 border-b" style={{ borderColor: 'rgba(255,255,255,0.08)' }}>
        <div className="flex items-center gap-[7px] rounded-[9px] px-[11px] py-2" style={{ background: 'rgba(255,255,255,0.1)', border: '1px solid rgba(255,255,255,0.14)' }}>
          <span className="text-[13px]" style={{ color: 'rgba(255,255,255,0.45)' }}>🔍</span>
          <input
            type="text"
            placeholder="সেবা বা স্থান খুঁজুন..."
            className="flex-1 bg-transparent border-none outline-none text-white font-sans text-[13px]"
            style={{ color: '#fff' }}
          />
        </div>
      </div>

      {/* Nav */}
      <div className="py-[10px] flex-1">
        <div className="text-[9.5px] font-bold uppercase tracking-widest px-[18px] py-[10px] pb-[3px]" style={{ color: 'rgba(255,255,255,0.5)' }}>
          প্রধান মেনু
        </div>
        {mainNav.map((item) => (
          <button
            key={item.id}
            onClick={() => onNavigate(item.id, item.type)}
            className={`flex items-center gap-[9px] px-[18px] py-[9px] w-full text-left text-[13px] font-medium border-l-[3px] transition-all ${
              activePage === item.id
                ? "border-l-[#52b788]"
                : "border-transparent"
            }`}
            style={{
              color: activePage === item.id ? '#52b788' : 'rgba(255,255,255,0.68)',
              background: activePage === item.id ? 'rgba(82,183,136,0.15)' : 'transparent',
            }}
            onMouseEnter={(e) => {
              if (activePage !== item.id) {
                e.currentTarget.style.background = 'rgba(255,255,255,0.07)';
                e.currentTarget.style.color = '#fff';
              }
            }}
            onMouseLeave={(e) => {
              if (activePage !== item.id) {
                e.currentTarget.style.background = 'transparent';
                e.currentTarget.style.color = 'rgba(255,255,255,0.68)';
              }
            }}
          >
            <span className="text-base w-[22px] text-center">{item.emoji}</span>
            {item.label}
            {item.count && (
              <span
                className="ml-auto text-[10px] font-bold px-[6px] py-[2px] rounded-[9px]"
                style={{
                  background: activePage === item.id ? 'rgba(82,183,136,0.22)' : 'rgba(255,255,255,0.1)',
                  color: activePage === item.id ? '#52b788' : 'rgba(255,255,255,0.55)',
                }}
              >
                {item.count}
              </span>
            )}
          </button>
        ))}

        {sidebarGroups.map((group) => (
          <div key={group.label}>
            <div className="text-[9.5px] font-bold uppercase tracking-widest px-[18px] pt-[10px] pb-[3px] mt-[6px]" style={{ color: 'rgba(255,255,255,0.5)' }}>
              {group.label}
            </div>
            {group.items.map((item) => (
              <button
                key={item.id}
                onClick={() => onNavigate(item.id, item.type)}
                className={`flex items-center gap-[9px] px-[18px] py-[9px] w-full text-left text-[13px] font-medium border-l-[3px] transition-all ${
                  activePage === item.id
                    ? "border-l-[#52b788]"
                    : "border-transparent"
                }`}
                style={{
                  color: activePage === item.id ? '#52b788' : 'rgba(255,255,255,0.68)',
                  background: activePage === item.id ? 'rgba(82,183,136,0.15)' : 'transparent',
                }}
                onMouseEnter={(e) => {
                  if (activePage !== item.id) {
                    e.currentTarget.style.background = 'rgba(255,255,255,0.07)';
                    e.currentTarget.style.color = '#fff';
                  }
                }}
                onMouseLeave={(e) => {
                  if (activePage !== item.id) {
                    e.currentTarget.style.background = 'transparent';
                    e.currentTarget.style.color = 'rgba(255,255,255,0.68)';
                  }
                }}
              >
                <span className="text-base w-[22px] text-center">{item.emoji}</span>
                {item.label}
                {item.count && (
                  <span
                    className="ml-auto text-[10px] font-bold px-[6px] py-[2px] rounded-[9px]"
                    style={{
                      background: activePage === item.id ? 'rgba(82,183,136,0.22)' : 'rgba(255,255,255,0.1)',
                      color: activePage === item.id ? '#52b788' : 'rgba(255,255,255,0.55)',
                    }}
                  >
                    {item.count}
                  </span>
                )}
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
              className={`flex flex-col items-center py-[7px] px-1 rounded-[7px] text-[10px] font-bold gap-[2px] transition-opacity hover:opacity-80 ${
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
    </nav>
  );
};

export default AppSidebar;
