import React, { useEffect, useRef, useMemo, useCallback } from 'react';
import { motion } from 'framer-motion';

// Memoized radar background — generates dots once
const HomeRadarLayers = React.memo(({ isHomeZone }) => {
  const targets = useMemo(() => {
    return Array.from({ length: 80 }).map((_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      isGreen: Math.random() > 0.4,
      dur: 4 + Math.random() * 4,
      delay: Math.random() * 5,
      size: Math.random() * 1.1 + 0.9
    }));
  }, []);

  return (
    <div className={`home-hud-bg ${isHomeZone ? 'hud-active-mode' : ''}`}>
      <div className="radar-base-layer">
        <div className="radar-grid-full" />
        <div className="radar-circles-center">
          <div className="arc arc-1" />
          <div className="arc arc-2" />
          <div className="arc arc-3" />
          <div className="arc arc-4" />
        </div>
      </div>

      <div className="radar-active-layer">
        <div className="radar-sweep-scanner" />
        
        {targets.map(t => (
          <div
            key={t.id}
            className={`radar-dot-pulse ${t.isGreen ? 'dot-green' : 'dot-red'}`}
            style={{
              left: `${t.x}%`,
              top: `${t.y}%`,
              width: t.size,
              height: t.size,
              animationDuration: `${t.dur}s`,
              animationDelay: `${t.delay}s`
            }}
          />
        ))}
      </div>
      
      <div className="radar-hud-markers">
        <div className="hud-marker top-left mono">SCAN_MODE: ISR_ACTIVE</div>
        <div className="hud-marker top-right mono">FREQ: 5.8GHZ_SECURE</div>
        <div className="hud-marker bottom-left mono">NAV: RTK_GPS_LOCK</div>
        <div className="hud-marker bottom-right mono">SAT: 14_STR_FIX</div>
      </div>

      <style jsx>{`
        .home-hud-bg {
          position: fixed;
          inset: 0;
          z-index: 10;
          pointer-events: none;
          background: #000;
          transition: background 0.8s cubic-bezier(0.19, 1, 0.22, 1);
        }

        .hud-active-mode {
          background: radial-gradient(circle at 50% 50%, rgba(5, 150, 105, 0.1) 0%, rgba(0, 0, 0, 1) 80%);
        }

        .radar-base-layer { 
          z-index: 1; 
          position: absolute; 
          inset: 0; 
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .radar-active-layer { 
          z-index: 2; 
          position: absolute; 
          inset: 0; 
        }

        .radar-grid-full {
          position: absolute;
          inset: 0;
          background-image: 
            linear-gradient(rgba(250, 204, 21, 0.035) 1px, transparent 1px),
            linear-gradient(90deg, rgba(250, 204, 21, 0.035) 1px, transparent 1px);
          background-size: 100px 100px;
          transition: background-image 0.5s ease;
        }

        .hud-active-mode .radar-grid-full {
          background-image: 
            linear-gradient(rgba(5, 150, 105, 0.06) 1px, transparent 1px),
            linear-gradient(90deg, rgba(5, 150, 105, 0.06) 1px, transparent 1px);
        }

        .radar-circles-center {
          position: relative;
          width: 100vw;
          height: 100vw;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .arc {
          position: absolute;
          border: 1px solid rgba(250, 204, 21, 0.035);
          border-radius: 50%;
          transition: border-color 0.5s ease;
        }

        .hud-active-mode .arc { border-color: rgba(5, 150, 105, 0.08); }

        .arc-1 { width: 250px; height: 250px; }
        .arc-2 { width: 550px; height: 550px; }
        .arc-3 { width: 850px; height: 850px; }
        .arc-4 { width: 1150px; height: 1150px; }

        .radar-sweep-scanner {
          position: absolute;
          top: 50%;
          left: 50%;
          width: 150vmax;
          height: 150vmax;
          background: conic-gradient(from 0deg, rgba(250, 204, 21, 0.06) 0deg, transparent 90deg);
          transform-origin: center center;
          opacity: 0.5;
          animation: sweepRotate 18s infinite linear;
          transition: background 0.5s ease;
          pointer-events: none;
          will-change: transform;
        }

        .hud-active-mode .radar-sweep-scanner {
          background: conic-gradient(from 0deg, rgba(5, 150, 105, 0.12) 0deg, transparent 90deg);
        }

        @keyframes sweepRotate {
          from { transform: translate(-50%, -50%) rotate(0deg); }
          to { transform: translate(-50%, -50%) rotate(360deg); }
        }

        .radar-dot-pulse {
          position: absolute;
          border-radius: 50%;
          opacity: 0.35;
          animation: softPulse infinite ease-in-out;
        }

        .dot-green {
          background: var(--emerald);
          box-shadow: 0 0 4px rgba(5, 150, 105, 0.3);
        }
        .dot-red {
          background: var(--red-alert);
          box-shadow: 0 0 4px rgba(220, 38, 38, 0.3);
        }

        .hud-active-mode .dot-green {
          box-shadow: 0 0 5px rgba(5, 150, 105, 0.4);
        }

        @keyframes softPulse {
          0%, 100% { opacity: 0.25; transform: scale(0.98); }
          50% { opacity: 0.7; transform: scale(1.03); }
        }

        .radar-hud-markers {
          position: absolute;
          inset: 50px;
          pointer-events: none;
          z-index: 3;
        }

        .hud-marker {
          position: absolute;
          font-size: 8px;
          letter-spacing: 3px;
          color: var(--yellow);
          opacity: 0.25;
          transition: color 0.5s ease, opacity 0.5s ease;
        }
        
        .hud-active-mode .hud-marker { color: var(--emerald); opacity: 0.5; }

        .top-left { top: 0; left: 0; }
        .top-right { top: 0; right: 0; }
        .bottom-left { bottom: 0; left: 0; }
        .bottom-right { bottom: 0; right: 0; }
      `}</style>
    </div>
  );
});

HomeRadarLayers.displayName = 'HomeRadarLayers';

const Hero = ({ isHomeZone }) => {
  const interests = useMemo(() => [
    { title: "UAVs & Drones", id: "01" },
    { title: "Avionics", id: "02" },
    { title: "Autonomous Systems", id: "03" },
    { title: "IoT", id: "04" }
  ], []);

  // Glow tracker using refs only — zero re-renders
  const elementsRef = useRef([]);
  const glowRafRef = useRef(null);
  const frameCountRef = useRef(0);

  const registerElement = useCallback((el, id) => {
    if (el && !elementsRef.current.find(item => item.id === id)) {
      elementsRef.current.push({ el, id });
    }
  }, []);

  useEffect(() => {
    let lastMousePos = null;

    const calculateGlow = () => {
      if (!lastMousePos) return;
      
      frameCountRef.current++;
      // Only compute glow every 3rd frame
      if (frameCountRef.current % 3 !== 0) {
        glowRafRef.current = requestAnimationFrame(calculateGlow);
        return;
      }
      
      const { x: clientX, y: clientY } = lastMousePos;
      const threshold = 150;

      elementsRef.current.forEach(({ el }) => {
        if (!el) return;
        const rect = el.getBoundingClientRect();
        const cx = rect.left + rect.width / 2;
        const cy = rect.top + rect.height / 2;
        const dx = clientX - cx;
        const dy = clientY - cy;
        const distance = Math.sqrt(dx * dx + dy * dy);

        if (distance < threshold) {
          const intensity = 1 - (distance / threshold);
          el.style.filter = `brightness(${1 + (0.1 * intensity)})`;
          el.style.textShadow = `0 0 ${6 * intensity}px #facc15`;
        } else {
          el.style.filter = '';
          el.style.textShadow = 'none';
        }
      });

      glowRafRef.current = null;
    };

    const handleMove = (e) => {
      lastMousePos = { x: e.clientX, y: e.clientY };
      if (!glowRafRef.current) {
        glowRafRef.current = requestAnimationFrame(calculateGlow);
      }
    };

    window.addEventListener('mousemove', handleMove, { passive: true });
    
    return () => {
      window.removeEventListener('mousemove', handleMove);
      if (glowRafRef.current) cancelAnimationFrame(glowRafRef.current);
    };
  }, []);

  return (
    <div className={`hero-container ${isHomeZone ? 'active-green-mode' : ''}`}>
      <HomeRadarLayers isHomeZone={isHomeZone} />
      
      <motion.div 
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1, delay: 0.6, ease: [0.19, 1, 0.22, 1] }}
        className="hero-main-hud"
      >
        <div className="hud-floating-text">
          <div className="hero-top-tag">
            <span className="mono mission-tag highlight">
              {isHomeZone ? ">> AIRSPACE_CONTROL // ACTIVE_ISR <<" : "SYSTEM_MONITOR // OPERATOR_SYNC"}
            </span>
          </div>
          
          <h1 className="hero-title">
            Harshwardhan Karanje
          </h1>

          <h2 
            className="hero-subtitle"
            ref={(el) => registerElement(el, 'subtitle')}
          >
            COMPUTER ENGINEERING STUDENT — PCCOE
          </h2>

          <div className="interests-hud-section">
            <h4 
              className="mono highlight section-label"
              ref={(el) => registerElement(el, 'section-label')}
            >
              AREA OF INTEREST
            </h4>
            <div className="interests-list-layout">
              {interests.map((item) => (
                <div 
                  key={item.id}
                  className="aoi-system-module"
                >
                  <div className="aoi-hud-tick" />
                  <div className="aoi-text-group">
                    <span 
                      className="aoi-id mono highlight"
                      ref={(el) => registerElement(el, `aoi-id-${item.id}`)}
                    >
                      [ {item.id} ]
                    </span>
                    <span 
                      className="aoi-label mono"
                      ref={(el) => registerElement(el, `aoi-${item.id}`)}
                    >
                      {item.title}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </motion.div>

      <style jsx>{`
        .hero-container {
          min-height: 100vh;
          display: flex;
          align-items: center;
          justify-content: center;
          position: relative;
          width: 100%;
          overflow: hidden;
          background: #000;
        }

        .hero-main-hud {
          text-align: center;
          width: 100%;
          max-width: 1100px;
          position: relative;
          z-index: 100;
        }

        .hud-floating-text {
          padding: 1.5rem;
        }

        .hero-top-tag { margin-bottom: 2.5rem; }
        .mission-tag { 
          font-size: 0.78rem; 
          letter-spacing: 0.5rem; 
          display: block; 
          opacity: 0.65; 
          transition: color 0.5s ease, opacity 0.5s ease;
        }

        .hero-title {
          font-family: var(--font-tech);
          font-size: 5rem;
          font-weight: 900;
          text-transform: uppercase;
          line-height: 1;
          margin-bottom: 1.5rem;
          color: #fff;
          text-shadow: 0 0 12px var(--yellow-glow);
          letter-spacing: -1px;
          transition: color 0.5s ease, text-shadow 0.6s ease;
        }

        .active-green-mode .hero-title {
          color: #16A34A !important; 
          text-shadow: 0 0 20px var(--emerald), 0 0 8px rgba(250, 204, 21, 0.3);
        }

        .hero-subtitle {
          font-family: var(--font-tech);
          font-size: 1.2rem;
          letter-spacing: 0.7rem;
          color: var(--text-dim);
          text-transform: uppercase;
          margin-bottom: 8rem;
          opacity: 0.55;
          transition: color 0.5s ease, opacity 0.5s ease, letter-spacing 0.5s ease, text-shadow 0.5s ease;
        }

        .active-green-mode .hero-subtitle {
          color: #facc15 !important;
          opacity: 1;
          letter-spacing: 0.8rem;
          text-shadow: 0 0 6px rgba(250, 204, 21, 0.25);
        }

        .section-label {
          margin-bottom: 3.5rem;
          font-size: 0.85rem;
          letter-spacing: 10px;
          opacity: 0.65;
          font-weight: 800;
          transition: color 0.5s ease, opacity 0.5s ease, text-shadow 0.5s ease;
        }

        .active-green-mode .section-label {
          color: #facc15 !important;
          opacity: 1;
          text-shadow: 0 0 8px rgba(250, 204, 21, 0.35);
        }

        .interests-list-layout {
          display: grid;
          grid-template-columns: repeat(2, 300px);
          gap: 2.2rem 4rem;
          justify-content: center;
        }

        .aoi-system-module {
          display: flex;
          flex-direction: column;
          align-items: flex-start;
          gap: 1rem;
          position: relative;
        }

        .aoi-text-group {
          display: flex;
          flex-direction: row;
          align-items: center;
          gap: 1.8rem;
          width: 100%;
        }

        .aoi-hud-tick {
          width: 22px;
          height: 1px;
          background: var(--yellow);
          opacity: 0.25;
          transition: all 0.4s ease;
        }

        .active-green-mode .aoi-hud-tick {
          background: #facc15;
          opacity: 0.6;
          box-shadow: 0 0 4px rgba(250, 204, 21, 0.4);
        }

        .aoi-id { 
          font-size: 0.75rem;
          opacity: 0.45; 
          letter-spacing: 3px; 
          transition: opacity 0.4s, color 0.4s;
          min-width: 60px;
          text-align: left;
          font-weight: 900;
        }

        .active-green-mode .aoi-id {
          color: #facc15 !important;
          opacity: 1;
        }

        .aoi-label { 
          font-size: 0.95rem;
          letter-spacing: 1px; 
          color: #fff; 
          opacity: 0.75; 
          font-weight: 800;
          transition: all 0.4s;
          position: relative;
          white-space: nowrap;
        }

        .active-green-mode .aoi-label {
          color: #facc15 !important;
          opacity: 1;
          text-shadow: 0 0 6px rgba(250, 204, 21, 0.25);
        }

        .aoi-label::after {
          content: '';
          position: absolute;
          bottom: -5px;
          left: 0;
          width: 0;
          height: 1px;
          background: var(--yellow);
          transition: width 0.4s ease;
        }

        .active-green-mode .aoi-label::after {
          background: #facc15;
        }

        .aoi-system-module:hover .aoi-label::after {
          width: 40px;
        }

        .aoi-system-module:hover .aoi-hud-tick {
          width: 40px;
          background: #facc15;
          opacity: 0.8;
        }

        .aoi-system-module:hover .aoi-label {
          color: #facc15;
          opacity: 1;
          text-shadow: 0 0 8px rgba(250, 204, 21, 0.4);
        }

        @media (max-width: 1024px) {
          .hero-title { font-size: 3rem; }
          .hero-subtitle { font-size: 0.9rem; letter-spacing: 4px; margin-bottom: 5rem; }
          .interests-list-layout { grid-template-columns: 1fr; gap: 2.5rem; }
          .aoi-system-module { align-items: center; }
          .aoi-text-group { justify-content: center; gap: 1.2rem; }
          .hud-floating-text { padding: 1.5rem 1rem; }
          .section-label { letter-spacing: 6px; margin-bottom: 2.5rem; }
        }

        @media (max-width: 768px) {
          .hero-container { align-items: flex-start; padding-top: 2.5rem; }
          .hud-floating-text { padding: 1rem 0.5rem; }
          .hero-top-tag { margin-bottom: 1.2rem; }
          .mission-tag { font-size: 0.55rem; letter-spacing: 0.25rem; }
          .hero-title { font-size: 2rem; letter-spacing: -0.5px; margin-bottom: 0.8rem; }
          .hero-subtitle { font-size: 0.65rem; letter-spacing: 2.5px; margin-bottom: 3rem; }
          .section-label { font-size: 0.7rem; letter-spacing: 5px; margin-bottom: 2rem; }
          .interests-list-layout { 
            grid-template-columns: 1fr 1fr; 
            gap: 1.5rem 2rem;
            padding: 0 0.5rem;
          }
          .aoi-system-module { align-items: flex-start; }
          .aoi-text-group { gap: 0.8rem; }
          .aoi-label { font-size: 0.82rem; white-space: normal; }
          .aoi-id { font-size: 0.65rem; min-width: 45px; }
          /* Hide decorative corner radar markers on mobile */
          .radar-hud-markers { display: none; }
        }

        @media (max-width: 380px) {
          .hero-title { font-size: 1.7rem; }
          .interests-list-layout { grid-template-columns: 1fr; }
        }
      `}</style>
    </div>
  );
};

export default React.memo(Hero);