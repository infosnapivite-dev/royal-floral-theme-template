import React, { useRef, useLayoutEffect } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

import venueImage from '../assets/venue-chateau-estate.png';
import venueFlower from '../assets/venue page flower.png';
import FloatingBotanicals from './FloatingBotanicals';

gsap.registerPlugin(ScrollTrigger);

const gpuLayerStyle = {
  transform: 'translate3d(0, 0, 0)',
  WebkitTransform: 'translate3d(0, 0, 0)',
  backfaceVisibility: 'hidden',
  WebkitBackfaceVisibility: 'hidden',
  willChange: 'transform, opacity',
};

export default function VenueSection() {
  const sectionRef = useRef(null);
  const headerRef = useRef(null);
  const compassRef = useRef(null);
  const venueVisualRef = useRef(null);
  const venueImgRef = useRef(null);
  const floralLeftRef = useRef(null);
  const floralRightRef = useRef(null);
  const addressDetailsRef = useRef(null);
  const directionsCtaRef = useRef(null);

  useLayoutEffect(() => {
    const scroller = document.querySelector('#mockup-scroll-container') || window;
    if (!sectionRef.current) return;

    const ctx = gsap.context(() => {
      // 1. ROTATING CARTOGRAPHIC ASTROLABE / CELESTIAL COMPASS (Unique Scroll Parallax)
      if (compassRef.current) {
        gsap.fromTo(
          compassRef.current,
          { rotate: -35 },
          {
            rotate: 135,
            ease: 'none',
            scrollTrigger: {
              trigger: sectionRef.current,
              scroller: scroller,
              start: 'top bottom',
              end: 'bottom top',
              scrub: 1.2,
            },
          }
        );
      }

      // 2. ARCHITECTURAL VISTA PARALLAX (Subtle zoom & depth elevation)
      if (venueVisualRef.current && venueImgRef.current) {
        // Outer frame movement
        gsap.fromTo(
          venueVisualRef.current,
          { y: 40 },
          {
            y: -30,
            ease: 'none',
            scrollTrigger: {
              trigger: venueVisualRef.current,
              scroller: scroller,
              start: 'top bottom',
              end: 'bottom top',
              scrub: 1.3,
            },
          }
        );

        // Inner image optical zoom depth
        gsap.fromTo(
          venueImgRef.current,
          { scale: 1.0, yPercent: -5 },
          {
            scale: 1.12,
            yPercent: 5,
            ease: 'none',
            scrollTrigger: {
              trigger: venueVisualRef.current,
              scroller: scroller,
              start: 'top bottom',
              end: 'bottom top',
              scrub: 1.4,
            },
          }
        );
      }

      // 4. BOTANICAL FOREGROUND LAYERS (High differential velocity & gentle sway)
      if (floralLeftRef.current) {
        gsap.fromTo(
          floralLeftRef.current,
          { y: 35, x: -8, rotate: -4 },
          {
            y: -35,
            x: 6,
            rotate: 3,
            ease: 'none',
            scrollTrigger: {
              trigger: venueVisualRef.current,
              scroller: scroller,
              start: 'top bottom',
              end: 'bottom top',
              scrub: 0.85,
            },
          }
        );
      }

      if (floralRightRef.current) {
        gsap.fromTo(
          floralRightRef.current,
          { y: 40, x: 8, rotate: 4 },
          {
            y: -40,
            x: -6,
            rotate: -3,
            ease: 'none',
            scrollTrigger: {
              trigger: venueVisualRef.current,
              scroller: scroller,
              start: 'top bottom',
              end: 'bottom top',
              scrub: 0.9,
            },
          }
        );
      }

      // 5. ADDRESS & TRANSPORTATION PARALLAX REVEAL
      if (addressDetailsRef.current) {
        gsap.fromTo(
          addressDetailsRef.current,
          { y: 35, opacity: 0.7 },
          {
            y: -15,
            opacity: 1,
            ease: 'none',
            scrollTrigger: {
              trigger: addressDetailsRef.current,
              scroller: scroller,
              start: 'top bottom',
              end: 'center center',
              scrub: 1.0,
            },
          }
        );
      }

      // 6. DIRECTIONS CTA FLOAT
      if (directionsCtaRef.current) {
        gsap.fromTo(
          directionsCtaRef.current,
          { y: 25, scale: 0.96 },
          {
            y: -10,
            scale: 1,
            ease: 'none',
            scrollTrigger: {
              trigger: directionsCtaRef.current,
              scroller: scroller,
              start: 'top bottom',
              end: 'bottom bottom',
              scrub: 1.2,
            },
          }
        );
      }
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      className="relative w-full pt-16 pb-24 px-5 overflow-hidden select-none"
      style={gpuLayerStyle}
    >
      {/* Floating Botanical Parallax Leaves & Petals */}
      <FloatingBotanicals variant="venue" />
      {/* Soft Ambient Radial Sunbeam (Depth Layer) */}
      <div
        className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[340px] h-[340px] rounded-full pointer-events-none opacity-40 blur-3xl"
        style={{
          background: 'radial-gradient(circle, rgba(230, 205, 155, 0.35) 0%, rgba(247, 214, 210, 0.2) 50%, transparent 75%)',
        }}
      />

      {/* ===================================================================
          1. EDITORIAL HEADER & ROTATING CELESTIAL ASTROLABE
         =================================================================== */}
      <div ref={headerRef} className="text-center relative z-10 mb-8">
        {/* Astrolabe / Compass Ornament */}
        <div className="flex items-center justify-center gap-3 mb-3">
          <div className="h-[1px] w-12 bg-gradient-to-r from-transparent via-[#c5a059]/60 to-[#c5a059]" />
          
          <div
            ref={compassRef}
            className="w-9 h-9 rounded-full border border-[#c5a059]/50 flex items-center justify-center text-[#c5a059] shadow-sm bg-white/40 backdrop-blur-xs"
            title="Cartographic Orientation"
          >
            <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              <circle cx="12" cy="12" r="9.5" strokeDasharray="1.5 2.5" />
              <polygon points="12,3 14.5,10.5 22,12 14.5,13.5 12,21 9.5,13.5 2,12 9.5,10.5" fill="rgba(197, 160, 89, 0.18)" />
              <circle cx="12" cy="12" r="1.5" fill="#801b26" stroke="none" />
            </svg>
          </div>

          <div className="h-[1px] w-12 bg-gradient-to-l from-transparent via-[#c5a059]/60 to-[#c5a059]" />
        </div>

        {/* Section Eyebrow */}
        <p className="text-[10px] uppercase tracking-[0.38em] text-[#801b26] font-royal font-semibold mb-2">
          The Sanctuary of Our Vows
        </p>

        {/* Primary Serif Title */}
        <h2 className="text-2xl md:text-3xl font-royal tracking-wide text-[#1a1519] font-medium leading-tight">
          Château de Versailles
        </h2>
      </div>

      {/* ===================================================================
          2. OPEN ARCHITECTURAL VENUE VISTA (STRICTLY NOT IN A CARD LAYOUT)
             Softly vignetted into canvas + floating botanical foreground depth
         =================================================================== */}
      <div
        ref={venueVisualRef}
        className="relative w-full max-w-[380px] mx-auto my-6 overflow-visible will-animate"
        style={gpuLayerStyle}
      >
        {/* Natural Vignetted Watercolor Artwork Container */}
        <div className="relative w-full overflow-visible">
          {/* Zooming Architectural Watercolor Painting */}
          <img
            ref={venueImgRef}
            src={venueImage}
            alt="Château de Versailles luxury wedding venue with parterre gardens"
            className="w-full h-auto object-contain object-center will-animate drop-shadow-[0_12px_28px_rgba(0,0,0,0.06)]"
            style={{
              transformOrigin: '50% 60%',
              ...gpuLayerStyle,
            }}
          />
        </div>

        {/* Floating Botanical Foreground Floral Sprays (venue page flower.png) */}
        {/* Left Floral Accent (Rotated 110deg to the left) */}
        <div
          ref={floralLeftRef}
          className="absolute -top-6 -left-6 sm:-left-8 w-20 sm:w-24 z-20 pointer-events-none will-animate drop-shadow-md"
          style={gpuLayerStyle}
        >
          <img
            src={venueFlower}
            alt="Venue floral accent left"
            className="w-full h-auto object-contain origin-center"
            style={{ transform: 'rotate(-110deg)', transformOrigin: 'center' }}
          />
        </div>

        {/* Right Floral Accent (Mirrored for symmetrical architectural elegance) */}
        <div
          ref={floralRightRef}
          className="absolute -bottom-6 -right-6 sm:-right-8 w-20 sm:w-24 z-20 pointer-events-none will-animate drop-shadow-md"
          style={gpuLayerStyle}
        >
          <img
            src={venueFlower}
            alt="Venue floral accent right"
            className="w-full h-auto object-contain transform scale-x-[-1]"
          />
        </div>
      </div>

      {/* ===================================================================
          3. VENUE ADDRESS & LOGISTICAL TRAVEL NOTES (Editorial Typography)
         =================================================================== */}
      <div
        ref={addressDetailsRef}
        className="w-full max-w-[360px] mx-auto text-center mt-6 will-animate"
        style={gpuLayerStyle}
      >
        {/* Address Lines */}
        <p className="text-[13px] font-royal tracking-widest text-[#801b26] font-semibold uppercase mb-1">
          Estate Address
        </p>
        
        <p className="font-serif-display text-lg text-[#1a1519] leading-snug">
          Place d'Armes, 78000 Versailles
        </p>
        <p className="font-serif-display text-sm text-[#5c5049] italic mb-5">
          Île-de-France, France
        </p>

        {/* Subtle Decorative Golden Dividing Bar */}
        <div className="flex items-center justify-center gap-2 mb-6">
          <span className="w-8 h-[1px] bg-[#c5a059]/40" />
          <span className="w-1.5 h-1.5 rounded-full bg-[#c5a059]" />
          <span className="w-8 h-[1px] bg-[#c5a059]/40" />
        </div>
      </div>

      {/* ===================================================================
          4. INTERACTIVE DIRECTION BUTTON
         =================================================================== */}
      <div
        ref={directionsCtaRef}
        className="w-full max-w-[340px] mx-auto flex flex-col items-center will-animate z-20 relative"
        style={gpuLayerStyle}
      >
        {/* Primary Get Directions CTA */}
        <a
          href="https://maps.google.com/?q=Ch%C3%A2teau+de+Versailles,+Place+d'Armes,+78000+Versailles,+France"
          target="_blank"
          rel="noopener noreferrer"
          className="group relative w-full flex items-center justify-center gap-2.5 px-6 py-3.5 rounded-full bg-gradient-to-r from-[#801b26] via-[#982230] to-[#801b26] text-[#fdfaf5] shadow-lg shadow-[#801b26]/20 border border-[#c5a059]/40 hover:border-[#c5a059] hover:shadow-xl hover:shadow-[#801b26]/30 active:scale-[0.98] transition-all duration-300"
        >
          {/* Subtle Gilded Button Shimmer */}
          <div className="absolute inset-0 rounded-full bg-gradient-to-r from-transparent via-white/15 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />

          {/* Direction Compass Icon */}
          <svg
            className="w-4 h-4 text-[#e5c98a] group-hover:translate-x-0.5 transition-transform duration-300"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <polygon points="3 11 22 2 13 21 11 13 3 11" />
          </svg>

          <span className="font-royal text-xs tracking-[0.22em] uppercase font-semibold text-white">
            Get Directions
          </span>
        </a>
      </div>
    </section>
  );
}
