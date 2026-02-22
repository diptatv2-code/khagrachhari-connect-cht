import { emergencyContacts } from "@/data/content";

const EmergencyBar = () => {
  return (
    <>
      {/* Desktop */}
      <div id="emergency" className="hidden lg:block bg-gradient-to-r from-destructive via-[#e74c3c] to-destructive bg-[length:200%_100%] animate-slide-bg py-3.5 px-10">
        <div className="max-w-[1280px] mx-auto flex items-center gap-10">
          <div className="flex items-center gap-2.5 text-[15px] font-bold text-destructive-foreground whitespace-nowrap">
            🚨 জরুরি যোগাযোগ:
          </div>
          <div className="flex gap-[30px] flex-1">
            {emergencyContacts.map((c) => (
              <div key={c.name} className="flex items-center gap-2.5 cursor-pointer">
                <div className="w-8 h-8 bg-destructive-foreground/[0.18] rounded-lg flex items-center justify-center text-base">
                  {c.emoji}
                </div>
                <div>
                  <div className="text-xs text-destructive-foreground/75">{c.name}</div>
                  <div className="text-sm font-bold text-destructive-foreground">{c.number}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Mobile */}
      <div className="lg:hidden mx-4 mt-4 bg-gradient-to-br from-destructive to-[#e74c3c] rounded-[14px] px-4 py-3.5 flex items-center gap-3 shadow-lg animate-pulse-shadow">
        <div className="text-[28px] flex-shrink-0">🚨</div>
        <div className="flex-1">
          <h3 className="text-sm font-bold text-destructive-foreground mb-0.5">জরুরি সেবা</h3>
          <p className="text-[11px] text-destructive-foreground/85">হাসপাতাল · পুলিশ · ফায়ার সার্ভিস</p>
        </div>
        <a href="#emergency-contacts" className="text-destructive-foreground text-lg opacity-80">›</a>
      </div>
    </>
  );
};

export default EmergencyBar;
