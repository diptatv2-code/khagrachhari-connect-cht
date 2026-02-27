import { useState, useEffect, useCallback } from "react";

interface Props {
  images: string[];
  initialIndex?: number;
  onClose: () => void;
}

const ImageLightbox = ({ images, initialIndex = 0, onClose }: Props) => {
  const [idx, setIdx] = useState(initialIndex);
  const total = images.length;

  const prev = useCallback(() => setIdx((i) => (i - 1 + total) % total), [total]);
  const next = useCallback(() => setIdx((i) => (i + 1) % total), [total]);

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowLeft") prev();
      if (e.key === "ArrowRight") next();
    };
    document.addEventListener("keydown", handleKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", handleKey);
      document.body.style.overflow = "";
    };
  }, [onClose, prev, next]);

  // Touch swipe
  const [touchStart, setTouchStart] = useState<number | null>(null);

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center animate-in fade-in duration-200"
      style={{ background: "rgba(0,0,0,0.92)" }}
      onClick={onClose}
    >
      {/* Close */}
      <button
        onClick={onClose}
        className="absolute top-4 right-4 w-11 h-11 rounded-full bg-white/10 text-white flex items-center justify-center text-xl hover:bg-white/20 transition-colors z-10"
      >
        ✕
      </button>

      {/* Image */}
      <img
        src={images[idx]}
        alt=""
        className="max-w-[90vw] max-h-[85vh] object-contain select-none"
        onClick={(e) => e.stopPropagation()}
        onTouchStart={(e) => setTouchStart(e.touches[0].clientX)}
        onTouchEnd={(e) => {
          if (touchStart === null) return;
          const diff = e.changedTouches[0].clientX - touchStart;
          if (Math.abs(diff) > 50) {
            if (diff > 0) prev();
            else next();
          }
          setTouchStart(null);
        }}
        draggable={false}
      />

      {/* Arrows */}
      {total > 1 && (
        <>
          <button
            onClick={(e) => { e.stopPropagation(); prev(); }}
            className="absolute left-3 top-1/2 -translate-y-1/2 w-11 h-11 rounded-full bg-white/15 text-white flex items-center justify-center text-lg hover:bg-white/30 transition-colors"
          >
            ‹
          </button>
          <button
            onClick={(e) => { e.stopPropagation(); next(); }}
            className="absolute right-3 top-1/2 -translate-y-1/2 w-11 h-11 rounded-full bg-white/15 text-white flex items-center justify-center text-lg hover:bg-white/30 transition-colors"
          >
            ›
          </button>
        </>
      )}

      {/* Counter */}
      {total > 1 && (
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 text-white/80 text-sm font-semibold">
          {idx + 1}/{total}
        </div>
      )}
    </div>
  );
};

export default ImageLightbox;
