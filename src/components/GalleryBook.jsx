import React, { useState, useRef, useLayoutEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

// Clean background assets
import bookCleanBase from '../assets/book-clean-base.webp';
import pageVerso from '../assets/book-page-verso.webp';
import FloatingBotanicals from './FloatingBotanicals';

const pages = [
  { id: 1, num: '01', caption: 'Where our story began' },
  { id: 2, num: '02', caption: 'The beginning of forever' },
  { id: 3, num: '03', caption: 'Strolling hand in hand' },
  { id: 4, num: '04', caption: 'A love in full bloom' },
  { id: 5, num: '05', caption: 'Laughter in the rose garden' },
  { id: 6, num: '06', caption: 'Palace garden romance' },
  { id: 7, num: '07', caption: 'Two hearts, one journey' },
  { id: 8, num: '08', caption: 'Cherished for all eternity' },
];

const gpuLayerStyle = {
  transform: 'translate3d(0, 0, 0)',
  WebkitTransform: 'translate3d(0, 0, 0)',
  backfaceVisibility: 'hidden',
  WebkitBackfaceVisibility: 'hidden',
  willChange: 'transform, opacity',
};

// Procedural real-life paper rustle audio using Web Audio API
function playPaperSound() {
  try {
    const AudioContext = window.AudioContext || window.webkitAudioContext;
    if (!AudioContext) return;
    const ctx = new AudioContext();
    if (ctx.state === 'suspended') ctx.resume();

    const bufferSize = Math.floor(ctx.sampleRate * 0.32);
    const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
    const data = buffer.getChannelData(0);

    for (let i = 0; i < bufferSize; i++) {
      const envelope = Math.sin((i / bufferSize) * Math.PI);
      data[i] = (Math.random() * 2 - 1) * envelope * 0.45;
    }

    const noise = ctx.createBufferSource();
    noise.buffer = buffer;

    const filter = ctx.createBiquadFilter();
    filter.type = 'bandpass';
    filter.frequency.setValueAtTime(1400, ctx.currentTime);
    filter.frequency.exponentialRampToValueAtTime(700, ctx.currentTime + 0.3);
    filter.Q.value = 2.0;

    const gain = ctx.createGain();
    gain.gain.setValueAtTime(0.16, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.32);

    noise.connect(filter);
    filter.connect(gain);
    gain.connect(ctx.destination);

    noise.start();
  } catch (e) {
    // Silent fallback if audio context is restricted
  }
}

// Reusable single memory book page with a single luxury photo placeholder frame (Zero White Box!)
function BookPageLayout({ page }) {
  return (
    <div className="relative w-full h-full select-none overflow-hidden rounded-[6px]">
      {/* 1. Authentic Book Frame Background (Spine, Header, Ribbons, Florals, Curled Corner) */}
      <img
        src={bookCleanBase}
        alt="Memory Book Frame"
        className="w-full h-full object-contain pointer-events-none select-none"
        loading="eager"
        decoding="sync"
      />

      {/* 2. Photo Area (ONLY A SINGLE LUXURY PHOTO SLOT PER PAGE) */}
      <div className="absolute top-[18.6%] left-[13.6%] w-[73.2%] flex flex-col pointer-events-none">
        {/* Single Centerpiece Photo Frame with Increased Height */}
        <div className="relative w-full aspect-[467/505] rounded-[4px] bg-[#faf4ed]/90 border border-[#d9ccbe] shadow-[inset_0_2px_5px_rgba(78,55,45,0.06)] flex flex-col items-center justify-center">
          {/* 4 Vintage Gold Photo-Mount Corners */}
          <div className="absolute top-2 left-2 w-4.5 h-4.5 border-t-2 border-l-2 border-[#c5a059]/75 rounded-tl-[2px]" />
          <div className="absolute top-2 right-2 w-4.5 h-4.5 border-t-2 border-r-2 border-[#c5a059]/75 rounded-tr-[2px]" />
          <div className="absolute bottom-2 left-2 w-4.5 h-4.5 border-b-2 border-l-2 border-[#c5a059]/75 rounded-bl-[2px]" />
          <div className="absolute bottom-2 right-2 w-4.5 h-4.5 border-b-2 border-r-2 border-[#c5a059]/75 rounded-br-[2px]" />

          {/* Minimalist Camera Icon & Placeholder Label */}
          <div className="w-12 h-12 rounded-full bg-[#f3ebe1] border border-[#d9ccbe]/60 flex items-center justify-center mb-2.5 shadow-xs">
            <svg
              className="w-6 h-6 text-[#c5a059]"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.6"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z" />
              <circle cx="12" cy="13" r="4" />
            </svg>
          </div>
          <span className="text-[11.5px] sm:text-[12.5px] font-serif-display tracking-[0.2em] text-[#7a6f68] uppercase font-medium">
            Photo Slot
          </span>
        </div>

        {/* 3. Bottom Page Number (Pure Typography on Natural Parchment - ZERO White Box!) */}
        <div className="w-full mt-4 text-center">
          <p className="font-serif-display text-[12px] sm:text-[13px] text-[#8a7d76] tracking-[0.25em]">
            {page.num}
          </p>
        </div>
      </div>
    </div>
  );
}

export default function GalleryBook() {
  // Start on page index 1 (Page 02 as in reference)
  const [currentPageIndex, setCurrentPageIndex] = useState(1);
  const [isFlipping, setIsFlipping] = useState(false);
  const [flipState, setFlipState] = useState(null); // { fromIndex, toIndex, direction }

  const sectionRef = useRef(null);
  const bookStageRef = useRef(null);
  const controlsRef = useRef(null);
  const turningLeafRef = useRef(null);
  const castShadowRef = useRef(null);
  const frontShineRef = useRef(null);
  const backShineRef = useRef(null);

  // Touch swipe coordinates
  const touchStartX = useRef(null);
  const touchStartY = useRef(null);

  const currentPage = pages[currentPageIndex];

  // =========================================================================
  // REAL-LIFE PHYSICAL 3D PAGE TURN ENGINE
  // =========================================================================
  const turnPage = useCallback(
    (direction) => {
      if (isFlipping) return;

      let nextIndex = currentPageIndex + direction;
      if (nextIndex < 0) nextIndex = pages.length - 1;
      if (nextIndex >= pages.length) nextIndex = 0;

      playPaperSound();
      setIsFlipping(true);
      setFlipState({
        fromIndex: currentPageIndex,
        toIndex: nextIndex,
        direction: direction > 0 ? 'next' : 'prev',
      });
    },
    [currentPageIndex, isFlipping]
  );

  // Animate the page turn when flipState updates
  useLayoutEffect(() => {
    if (!flipState || !turningLeafRef.current) return;

    const leaf = turningLeafRef.current;
    const shadow = castShadowRef.current;
    const frontShine = frontShineRef.current;
    const backShine = backShineRef.current;

    const isNext = flipState.direction === 'next';

    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        onComplete: () => {
          setCurrentPageIndex(flipState.toIndex);
          setFlipState(null);
          setIsFlipping(false);
        },
      });

      if (isNext) {
        // FORWARD FLIP: Current page peels from right, curls, and turns over to left (0deg -> -180deg)
        gsap.set(leaf, {
          rotateY: 0,
          rotateZ: 0,
          skewY: 0,
          transformOrigin: '0% 50%',
        });
        if (shadow) gsap.set(shadow, { opacity: 0 });
        if (frontShine) gsap.set(frontShine, { opacity: 0 });
        if (backShine) gsap.set(backShine, { opacity: 0.6 });

        // Phase 1: First half of turn (0deg -> -90deg, front face visible)
        tl.to(leaf, {
          rotateY: -90,
          rotateZ: -2.8,
          skewY: 3.2,
          scale: 1.03,
          duration: 0.38,
          ease: 'power2.in',
        })
          .to(
            shadow,
            {
              opacity: 0.65,
              duration: 0.38,
              ease: 'power1.in',
            },
            0
          )
          .to(
            frontShine,
            {
              opacity: 0.55,
              duration: 0.38,
              ease: 'power1.in',
            },
            0
          )
          // Phase 2: Second half of turn (-90deg -> -180deg, back face visible)
          .to(leaf, {
            rotateY: -180,
            rotateZ: 0,
            skewY: 0,
            scale: 1,
            duration: 0.44,
            ease: 'power2.out',
          })
          .to(
            shadow,
            {
              opacity: 0,
              duration: 0.44,
              ease: 'power2.out',
            },
            0.38
          )
          .to(
            backShine,
            {
              opacity: 0,
              duration: 0.44,
              ease: 'power2.out',
            },
            0.38
          );
      } else {
        // BACKWARD FLIP: Previous page starts folded on left (-180deg), turns back to right (-180deg -> 0deg)
        gsap.set(leaf, {
          rotateY: -180,
          rotateZ: 0,
          skewY: 0,
          transformOrigin: '0% 50%',
        });
        if (shadow) gsap.set(shadow, { opacity: 0 });
        if (backShine) gsap.set(backShine, { opacity: 0.5 });
        if (frontShine) gsap.set(frontShine, { opacity: 0.6 });

        // Phase 1: Lift from left (-180deg -> -90deg)
        tl.to(leaf, {
          rotateY: -90,
          rotateZ: 2.8,
          skewY: -3.2,
          scale: 1.03,
          duration: 0.38,
          ease: 'power2.in',
        })
          .to(
            shadow,
            {
              opacity: 0.65,
              duration: 0.38,
              ease: 'power1.in',
            },
            0
          )
          .to(
            backShine,
            {
              opacity: 0,
              duration: 0.38,
              ease: 'power1.in',
            },
            0
          )
          // Phase 2: Land flat on right (-90deg -> 0deg)
          .to(leaf, {
            rotateY: 0,
            rotateZ: 0,
            skewY: 0,
            scale: 1,
            duration: 0.44,
            ease: 'power2.out',
          })
          .to(
            shadow,
            {
              opacity: 0,
              duration: 0.44,
              ease: 'power2.out',
            },
            0.38
          )
          .to(
            frontShine,
            {
              opacity: 0,
              duration: 0.44,
              ease: 'power2.out',
            },
            0.38
          );
      }
    });

    return () => ctx.revert();
  }, [flipState]);

  // Touch Swipe Gesture Handlers
  const onTouchStart = (e) => {
    touchStartX.current = e.touches[0].clientX;
    touchStartY.current = e.touches[0].clientY;
  };

  const onTouchEnd = (e) => {
    if (touchStartX.current === null || isFlipping) return;
    const diffX = touchStartX.current - e.changedTouches[0].clientX;
    const diffY = touchStartY.current - e.changedTouches[0].clientY;

    if (Math.abs(diffX) > Math.abs(diffY) && Math.abs(diffX) > 40) {
      if (diffX > 0) {
        turnPage(1); // Swipe left = turn forward
      } else {
        turnPage(-1); // Swipe right = turn backward
      }
    }
    touchStartX.current = null;
    touchStartY.current = null;
  };

  // Section Parallax with GSAP ScrollTrigger
  useLayoutEffect(() => {
    const scroller = document.querySelector('#mockup-scroll-container') || window;
    if (!sectionRef.current) return;

    const ctx = gsap.context(() => {
      if (bookStageRef.current) {
        gsap.fromTo(
          bookStageRef.current,
          { y: 45, scale: 0.96 },
          {
            y: -22,
            scale: 1.02,
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

      if (controlsRef.current) {
        gsap.fromTo(
          controlsRef.current,
          { y: 35, opacity: 0.7 },
          {
            y: -15,
            opacity: 1,
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
    }, sectionRef);

    ScrollTrigger.refresh();

    return () => ctx.revert();
  }, []);

  // Determine which page to render underneath as the base layer during flip
  const basePageIndex = flipState
    ? flipState.direction === 'next'
      ? flipState.toIndex
      : flipState.fromIndex
    : currentPageIndex;

  // Determine which page is turning
  const turningPageIndex = flipState
    ? flipState.direction === 'next'
      ? flipState.fromIndex
      : flipState.toIndex
    : currentPageIndex;

  return (
    <section
      ref={sectionRef}
      id="gallery-book-section"
      className="relative w-full bg-transparent flex flex-col items-center pt-8 pb-14 px-3 sm:px-4 select-none border-t border-[#c5a059]/25 overflow-hidden"
    >
      {/* Floating Botanical Parallax Leaves & Petals */}
      <FloatingBotanicals variant="gallery" />

      {/* =========================================================================
          PHYSICAL BOOK STAGE (3D Perspective Viewport)
         ========================================================================= */}
      <div
        ref={bookStageRef}
        style={gpuLayerStyle}
        className="w-full max-w-[364px] relative flex flex-col items-center z-10"
      >
        {/* Book Container with Realistic Depth Shadows and 3D Perspective */}
        <div
          onTouchStart={onTouchStart}
          onTouchEnd={onTouchEnd}
          className="relative w-full aspect-[640/848] rounded-[6px] overflow-visible perspective-[2200px]"
          style={{
            perspective: '2200px',
            WebkitPerspective: '2200px',
            transformStyle: 'preserve-3d',
            filter:
              'drop-shadow(0 22px 32px rgba(78, 55, 45, 0.18)) drop-shadow(0 8px 14px rgba(152, 71, 78, 0.09))',
          }}
        >
          {/* =====================================================================
              1. BASE STATIONARY PAGE (Always seated underneath)
             ===================================================================== */}
          <div className="absolute inset-0 w-full h-full rounded-[6px] overflow-hidden">
            <BookPageLayout page={pages[basePageIndex]} />

            {/* Dynamic Cast Shadow (Cast by the turning leaf onto the page underneath) */}
            <div
              ref={castShadowRef}
              className="absolute inset-0 pointer-events-none rounded-[6px] transition-opacity duration-75"
              style={{
                opacity: 0,
                background:
                  'linear-gradient(to right, rgba(45, 25, 20, 0.55) 0%, rgba(45, 25, 20, 0.25) 30%, rgba(45, 25, 20, 0) 75%)',
              }}
            />
          </div>

          {/* =====================================================================
              2. 3D PHYSICAL TURNING LEAF (Peels, bends & flips in real-time)
             ===================================================================== */}
          {flipState && (
            <div
              ref={turningLeafRef}
              className="absolute inset-0 w-full h-full"
              style={{
                transformOrigin: '0% 50%',
                transformStyle: 'preserve-3d',
                WebkitTransformStyle: 'preserve-3d',
                backfaceVisibility: 'hidden',
                WebkitBackfaceVisibility: 'hidden',
                willChange: 'transform',
              }}
            >
              {/* --- FRONT FACE (Current page lifting & curling) --- */}
              <div
                className="absolute inset-0 w-full h-full rounded-[6px] overflow-hidden"
                style={{
                  backfaceVisibility: 'hidden',
                  WebkitBackfaceVisibility: 'hidden',
                  transform: 'rotateY(0deg)',
                  transformStyle: 'preserve-3d',
                }}
              >
                <BookPageLayout page={pages[turningPageIndex]} />

                {/* Moving Paper Roll Highlight & Shadow on Front Face */}
                <div
                  ref={frontShineRef}
                  className="absolute inset-0 pointer-events-none rounded-[6px]"
                  style={{
                    opacity: 0,
                    background:
                      'linear-gradient(to right, rgba(0,0,0,0) 0%, rgba(40,20,15,0.18) 35%, rgba(255,255,255,0.45) 55%, rgba(40,20,15,0.3) 75%, rgba(0,0,0,0.45) 100%)',
                  }}
                />
              </div>

              {/* --- BACK FACE (Verso page revealed after 90 degrees) --- */}
              <div
                className="absolute inset-0 w-full h-full rounded-[6px] overflow-hidden"
                style={{
                  backfaceVisibility: 'hidden',
                  WebkitBackfaceVisibility: 'hidden',
                  transform: 'rotateY(180deg)',
                  transformStyle: 'preserve-3d',
                }}
              >
                <img
                  src={pageVerso}
                  alt="Memory Book Verso Page"
                  className="w-full h-full object-contain pointer-events-none rounded-[6px]"
                  loading="eager"
                  decoding="sync"
                />

                {/* Moving Paper Roll Highlight & Shadow on Back Face */}
                <div
                  ref={backShineRef}
                  className="absolute inset-0 pointer-events-none rounded-[6px]"
                  style={{
                    opacity: 0,
                    background:
                      'linear-gradient(to left, rgba(0,0,0,0) 0%, rgba(40,20,15,0.18) 35%, rgba(255,255,255,0.45) 55%, rgba(40,20,15,0.3) 75%, rgba(0,0,0,0.45) 100%)',
                  }}
                />
              </div>
            </div>
          )}

          {/* Quick-Click Hotspots for Immediate Intuitive Page Turning */}
          <div
            onClick={() => turnPage(-1)}
            aria-label="Previous Page"
            className="absolute top-0 left-0 w-1/2 h-full z-20 cursor-w-resize"
          />
          <div
            onClick={() => turnPage(1)}
            aria-label="Next Page"
            className="absolute top-0 right-0 w-1/2 h-full z-20 cursor-e-resize"
          />
        </div>
      </div>

      {/* =========================================================================
          BOTTOM CONTROLS & NAVIGATION (Matching Reference Design)
         ========================================================================= */}
      <div
        ref={controlsRef}
        style={gpuLayerStyle}
        className="w-full max-w-[340px] flex flex-col items-center mt-5 z-10"
      >
        {/* Navigation Bar: Arrow Left · Page Indicator · Arrow Right */}
        <div className="flex items-center justify-center gap-6 w-full">
          {/* Previous Page Button */}
          <button
            type="button"
            onClick={() => turnPage(-1)}
            disabled={isFlipping}
            aria-label="Previous Page"
            className="w-10 h-10 rounded-full border border-[#8a7d76]/40 flex items-center justify-center text-[#5c5049] hover:bg-[#c59a94]/15 hover:border-[#98474e] hover:text-[#98474e] active:scale-90 transition-all duration-200 disabled:opacity-50"
          >
            <svg
              className="w-4 h-4"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.8"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M19 12H5M12 19l-7-7 7-7" />
            </svg>
          </button>

          {/* Page Counter: 02 / 08 (Matching Reference) */}
          <div className="flex items-center justify-center min-w-[90px] font-serif-display text-[15px] tracking-[0.24em] text-[#5c5049] font-normal">
            <span>{currentPage.num}</span>
            <span className="mx-2 text-[#9a8d86]/60 font-light">/</span>
            <span>{String(pages.length).padStart(2, '0')}</span>
          </div>

          {/* Next Page Button */}
          <button
            type="button"
            onClick={() => turnPage(1)}
            disabled={isFlipping}
            aria-label="Next Page"
            className="w-10 h-10 rounded-full border border-[#8a7d76]/40 flex items-center justify-center text-[#5c5049] hover:bg-[#c59a94]/15 hover:border-[#98474e] hover:text-[#98474e] active:scale-90 transition-all duration-200 disabled:opacity-50"
          >
            <svg
              className="w-4 h-4"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.8"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M5 12h14M12 5l7 7-7 7" />
            </svg>
          </button>
        </div>

        {/* Swipe Hint */}
        <p className="text-[11px] font-serif-display tracking-[0.22em] text-[#8a7d76] uppercase mt-2.5">
          Swipe to turn the page
        </p>

        {/* Delicate Rose Accent Divider */}
        <div className="w-10 h-[1.5px] bg-[#c59a94] mt-2.5 rounded-full" />
      </div>
    </section>
  );
}
