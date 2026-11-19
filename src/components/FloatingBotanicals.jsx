import React, { useRef, useLayoutEffect } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

import leafImg from '../assets/leaf.png';
import petalImg from '../assets/petal.png';

gsap.registerPlugin(ScrollTrigger);

const gpuLayerStyle = {
  transform: 'translate3d(0, 0, 0)',
  WebkitTransform: 'translate3d(0, 0, 0)',
  backfaceVisibility: 'hidden',
  WebkitBackfaceVisibility: 'hidden',
  willChange: 'transform, opacity',
};

// Depth-of-Field & Parallax presets for each section
const VARIANT_CONFIGS = {
  hero: [
    { type: 'petal', depth: 'foreground', blur: 'blur-[2.5px]', size: 'w-11 sm:w-13', top: '14%', right: '5%', yTravel: 85, rotFrom: -25, rotTo: 40, opacity: 0.85 },
    { type: 'leaf', depth: 'midground', blur: '', size: 'w-7 sm:w-8', top: '48%', left: '4%', yTravel: 50, rotFrom: 15, rotTo: -20, opacity: 0.9 },
    { type: 'petal', depth: 'midground', blur: '', size: 'w-8 sm:w-9', top: '68%', right: '6%', yTravel: 60, rotFrom: -35, rotTo: 25, opacity: 0.9 },
    { type: 'leaf', depth: 'background', blur: 'blur-[1.2px]', size: 'w-5 sm:w-6', top: '82%', left: '8%', yTravel: 30, rotFrom: 40, rotTo: 65, opacity: 0.5 },
  ],
  events: [
    { type: 'petal', depth: 'foreground', blur: 'blur-[2px]', size: 'w-12 sm:w-14', top: '8%', right: '4%', yTravel: 95, rotFrom: -20, rotTo: 50, opacity: 0.82 },
    { type: 'leaf', depth: 'midground', blur: '', size: 'w-7 sm:w-8', top: '28%', left: '4%', yTravel: 55, rotFrom: 20, rotTo: -15, opacity: 0.88 },
    { type: 'petal', depth: 'midground', blur: '', size: 'w-8 sm:w-9', top: '52%', right: '5%', yTravel: 65, rotFrom: -30, rotTo: 30, opacity: 0.9 },
    { type: 'leaf', depth: 'background', blur: 'blur-[1px]', size: 'w-5 sm:w-6', top: '74%', left: '5%', yTravel: 35, rotFrom: -10, rotTo: 35, opacity: 0.55 },
    { type: 'petal', depth: 'foreground', blur: 'blur-[2.5px]', size: 'w-11 sm:w-13', top: '92%', right: '6%', yTravel: 80, rotFrom: 30, rotTo: 90, opacity: 0.8 },
  ],
  gallery: [
    { type: 'leaf', depth: 'midground', blur: '', size: 'w-7 sm:w-8', top: '12%', right: '4%', yTravel: 55, rotFrom: -15, rotTo: 35, opacity: 0.85 },
    { type: 'petal', depth: 'midground', blur: '', size: 'w-7 sm:w-8', top: '24%', right: '5%', yTravel: 50, rotFrom: 25, rotTo: -20, opacity: 0.9 },
    { type: 'petal', depth: 'background', blur: '', size: 'w-5 sm:w-6', top: '42%', left: '6%', yTravel: 35, rotFrom: 15, rotTo: 50, opacity: 0.7 },
    { type: 'petal', depth: 'midground', blur: '', size: 'w-6 sm:w-7', top: '56%', right: '6%', yTravel: 50, rotFrom: -35, rotTo: 15, opacity: 0.9 },
    { type: 'petal', depth: 'midground', blur: '', size: 'w-7 sm:w-8', top: '70%', left: '4%', yTravel: 55, rotFrom: -40, rotTo: 25, opacity: 0.9 },
    { type: 'leaf', depth: 'background', blur: '', size: 'w-5 sm:w-6', top: '84%', right: '5%', yTravel: 30, rotFrom: 10, rotTo: 45, opacity: 0.7 },
  ],
  venue: [
    { type: 'leaf', depth: 'foreground', blur: 'blur-[2.5px]', size: 'w-11 sm:w-13', top: '10%', left: '5%', yTravel: 85, rotFrom: -30, rotTo: 30, opacity: 0.8 },
    { type: 'petal', depth: 'midground', blur: '', size: 'w-8 sm:w-9', top: '36%', right: '5%', yTravel: 55, rotFrom: 20, rotTo: -25, opacity: 0.9 },
    { type: 'leaf', depth: 'midground', blur: '', size: 'w-7 sm:w-8', top: '68%', left: '4%', yTravel: 50, rotFrom: -15, rotTo: 25, opacity: 0.88 },
    { type: 'petal', depth: 'background', blur: 'blur-[1.2px]', size: 'w-5 sm:w-6', top: '88%', right: '6%', yTravel: 35, rotFrom: 35, rotTo: 65, opacity: 0.55 },
  ],
  countdown: [
    { type: 'petal', depth: 'foreground', blur: 'blur-[2px]', size: 'w-11 sm:w-13', top: '8%', right: '5%', yTravel: 80, rotFrom: -25, rotTo: 35, opacity: 0.85 },
    { type: 'leaf', depth: 'midground', blur: '', size: 'w-7 sm:w-8', top: '34%', left: '4%', yTravel: 50, rotFrom: 20, rotTo: -20, opacity: 0.9 },
    { type: 'petal', depth: 'midground', blur: '', size: 'w-8 sm:w-9', top: '68%', right: '5%', yTravel: 60, rotFrom: -30, rotTo: 25, opacity: 0.9 },
    { type: 'leaf', depth: 'background', blur: 'blur-[1px]', size: 'w-5 sm:w-6', top: '88%', left: '6%', yTravel: 30, rotFrom: 15, rotTo: 50, opacity: 0.5 },
  ],
  thankyou: [
    { type: 'leaf', depth: 'midground', blur: '', size: 'w-7 sm:w-8', top: '14%', left: '4%', yTravel: 55, rotFrom: -20, rotTo: 35, opacity: 0.85 },
    { type: 'petal', depth: 'midground', blur: '', size: 'w-7 sm:w-8', top: '26%', left: '6%', yTravel: 50, rotFrom: 20, rotTo: -25, opacity: 0.9 },
    { type: 'petal', depth: 'background', blur: '', size: 'w-5 sm:w-6', top: '44%', right: '7%', yTravel: 35, rotFrom: -15, rotTo: 30, opacity: 0.7 },
    { type: 'petal', depth: 'midground', blur: '', size: 'w-7 sm:w-8', top: '58%', right: '5%', yTravel: 55, rotFrom: -30, rotTo: 20, opacity: 0.9 },
    { type: 'leaf', depth: 'midground', blur: '', size: 'w-6 sm:w-7', top: '72%', left: '4%', yTravel: 45, rotFrom: -25, rotTo: 20, opacity: 0.85 },
    { type: 'petal', depth: 'midground', blur: '', size: 'w-6 sm:w-7', top: '84%', left: '7%', yTravel: 45, rotFrom: 25, rotTo: -20, opacity: 0.9 },
  ],
};

export default function FloatingBotanicals({ variant = 'hero' }) {
  const containerRef = useRef(null);
  const itemsRef = useRef([]);

  const items = VARIANT_CONFIGS[variant] || VARIANT_CONFIGS.hero;

  useLayoutEffect(() => {
    const scroller = document.querySelector('#mockup-scroll-container') || window;
    if (!containerRef.current) return;

    const ctx = gsap.context(() => {
      itemsRef.current.forEach((el, idx) => {
        if (!el) return;
        const config = items[idx];
        if (!config) return;

        // Differential Parallax Scrub based on Depth-of-Field
        // Foreground moves fast (high yTravel), Background moves slow (low yTravel)
        gsap.fromTo(
          el,
          {
            y: config.yTravel,
            rotate: config.rotFrom,
          },
          {
            y: -config.yTravel,
            rotate: config.rotTo,
            ease: 'none',
            scrollTrigger: {
              trigger: containerRef.current,
              scroller: scroller,
              start: 'top bottom',
              end: 'bottom top',
              scrub: config.depth === 'foreground' ? 0.8 : config.depth === 'midground' ? 1.0 : 1.3,
            },
          }
        );
      });
    }, containerRef);

    return () => ctx.revert();
  }, [items]);

  return (
    <div
      ref={containerRef}
      className="absolute inset-0 pointer-events-none overflow-hidden z-25"
      style={gpuLayerStyle}
    >
      {items.map((item, idx) => {
        const isPetal = item.type === 'petal';
        const imgSrc = isPetal ? petalImg : leafImg;

        // Positioning styles
        const posStyle = {
          top: item.top,
          ...(item.left ? { left: item.left } : {}),
          ...(item.right ? { right: item.right } : {}),
          opacity: item.opacity,
          ...gpuLayerStyle,
        };

        return (
          <div
            key={idx}
            ref={(el) => (itemsRef.current[idx] = el)}
            className={`absolute ${item.size} will-animate drop-shadow-sm`}
            style={posStyle}
          >
            <img
              src={imgSrc}
              alt=""
              className={`w-full h-auto object-contain pointer-events-none ${item.blur}`}
            />
          </div>
        );
      })}
    </div>
  );
}
