import { useState } from "react";
import { useParams, Link } from "react-router-dom";
import { touristSpotsDetailed } from "@/data/touristSpotsDetailed";
import { cloudinaryFetchUrl } from "@/lib/cloudinary";
import ImageLightbox from "@/components/ImageLightbox";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const optimizePhoto = (url: string, width = 800) => {
  if (url.startsWith("/")) return url;
  if (url.includes("res.cloudinary.com")) return url;
  return cloudinaryFetchUrl(url, width);
};

const TouristSpotDetail = () => {
  const { slug } = useParams<{ slug: string }>();
  const spot = touristSpotsDetailed.find((s) => s.slug === slug);
  const [lightbox, setLightbox] = useState<number | null>(null);

  if (!spot) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="max-w-[1280px] mx-auto px-4 py-20 text-center">
          <div className="text-6xl mb-4">🔍</div>
          <h1 className="font-bangla text-2xl text-primary mb-2">স্থান পাওয়া যায়নি</h1>
          <Link to="/" className="text-forest-light font-semibold hover:underline">← হোমে ফিরে যান</Link>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      {/* Hero */}
      <div className="relative h-[280px] lg:h-[420px] overflow-hidden">
        <img
          src={optimizePhoto(spot.photos[0], 1200)}
          alt={spot.name}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
          <div className="text-center z-10">
            {spot.badge && (
              <span className="bg-foreground/40 backdrop-blur-md text-primary-foreground text-xs font-bold px-3 py-1 rounded-full">
                {spot.badge}
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-[900px] mx-auto px-4 lg:px-10 py-8 lg:py-12">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-sm text-muted-foreground mb-6">
          <Link to="/" className="hover:text-forest-light">হোম</Link>
          <span>/</span>
          <Link to="/#tourism" className="hover:text-forest-light">দর্শনীয় স্থান</Link>
          <span>/</span>
          <span className="text-primary font-medium">{spot.name}</span>
        </div>

        <h1 className="font-bangla text-[28px] lg:text-[40px] text-primary leading-tight mb-1">{spot.name}</h1>
        {spot.realName && <p className="text-sm text-muted-foreground mb-4">{spot.realName}</p>}

        <div className="flex flex-wrap gap-2 mb-8">
          <span className="bg-muted text-primary text-xs font-semibold px-3 py-1.5 rounded-full">📍 {spot.location}</span>
          <span className="bg-muted text-primary text-xs font-semibold px-3 py-1.5 rounded-full">📏 {spot.distance}</span>
          <span className="bg-muted text-primary text-xs font-semibold px-3 py-1.5 rounded-full">⭐ {spot.rating}</span>
          <span className="bg-muted text-primary text-xs font-semibold px-3 py-1.5 rounded-full">🗓️ {spot.bestTime}</span>
        </div>

        <section className="mb-8">
          <h2 className="font-bangla text-xl text-primary mb-3 flex items-center gap-2">
            <span className="w-1 h-5 bg-secondary rounded-sm block" /> বিস্তারিত বিবরণ
          </h2>
          <p className="text-muted-foreground leading-relaxed">{spot.fullDescription}</p>
        </section>

        {spot.history && (
          <section className="mb-8">
            <h2 className="font-bangla text-xl text-primary mb-3 flex items-center gap-2">
              <span className="w-1 h-5 bg-secondary rounded-sm block" /> ইতিহাস
            </h2>
            <p className="text-muted-foreground leading-relaxed">{spot.history}</p>
          </section>
        )}

        {/* Photo Gallery */}
        <section className="mb-8">
          <h2 className="font-bangla text-xl text-primary mb-3 flex items-center gap-2">
            <span className="w-1 h-5 bg-secondary rounded-sm block" /> ছবি গ্যালারি
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {spot.photos.map((photo, i) => (
              <GalleryImage key={i} src={optimizePhoto(photo, 600)} alt={`${spot.name} - ছবি ${i + 1}`} onClick={() => setLightbox(i)} />
            ))}
          </div>
        </section>

        <section className="mb-8">
          <h2 className="font-bangla text-xl text-primary mb-3 flex items-center gap-2">
            <span className="w-1 h-5 bg-secondary rounded-sm block" /> বিশেষ আকর্ষণ
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {spot.highlights.map((h, i) => (
              <div key={i} className="flex items-center gap-2 bg-muted rounded-xl px-4 py-3">
                <span className="text-secondary">✦</span>
                <span className="text-sm text-primary">{h}</span>
              </div>
            ))}
          </div>
        </section>

        <section className="mb-8">
          <h2 className="font-bangla text-xl text-primary mb-3 flex items-center gap-2">
            <span className="w-1 h-5 bg-secondary rounded-sm block" /> কিভাবে যাবেন
          </h2>
          <div className="bg-muted rounded-2xl p-5">
            <p className="text-muted-foreground">{spot.howToReach}</p>
            {spot.entryFee && (
              <p className="text-sm text-forest-light font-semibold mt-2">🎫 {spot.entryFee}</p>
            )}
          </div>
        </section>

        {spot.tips && spot.tips.length > 0 && (
          <section className="mb-8">
            <h2 className="font-bangla text-xl text-primary mb-3 flex items-center gap-2">
              <span className="w-1 h-5 bg-secondary rounded-sm block" /> পরামর্শ ও টিপস
            </h2>
            <div className="space-y-2">
              {spot.tips.map((tip, i) => (
                <div key={i} className="flex items-start gap-2 bg-accent/20 rounded-xl px-4 py-3">
                  <span className="text-secondary mt-0.5">💡</span>
                  <span className="text-sm text-primary">{tip}</span>
                </div>
              ))}
            </div>
          </section>
        )}

        <div className="pt-4 border-t border-border">
          <Link to="/#tourism" className="inline-flex items-center gap-2 text-forest-light font-semibold hover:underline">
            ← সব দর্শনীয় স্থান দেখুন
          </Link>
        </div>
      </div>

      <Footer />

      {lightbox !== null && (
        <ImageLightbox
          images={spot.photos.map((p) => optimizePhoto(p, 1200))}
          initialIndex={lightbox}
          onClose={() => setLightbox(null)}
        />
      )}
    </div>
  );
};

const GalleryImage = ({ src, alt, onClick }: { src: string; alt: string; onClick: () => void }) => {
  const [loaded, setLoaded] = useState(false);
  const [error, setError] = useState(false);

  return (
    <div className="rounded-2xl overflow-hidden h-[180px] lg:h-[200px] cursor-pointer relative" onClick={onClick}>
      {!loaded && !error && <div className="absolute inset-0 bg-muted animate-pulse" />}
      {!error ? (
        <img
          src={src}
          alt={alt}
          className={`w-full h-full object-cover hover:scale-105 transition-all duration-300 ${loaded ? "opacity-100" : "opacity-0"}`}
          loading="lazy"
          onLoad={() => setLoaded(true)}
          onError={() => setError(true)}
        />
      ) : (
        <div className="w-full h-full flex items-center justify-center bg-muted">
          <span className="text-4xl">🏔️</span>
        </div>
      )}
    </div>
  );
};

export default TouristSpotDetail;
