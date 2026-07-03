import React, { useState, useEffect, useCallback } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

const SLIDE_DATA = [
  {
    id: 1,
    image: 'https://img.freepik.com/premium-photo/merchandising-modern-mens-clothing-store-digital-art_1068997-1266.jpg',
    subtitle: 'URBAN STREETWEAR CO.',
    title: 'DEFINING MODERN MINIMALISM',
    description: 'Discover the Autumn/Winter collection featuring oversized Silhouettes, premium heavy-knit cotton, and earthy neutral tones.',
    primaryBtn: 'Shop Collection',
    secondaryBtn: 'Explore Lookbook',
  },
  {
    id: 2,
    image: 'https://thumbs.dreamstime.com/b/men-casual-clothing-shop-clothes-shopping-mall-wear-140082642.jpg',
    subtitle: 'EXCLUSIVELY CRAFTED',
    title: 'THE ATHLEISURE REVOLUTION',
    description: 'Engineered for the city. Performance fabrics meet tailored fits designed to transition seamlessly from street to lounge.',
    primaryBtn: 'Shop New Arrivals',
    secondaryBtn: 'View Campaign',
  },
  {
    id: 3,
    image: "https://png.pngtree.com/thumb_back/fw800/background/20230425/pngtree-fashion-store-interior-of-a-men-s-clothing-store-image_2519173.jpg",
    subtitle: 'PREMIUM UTILITY',
    title: 'FUNCTIONAL URBAN GEAR',
    description: 'Weather-resistant outerwear and modular cargo systems built for the modern commuter who refuses to compromise on style.',
    primaryBtn: 'Shop Outerwear',
    secondaryBtn: 'Discover Utility',
  }
];

export default function HomeSlidingPage() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);

  const nextSlide = useCallback(() => {
    if (isTransitioning) return;
    setIsTransitioning(true);
    setCurrentIndex((prevIndex) => (prevIndex + 1) % SLIDE_DATA.length);
  }, [isTransitioning]);

  const prevSlide = () => {
    if (isTransitioning) return;
    setIsTransitioning(true);
    setCurrentIndex((prevIndex) => (prevIndex - 1 + SLIDE_DATA.length) % SLIDE_DATA.length);
  };

  const goToSlide = (index) => {
    if (isTransitioning || index === currentIndex) return;
    setIsTransitioning(true);
    setCurrentIndex(index);
  };

  // Auto-slide every 4 seconds
  useEffect(() => {
    const timer = setInterval(nextSlide, 4000);
    return () => clearInterval(timer);
  }, [nextSlide]);

  // Reset transitioning block after animation completes (Tailwind duration-700)
  useEffect(() => {
    const transitionTimer = setTimeout(() => {
      setIsTransitioning(false);
    }, 700);
    return () => clearTimeout(transitionTimer);
  }, [currentIndex]);

  return (
    <div className="relative w-full h-[80vh] md:h-screen overflow-hidden bg-black select-none">
      
      {/* Slides Container */}
      {SLIDE_DATA.map((slide, index) => {
        const isActive = index === currentIndex;
        return (
          <div
            key={slide.id}
            className={`absolute inset-0 w-full h-full transition-opacity duration-700 ease-in-out ${
              isActive ? 'opacity-100 z-10' : 'opacity-0 z-0'
            }`}
          >
            {/* Background Image */}
            <img
              src={slide.image}
              alt={slide.title}
              className="w-full h-full object-cover object-center transform scale-105 transition-transform duration-[4000ms] ease-out"
              style={{ transform: isActive ? 'scale(1)' : 'scale(1.05)' }}
            />
            
            {/* Dark Premium Gradient Overlay */}
            <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/40 to-transparent md:bg-gradient-to-t md:from-black/80 md:via-black/30 md:to-black/20" />

            {/* Content Layer */}
            <div className="absolute inset-0 z-20 flex flex-col justify-end md:justify-center items-start px-6 sm:px-12 md:px-20 lg:px-32 pb-16 md:pb-0 max-w-4xl text-white">
              
              <span className={`tracking-[0.25em] text-xs sm:text-sm font-semibold text-gray-300 uppercase mb-3 transform transition-all duration-700 delay-300 ${
                isActive ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'
              }`}>
                {slide.subtitle}
              </span>
              
              <h1 className={`text-3xl sm:text-5xl md:text-6xl lg:text-7xl font-extrabold tracking-tight leading-tight md:leading-none mb-4 md:mb-6 transform transition-all duration-700 delay-500 ${
                isActive ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'
              }`}>
                {slide.title}
              </h1>
              
              <p className={`text-sm sm:text-base md:text-lg text-gray-300 font-light max-w-xl mb-8 md:mb-10 leading-relaxed transform transition-all duration-700 delay-700 ${
                isActive ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'
              }`}>
                {slide.description}
              </p>
              
              {/* Responsive Buttons */}
              <div className={`flex flex-col sm:flex-row gap-4 w-full sm:w-auto transform transition-all duration-700 delay-900 ${
                isActive ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'
              }`}>
                <button className="px-8 py-3.5 bg-white text-black font-medium tracking-wide uppercase hover:bg-black hover:text-white border border-white transition-colors duration-300 text-sm w-full sm:w-auto shadow-lg">
                  {slide.primaryBtn}
                </button>
                <button className="px-8 py-3.5 bg-transparent text-white font-medium tracking-wide uppercase hover:bg-white hover:text-black border border-white/60 hover:border-white transition-colors duration-300 text-sm w-full sm:w-auto backdrop-blur-sm">
                  {slide.secondaryBtn}
                </button>
              </div>

            </div>
          </div>
        );
      })}

      {/* Navigation Arrows (Hidden on mobile for seamless premium touch UX) */}
      <button
        onClick={prevSlide}
        className="hidden md:flex absolute left-6 top-1/2 -translate-y-1/2 z-30 w-12 h-12 items-center justify-center rounded-full border border-white/20 bg-black/10 text-white hover:bg-white hover:text-black hover:border-white transition-all duration-300 backdrop-blur-sm group"
        aria-label="Previous slide"
      >
        <ChevronLeft className="w-5 h-5 transform group-hover:-translate-x-0.5 transition-transform" />
      </button>
      <button
        onClick={nextSlide}
        className="hidden md:flex absolute right-6 top-1/2 -translate-y-1/2 z-30 w-12 h-12 items-center justify-center rounded-full border border-white/20 bg-black/10 text-white hover:bg-white hover:text-black hover:border-white transition-all duration-300 backdrop-blur-sm group"
        aria-label="Next slide"
      >
        <ChevronRight className="w-5 h-5 transform group-hover:translate-x-0.5 transition-transform" />
      </button>

      {/* Bottom Indicators (Dots) */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-30 flex items-center gap-3">
        {SLIDE_DATA.map((_, index) => (
          <button
            key={index}
            onClick={() => goToSlide(index)}
            className={`h-1.5 transition-all duration-500 rounded-full ${
              index === currentIndex ? 'w-8 bg-white' : 'w-2 bg-white/40 hover:bg-white/70'
            }`}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>
    </div>
  );
}