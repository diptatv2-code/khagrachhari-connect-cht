import { Link } from "react-router-dom";
import { touristSpotsDetailed } from "@/data/touristSpotsDetailed";

const TouristSpots = () => {
  return (
    <section id="tourism" className="animate-fade-up-delay-2">
      {/* Desktop */}
      <div className="hidden lg:block max-w-[1280px] mx-auto px-10 py-[70px]">
        <div className="flex items-end justify-between mb-9">
          <div>
            <div className="text-xs text-secondary font-bold tracking-[2px] uppercase mb-1.5">পর্যটন</div>
            <div className="font-bangla text-[32px] text-primary leading-tight">দর্শনীয় স্থানসমূহ</div>
            <div className="text-sm text-muted-foreground mt-1.5 max-w-[500px]">
              খাগড়াছড়ির সেরা প্রাকৃতিক ও ঐতিহাসিক স্থানগুলো এক নজরে
            </div>
          </div>
          <Link to="/directory" className="flex items-center gap-1.5 text-sm text-forest-light font-semibold border-2 border-forest-light px-5 py-2.5 rounded-[10px] hover:bg-forest-light hover:text-primary-foreground transition-all whitespace-nowrap">
            সব দেখুন →
          </Link>
        </div>

        <div className="grid grid-cols-4 gap-5">
          {touristSpotsDetailed.map((spot) => (
            <Link to={`/spot/${spot.slug}`} key={spot.id} className="bg-card rounded-[20px] overflow-hidden shadow-md hover:-translate-y-1.5 hover:shadow-lg transition-all cursor-pointer block">
              <div className="h-40 relative overflow-hidden">
                <img
                  src={spot.photos[0]}
                  alt={spot.name}
                  className="w-full h-full object-cover"
                  loading="lazy"
                  onError={(e) => {
                    e.currentTarget.style.display = 'none';
                    e.currentTarget.parentElement!.classList.add('flex', 'items-center', 'justify-center', 'text-[52px]', `bg-gradient-to-br`, spot.gradient.split(' ').join(' '));
                    e.currentTarget.parentElement!.innerHTML = `<span class="text-[52px]">${spot.emoji}</span>`;
                  }}
                />
                {spot.badge && (
                  <div className="absolute top-3 left-3 bg-foreground/45 backdrop-blur-md text-primary-foreground text-[10px] font-bold px-2.5 py-1 rounded-full">
                    {spot.badge}
                  </div>
                )}
              </div>
              <div className="p-4">
                <div className="text-[15px] font-bold text-primary mb-1">{spot.name}</div>
                <div className="text-xs text-muted-foreground leading-relaxed">{spot.shortDescription}</div>
                <div className="flex justify-between items-center mt-2">
                  <div className="text-xs text-muted-foreground/70 flex items-center gap-1">📍 {spot.distance}</div>
                  <div className="text-xs text-muted-foreground font-semibold flex items-center gap-1">
                    <span className="text-secondary">★</span> {spot.rating}
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>

      {/* Mobile - Horizontal scroll */}
      <div className="lg:hidden">
        <div className="flex items-center justify-between px-[18px] pt-5 pb-3">
          <h2 className="font-bangla text-[17px] text-primary flex items-center gap-2">
            <span className="w-1 h-5 bg-secondary rounded-sm block" />
            দর্শনীয় স্থান
          </h2>
          <Link to="/directory" className="text-xs text-forest-light font-semibold border border-forest-light px-2.5 py-1 rounded-full">
            সব দেখুন
          </Link>
        </div>

        <div className="flex gap-3 px-4 overflow-x-auto scrollbar-hide pb-2">
          {touristSpotsDetailed.slice(0, 5).map((spot) => (
            <Link to={`/spot/${spot.slug}`} key={spot.id} className="flex-shrink-0 w-40 rounded-2xl overflow-hidden shadow-md bg-card cursor-pointer active:scale-[0.97] transition-transform block">
              <div className="w-full h-[100px] overflow-hidden">
                <img src={spot.photos[0]} alt={spot.name} className="w-full h-full object-cover" loading="lazy" />
              </div>
              <div className="p-2.5">
                <div className="text-[13px] font-bold text-primary mb-0.5">{spot.name}</div>
                <div className="text-[11px] text-muted-foreground flex items-center gap-1">📍 {spot.distance}</div>
                <div className="flex items-center gap-1 mt-1">
                  <span className="text-secondary text-[11px]">★★★★★</span>
                  <span className="text-[11px] text-muted-foreground">({spot.rating})</span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TouristSpots;
