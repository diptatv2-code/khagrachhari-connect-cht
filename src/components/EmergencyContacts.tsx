import { emergencyContacts } from "@/data/content";

const EmergencyContacts = () => {
  return (
    <section id="emergency-contacts" className="max-w-[1280px] mx-auto px-4 lg:px-10 py-10 lg:py-[70px] animate-fade-up-delay-4">
      <div className="mb-6 lg:mb-9">
        <div className="hidden lg:block text-xs text-secondary font-bold tracking-[2px] uppercase mb-1.5">জরুরি</div>
        <h2 className="font-bangla text-[17px] lg:text-[32px] text-primary flex items-center gap-2">
          <span className="w-1 h-5 bg-secondary rounded-sm block lg:hidden" />
          জরুরি যোগাযোগ
        </h2>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-5 gap-3 lg:gap-4">
        {emergencyContacts.map((c) => (
          <div
            key={c.name}
            className="bg-card rounded-xl p-3 lg:p-4 flex items-center gap-2.5 lg:gap-3 shadow-sm hover:shadow-md cursor-pointer border border-transparent hover:border-forest-light/20 transition-all active:scale-[0.97]"
          >
            <div className={`w-9 h-9 lg:w-11 lg:h-11 rounded-[10px] flex items-center justify-center text-lg lg:text-xl flex-shrink-0 ${c.color}`}>
              {c.emoji}
            </div>
            <div>
              <div className="text-xs font-bold text-foreground">{c.name}</div>
              <div className="text-[11px] lg:text-xs text-forest-light font-semibold">{c.number}</div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default EmergencyContacts;
