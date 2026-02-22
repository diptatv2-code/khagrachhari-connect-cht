import { transportInfo } from "@/data/content";

const TransportSection = () => {
  return (
    <section id="transport" className="bg-cream-dark py-10 lg:py-[70px]">
      <div className="max-w-[1280px] mx-auto px-4 lg:px-10">
        <div className="mb-6 lg:mb-9">
          <div className="hidden lg:block text-xs text-secondary font-bold tracking-[2px] uppercase mb-1.5">পরিবহন</div>
          <h2 className="font-bangla text-[17px] lg:text-[32px] text-primary flex items-center gap-2">
            <span className="w-1 h-5 bg-secondary rounded-sm block lg:hidden" />
            যাতায়াত তথ্য
          </h2>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 lg:gap-8">
          {/* Dhaka to Khagrachhari */}
          <div className="bg-card rounded-[20px] p-5 lg:p-7 shadow-md">
            <div className="flex items-center gap-3.5 mb-5">
              <div className="w-[50px] h-[50px] bg-muted rounded-[14px] flex items-center justify-center text-2xl">🚌</div>
              <div>
                <div className="font-bangla text-lg text-primary">ঢাকা → খাগড়াছড়ি</div>
                <div className="text-xs text-muted-foreground/70">আন্তঃজেলা বাস সার্ভিস</div>
              </div>
            </div>
            <div className="flex flex-col gap-3">
              {[
                { key: "দূরত্ব", val: transportInfo.dhaka.distance },
                { key: "সময়", val: transportInfo.dhaka.time },
                { key: "ভাড়া", val: transportInfo.dhaka.fare },
              ].map((r) => (
                <div key={r.key} className="flex justify-between items-center px-4 py-3 bg-background rounded-[10px] text-[13px]">
                  <span className="text-muted-foreground">{r.key}</span>
                  <span className="font-bold text-primary">{r.val}</span>
                </div>
              ))}
            </div>
            <div className="flex flex-wrap gap-2 mt-4">
              {transportInfo.dhaka.busCompanies.map((bus) => (
                <span key={bus} className="text-[11px] bg-muted text-forest-light px-3 py-1 rounded-full font-semibold border border-forest-light/20">
                  {bus}
                </span>
              ))}
            </div>
          </div>

          {/* Chittagong to Khagrachhari */}
          <div className="bg-card rounded-[20px] p-5 lg:p-7 shadow-md">
            <div className="flex items-center gap-3.5 mb-5">
              <div className="w-[50px] h-[50px] bg-muted rounded-[14px] flex items-center justify-center text-2xl">🚐</div>
              <div>
                <div className="font-bangla text-lg text-primary">চট্টগ্রাম → খাগড়াছড়ি</div>
                <div className="text-xs text-muted-foreground/70">বাস ও মাইক্রোবাস</div>
              </div>
            </div>
            <div className="flex flex-col gap-3">
              {[
                { key: "দূরত্ব", val: transportInfo.chittagong.distance },
                { key: "সময়", val: transportInfo.chittagong.time },
                { key: "যানবাহন", val: transportInfo.chittagong.vehicles },
              ].map((r) => (
                <div key={r.key} className="flex justify-between items-center px-4 py-3 bg-background rounded-[10px] text-[13px]">
                  <span className="text-muted-foreground">{r.key}</span>
                  <span className="font-bold text-primary">{r.val}</span>
                </div>
              ))}
            </div>

            <div className="mt-6 pt-5 border-t border-border">
              <div className="font-bangla text-base text-primary mb-3">স্থানীয় যানবাহন</div>
              <div className="flex flex-col gap-2.5">
                {transportInfo.local.map((l) => (
                  <div key={l.name} className="flex items-center gap-3 text-[13px]">
                    <span className="text-secondary">•</span>
                    <span className="font-semibold text-primary">{l.name}</span>
                    <span className="text-muted-foreground">— {l.desc}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default TransportSection;
