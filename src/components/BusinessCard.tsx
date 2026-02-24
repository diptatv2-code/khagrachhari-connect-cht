interface Business {
  id: string;
  name_bn: string;
  name_en: string | null;
  category: string;
  address: string;
  phone: string;
  whatsapp: string | null;
  description: string | null;
  google_maps_place_id: string | null;
  hours: string | null;
  rating: string | null;
  tag: string | null;
}

interface Props {
  biz: Business;
  emoji?: string;
}

const BusinessCard = ({ biz, emoji = "📍" }: Props) => {
  const mapsUrl = biz.google_maps_place_id
    ? `https://www.google.com/maps/place/?q=place_id:${biz.google_maps_place_id}`
    : null;

  return (
    <div className="bg-card rounded-xl shadow-sm overflow-hidden transition-all hover:shadow-md hover:-translate-y-[2px] flex flex-col sm:flex-row lg:flex-col">
      {/* Photo area */}
      <div className="h-[120px] sm:w-[90px] sm:h-auto sm:min-h-[90px] lg:w-auto lg:h-[120px] bg-muted flex items-center justify-center relative flex-shrink-0">
        <span className="text-[44px] opacity-45">{emoji}</span>
        {mapsUrl && (
          <a
            href={mapsUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="hidden lg:block absolute bottom-[7px] right-[7px] bg-black/55 text-primary-foreground text-[10px] font-semibold px-[7px] py-[3px] rounded-[5px] backdrop-blur-sm hover:bg-black/75 transition-colors"
          >
            📷 ছবি দেখুন
          </a>
        )}
      </div>
      {/* Body */}
      <div className="p-[13px] flex-1 flex flex-col">
        <div className="text-[13px] font-bold text-foreground mb-[3px] leading-tight">{biz.name_bn}</div>
        <div className="text-[11px] text-muted-foreground mb-2 leading-relaxed flex-1">📍 {biz.address}</div>
        <div className="flex gap-[5px] flex-wrap mb-[9px]">
          {biz.tag && (
            <span className="text-[10px] px-[7px] py-[2px] rounded-full font-semibold bg-amber-100 text-amber-800">{biz.tag}</span>
          )}
          {biz.hours && (
            <span className="text-[10px] px-[7px] py-[2px] rounded-full font-semibold bg-muted text-green-800">{biz.hours}</span>
          )}
          {biz.rating && (
            <span className="text-[11px] font-bold text-amber-600 flex items-center gap-[2px]">⭐ {biz.rating}</span>
          )}
        </div>
        <div className="flex gap-[5px] pt-[9px] border-t border-border">
          {mapsUrl && (
            <a
              href={mapsUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex-1 py-[7px] rounded-[7px] text-[11px] font-semibold flex items-center justify-center gap-1 bg-muted text-[hsl(var(--green-mid))] hover:opacity-80 transition-opacity"
            >
              📍 ম্যাপ
            </a>
          )}
          {biz.phone && (
            <a
              href={`tel:${biz.phone}`}
              className="flex-1 py-[7px] rounded-[7px] text-[11px] font-semibold flex items-center justify-center gap-1 bg-blue-50 text-blue-800 hover:opacity-80 transition-opacity"
            >
              📞 {biz.phone}
            </a>
          )}
        </div>
      </div>
    </div>
  );
};

export default BusinessCard;
