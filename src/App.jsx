
import React, { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { LayoutDashboard, User, History, ShieldAlert, Target, Radio, Menu, X } from 'lucide-react';
import Hero from './components/Hero';
import Operative from './components/Operative';
import Arsenal from './components/Arsenal';
import Intel from './components/Intel';
import Uplink from './components/Uplink';
import Drone from './components/Drone';
import Timeline from './components/Timeline';
import Intro from './components/Intro';
import ErrorBoundary from './components/ErrorBoundary';
import { SpeedInsights } from '@vercel/speed-insights/react';
import { GradientBackground } from './components/ui/paper-design-shader-background';

const NAV_ITEMS = [
  { id: 'hero', label: 'DASHBOARD', icon: <LayoutDashboard size={16} /> },
  { id: 'about', label: 'OPERATIVE', icon: <User size={16} /> },
  { id: 'timeline', label: 'MISSION LOG', icon: <History size={16} /> },
  { id: 'platforms', label: 'PROJECTS', icon: <ShieldAlert size={16} /> },
  { id: 'intel', label: 'INTEL', icon: <Target size={16} /> },
  { id: 'contact', label: 'UPLINK', icon: <Radio size={16} /> },
];

const App = () => {
  const [activeTab, setActiveTab] = useState('hero');
  const [isBooting, setIsBooting] = useState(true);
  const [isHomeZone, setIsHomeZone] = useState(false);
  const [isDimmed, setIsDimmed] = useState(false);
  const [showSweep, setShowSweep] = useState(false);
  const [isUILoaded, setIsUILoaded] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const prevTabRef = useRef(activeTab);

  const handleBootComplete = useCallback(() => setIsBooting(false), []);

  // Transition after boot
  useEffect(() => {
    if (!isBooting) {
      const timer = setTimeout(() => setIsUILoaded(true), 700);
      return () => clearTimeout(timer);
    }
  }, [isBooting]);

  // Tab Transition Logic
  useEffect(() => {
    if (activeTab === 'hero' && prevTabRef.current !== 'hero' && !isBooting) {
      setIsDimmed(true);
      const timer1 = setTimeout(() => {
        setIsDimmed(false);
        setShowSweep(true);
      }, 100);
      const timer2 = setTimeout(() => setShowSweep(false), 900);
      return () => { clearTimeout(timer1); clearTimeout(timer2); };
    }
    prevTabRef.current = activeTab;
  }, [activeTab, isBooting]);

  // Optimized cursor zone detection — rAF + cached targets
  useEffect(() => {
    if (activeTab !== 'hero' || isBooting) {
      setIsHomeZone(false);
      return;
    }
    
    let rafId = null;
    let lastMousePos = null;
    let cachedTargets = null;
    let cacheTimeout = null;

    const invalidateCache = () => { cachedTargets = null; };

    const checkProximity = () => {
      if (!lastMousePos) return;
      
      if (!cachedTargets) {
        cachedTargets = Array.from(
          document.querySelectorAll('.hero-title, .hero-subtitle, .section-label, .aoi-label')
        );
      }
      
      let minDistance = Infinity;
      const { x, y } = lastMousePos;

      for (let i = 0; i < cachedTargets.length; i++) {
        const rect = cachedTargets[i].getBoundingClientRect();
        const cx = rect.left + rect.width / 2;
        const cy = rect.top + rect.height / 2;
        const dx = x - cx;
        const dy = y - cy;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < minDistance) minDistance = dist;
      }

      setIsHomeZone(minDistance < 200);
      rafId = null;
    };

    const handleMove = (e) => {
      lastMousePos = { x: e.clientX, y: e.clientY };
      if (!rafId) {
        rafId = requestAnimationFrame(checkProximity);
      }
    };
    
    window.addEventListener('mousemove', handleMove, { passive: true });
    window.addEventListener('resize', invalidateCache);
    
    return () => {
      window.removeEventListener('mousemove', handleMove);
      window.removeEventListener('resize', invalidateCache);
      if (rafId) cancelAnimationFrame(rafId);
    };
  }, [activeTab, isBooting]);

  const getAtmosphereConfig = () => {
    if (isBooting) {
      // Intro
      return { colors: ["#050505", "#111111", "#FACC15", "#D4A017", "#B8860B"], blur: "20px", opacity: 0.35, speed: 0.3 };
    }
    switch (activeTab) {
      case 'hero': 
        // Home: Untouched
        return { colors: ["#FACC15", "#D4A017", "#FFE08A", "#111111", "#000000"], blur: "0px", opacity: 1.0, speed: 1 };
      case 'about': 
        // Operative
        return { colors: ["#050505", "#000000", "#111111", "#B8860B", "#FACC15"], blur: "20px", opacity: 0.65, speed: 0.4 };
      case 'timeline': 
        // Mission Log
        return { colors: ["#050505", "#050505", "#111111", "#B8860B", "#D4A017"], blur: "25px", opacity: 0.6, speed: 0.2 };
      case 'platforms': 
        // Projects
        return { colors: ["#000000", "#050505", "#111111", "#FACC15", "#D4A017"], blur: "20px", opacity: 0.6, speed: 0.4 };
      case 'intel': 
        // Intel
        return { colors: ["#050505", "#000000", "#111111", "#D4A017", "#B8860B"], blur: "30px", opacity: 0.55, speed: 0.3 };
      case 'contact': 
        // Contact
        return { colors: ["#000000", "#111111", "#B8860B", "#FACC15", "#D4A017"], blur: "25px", opacity: 0.65, speed: 0.3 };
      default: 
        return { colors: ["#050505", "#111111", "#FACC15", "#D4A017", "#000000"], blur: "20px", opacity: 0.6, speed: 0.3 };
    }
  };

  return (
    <>
      <GradientBackground {...getAtmosphereConfig()} />
      <AnimatePresence mode="wait">
        {isBooting && <Intro key="intro-screen" onComplete={handleBootComplete} />}
      </AnimatePresence>

      <div className={`app-container ${isDimmed ? 'dimmed-state' : ''} ${isHomeZone && activeTab === 'hero' ? 'home-active' : ''} ${isSidebarOpen ? 'sidebar-open' : ''}`}>
      <div className="global-haze" />
      <div className="hud-grid" />
      <div className="scanline-sweep" />
      <div className="scanline" />

      {/* Sweep Overlay */}
      <AnimatePresence>
        {showSweep && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="sweep-overlay"
          >
            <div className="sweep-line" />
          </motion.div>
        )}
      </AnimatePresence>

      <Drone isOffline={!isUILoaded} />

      {/* Sidebar Toggle Button */}
      {isUILoaded && (
        <button 
          className="sidebar-toggle-btn"
          onClick={() => setIsSidebarOpen(!isSidebarOpen)}
        >
          {isSidebarOpen ? <X size={20} /> : <Menu size={20} />}
        </button>
      )}

      {/* UI Elements */}
      <AnimatePresence>
        {isUILoaded && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, delay: 0.5 }}
          >
            <header className="status-bar">
              <div className="status-item mono highlight">
                <span className="dot-led pulse-fast" />
                SYSTEM_ID: HK_TMI_07 // STATUS: LOCKED
              </div>
              <div className="status-item mono clock-utc">{new Date().toLocaleTimeString()} Z</div>
              <div className="status-item mono team-branding">WOLVES_OF_THE_SKY // TMI</div>
            </header>

            <nav className={`nav-sidebar ${isSidebarOpen ? 'open' : ''}`}>
              <div className="nav-group">
                {NAV_ITEMS.map((item) => (
                  <button
                    key={item.id}
                    className={`nav-btn ${activeTab === item.id ? 'active' : ''}`}
                    onClick={() => {
                      setActiveTab(item.id);
                      if (window.innerWidth <= 1024) setIsSidebarOpen(false);
                    }}
                  >
                    <div className="nav-icon">{item.icon}</div>
                    <span className="nav-label">{item.label}</span>
                    {activeTab === item.id && (
                      <motion.div layoutId="nav-glow" className="nav-glow" />
                    )}
                  </button>
                ))}
              </div>
              <div className="nav-footer mono">HK_OS_v4.5</div>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>

      <main className="content-area">
        <ErrorBoundary resetKey={activeTab}>
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ 
                opacity: 0, 
                scale: activeTab === 'hero' ? 0.99 : 1,
                x: activeTab === 'hero' ? 0 : 15,
                y: activeTab === 'hero' ? 8 : 0
              }}
              animate={{ opacity: 1, scale: 1, x: 0, y: 0 }}
              exit={{ 
                opacity: 0, 
                scale: activeTab === 'hero' ? 0.99 : 1,
                x: activeTab === 'hero' ? 0 : -15,
                y: activeTab === 'hero' ? -4 : 0
              }}
              transition={{ duration: 0.6, ease: [0.19, 1, 0.22, 1] }}
              className="tab-container"
            >
              {activeTab === 'hero' && <Hero isHomeZone={isHomeZone} setActiveTab={setActiveTab} />}
              {activeTab === 'about' && <Operative />}
              {activeTab === 'timeline' && <Timeline />}
              {activeTab === 'platforms' && <Arsenal />}
              {activeTab === 'intel' && <Intel />}
              {activeTab === 'contact' && <Uplink />}
            </motion.div>
          </AnimatePresence>
        </ErrorBoundary>
      </main>

      {/* Mobile Bottom Navigation Bar — only visible on screens ≤ 768px */}
      <nav className="mobile-nav-bar">
        {NAV_ITEMS.map((item) => (
          <button
            key={item.id}
            className={`mobile-nav-btn ${activeTab === item.id ? 'active' : ''}`}
            onClick={() => setActiveTab(item.id)}
          >
            <div className="mobile-nav-icon">{item.icon}</div>
            <span>{item.label}</span>
          </button>
        ))}
      </nav>

      <SpeedInsights />

      <style jsx>{`
        .app-container {
          display: flex;
          height: 100vh;
          width: 100vw;
          background: transparent;
          position: relative;
          transition: filter 0.3s ease;
          overflow: hidden;
        }

        .app-container.dimmed-state {
          filter: brightness(0.1) contrast(1.1);
        }

        .global-haze {
          position: fixed;
          inset: 0;
          z-index: 0;
          pointer-events: none;
          background: 
            radial-gradient(ellipse at 30% 40%, rgba(250, 204, 21, 0.035) 0%, transparent 60%),
            radial-gradient(ellipse at 70% 60%, rgba(212, 160, 23, 0.025) 0%, transparent 50%),
            radial-gradient(ellipse at 50% 80%, rgba(255, 224, 138, 0.015) 0%, transparent 70%);
          filter: blur(40px);
          animation: hazeShift 25s infinite alternate ease-in-out;
        }

        @keyframes hazeShift {
          0% { transform: scale(1) translate(0, 0); opacity: 0.7; }
          50% { transform: scale(1.1) translate(-2%, 2%); opacity: 1; }
          100% { transform: scale(1.05) translate(2%, -2%); opacity: 0.8; }
        }

        .sweep-overlay {
          position: fixed;
          inset: 0;
          background: rgba(0,0,0,0.3);
          z-index: 10000;
          pointer-events: none;
        }

        .sweep-line {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 2px;
          background: linear-gradient(90deg, transparent, var(--yellow), transparent);
          box-shadow: 0 0 15px var(--yellow-glow);
          animation: sweepAction 0.8s cubic-bezier(0.19, 1, 0.22, 1) forwards;
        }

        @keyframes sweepAction {
          from { top: 0%; opacity: 0; }
          30% { opacity: 1; }
          to { top: 100%; opacity: 0; }
        }

        .status-bar {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          height: 40px;
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 0 2rem;
          background: rgba(10, 10, 10, 0.55);
          backdrop-filter: blur(12px);
          -webkit-backdrop-filter: blur(12px);
          border-bottom: 1px solid rgba(250, 204, 21, 0.15);
          box-shadow: 0 1px 15px rgba(250, 204, 21, 0.05), inset 0 1px 0 rgba(255, 255, 255, 0.05);
          z-index: 1100;
          font-size: 0.7rem;
          letter-spacing: 2px;
          color: var(--text-dim);
          transition: background 0.4s ease, border-color 0.4s ease;
        }

        .home-active .status-bar {
          background: rgba(4, 12, 8, 0.55);
          border-color: rgba(16, 185, 129, 0.15);
        }

        .dot-led {
          display: inline-block;
          width: 6px;
          height: 6px;
          border-radius: 50%;
          background: var(--emerald);
          margin-right: 10px;
          box-shadow: 0 0 6px var(--emerald);
        }

        .pulse-fast { animation: blink 0.8s infinite; }
        @keyframes blink { 50% { opacity: 0.3; } }

        /* Left Dashboard Panel (Mission Control) */
        .sidebar-toggle-btn {
          position: fixed;
          top: 60px;
          left: 1.5rem;
          z-index: 1000;
          background: rgba(10, 10, 10, 0.8);
          border: 1px solid rgba(250, 204, 21, 0.3);
          color: var(--yellow);
          width: 40px;
          height: 40px;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          transition: all 0.3s ease;
          border-radius: 4px;
        }

        .sidebar-toggle-btn:hover {
          background: rgba(250, 204, 21, 0.1);
          box-shadow: 0 0 12px rgba(250, 204, 21, 0.2);
        }

        .nav-sidebar {
          position: fixed;
          left: 0;
          top: 40px;
          bottom: 0;
          width: 230px;
          background: rgba(8, 8, 8, 0.60);
          backdrop-filter: blur(14px);
          -webkit-backdrop-filter: blur(14px);
          border-right: 1px solid rgba(250, 204, 21, 0.15);
          display: flex;
          flex-direction: column;
          padding: 2.5rem 1.5rem;
          z-index: 100;
          transform: translateX(-100%);
          transition: transform 0.4s cubic-bezier(0.19, 1, 0.22, 1);
        }

        .nav-sidebar.open {
          transform: translateX(0);
        }

        .home-active .nav-sidebar {
          background: rgba(4, 15, 8, 0.60);
          border-right: 1px solid rgba(16, 185, 129, 0.15);
        }

        .nav-header { 
          font-size: 0.6rem; 
          opacity: 0.4; 
          letter-spacing: 4px; 
          margin-bottom: 2rem; 
          padding-left: 0.8rem; 
          transition: color 0.4s ease;
        }
        
        .home-active .nav-header {
          color: var(--emerald);
          opacity: 0.8;
        }

        .nav-group { display: flex; flex-direction: column; gap: 0.6rem; flex: 1; margin-top: 3.5rem; }
        
        .nav-btn {
          position: relative;
          display: flex;
          align-items: center;
          gap: 1rem;
          padding: 0.9rem;
          background: rgba(20, 20, 20, 0.4);
          border: 1px solid rgba(255, 255, 255, 0.03);
          border-radius: 6px;
          color: var(--text-dim);
          font-family: var(--font-tech);
          font-size: 0.68rem;
          letter-spacing: 2px;
          cursor: pointer;
          transition: all 0.3s cubic-bezier(0.19, 1, 0.22, 1);
          text-align: left;
        }

        .nav-btn:hover { 
          color: #fff; 
          background: rgba(40, 40, 40, 0.5);
          border-color: rgba(255, 255, 255, 0.1);
          box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.1);
        }
        
        .home-active .nav-btn:hover {
          color: var(--emerald);
          background: rgba(16, 185, 129, 0.08);
        }

        .nav-btn.active { 
          color: #FACC15; 
          background: rgba(250, 204, 21, 0.12);
          border-color: rgba(250, 204, 21, 0.3);
          box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.1), 0 0 15px rgba(250, 204, 21, 0.18);
        }
        
        .home-active .nav-btn.active {
          color: var(--emerald);
          border-color: rgba(16, 185, 129, 0.3);
          background: rgba(16, 185, 129, 0.12);
          box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.1), 0 0 15px rgba(16, 185, 129, 0.18);
        }

        .nav-glow { 
          position: absolute; 
          left: 0; 
          top: 0; 
          bottom: 0; 
          width: 3px; 
          background: var(--yellow); 
          box-shadow: 0 0 8px var(--yellow); 
          transition: background 0.4s ease, box-shadow 0.4s ease;
        }

        .home-active .nav-glow {
          background: var(--emerald);
          box-shadow: 0 0 8px var(--emerald);
        }

        .nav-footer {
          font-size: 0.55rem;
          opacity: 0.25;
          letter-spacing: 3px;
          padding-left: 0.8rem;
        }

        .content-area {
          flex: 1;
          margin-left: 0;
          margin-top: 40px;
          padding: 3rem 3rem 3rem 5rem;
          height: calc(100vh - 40px);
          overflow-y: auto;
          transition: margin-left 0.4s cubic-bezier(0.19, 1, 0.22, 1), filter 0.3s ease;
        }

        .sidebar-open .content-area {
          margin-left: 230px;
        }

        .tab-container { max-width: 1200px; margin: 0 auto; }
        
        @media (max-width: 1024px) {
          .nav-sidebar { width: 230px; padding: 2.5rem 1.5rem; }
          .nav-label { display: block; }
          .nav-header { display: block; }
          .content-area { padding: 4rem 2rem 2rem 2rem; }
        }

        /* ============================================
           MOBILE LAYOUT — Bottom Navigation Bar
           Desktop/tablet layout is completely unchanged
           ============================================ */
        @media (max-width: 768px) {
          /* Hide toggle button completely on mobile */
          .sidebar-toggle-btn {
            display: none !important;
          }

          /* Hide the left sidebar entirely */
          .nav-sidebar {
            display: none !important;
          }

          /* Shift content to full width with bottom padding for nav bar */
          .content-area {
            margin-left: 0 !important;
            margin-top: 40px;
            padding: 1.2rem 1rem 6rem 1rem;
            height: calc(100vh - 40px);
            overflow-y: auto;
          }

          /* Status bar compact */
          .status-bar {
            padding: 0 1rem;
            font-size: 0.55rem;
          }

          /* Hide verbose items on mobile status bar */
          .team-branding { display: none; }

          /* Bottom Mobile Navigation Bar */
          .mobile-nav-bar {
            display: flex !important;
          }
        }

        /* Mobile bottom nav — hidden by default (desktop) */
        .mobile-nav-bar {
          display: none;
          position: fixed;
          bottom: 0;
          left: 0;
          right: 0;
          height: 64px;
          background: rgba(5, 5, 5, 0.97);
          border-top: 1px solid var(--border-dim);
          z-index: 2000;
          align-items: center;
          justify-content: space-around;
          padding: 0 0.5rem;
          backdrop-filter: blur(10px);
        }

        .mobile-nav-btn {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 4px;
          background: transparent;
          border: none;
          color: var(--text-dim);
          font-family: var(--font-tech);
          font-size: 0.42rem;
          letter-spacing: 1.5px;
          padding: 0.5rem 0.4rem;
          cursor: pointer;
          transition: color 0.2s ease;
          flex: 1;
        }

        .mobile-nav-btn.active {
          color: var(--yellow);
        }

        .mobile-nav-btn.active svg {
          filter: drop-shadow(0 0 4px var(--yellow-glow));
        }

        .mobile-nav-icon {
          display: flex;
          align-items: center;
          justify-content: center;
        }

        /* ── GLOBAL AEROSPACE GLASS HUD EFFECT ── */
        .tech-glass-panel {
          background: rgba(8, 8, 8, 0.55) !important;
          backdrop-filter: blur(14px) !important;
          -webkit-backdrop-filter: blur(14px) !important;
          border: 1px solid rgba(250, 204, 21, 0.15) !important;
          box-shadow: 0 0 20px rgba(250, 204, 21, 0.05) !important;
          transition: all 0.3s ease !important;
        }

        .tech-glass-panel:hover {
          background: rgba(12, 12, 12, 0.65) !important;
          border-color: rgba(250, 204, 21, 0.25) !important;
          box-shadow: 0 0 25px rgba(250, 204, 21, 0.1) !important;
          transform: translateY(-2px) !important;
        }
      `}</style>
      </div>
    </>
  );
};

export default App;
