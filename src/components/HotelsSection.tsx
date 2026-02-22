import { hotels } from "@/data/content";

const hotelGradients = [
  "from-primary to-forest-light",
  "from-blue-700 to-blue-400",
  "from-purple-800 to-purple-500",
];

const HotelsSection = () => {
  return (
    <section id="hotels" className="max-w-[1280px] mx-auto px-4 lg:px-10 py-10 lg:py-[70px]">
      <div className="flex items-end justify-between mb-6 lg:mb-9">
        <div>
          <div className="hidden lg:block text-xs text-secondary font-bold tracking-[2px] uppercase mb-1.5">আবাসন</div>
          <h2 className="font-bangla text-[17px] lg:text-[32px] text-primary flex items-center gap-2">
            <span className="w-1 h-5 bg-secondary rounded-sm block lg:hidden" />
            হোটেল ও রিসোর্ট
          </h2>
          <div className="hidden lg:block text-sm text-muted-foreground mt-1.5">পর্যটকদের জন্য খাগড়াছড়ির সেরা থাকার ব্যবস্থা</div>
        </div>
        <button className="hidden lg:flex items-center gap-1.5 text-sm text-forest-light font-semibold border-2 border-forest-light px-5 py-2.5 rounded-[10px] hover:bg-forest-light hover:text-primary-foreground transition-all">
          সব হোটেল →
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-5">
        {hotels.map((hotel, i) => (
          <div key={hotel.id} className="bg-card rounded-[18px] overflow-hidden shadow-md hover:-translate-y-1 hover:shadow-lg transition-all cursor-pointer">
            <div className={`h-[120px] flex items-center justify-center text-[48px] bg-gradient-to-br ${hotelGradients[i]}`}>
              {hotel.emoji}
            </div>
            <div className="p-4 lg:p-5">
              <div className="text-[15px] font-bold text-primary mb-1">{hotel.name}</div>
              <div className="text-xs text-muted-foreground/70 mb-2">📞 {hotel.phone}</div>
              <div className="flex justify-between items-center">
                <div className="text-[13px] text-forest-light font-bold">{hotel.price}</div>
                <div className="text-[10px] bg-muted text-primary px-2.5 py-0.5 rounded-full font-semibold">{hotel.tag}</div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default HotelsSection;
