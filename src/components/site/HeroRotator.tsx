import { useEffect, useRef, useState } from "react";
import { Pause, Play } from "lucide-react";

type Slide = {
  src: string;
  alt: string;
  width: number;
  height: number;
};

const INTERVAL_MS = 4500;

export function HeroRotator({ slides }: { slides: Slide[] }) {
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (slides.length <= 1 || paused) return;
    const id = setInterval(() => {
      setIndex((i) => (i + 1) % slides.length);
    }, INTERVAL_MS);
    return () => clearInterval(id);
  }, [slides.length, paused]);

  return (
    <div
      ref={containerRef}
      className="relative w-full overflow-hidden rounded-[20px] border border-border/60 shadow-elevated sm:rounded-[24px]"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onFocus={() => setPaused(true)}
      onBlur={(e) => {
        if (!containerRef.current?.contains(e.relatedTarget as Node)) {
          setPaused(false);
        }
      }}
    >
      {/* Fixed 4:3 box so all three slides share one frame regardless of source size */}
      <div className="relative aspect-[4/3] w-full">
        {slides.map((slide, i) => (
          <img
            key={slide.src}
            src={slide.src}
            alt={slide.alt}
            width={slide.width}
            height={slide.height}
            loading={i === 0 ? "eager" : "lazy"}
            decoding="async"
            {...(i === 0 ? { fetchPriority: "high" as const } : {})}
            className={
              "absolute inset-0 h-full w-full object-cover transition-opacity duration-700 ease-in-out " +
              (i === index ? "opacity-100" : "opacity-0")
            }
          />
        ))}
      </div>

      {slides.length > 1 && (
        <div className="absolute bottom-4 left-1/2 flex -translate-x-1/2 items-center gap-3">
          <div className="flex gap-2">
            {slides.map((slide, i) => (
              <button
                key={slide.src}
                type="button"
                aria-label={`Show slide ${i + 1}`}
                onClick={() => setIndex(i)}
                className={
                  "h-1.5 rounded-full transition-all " +
                  (i === index ? "w-6 bg-primary" : "w-1.5 bg-white/60")
                }
              />
            ))}
          </div>
          <button
            type="button"
            aria-label={paused ? "Play slideshow" : "Pause slideshow"}
            onClick={() => setPaused((p) => !p)}
            className="grid h-6 w-6 place-items-center rounded-full bg-black/40 text-white transition-colors hover:bg-black/60"
          >
            {paused ? <Play className="h-3 w-3" /> : <Pause className="h-3 w-3" />}
          </button>
        </div>
      )}
    </div>
  );
}
