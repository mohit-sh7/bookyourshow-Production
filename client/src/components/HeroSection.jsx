import React, { useEffect, useRef, useState, useCallback } from "react";
import { ArrowRight, CalendarIcon, ClockIcon } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { dummyShowsData, assets } from "../assets/assets";

const SLIDE_INTERVAL = 3000;

const HeroSection = () => {
  const navigate = useNavigate();
  const slides = dummyShowsData;

  const [index, setIndex] = useState(0);

  // Touch gesture tracking
  const touchStartX = useRef(0);
  const touchEndX = useRef(0);
  const intervalRef = useRef(null);

  // Restart the auto-slide timer (used on mount and after manual interaction)
  const startAutoSlide = useCallback(() => {
    if (intervalRef.current) clearInterval(intervalRef.current);
    if (!slides.length) return;
    intervalRef.current = setInterval(() => {
      setIndex((prev) => (prev + 1) % slides.length);
    }, SLIDE_INTERVAL);
  }, [slides.length]);

  useEffect(() => {
    startAutoSlide();
    return () => clearInterval(intervalRef.current);
  }, [startAutoSlide]);

  const goToSlide = (i) => {
    setIndex(i);
    startAutoSlide(); // reset timer so it doesn't jump right after manual nav
  };

  const onTouchStart = (e) => {
    touchStartX.current = e.changedTouches[0].clientX;
    touchEndX.current = e.changedTouches[0].clientX;
  };
  const onTouchMove = (e) => (touchEndX.current = e.changedTouches[0].clientX);
  const onTouchEnd = () => {
    const diff = touchStartX.current - touchEndX.current;
    if (Math.abs(diff) > 50 && slides.length) {
      const next =
        diff > 0 ? (index + 1) % slides.length : (index - 1 + slides.length) % slides.length;
      goToSlide(next);
    }
  };

  // Guard against empty/loading data
  if (!slides.length) return null;

  const current = slides[index];

  const genresText = current.genres?.slice(0, 3).map((g) => g.name).join(" | ") ?? "";
  const releaseYear = current.release_date ? current.release_date.split("-")[0] : "—";
  const overviewText = current.overview
    ? current.overview.length > 220
      ? `${current.overview.slice(0, 220)}...`
      : current.overview
    : "";

  return (
    <div
      className="relative h-[92vh] w-full overflow-hidden pt-24"
      onTouchStart={onTouchStart}
      onTouchMove={onTouchMove}
      onTouchEnd={onTouchEnd}
    >
      {/* FADE STACK */}
      {slides.map((slide, i) => (
        <div
          key={slide._id}
          className={`absolute inset-0 bg-cover bg-center transition-opacity duration-[1400ms]
            ${i === index ? "opacity-100" : "opacity-0"}
          `}
          style={{
            backgroundImage: `url(${slide.backdrop_path})`,
          }}
          role="img"
          aria-label={slide.title}
        ></div>
      ))}

      {/* Soft Overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-[#0D031A]/60 to-[#05020A]"></div>

      {/* Content */}
     
<div className="relative z-10 h-full flex flex-col justify-center px-6 md:px-12 max-w-[1400px] mx-auto">
  <h1 className="text-heading-futuristic text-5xl md:text-[70px] leading-tight max-w-2xl drop-shadow-xl">
    {current.title}
  </h1>

  <div className="flex items-center gap-4 text-gray-300 mt-4">
    <span>{genresText}</span>
    <span className="flex items-center gap-1">
      <CalendarIcon className="w-4 h-4" /> {releaseYear}
    </span>
    <span className="flex items-center gap-1">
      <ClockIcon className="w-4 h-4" /> {current.runtime ?? "—"}m
    </span>
  </div>

  <p className="max-w-xl text-gray-300 mt-4 leading-relaxed">
    {overviewText}
  </p>
</div>

{/* Explore button: pinned to the right edge of the hero */}
<div className="absolute right-6 md:right-16 bottom-28 md:bottom-28 z-10">
  <button
    onClick={() => navigate(`/movies`)}
    className="btn-neon group flex items-center gap-2 px-4 py-2 text-sm rounded-full transition-all hover:scale-[1.05]"
  >
    Explore Movie
    <ArrowRight className="w-4 h-4 transition-all duration-300 ease-out group-hover:w-6 group-hover:translate-x-1" />
  </button>
</div>

      {/* DOTS */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex gap-3 z-20">
        {slides.map((_, i) => (
          <button
            key={i}
            onClick={() => goToSlide(i)}
            aria-label={`Go to slide ${i + 1} of ${slides.length}`}
            className={`h-3 w-3 rounded-full transition-all cursor-pointer
              ${i === index
                ? "bg-primary scale-125 shadow-[0_0_10px_rgba(127,0,255,0.8)]"
                : "bg-white/40 hover:bg-white/70"
              }
          `}
          ></button>
        ))}
      </div>
    </div>
  );
};

export default HeroSection;