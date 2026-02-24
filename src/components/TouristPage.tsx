import { touristSpotsList } from "@/data/sidebarNav";

interface Props {
  onBack: () => void;
}

const TouristPage = ({ onBack }: Props) => {
  return (
    <div>
      <div className="flex items-center justify-between mb-[14px]">
        <span className="font-serif-bn text-[15px] lg:text-[17px] font-bold text-foreground flex items-center gap-[7px]">
          <span className="w-1 h-5 bg-secondary rounded-sm" />
          🗺️ পর্যটন স্থান
        </span>
        <button
          onClick={onBack}
          className="bg-muted text-[hsl(var(--green-mid))] border-none rounded-full px-[13px] py-[5px] text-[11px] font-semibold cursor-pointer"
        >
          ← ফিরে যান
        </button>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-3 gap-[9px] lg:gap-[13px]">
        {touristSpotsList.map((spot) => (
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
            <div className="flex gap-[5px] px-[10px] pb-2 border-t border-border pt-2">
              <span className="flex-1 text-center text-[11px] font-semibold bg-muted text-[hsl(var(--green-mid))] py-[5px] rounded-[7px]">
                📍 ম্যাপে দেখুন
              </span>
              <span className="flex-1 text-center text-[10px] font-semibold bg-amber-100 text-amber-800 py-[5px] rounded-[7px]">
                {spot.hours}
              </span>
            </div>
          </a>
        ))}
      </div>
    </div>
  );
};

export default TouristPage;
