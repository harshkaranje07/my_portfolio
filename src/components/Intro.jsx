
import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const Intro = ({ onComplete }) => {
  const [phase, setPhase] = useState(0); // 1: Team, 2: Quote, 3: Loading, 4: Ready/Exit
  const [loadProgress, setLoadProgress] = useState(0);
  const [isCursorBlinking, setIsCursorBlinking] = useState(true);

  useEffect(() => {
    // Stage 1: Team Name
    const t1 = setTimeout(() => setPhase(1), 500);
    // Stage 2: Mission Quote
    const t2 = setTimeout(() => setPhase(2), 1200);
    // Stage 3: Loading Protocol
    const t3 = setTimeout(() => setPhase(3), 1900);
    
    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
    };
  }, []);

  useEffect(() => {
    if (phase === 3) {
      // 1s blink limit for cursor
      const cursorTimer = setTimeout(() => setIsCursorBlinking(false), 1000);
      
      const interval = setInterval(() => {
        setLoadProgress(prev => {
          if (prev >= 100) {
            clearInterval(interval);
            setTimeout(() => setPhase(4), 500);
            return 100;
          }
          // Smooth linear fill (approx 1.2s total)
          return prev + 2.5;
        });
      }, 30);

      return () => {
        clearInterval(interval);
        clearTimeout(cursorTimer);
      };
    }
  }, [phase]);

  useEffect(() => {
    if (phase === 4) {
      const timer = setTimeout(() => onComplete(), 800);
      return () => clearTimeout(timer);
    }
  }, [phase, onComplete]);

  return (
    <div className="intro-screen">
      <div className="pure-black-base" />
      
      {/* New Cinematic Aerospace Atmosphere */}
      <div className="intro-atmosphere" />
      <div className="intro-radar-rings" />
      <div className="text-glow-anchor" />
      <div className="intro-vignette" />

      <div className="avionics-scan-overlay" />
      
      <div className="intro-center-anchor">
        <AnimatePresence mode="wait">
          {phase > 0 && phase < 4 && (
            <motion.div
              key="intro-content"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0, y: -6 }} // Step 1 Exit: Tiny upward move (6px max)
              transition={{ duration: 0.6, ease: "easeOut" }}
              className="intro-viewport"
            >
              {/* 1. TEAM MAVERICK INDIA */}
              <motion.div 
                className="intro-line mono highlight"
                initial={{ opacity: 0 }}
                animate={{ opacity: phase >= 1 ? 1 : 0 }}
                transition={{ duration: 0.4 }}
              >
                TEAM MAVERICK INDIA
              </motion.div>

              {/* 2. "WOLVES OF THE SKY" */}
              <motion.div 
                className="intro-line quote-text mono"
                initial={{ opacity: 0 }}
                animate={{ opacity: phase >= 2 ? 1 : 0 }}
                transition={{ duration: 0.5 }}
              >
                "WOLVES OF THE SKY"
              </motion.div>

              {/* 3. AUTONOMOUS SYSTEMS LOADING */}
              <div className="loading-sequence-block">
                <motion.div 
                  className="loading-text mono green-accent"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: phase >= 3 ? 1 : 0 }}
                  transition={{ duration: 0.4 }}
                >
                  AUTONOMOUS SYSTEMS LOADING
                  <span className={`block-cursor ${isCursorBlinking ? 'blinking' : ''}`}>█</span>
                </motion.div>

                <motion.div 
                  className="progress-bar-wrap"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: phase >= 3 ? 1 : 0 }}
                >
                  <div className="bar-track">
                    <div 
                      className="bar-fill green-fill" 
                      style={{ width: `${loadProgress}%` }}
                    />
                  </div>
                </motion.div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <style jsx>{`
        .intro-screen {
          position: fixed;
          inset: 0;
          background: transparent;
          z-index: 100000;
          display: flex;
          align-items: center;
          justify-content: center;
          overflow: hidden;
        }

        .pure-black-base {
          display: none;
        }

        /* ── New Atmosphere Styles ── */
        .intro-atmosphere {
          position: absolute;
          inset: 0;
          z-index: 2;
          background: 
            radial-gradient(ellipse at 50% 50%, rgba(250,204,21,0.03) 0%, transparent 60%),
            linear-gradient(rgba(250,204,21,0.015) 1px, transparent 1px),
            linear-gradient(90deg, rgba(250,204,21,0.015) 1px, transparent 1px);
          background-size: 100% 100%, 60px 60px, 60px 60px;
          animation: atmosphericDrift 30s linear infinite;
        }

        .intro-radar-rings {
          position: absolute;
          top: 50%; left: 50%;
          transform: translate(-50%, -50%);
          width: 800px; height: 800px;
          border-radius: 50%;
          border: 1px solid rgba(250,204,21,0.02);
          box-shadow: inset 0 0 40px rgba(250,204,21,0.01), 0 0 40px rgba(250,204,21,0.01);
          z-index: 2;
          pointer-events: none;
        }
        
        .intro-radar-rings::after {
          content: '';
          position: absolute;
          top: 50%; left: 50%;
          transform: translate(-50%, -50%);
          width: 1200px; height: 1200px;
          border-radius: 50%;
          border: 1px solid rgba(250,204,21,0.015);
        }

        .text-glow-anchor {
          position: absolute;
          top: 50%; left: 50%;
          transform: translate(-50%, -50%);
          width: 600px; height: 300px;
          background: radial-gradient(circle at 50% 50%, rgba(250,204,21,0.08), transparent 70%);
          filter: blur(20px);
          z-index: 3;
          pointer-events: none;
        }
        
        .intro-vignette {
          position: absolute;
          inset: 0;
          background: radial-gradient(circle at 50% 50%, transparent 40%, rgba(0,0,0,0.85) 100%);
          z-index: 4;
          pointer-events: none;
        }

        @keyframes atmosphericDrift {
          0% { background-position: 0 0, 0 0, 0 0; }
          100% { background-position: 0 0, 60px 60px, 60px 60px; }
        }

        /* ── End New Atmosphere Styles ── */

        .avionics-scan-overlay {
          position: absolute;
          inset: 0;
          background: linear-gradient(
            rgba(0, 0, 0, 0) 50%,
            rgba(255, 255, 255, 0.01) 50%
          );
          background-size: 100% 4px;
          z-index: 5;
          pointer-events: none;
          opacity: 0.25;
        }

        .intro-center-anchor {
          position: relative;
          z-index: 10;
          text-align: center;
          width: 100%;
          max-width: 1200px;
        }

        .intro-viewport {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 1.2rem;
        }

        .intro-line {
          font-family: var(--font-tech);
          font-size: 1.1rem;
          letter-spacing: 0.6rem;
          font-weight: 700;
          margin-bottom: 0.2rem;
        }

        .quote-text {
          font-size: 2.8rem;
          letter-spacing: 0.15rem;
          color: #fff;
          margin-bottom: 5.5rem;
        }

        .loading-sequence-block {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 1.2rem;
          width: 100%;
        }

        .loading-text {
          font-family: var(--font-mono);
          font-size: 0.85rem;
          letter-spacing: 0.3rem;
          font-weight: 700;
        }

        .green-accent {
          color: var(--emerald);
        }

        .block-cursor {
          display: inline-block;
          margin-left: 10px;
          vertical-align: middle;
        }

        .blinking {
          animation: blink 0.5s infinite;
        }

        @keyframes blink {
          0%, 100% { opacity: 1; }
          50% { opacity: 0; }
        }

        .progress-bar-wrap {
          width: 350px;
        }

        .bar-track {
          width: 100%;
          height: 3px;
          background: rgba(255, 255, 255, 0.05);
          position: relative;
          overflow: hidden;
        }

        .green-fill {
          height: 100%;
          background: var(--emerald);
          box-shadow: 0 0 10px var(--emerald-glow);
          transition: width 0.05s linear;
        }

        @media (max-width: 768px) {
          .quote-text { font-size: 1.6rem; margin-bottom: 3.5rem; }
          .intro-line { font-size: 0.8rem; letter-spacing: 0.3rem; }
          .progress-bar-wrap { width: 240px; }
        }
      `}</style>
    </div>
  );
};

export default Intro;
