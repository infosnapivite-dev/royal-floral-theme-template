import React, { useEffect, useState, Component } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Lenis from 'lenis';
import IPhoneFrame from './components/Chassis/IPhoneFrame';
import ParallaxHero from './components/ParallaxHero';
import EventsPage from './components/EventsPage';
import GalleryBook from './components/GalleryBook';
import VenueSection from './components/VenueSection';
import CountdownSection from './components/CountdownSection';
import ThankYouSection from './components/ThankYouSection';
import './styles/iphone-mockup.css';

gsap.registerPlugin(ScrollTrigger);

// Error boundary to catch any runtime errors gracefully and prevent black screens
class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('App Error caught:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="w-full h-full flex flex-col items-center justify-center p-8 bg-[#f9f6f0] text-center select-none">
          <h2 className="font-royal text-xl text-[#801b26] mb-3">Royal Floral Invitation</h2>
          <p className="text-sm text-[#4e474d] mb-4">Something went wrong during loading.</p>
          <button
            onClick={() => window.location.reload()}
            className="px-5 py-2 rounded-full border border-[#c5a059] text-xs font-royal tracking-widest text-[#1a1519] hover:bg-[#c5a059]/10 transition-colors"
          >
            Reload Invitation
          </button>
        </div>
      );
    }
    return this.props.children;
  }
}

export default function App() {
  const [backdropTheme, setBackdropTheme] = useState('light'); // 'light' ivory or 'dark' velvet

  useEffect(() => {
    const scroller = document.getElementById('mockup-scroll-container');
    if (!scroller) return;

    let lenis;
    let updateLenis;

    try {
      lenis = new Lenis({
        wrapper: scroller,
        content: scroller.querySelector('.scroll-content') || scroller,
        smoothWheel: true,
        duration: 1.1,
      });

      lenis.on('scroll', ScrollTrigger.update);

      updateLenis = (time) => {
        lenis.raf(time * 1000);
      };
      gsap.ticker.add(updateLenis);
      gsap.ticker.lagSmoothing(0);
    } catch (err) {
      console.warn('Lenis smooth scrolling fallback to native scroll:', err);
    }

    const timer = setTimeout(() => {
      ScrollTrigger.refresh();
    }, 200);

    return () => {
      clearTimeout(timer);
      if (updateLenis) gsap.ticker.remove(updateLenis);
      if (lenis) lenis.destroy();
    };
  }, []);

  return (
    <ErrorBoundary>
      <div className={`desktop-viewport-container ${backdropTheme === 'dark' ? 'stage-dark' : 'stage-light'}`}>
        {/* Subtle desktop backdrop theme switcher in top right corner */}
        <div className="hidden md:flex absolute top-4 right-4 z-50 items-center gap-2 bg-white/60 backdrop-blur-md px-3 py-1.5 rounded-full border border-[#c5a059]/30 shadow-sm text-[11px] font-royal tracking-wider text-[#4e474d]">
          <span>Backdrop:</span>
          <button
            onClick={() => setBackdropTheme('light')}
            className={`px-2 py-0.5 rounded-full transition-colors ${
              backdropTheme === 'light' ? 'bg-[#c5a059] text-white font-semibold' : 'hover:text-[#1a1519]'
            }`}
          >
            Ivory
          </button>
          <button
            onClick={() => setBackdropTheme('dark')}
            className={`px-2 py-0.5 rounded-full transition-colors ${
              backdropTheme === 'dark' ? 'bg-[#801b26] text-white font-semibold' : 'hover:text-[#1a1519]'
            }`}
          >
            Velvet
          </button>
        </div>

        <IPhoneFrame>
          {/* 
            Internal Scrollable Viewport
            - id="mockup-scroll-container": Rigidly bound to GSAP ScrollTrigger & Lenis
            - Continuous Single Page Scroll:
              1. Home Page (GSAP Parallax Chateau Hero + Invitation Announcement)
              2. Event Page (Date-Led Editorial "Our Celebrations" with 3 Cards)
            - gpu-accelerated & no-scrollbar: Performance & clean mockup display
          */}
          <main
            id="mockup-scroll-container"
            className="inner-app-scroll relative w-full h-full royal-page-gradient overflow-y-auto overflow-x-hidden no-scrollbar gpu-accelerated"
          >
            <div className="scroll-content w-full relative flex flex-col">
              {/* =========================================================
                  1. HOME PAGE (GSAP Parallax Hero)
                 ========================================================= */}
              <ParallaxHero />

              {/* =========================================================
                  2. EVENT PAGE (Date-Led Editorial "Our Celebrations")
                 ========================================================= */}
              <EventsPage />

              {/* =========================================================
                  3. MEMORY BOOK GALLERY SECTION
                 ========================================================= */}
              <GalleryBook />

              {/* =========================================================
                  4. VENUE SECTION (Architectural Editorial & Navigation)
                 ========================================================= */}
              <VenueSection />

              {/* =========================================================
                  5. COUNTDOWN SECTION (Floral Wreath & Live Timer)
                 ========================================================= */}
              <CountdownSection />

              {/* =========================================================
                  6. THANK YOU SECTION (Heartfelt Gratitude & Monogram)
                 ========================================================= */}
              <ThankYouSection />
            </div>
          </main>
        </IPhoneFrame>
      </div>
    </ErrorBoundary>
  );
}
