import React, { useState, useRef, useLayoutEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

// Import the 3 event illustrations
import welcomeDinnerImg from '../assets/welcome-dinner.webp';
import weddingCeremonyImg from '../assets/wedding-ceremony.webp';
import receptionImg from '../assets/reception-transparent.webp';
import FloatingBotanicals from './FloatingBotanicals';

const gpuLayerStyle = {
  transform: 'translate3d(0, 0, 0)',
  WebkitTransform: 'translate3d(0, 0, 0)',
  backfaceVisibility: 'hidden',
  WebkitBackfaceVisibility: 'hidden',
  willChange: 'transform, opacity',
};

export default function EventsPage({ onNavigate, activeTab = 'events' }) {
  const [selectedLocation, setSelectedLocation] = useState(null);
  const sectionRef = useRef(null);
  const headerRef = useRef(null);
  const cardRefs = useRef([]);

  const events = [
    {
      id: 'welcome-dinner',
      day: 'Friday',
      date: 'MAY 16',
      title: 'Welcome Dinner',
      time: 'Friday · 7:00 PM',
      location: 'The Rose Garden',
      address: 'The Grand Pavilion & Rose Parterre, Palace Gardens',
      image: welcomeDinnerImg,
      alt: 'Welcome dinner table illustration with roses and palace backdrop',
      isTinted: false,
    },
    {
      id: 'wedding-ceremony',
      day: 'Saturday',
      date: 'MAY 17',
      title: 'Wedding Ceremony',
      time: 'Saturday · 4:00 PM',
      location: 'The Rose Garden',
      address: 'Central Floral Colonnade & Fountain Courtyard',
      image: weddingCeremonyImg,
      alt: 'Wedding ceremony floral archway with palace view',
      isTinted: true, // Distinct soft blush peach-rose background band as in reference
    },
    {
      id: 'reception',
      day: 'Saturday',
      date: 'MAY 17',
      title: 'Reception',
      time: 'Saturday · 7:00 PM',
      location: 'The Rose Garden',
      address: 'The Orangery Ballroom & Lantern Lawn',
      image: receptionImg,
      alt: 'Reception dinner table under lantern-lit boughs',
      isTinted: false,
    },
  ];

  useLayoutEffect(() => {
    const scroller = document.querySelector('#mockup-scroll-container') || window;
    if (!sectionRef.current) return;

    const ctx = gsap.context(() => {
      // =======================================================================
      // 1. ENHANCED HEADER PARALLAX CASCADE (Multi-depth text travel)
      // =======================================================================
      if (headerRef.current) {
        const eyebrow = headerRef.current.querySelector('.header-eyebrow');
        const title = headerRef.current.querySelector('.header-title');
        const subtitle = headerRef.current.querySelector('.header-subtitle');

        if (eyebrow) {
          gsap.fromTo(
            eyebrow,
            { y: 45, opacity: 0.4 },
            {
              y: -25,
              opacity: 1,
              ease: 'none',
              scrollTrigger: {
                trigger: headerRef.current,
                scroller: scroller,
                start: 'top bottom',
                end: 'bottom top',
                scrub: 1.1,
              },
            }
          );
        }

        if (title) {
          gsap.fromTo(
            title,
            { y: 65, scale: 0.90, opacity: 0.5 },
            {
              y: -38,
              scale: 1.08,
              opacity: 1,
              ease: 'none',
              scrollTrigger: {
                trigger: headerRef.current,
                scroller: scroller,
                start: 'top bottom',
                end: 'bottom top',
                scrub: 1.3,
              },
            }
          );
        }

        if (subtitle) {
          gsap.fromTo(
            subtitle,
            { y: 42, opacity: 0.55 },
            {
              y: -22,
              opacity: 1,
              ease: 'none',
              scrollTrigger: {
                trigger: headerRef.current,
                scroller: scroller,
                start: 'top bottom',
                end: 'bottom top',
                scrub: 0.95,
              },
            }
          );
        }
      }

      // =======================================================================
      // 2. ENHANCED MULTI-TIER TEXT & ILLUSTRATION PARALLAX ON EACH CARD
      // =======================================================================
      cardRefs.current.forEach((cardEl, idx) => {
        if (!cardEl) return;
        const isReversed = idx === 1;

        const imgEl = cardEl.querySelector('.event-illustration');
        const titleEl = cardEl.querySelector('.event-title');
        const timeEl = cardEl.querySelector('.event-time');
        const locationEl = cardEl.querySelector('.event-location');
        const actionEl = cardEl.querySelector('.event-action');

        // A. HIGH-SPEED FLOATING WATERCOLOR ILLUSTRATION (Pronounced depth & 3D tilt)
        if (imgEl) {
          gsap.fromTo(
            imgEl,
            {
              y: 95,
              scale: 0.86,
              rotate: isReversed ? 5 : -5,
            },
            {
              y: -85,
              scale: 1.14,
              rotate: isReversed ? -3.5 : 3.5,
              ease: 'none',
              scrollTrigger: {
                trigger: cardEl,
                scroller: scroller,
                start: 'top bottom',
                end: 'bottom top',
                scrub: 1.4,
              },
            }
          );
        }

        // B. PARALLAX TEXT ELEMENT 1: TITLE (Pronounced vertical & lateral float)
        if (titleEl) {
          gsap.fromTo(
            titleEl,
            { y: 52, x: isReversed ? 16 : -16 },
            {
              y: -40,
              x: isReversed ? -10 : 10,
              ease: 'none',
              scrollTrigger: {
                trigger: cardEl,
                scroller: scroller,
                start: 'top bottom',
                end: 'bottom top',
                scrub: 1.1,
              },
            }
          );
        }

        // C. PARALLAX TEXT ELEMENT 2: TIME (Gentle trailing speed)
        if (timeEl) {
          gsap.fromTo(
            timeEl,
            { y: 35 },
            {
              y: -26,
              ease: 'none',
              scrollTrigger: {
                trigger: cardEl,
                scroller: scroller,
                start: 'top bottom',
                end: 'bottom top',
                scrub: 0.9,
              },
            }
          );
        }

        // D. PARALLAX TEXT ELEMENT 3: LOCATION PIN & VENUE (Medium-high speed)
        if (locationEl) {
          gsap.fromTo(
            locationEl,
            { y: 56, opacity: 0.7 },
            {
              y: -42,
              opacity: 1,
              ease: 'none',
              scrollTrigger: {
                trigger: cardEl,
                scroller: scroller,
                start: 'top bottom',
                end: 'bottom top',
                scrub: 1.25,
              },
            }
          );
        }

        // E. PARALLAX TEXT ELEMENT 4: "VIEW LOCATION" ACTION LINK (Eager glide & scale)
        if (actionEl) {
          gsap.fromTo(
            actionEl,
            { y: 72, scale: 0.90 },
            {
              y: -54,
              scale: 1.08,
              ease: 'none',
              scrollTrigger: {
                trigger: cardEl,
                scroller: scroller,
                start: 'top bottom',
                end: 'bottom top',
                scrub: 1.5,
              },
            }
          );
        }
      });

      // =======================================================================
      // 3. FLOATING AMBIENT BOTANICAL PETALS PARALLAX (Atmospheric depth)
      // =======================================================================
      const petals = sectionRef.current.querySelectorAll('.ambient-petal');
      petals.forEach((petal, i) => {
        const speed = [1.6, 2.0, 1.4][i % 3];
        const yStart = [-40, 80, -30][i % 3];
        const yEnd = [110, -120, 100][i % 3];
        const rotStart = [-25, 40, -15][i % 3];
        const rotEnd = [65, -50, 45][i % 3];

        gsap.fromTo(
          petal,
          { y: yStart, rotate: rotStart, opacity: 0.35 },
          {
            y: yEnd,
            rotate: rotEnd,
            opacity: 0.65,
            ease: 'none',
            scrollTrigger: {
              trigger: sectionRef.current,
              scroller: scroller,
              start: 'top bottom',
              end: 'bottom top',
              scrub: speed,
            },
          }
        );
      });
    }, sectionRef);

    // Refresh ScrollTrigger to ensure calculations match container height
    ScrollTrigger.refresh();

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      id="events-section"
      className="relative w-full bg-transparent flex flex-col pt-3 pb-8 select-none border-t border-[#c5a059]/20 overflow-hidden"
    >
      {/* Ambient Parallax Watercolor Rose Petals & Leaves for 3D Depth-of-Field */}
      <FloatingBotanicals variant="events" />
      {/* =========================================================================
          TOP EDITORIAL HEADER WITH INDIVIDUAL PARALLAX LAYERS
         ========================================================================= */}
      <header
        ref={headerRef}
        className="w-full pt-3 pb-6 px-4 flex flex-col items-center text-center overflow-hidden"
      >
        {/* Subtle Eyebrow Divider */}
        <div
          style={gpuLayerStyle}
          className="header-eyebrow flex items-center justify-center gap-3 w-full max-w-[300px] mb-2.5"
        >
          <div className="h-[1px] flex-1 bg-[#dcd2c6]" />
          <span className="text-[11px] font-medium tracking-[0.24em] text-[#786f67] uppercase font-serif-display">
            04 · Date-Led Editorial
          </span>
          <div className="h-[1px] flex-1 bg-[#dcd2c6]" />
        </div>

        {/* Main Headline */}
        <h2
          style={gpuLayerStyle}
          className="header-title font-serif-display text-[35px] sm:text-[37px] font-normal tracking-wide text-[#98474e] leading-tight"
        >
          Our Celebrations
        </h2>

        {/* Subtitle */}
        <p
          style={gpuLayerStyle}
          className="header-subtitle text-[14.5px] sm:text-[15px] text-[#635b54] font-normal tracking-wide mt-1.5"
        >
          Join us for a beautiful weekend
        </p>
      </header>

      {/* =========================================================================
          EVENTS CARDS LIST WITH MULTI-DEPTH TEXT & ARTWORK PARALLAX
         ========================================================================= */}
      <div className="w-full flex-1 flex flex-col">
        {events.map((evt, idx) => {
          const isReversed = idx === 1; // Second event: image on left, text on right

          return (
            <article
              key={evt.id}
              ref={(el) => (cardRefs.current[idx] = el)}
              className={`w-full py-8 px-4 sm:px-5 flex items-center justify-between transition-colors overflow-hidden ${
                evt.isTinted ? 'bg-[#fbf0ec]/80 backdrop-blur-[1px]' : 'bg-transparent'
              } ${isReversed ? 'flex-row-reverse' : 'flex-row'}`}
            >
              {/* Event Details: Each sub-element scrolls with individual parallax velocity */}
              <div
                className={`flex-1 min-w-0 flex flex-col justify-center ${
                  isReversed ? 'pl-4 pr-1' : 'pr-4 pl-1'
                }`}
              >
                {/* 1. Title Layer */}
                <h3
                  style={gpuLayerStyle}
                  className="event-title font-serif-display text-[21.5px] sm:text-[22.5px] font-normal text-[#98474e] leading-snug"
                >
                  {evt.title}
                </h3>

                {/* 2. Time Layer */}
                <p
                  style={gpuLayerStyle}
                  className="event-time text-[13.5px] sm:text-[14px] text-[#635b54] mt-1 tracking-normal font-normal"
                >
                  {evt.time}
                </p>

                {/* 3. Location Pin & Venue Layer */}
                <div
                  style={gpuLayerStyle}
                  className="event-location flex items-center gap-1.5 mt-1.5 text-[13.5px] sm:text-[14px] text-[#635b54]"
                >
                  <svg
                    className="w-4 h-4 text-[#98474e] shrink-0"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.8"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z" />
                    <circle cx="12" cy="10" r="3" />
                  </svg>
                  <span className="truncate">{evt.location}</span>
                </div>

                {/* 4. Action Link Layer */}
                <div style={gpuLayerStyle} className="event-action mt-3">
                  <button
                    type="button"
                    onClick={() => setSelectedLocation(evt)}
                    className="inline-flex items-center text-[13px] font-normal text-[#98474e] underline underline-offset-[3.5px] decoration-[#98474e]/60 hover:decoration-[#98474e] transition-colors w-fit"
                  >
                    View location <span className="ml-1 inline-block">→</span>
                  </button>
                </div>
              </div>

              {/* Watercolor Illustration (Floating 3D Layer) */}
              <div
                style={gpuLayerStyle}
                className="event-illustration w-[148px] sm:w-[158px] h-[112px] sm:h-[118px] shrink-0 flex items-center justify-center overflow-visible"
              >
                <img
                  src={evt.image}
                  alt={evt.alt}
                  className="w-full h-full object-contain pointer-events-none drop-shadow-[0_6px_18px_rgba(0,0,0,0.08)]"
                />
              </div>
            </article>
          );
        })}
      </div>

      {/* Decorative Bottom Ending */}
      <div className="w-full pt-10 pb-5 flex flex-col items-center justify-center">
        <div className="w-14 h-[1px] bg-[#c5a059]/40 mb-3" />
        <span className="font-royal text-[11px] tracking-[0.3em] text-[#a1968b] uppercase">
          With Love · Kabir & Tara
        </span>
      </div>

      {/* =========================================================================
          LOCATION DETAILS MODAL (Interactive Enhancement)
         ========================================================================= */}
      <AnimatePresence>
        {selectedLocation && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 z-50 bg-black/40 backdrop-blur-sm flex items-end sm:items-center justify-center p-4"
            onClick={() => setSelectedLocation(null)}
          >
            <motion.div
              initial={{ y: 40, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 40, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="w-full max-w-[340px] bg-[#fdfbf8] rounded-2xl p-6 border border-[#c5a059]/40 shadow-2xl text-center relative"
            >
              <button
                type="button"
                onClick={() => setSelectedLocation(null)}
                className="absolute top-3.5 right-3.5 text-[#827a81] hover:text-[#1a1519] w-7 h-7 rounded-full flex items-center justify-center text-sm"
              >
                ✕
              </button>

              <div className="w-10 h-10 rounded-full bg-[#98474e]/10 text-[#98474e] flex items-center justify-center mx-auto mb-3">
                <svg
                  className="w-5 h-5"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z" />
                  <circle cx="12" cy="10" r="3" />
                </svg>
              </div>

              <span className="text-[10px] font-royal tracking-[0.25em] text-[#c5a059] uppercase block mb-1">
                Venue Information
              </span>

              <h3 className="font-serif-display text-xl text-[#98474e] mb-1">
                {selectedLocation.location}
              </h3>

              <p className="text-xs text-[#801b26] font-medium mb-2">
                {selectedLocation.title} · {selectedLocation.time}
              </p>

              <p className="text-xs text-[#524b45] leading-relaxed mb-5">
                {selectedLocation.address}
              </p>

              <div className="flex gap-2">
                <a
                  href={`https://maps.google.com/?q=${encodeURIComponent(
                    selectedLocation.location + ' ' + selectedLocation.address
                  )}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 py-2.5 px-4 bg-[#98474e] text-white rounded-full text-xs font-royal tracking-wider font-semibold shadow hover:bg-[#833a41] transition-colors"
                >
                  Open in Google Maps
                </a>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
