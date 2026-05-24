
import React, { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { LayoutDashboard, User, History, ShieldAlert, Target, Radio } from 'lucide-react';
import Hero from './components/Hero';
import Operative from './components/Operative';
import Arsenal from './components/Arsenal';
import Intel from './components/Intel';
import Uplink from './components/Uplink';
import Drone from './components/Drone';
import Timeline from './components/Timeline';
import Intro from './components/Intro';
import { SpeedInsights } from '@vercel/speed-insights/react';

const NAV_ITEMS = [
  { id: 'hero', label: 'DASHBOARD', icon: <LayoutDashboard size={16} /> },
  { id: 'about', label: 'OPERATIVE', icon: <User size={16} /> },
  { id: 'timeline', label: 'MISSION LOG', icon: <History size={16} /> },
  { id: 'platforms', label: 'ARSENAL', icon: <ShieldAlert size={16} /> },
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

  if (isBooting) {
    return <Intro onComplete={handleBootComplete} />;
  }

  return (
    <div className={`app-container ${isDimmed ? 'dimmed-state' : ''} ${isHomeZone && activeTab === 'hero' ? 'home-active' : ''}`}>
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

      <Drone activeTab={activeTab} isHomeZone={isHomeZone && activeTab === 'hero'} isOffline={!isUILoaded} />

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

            <nav className="nav-sidebar">
              <div className="nav-header mono"> MISSION_CONTROL</div>
              <div className="nav-group">
                {NAV_ITEMS.map((item) => (
                  <button
                    key={item.id}
                    className={`nav-btn ${activeTab === item.id ? 'active' : ''}`}
                    onClick={() => setActiveTab(item.id)}
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
            {activeTab === 'hero' && <Hero isHomeZone={isHomeZone} />}
            {activeTab === 'about' && <Operative />}
            {activeTab === 'timeline' && <Timeline />}
            {activeTab === 'platforms' && <Arsenal />}
            {activeTab === 'intel' && <Intel />}
            {activeTab === 'contact' && <Uplink />}
          </motion.div>
        </AnimatePresence>
      </main>

      <SpeedInsights />

      <style jsx>{`
        .app-container {
          display: flex;
          height: 100vh;
          width: 100vw;
          background: #000;
          position: relative;
          transition: filter 0.3s ease;
          overflow: hidden;
        }

        .app-container.dimmed-state {
          filter: brightness(0.1) contrast(1.1);
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
          background: rgba(5, 5, 5, 0.92);
          border-bottom: 1px solid var(--border-dim);
          z-index: 1100;
          font-size: 0.7rem;
          letter-spacing: 2px;
          color: var(--text-dim);
          transition: background 0.4s ease, border-color 0.4s ease;
        }

        .home-active .status-bar {
          background: rgba(4, 12, 8, 0.95);
          border-color: rgba(16, 185, 129, 0.2);
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
        .nav-sidebar {
          position: fixed;
          left: 0;
          top: 40px;
          bottom: 0;
          width: 230px;
          display: flex;
          flex-direction: column;
          padding: 2.5rem 1.2rem;
          background: rgba(8, 8, 8, 0.85);
          backdrop-filter: blur(6px);
          border-right: 1px solid var(--border-dim);
          z-index: 1000;
          transition: background 0.4s ease, border-color 0.4s ease;
        }

        .home-active .nav-sidebar {
          background: rgba(4, 15, 8, 0.75);
          border-right: 1px solid rgba(16, 185, 129, 0.25);
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

        .nav-group { display: flex; flex-direction: column; gap: 0.6rem; flex: 1; }
        
        .nav-btn {
          position: relative;
          display: flex;
          align-items: center;
          gap: 1rem;
          padding: 0.9rem;
          background: transparent;
          border: 1px solid transparent;
          color: var(--text-dim);
          font-family: var(--font-tech);
          font-size: 0.68rem;
          letter-spacing: 2px;
          cursor: pointer;
          transition: all 0.3s cubic-bezier(0.19, 1, 0.22, 1);
          text-align: left;
        }

        .nav-btn:hover { color: #fff; background: rgba(255,255,255,0.05); }
        
        .home-active .nav-btn:hover {
          color: var(--emerald);
          background: rgba(16, 185, 129, 0.08);
        }

        .nav-btn.active { color: var(--yellow); border-color: rgba(250, 204, 21, 0.2); background: rgba(250, 204, 21, 0.06); }
        
        .home-active .nav-btn.active {
          color: var(--emerald);
          border-color: rgba(16, 185, 129, 0.3);
          background: rgba(16, 185, 129, 0.12);
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
          margin-left: 230px;
          margin-top: 40px;
          padding: 3rem;
          height: calc(100vh - 40px);
          overflow-y: auto;
        }

        .tab-container { max-width: 1200px; margin: 0 auto; }
        
        @media (max-width: 1024px) {
          .nav-sidebar { width: 70px; padding: 2rem 0.6rem; }
          .nav-label { display: none; }
          .nav-header { display: none; }
          .content-area { margin-left: 70px; padding: 2rem; }
        }

        @media (max-width: 768px) {
          .nav-sidebar { width: 60px; }
          .content-area { margin-left: 60px; padding: 1.5rem; }
          .status-bar { padding: 0 1rem; font-size: 0.6rem; }
        }
      `}</style>
    </div>
  );
};

export default App;
