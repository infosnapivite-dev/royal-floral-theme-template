import React, { useRef, useLayoutEffect } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

// Register GSAP plugins
gsap.registerPlugin(ScrollTrigger);

// Import layer image assets
import chateauImg from '../assets/homepage-house-layer-1.webp';
import leftTreeImg from '../assets/homepage-left-tree-layer-2.webp';
import rightTreeImg from '../assets/homepage-right-tree-layer-2.webp';
import archwayImg from '../assets/homapage-gate-layer-3.webp';
import coupleImg from '../assets/homepage-couple-layer-3.webp';
import leftFlowerImg from '../assets/homepage-left-flower-layer-4.webp';
import rightFlowerImg from '../assets/homepage-right-flower-layer-4.webp';
import FloatingBotanicals from './FloatingBotanicals';

/**
 * Strict Zero-Flicker Hardware Acceleration Style Object
 * As mandated by the PRD & performance specs:
 * transform: translate3d(0, 0, 0); backface-visibility: hidden; will-change: transform;
 */
const gpuLayerStyle = {
  transform: 'translate3d(0, 0, 0)',
  WebkitTransform: 'translate3d(0, 0, 0)',
  backfaceVisibility: 'hidden',
  WebkitBackfaceVisibility: 'hidden',
  willChange: 'transform',
};

export default function ParallaxHero() {
  const sectionRef = useRef(null);
  const chateauLayerRef = useRef(null);
  const archwayLayerRef = useRef(null);
  const coupleLayerRef = useRef(null);
  const coupleTitleRef = useRef(null);
  const foregroundLayerRef = useRef(null);
  const uiLayerRef = useRef(null);

  useLayoutEffect(() => {
    const scroller = document.querySelector('#mockup-scroll-container');
    if (!scroller || !sectionRef.current) return;

    const ctx = gsap.context(() => {
      // Single ScrollTrigger timeline with scrub: 1 spanning from top top to bottom top
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: sectionRef.current,
          scroller: scroller,
          start: 'top top',
          end: 'bottom top',
          scrub: 1,
          invalidateOnRefresh: true,
        },
      });

      // Z-10 Chateau & Midground Trees: yPercent: -10
      if (chateauLayerRef.current) {
        tl.to(chateauLayerRef.current, { yPercent: -10, ease: 'none' }, 0);
      }

      // Z-20 Main Archway: yPercent: -30
      if (archwayLayerRef.current) {
        tl.to(archwayLayerRef.current, { yPercent: -30, ease: 'none' }, 0);
      }

      // Z-30 Bride & Groom: yPercent: -45
      if (coupleLayerRef.current) {
        tl.to(coupleLayerRef.current, { yPercent: -45, ease: 'none' }, 0);
      }

      // Z-35 Couple Title: yPercent: -55, fades out gracefully as user scrolls into events
      if (coupleTitleRef.current) {
        tl.to(coupleTitleRef.current, { yPercent: -55, opacity: 0, ease: 'power1.in', duration: 0.4 }, 0);
      }

      // Z-40 Foreground Leaves & Floral Clusters: yPercent: -80
      if (foregroundLayerRef.current) {
        tl.to(foregroundLayerRef.current, { yPercent: -80, ease: 'none' }, 0);
      }

      // Z-50 UI Text & Mouse Icon: Fade out within the first 10% of scroll
      if (uiLayerRef.current) {
        tl.to(uiLayerRef.current, { opacity: 0, y: -15, ease: 'power2.out', duration: 0.1 }, 0);
      }
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      className="relative w-full h-[670px] min-h-[670px] overflow-hidden bg-transparent select-none"
    >
      {/* =========================================================================
          LAYER 1: Z-10 (Chateau & Midground Trees)
          yPercent: -10
         ========================================================================= */}
      <div
        ref={chateauLayerRef}
        style={gpuLayerStyle}
        className="absolute inset-0 z-10 pointer-events-none flex items-center justify-center"
      >
        {/* Soft Midground Trees flanking the chateau - Scaled down & positioned lower */}
        <img
          src={leftTreeImg}
          alt=""
          className="absolute left-[0%] top-[38%] w-[25%] max-w-[100px] opacity-85 object-contain pointer-events-none"
        />
        <img
          src={rightTreeImg}
          alt=""
          className="absolute right-[0%] top-[38%] w-[25%] max-w-[100px] opacity-85 object-contain pointer-events-none"
        />

        {/* French Neoclassical Chateau Centered in the Upper Middle - Shifted 6px right */}
        <div className="absolute top-[39.5%] left-[calc(50%+6px)] -translate-x-1/2 -translate-y-1/2 w-[41%] max-w-[160px] flex items-center justify-center">
          <img
            src={chateauImg}
            alt="Royal French Chateau"
            className="w-full h-auto object-contain drop-shadow-[0_4px_12px_rgba(0,0,0,0.06)]"
          />
        </div>
      </div>

      {/* =========================================================================
          LAYER 2: Z-20 (Main Floral Archway)
          yPercent: -30
         ========================================================================= */}
      <div
        ref={archwayLayerRef}
        style={gpuLayerStyle}
        className="absolute inset-0 z-20 pointer-events-none flex items-center justify-center"
      >
        <div className="absolute top-[40%] left-1/2 -translate-x-1/2 -translate-y-1/2 w-[104%] max-w-[410px]">
          <img
            src={archwayImg}
            alt="Floral Stone Archway"
            className="w-full h-auto object-contain drop-shadow-[0_12px_28px_rgba(26,21,25,0.08)]"
          />
        </div>
      </div>

      {/* =========================================================================
          LAYER 3: Z-30 (Bride & Groom Couple - Updated transparent cutout)
          yPercent: -45
         ========================================================================= */}
      <div
        ref={coupleLayerRef}
        style={gpuLayerStyle}
        className="absolute inset-0 z-30 pointer-events-none flex items-center justify-center"
      >
        <div className="absolute top-[53.5%] left-[calc(50%+5px)] -translate-x-1/2 -translate-y-1/2 w-[32%] max-w-[125px]">
          <img
            src={coupleImg}
            alt="Bride and Groom"
            className="w-full h-auto object-contain drop-shadow-[0_8px_20px_rgba(0,0,0,0.12)]"
          />
        </div>
      </div>

      {/* =========================================================================
          COUPLE NAME & DATE (Centered in the hero blank space)
          yPercent: -55
         ========================================================================= */}
      <div
        ref={coupleTitleRef}
        style={gpuLayerStyle}
        className="absolute top-[69%] inset-x-0 w-full text-center px-4 z-35 pointer-events-none flex flex-col items-center justify-center will-animate"
      >
        <span className="font-royal text-[10px] tracking-[0.38em] text-[#801b26] uppercase font-semibold mb-1">
          The Wedding of
        </span>
        <h1 className="font-serif-display text-3xl sm:text-[36px] tracking-wide text-[#1a1519] font-normal leading-tight">
          Kabir <span className="font-script text-3xl sm:text-4xl text-[#c5a059] mx-1">&amp;</span> Tara
        </h1>
        <div className="flex items-center justify-center gap-2 mt-2 opacity-75">
          <span className="w-6 h-[1px] bg-[#c5a059]" />
          <span className="text-[10px] tracking-[0.28em] font-royal uppercase text-[#6e676d]">
            20 · 03 · 2027
          </span>
          <span className="w-6 h-[1px] bg-[#c5a059]" />
        </div>
      </div>

      {/* =========================================================================
          LAYER 4: Z-40 (Foreground Leaves & Floral Clusters)
          yPercent: -80
         ========================================================================= */}
      <div
        ref={foregroundLayerRef}
        style={gpuLayerStyle}
        className="absolute inset-0 z-40 pointer-events-none"
      >
        {/* Left Climbing Rose Spray - Scaled down & positioned lower */}
        <img
          src={leftFlowerImg}
          alt=""
          className="absolute left-[0%] top-[41%] w-[28%] max-w-[110px] h-auto object-contain pointer-events-none"
        />

        {/* Right Climbing Rose Spray - Scaled down & positioned lower */}
        <img
          src={rightFlowerImg}
          alt=""
          className="absolute right-[0%] top-[41%] w-[28%] max-w-[110px] h-auto object-contain pointer-events-none"
        />

        {/* Ambient Depth-of-Field Floating Leaves & Petals */}
        <FloatingBotanicals variant="hero" />
      </div>

      {/* =========================================================================
          LAYER 5: Z-50 (UI - "SCROLL TO EXPLORE" & SVG Mouse Icon)
          Fades out in the first 10% of scroll
         ========================================================================= */}
      <div
        ref={uiLayerRef}
        style={gpuLayerStyle}
        className="absolute inset-0 z-50 pointer-events-none flex flex-col justify-end items-center pb-3"
      >
        <div className="flex flex-col items-center gap-2.5">
          <span className="font-royal text-[10.5px] font-medium tracking-[0.34em] text-[#8e857b] uppercase select-none transition-colors duration-300">
            Scroll to Explore
          </span>

          {/* Elegant SVG Mouse with animated wheel indicator */}
          <div className="w-5 h-8 rounded-full border-[1.5px] border-[#a89f91] flex items-start justify-center pt-1.5 opacity-80">
            <span className="w-1 h-2 bg-[#801b26] rounded-full animate-bounce" />
          </div>
        </div>
      </div>
    </section>
  );
}
