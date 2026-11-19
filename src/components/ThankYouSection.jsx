import React, { useRef, useLayoutEffect } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

import floralSpray from '../assets/venue page flower.png';
import FloatingBotanicals from './FloatingBotanicals';

gsap.registerPlugin(ScrollTrigger);

const gpuLayerStyle = {
  transform: 'translate3d(0, 0, 0)',
  WebkitTransform: 'translate3d(0, 0, 0)',
  backfaceVisibility: 'hidden',
  WebkitBackfaceVisibility: 'hidden',
  willChange: 'transform, opacity',
};

export default function ThankYouSection() {
  const sectionRef = useRef(null);
  const crestRef = useRef(null);
  const eyebrowRef = useRef(null);
  const titleRef = useRef(null);
  const messageRef = useRef(null);
  const dateBadgeRef = useRef(null);
  const floralLeftRef = useRef(null);
  const floralRightRef = useRef(null);
  const returnBtnRef = useRef(null);

  const handleScrollToTop = () => {
    const scroller = document.querySelector('#mockup-scroll-container');
    if (scroller) {
      scroller.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  useLayoutEffect(() => {
    const scroller = document.querySelector('#mockup-scroll-container') || window;
    if (!sectionRef.current) return;

    const ctx = gsap.context(() => {
      // 1. Royal Crest Parallax: Scaling & delicate floating rotation
      if (crestRef.current) {
        gsap.fromTo(
          crestRef.current,
          { scale: 0.9, rotate: -15, y: 35 },
          {
            scale: 1.05,
            rotate: 15,
            y: -20,
            ease: 'none',
            scrollTrigger: {
              trigger: sectionRef.current,
              scroller: scroller,
              start: 'top bottom',
              end: 'center center',
              scrub: 1.2,
            },
          }
        );
      }

      // 2. Eyebrow & Title Vertical Drift
      if (eyebrowRef.current) {
        gsap.fromTo(
          eyebrowRef.current,
          { y: 25, opacity: 0.5 },
          {
            y: -15,
            opacity: 1,
            ease: 'none',
            scrollTrigger: {
              trigger: sectionRef.current,
              scroller: scroller,
              start: 'top bottom',
              end: 'center center',
              scrub: 1.0,
            },
          }
        );
      }

      if (titleRef.current) {
        gsap.fromTo(
          titleRef.current,
          { y: 40, opacity: 0.6 },
          {
            y: -25,
            opacity: 1,
            ease: 'none',
            scrollTrigger: {
              trigger: sectionRef.current,
              scroller: scroller,
              start: 'top bottom',
              end: 'center center',
              scrub: 1.2,
            },
          }
        );
      }

      // 3. Heartfelt Message Fade & Parallax Elevate
      if (messageRef.current) {
        gsap.fromTo(
          messageRef.current,
          { y: 30, opacity: 0.5 },
          {
            y: -15,
            opacity: 1,
            ease: 'none',
            scrollTrigger: {
              trigger: messageRef.current,
              scroller: scroller,
              start: 'top bottom',
              end: 'bottom bottom',
              scrub: 1.1,
            },
          }
        );
      }

      // 4. Date & Place Badge Reveal
      if (dateBadgeRef.current) {
        gsap.fromTo(
          dateBadgeRef.current,
          { y: 20, opacity: 0.6 },
          {
            y: -10,
            opacity: 1,
            ease: 'none',
            scrollTrigger: {
              trigger: dateBadgeRef.current,
              scroller: scroller,
              start: 'top bottom',
              end: 'bottom bottom',
              scrub: 1.0,
            },
          }
        );
      }

      // 6. Floating Floral Sprays on Left & Right
      if (floralLeftRef.current) {
        gsap.fromTo(
          floralLeftRef.current,
          { y: 50, rotate: -8 },
          {
            y: -50,
            rotate: 8,
            ease: 'none',
            scrollTrigger: {
              trigger: sectionRef.current,
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
          { y: 65, rotate: 10 },
          {
            y: -60,
            rotate: -8,
            ease: 'none',
            scrollTrigger: {
              trigger: sectionRef.current,
              scroller: scroller,
              start: 'top bottom',
              end: 'bottom top',
              scrub: 0.9,
            },
          }
        );
      }

      // 7. Return to Top CTA Float
      if (returnBtnRef.current) {
        gsap.fromTo(
          returnBtnRef.current,
          { y: 20, opacity: 0.7 },
          {
            y: -5,
            opacity: 1,
            ease: 'none',
            scrollTrigger: {
              trigger: returnBtnRef.current,
              scroller: scroller,
              start: 'top bottom',
              end: 'bottom bottom',
              scrub: 1.0,
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
      className="relative w-full pt-20 pb-28 px-6 overflow-hidden select-none flex flex-col items-center justify-center text-center"
      style={gpuLayerStyle}
    >
      {/* Ambient Parallax Leaves & Petals with Depth of Field */}
      <FloatingBotanicals variant="thankyou" />

      {/* Floating Botanical Spray - Left */}
      <div
        ref={floralLeftRef}
        className="absolute -top-6 -left-8 w-24 sm:w-28 opacity-75 pointer-events-none will-animate drop-shadow-sm"
        style={gpuLayerStyle}
      >
        <img
          src={floralSpray}
          alt=""
          className="w-full h-auto object-contain transform -rotate-45"
        />
      </div>

      {/* Floating Botanical Spray - Right (Mirrored) */}
      <div
        ref={floralRightRef}
        className="absolute -bottom-8 -right-8 w-24 sm:w-28 opacity-75 pointer-events-none will-animate drop-shadow-sm"
        style={gpuLayerStyle}
      >
        <img
          src={floralSpray}
          alt=""
          className="w-full h-auto object-contain transform scale-x-[-1] rotate-45"
        />
      </div>

      {/* ===================================================================
          1. GILDED ROYAL MONOGRAM CREST
         =================================================================== */}
      <div
        ref={crestRef}
        className="relative w-16 h-16 rounded-full border border-[#c5a059]/60 flex items-center justify-center bg-white/40 backdrop-blur-xs shadow-sm mb-6 will-animate"
        style={gpuLayerStyle}
      >
        {/* Subtle decorative inner ring */}
        <div className="absolute inset-1 rounded-full border border-[#c5a059]/30 border-dashed" />
        
        {/* Monogram letters */}
        <span className="font-royal text-lg text-[#801b26] font-bold tracking-widest pl-1">
          K&amp;T
        </span>
      </div>

      {/* ===================================================================
          2. EYEBROW & MAIN TITLE
         =================================================================== */}
      <p
        ref={eyebrowRef}
        className="text-[10px] uppercase tracking-[0.38em] text-[#801b26] font-royal font-semibold mb-2 will-animate"
        style={gpuLayerStyle}
      >
        With Heartfelt Gratitude
      </p>

      <h2
        ref={titleRef}
        className="font-serif-display text-4xl sm:text-5xl text-[#1a1519] font-normal tracking-wide leading-tight mb-5 will-animate"
        style={gpuLayerStyle}
      >
        Thank You
      </h2>

      {/* Decorative Golden Divider */}
      <div className="flex items-center justify-center gap-2 mb-6">
        <span className="w-8 h-[1px] bg-[#c5a059]/40" />
        <span className="w-1.5 h-1.5 rounded-full bg-[#c5a059]" />
        <span className="w-8 h-[1px] bg-[#c5a059]/40" />
      </div>

      {/* ===================================================================
          3. HEARTFELT NOTE
         =================================================================== */}
      <p
        ref={messageRef}
        className="max-w-[320px] mx-auto font-serif-display text-[15px] sm:text-base text-[#5c5049] leading-relaxed italic mb-8 will-animate"
        style={gpuLayerStyle}
      >
        "For sharing in the joy of our story, the warmth of your laughter, and the timeless blessings you bring to our new beginning."
      </p>

      {/* ===================================================================
          4. SIGNATURE IN SCRIPT (Static, No Parallax)
         =================================================================== */}
      <p className="font-script text-4xl sm:text-5xl text-[#c5a059] font-normal mb-2">
        Kabir &amp; Tara
      </p>

      {/* Ceremony Date & Location */}
      <div
        ref={dateBadgeRef}
        className="flex items-center justify-center gap-2 text-[10px] uppercase tracking-[0.32em] font-royal text-[#8a7d76] will-animate mb-10"
        style={gpuLayerStyle}
      >
        <span>20 March 2027</span>
        <span className="text-[#c5a059] font-bold">·</span>
        <span>Versailles, France</span>
      </div>

      {/* ===================================================================
          5. RETURN TO TOP ACTION BUTTON
         =================================================================== */}
      <div ref={returnBtnRef} className="will-animate" style={gpuLayerStyle}>
        <button
          type="button"
          onClick={handleScrollToTop}
          className="group inline-flex items-center gap-2 px-5 py-2.5 rounded-full border border-[#c5a059]/40 bg-white/40 hover:bg-white/80 hover:border-[#c5a059] text-[#5c5049] hover:text-[#1a1519] text-[11px] font-royal tracking-[0.24em] uppercase transition-all duration-300 shadow-xs active:scale-95 cursor-pointer"
        >
          <svg
            className="w-3.5 h-3.5 text-[#c5a059] group-hover:-translate-y-0.5 transition-transform duration-300"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M18 15l-6-6-6 6" />
          </svg>
          <span>Return to Top</span>
        </button>
      </div>
    </section>
  );
}
