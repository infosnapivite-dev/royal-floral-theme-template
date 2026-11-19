import React, { useState, useEffect, useRef, useLayoutEffect } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

import countdownFrame from '../assets/countdown frame.webp';
import FloatingBotanicals from './FloatingBotanicals';

gsap.registerPlugin(ScrollTrigger);

const gpuLayerStyle = {
  transform: 'translate3d(0, 0, 0)',
  WebkitTransform: 'translate3d(0, 0, 0)',
  backfaceVisibility: 'hidden',
  WebkitBackfaceVisibility: 'hidden',
  willChange: 'transform, opacity',
};

// Target wedding date: March 20, 2027 at 16:00
const WEDDING_DATE = new Date('2027-03-20T16:00:00');

export default function CountdownSection() {
  const sectionRef = useRef(null);
  const titleRef = useRef(null);
  const frameContainerRef = useRef(null);
  const flowerFrameRef = useRef(null);
  const innerDaysRef = useRef(null);
  const subTimerRef = useRef(null);
  const namesRef = useRef(null);
  const dateRef = useRef(null);
  const ambientPetalRef = useRef(null);

  // Live countdown state
  const [timeLeft, setTimeLeft] = useState(() => {
    const diff = Math.max(0, WEDDING_DATE.getTime() - Date.now());
    return {
      days: Math.floor(diff / (1000 * 60 * 60 * 24)),
      hours: Math.floor((diff / (1000 * 60 * 60)) % 24),
      minutes: Math.floor((diff / 1000 / 60) % 60),
      seconds: Math.floor((diff / 1000) % 60),
    };
  });

  useEffect(() => {
    const timer = setInterval(() => {
      const diff = Math.max(0, WEDDING_DATE.getTime() - Date.now());
      setTimeLeft({
        days: Math.floor(diff / (1000 * 60 * 60 * 24)),
        hours: Math.floor((diff / (1000 * 60 * 60)) % 24),
        minutes: Math.floor((diff / 1000 / 60) % 60),
        seconds: Math.floor((diff / 1000) % 60),
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  // Multi-tier Parallax Scrub with GSAP
  useLayoutEffect(() => {
    const scroller = document.querySelector('#mockup-scroll-container') || window;
    if (!sectionRef.current) return;

    const ctx = gsap.context(() => {
      // 1. Title parallax travel
      if (titleRef.current) {
        gsap.fromTo(
          titleRef.current,
          { y: 35, opacity: 0.6 },
          {
            y: -20,
            opacity: 1,
            ease: 'none',
            scrollTrigger: {
              trigger: sectionRef.current,
              scroller: scroller,
              start: 'top bottom',
              end: 'center center',
              scrub: 1.1,
            },
          }
        );
      }

      // 2. Floral Wreath Frame High Dynamic Rotation Parallax
      if (flowerFrameRef.current) {
        gsap.fromTo(
          flowerFrameRef.current,
          { rotate: -80 },
          {
            rotate: 80,
            ease: 'none',
            scrollTrigger: {
              trigger: frameContainerRef.current || sectionRef.current,
              scroller: scroller,
              start: 'top bottom',
              end: 'bottom top',
              scrub: 1.2,
            },
          }
        );
      }

      // 3. Frame Container Elevation & Scale Parallax
      if (frameContainerRef.current) {
        gsap.fromTo(
          frameContainerRef.current,
          { y: 40, scale: 0.95 },
          {
            y: -30,
            scale: 1.04,
            ease: 'none',
            scrollTrigger: {
              trigger: frameContainerRef.current,
              scroller: scroller,
              start: 'top bottom',
              end: 'bottom top',
              scrub: 1.3,
            },
          }
        );
      }

      // 3. Inner Number Float: Differential speed creates optical depth inside the ring
      if (innerDaysRef.current) {
        gsap.fromTo(
          innerDaysRef.current,
          { y: 20 },
          {
            y: -18,
            ease: 'none',
            scrollTrigger: {
              trigger: frameContainerRef.current,
              scroller: scroller,
              start: 'top bottom',
              end: 'bottom top',
              scrub: 0.9,
            },
          }
        );
      }

      // 4. Sub-timer row parallax travel
      if (subTimerRef.current) {
        gsap.fromTo(
          subTimerRef.current,
          { y: 35, opacity: 0.7 },
          {
            y: -15,
            opacity: 1,
            ease: 'none',
            scrollTrigger: {
              trigger: subTimerRef.current,
              scroller: scroller,
              start: 'top bottom',
              end: 'center center',
              scrub: 1.0,
            },
          }
        );
      }

      // 5. Couple Names & Date Cascade
      if (namesRef.current) {
        gsap.fromTo(
          namesRef.current,
          { y: 30, opacity: 0.6 },
          {
            y: -10,
            opacity: 1,
            ease: 'none',
            scrollTrigger: {
              trigger: namesRef.current,
              scroller: scroller,
              start: 'top bottom',
              end: 'bottom bottom',
              scrub: 1.1,
            },
          }
        );
      }

      if (dateRef.current) {
        gsap.fromTo(
          dateRef.current,
          { y: 25, opacity: 0.6 },
          {
            y: -8,
            opacity: 1,
            ease: 'none',
            scrollTrigger: {
              trigger: dateRef.current,
              scroller: scroller,
              start: 'top bottom',
              end: 'bottom bottom',
              scrub: 1.2,
            },
          }
        );
      }

      // 6. Ambient background petal drift
      if (ambientPetalRef.current) {
        gsap.fromTo(
          ambientPetalRef.current,
          { y: 60, x: -15, rotate: -12 },
          {
            y: -60,
            x: 20,
            rotate: 18,
            ease: 'none',
            scrollTrigger: {
              trigger: sectionRef.current,
              scroller: scroller,
              start: 'top bottom',
              end: 'bottom top',
              scrub: 0.8,
            },
          }
        );
      }
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  const format2Digits = (num) => String(num).padStart(2, '0');

  return (
    <section
      ref={sectionRef}
      className="relative w-full pt-16 pb-24 px-5 overflow-hidden select-none flex flex-col items-center justify-center text-center"
      style={gpuLayerStyle}
    >
      {/* Soft warm radial glow backdrop */}
      <div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[340px] h-[340px] rounded-full pointer-events-none opacity-30 blur-3xl"
        style={{
          background: 'radial-gradient(circle, rgba(230, 205, 155, 0.4) 0%, rgba(247, 214, 210, 0.25) 50%, transparent 75%)',
        }}
      />

      {/* Floating Botanical Parallax Leaves & Petals */}
      <FloatingBotanicals variant="countdown" />

      {/* ===================================================================
          1. HEADER TITLE: "Until We Say I Do"
         =================================================================== */}
      <h2
        ref={titleRef}
        className="font-serif-display text-3xl sm:text-4xl text-[#3e5142] font-normal tracking-wide leading-tight mb-4 will-animate"
        style={gpuLayerStyle}
      >
        Until We Say I Do
      </h2>

      {/* ===================================================================
          2. FLORAL WREATH & LARGE DAYS COUNTDOWN
         =================================================================== */}
      <div
        ref={frameContainerRef}
        className="relative w-[280px] sm:w-[310px] aspect-square flex items-center justify-center my-2 will-animate"
        style={gpuLayerStyle}
      >
        {/* The Botanical Wreath Frame with High Dynamic Parallax Rotation */}
        <img
          ref={flowerFrameRef}
          src={countdownFrame}
          alt="Watercolor floral countdown wreath"
          className="absolute inset-0 w-full h-full object-contain pointer-events-none drop-shadow-[0_8px_20px_rgba(0,0,0,0.06)] will-animate"
          style={{
            transformOrigin: '50% 50%',
            ...gpuLayerStyle,
          }}
        />

        {/* Center Days Display (Floating on independent parallax tier) */}
        <div
          ref={innerDaysRef}
          className="relative z-10 flex flex-col items-center justify-center will-animate"
          style={gpuLayerStyle}
        >
          {/* Big Days Number */}
          <span className="font-serif-display text-[72px] sm:text-[80px] text-[#8e4f55] font-normal leading-none tracking-tight">
            {timeLeft.days}
          </span>

          {/* Days Subtitle */}
          <span className="text-xs sm:text-sm font-sans tracking-[0.32em] text-[#3e5142] font-semibold uppercase mt-1">
            DAYS
          </span>
        </div>
      </div>

      {/* ===================================================================
          3. SUB-TIMER ROW: HOURS | MINUTES | SECONDS
         =================================================================== */}
      <div
        ref={subTimerRef}
        className="flex items-center justify-center gap-4 sm:gap-6 mt-4 mb-8 will-animate"
        style={gpuLayerStyle}
      >
        {/* Hours */}
        <div className="flex flex-col items-center min-w-[62px]">
          <span className="font-serif-display text-3xl sm:text-4xl text-[#8e4f55] font-normal leading-tight">
            {format2Digits(timeLeft.hours)}
          </span>
          <span className="text-[10px] font-sans tracking-[0.24em] text-[#3e5142] font-semibold uppercase mt-1">
            HOURS
          </span>
        </div>

        {/* Vertical Divider */}
        <div className="h-9 w-[1px] bg-[#3e5142]/20" />

        {/* Minutes */}
        <div className="flex flex-col items-center min-w-[62px]">
          <span className="font-serif-display text-3xl sm:text-4xl text-[#8e4f55] font-normal leading-tight">
            {format2Digits(timeLeft.minutes)}
          </span>
          <span className="text-[10px] font-sans tracking-[0.24em] text-[#3e5142] font-semibold uppercase mt-1">
            MINUTES
          </span>
        </div>

        {/* Vertical Divider */}
        <div className="h-9 w-[1px] bg-[#3e5142]/20" />

        {/* Seconds */}
        <div className="flex flex-col items-center min-w-[62px]">
          <span className="font-serif-display text-3xl sm:text-4xl text-[#8e4f55] font-normal leading-tight">
            {format2Digits(timeLeft.seconds)}
          </span>
          <span className="text-[10px] font-sans tracking-[0.24em] text-[#3e5142] font-semibold uppercase mt-1">
            SECONDS
          </span>
        </div>
      </div>

      {/* ===================================================================
          4. COUPLE NAMES & CEREMONY DATE
         =================================================================== */}
      <div className="flex flex-col items-center">
        {/* Couple Names */}
        <h3
          ref={namesRef}
          className="font-serif-display text-2xl sm:text-3xl text-[#2d3d31] tracking-wide font-normal mb-2 will-animate"
          style={gpuLayerStyle}
        >
          Kabir & Tara
        </h3>

        {/* Ceremony Date */}
        <p
          ref={dateRef}
          className="text-xs font-sans tracking-[0.34em] text-[#3e5142] font-semibold uppercase will-animate"
          style={gpuLayerStyle}
        >
          20 MARCH 2027
        </p>
      </div>

      {/* Delicate Bottom Flourish */}
      <div className="mt-8 flex items-center justify-center gap-2 opacity-50">
        <span className="w-8 h-[1px] bg-[#3e5142]/30" />
        <span className="w-1.5 h-1.5 rounded-full bg-[#8e4f55]" />
        <span className="w-8 h-[1px] bg-[#3e5142]/30" />
      </div>
    </section>
  );
}
