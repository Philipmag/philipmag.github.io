import { useState, useEffect, useCallback } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

const TRAINING_PHOTOS = [
  {
    src: "https://d2xsxph8kpxj0f.cloudfront.net/110291972/eUbA5NSXSrUDToa4RxQdTu/processed-F67D2EC3-1C70-4817-83C5-9E0564490036_e75f3fdc.jpeg",
    alt: "Digital Guardians cybersecurity training session with seniors",
    caption: "Community cybersecurity training session",
  },
  {
    src: "https://d2xsxph8kpxj0f.cloudfront.net/110291972/eUbA5NSXSrUDToa4RxQdTu/processed-E84E6CD8-0F08-4048-BE7E-6F79AF1890C0_0229d4f6.jpeg",
    alt: "Digital Guardians presenter preparing training materials",
    caption: "Preparing hands-on training materials",
  },
  {
    src: "https://d2xsxph8kpxj0f.cloudfront.net/110291972/eUbA5NSXSrUDToa4RxQdTu/processed-410BA081-8343-4DDE-BFD4-52E1A68DE325_a2197f32.jpeg",
    alt: "Digital Guardians group training session",
    caption: "Interactive group learning session",
  },
  {
    src: "https://d2xsxph8kpxj0f.cloudfront.net/110291972/eUbA5NSXSrUDToa4RxQdTu/processed-2A9E4817-63E1-4A17-9A97-0165C5665C27_5a909937.jpeg",
    alt: "Digital Guardians instructor teaching seniors",
    caption: "One-on-one guidance for digital safety",
  },
];

export default function TrainingSlideshow() {
  const [current, setCurrent] = useState(0);
  const [isHovered, setIsHovered] = useState(false);

  const next = useCallback(() => {
    setCurrent((prev) => (prev + 1) % TRAINING_PHOTOS.length);
  }, []);

  const prev = useCallback(() => {
    setCurrent((prev) => (prev - 1 + TRAINING_PHOTOS.length) % TRAINING_PHOTOS.length);
  }, []);

  // Auto-advance every 5 seconds unless hovered
  useEffect(() => {
    if (isHovered) return;
    const timer = setInterval(next, 5000);
    return () => clearInterval(timer);
  }, [isHovered, next]);

  return (
    <div
      className="relative rounded-2xl overflow-hidden group"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Image container */}
      <div className="relative aspect-[4/3] bg-muted">
        {TRAINING_PHOTOS.map((photo, i) => (
          <img
            key={photo.src}
            src={photo.src}
            alt={photo.alt}
            className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-700 ${
              i === current ? "opacity-100" : "opacity-0"
            }`}
            loading={i === 0 ? "eager" : "lazy"}
          />
        ))}

        {/* Gradient overlay for caption */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />

        {/* Caption */}
        <div className="absolute bottom-0 left-0 right-0 p-6">
          <p className="text-white text-sm font-medium">
            {TRAINING_PHOTOS[current].caption}
          </p>
        </div>

        {/* Navigation arrows */}
        <button
          onClick={prev}
          className="absolute left-3 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-black/40 backdrop-blur-sm flex items-center justify-center text-white opacity-0 group-hover:opacity-100 transition-opacity hover:bg-black/60"
          aria-label="Previous photo"
        >
          <ChevronLeft className="w-5 h-5" />
        </button>
        <button
          onClick={next}
          className="absolute right-3 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-black/40 backdrop-blur-sm flex items-center justify-center text-white opacity-0 group-hover:opacity-100 transition-opacity hover:bg-black/60"
          aria-label="Next photo"
        >
          <ChevronRight className="w-5 h-5" />
        </button>
      </div>

      {/* Dots indicator */}
      <div className="absolute bottom-16 left-0 right-0 flex justify-center gap-2">
        {TRAINING_PHOTOS.map((_, i) => (
          <button
            key={i}
            onClick={() => setCurrent(i)}
            className={`w-2 h-2 rounded-full transition-all ${
              i === current
                ? "bg-primary w-6"
                : "bg-white/50 hover:bg-white/80"
            }`}
            aria-label={`Go to photo ${i + 1}`}
          />
        ))}
      </div>
    </div>
  );
}
