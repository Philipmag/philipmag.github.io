import { useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
const TRAINING_PHOTOS = [
  {
    src: "/media/processed-F67D2EC3-1C70-4817-83C5-9E0564490036_e75f3fdc.jpeg",
    alt: "Digital Guardians cybersecurity training session with older adults",
    caption: "Community cybersecurity training session",
  },
  {
    src: "/media/processed-E84E6CD8-0F08-4048-BE7E-6F79AF1890C0_0229d4f6.jpeg",
    alt: "Digital Guardians presenter preparing materials",
    caption: "Preparing hands-on training materials",
  },
  {
    src: "/media/processed-410BA081-8343-4DDE-BFD4-52E1A68DE325_a2197f32.jpeg",
    alt: "Digital Guardians group training session",
    caption: "Interactive group learning session",
  },
  {
    src: "/media/processed-2A9E4817-63E1-4A17-9A97-0165C5665C27_5a909937.jpeg",
    alt: "Digital Guardians instructor teaching older adults",
    caption: "One-on-one guidance for digital safety",
  },
];
export default function TrainingSlideshow() {
  const [current, setCurrent] = useState(0);
  const photo = TRAINING_PHOTOS[current];
  return (
    <div role="region" aria-label="Community workshop photographs">
      <figure className="scene">
        <img
          src={photo.src}
          alt={photo.alt}
          width="1200"
          height="900"
          style={{ aspectRatio: "4 / 3", objectFit: "contain" }}
          loading="lazy"
          decoding="async"
        />
        <figcaption aria-live="polite">{photo.caption}</figcaption>
      </figure>
      <div className="flex items-center justify-between mt-5">
        <button
          type="button"
          className="icon-button"
          aria-label="Previous workshop photo"
          onClick={() =>
            setCurrent(
              (current - 1 + TRAINING_PHOTOS.length) % TRAINING_PHOTOS.length
            )
          }
        >
          <ChevronLeft size={18} />
        </button>
        <span className="text-sm text-muted-foreground">
          Photo {current + 1} of {TRAINING_PHOTOS.length}
        </span>
        <button
          type="button"
          className="icon-button"
          aria-label="Next workshop photo"
          onClick={() => setCurrent((current + 1) % TRAINING_PHOTOS.length)}
        >
          <ChevronRight size={18} />
        </button>
      </div>
    </div>
  );
}
