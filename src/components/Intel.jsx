import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Maximize2 } from 'lucide-react';

const FEEDS = [
  { id: 'cam-01', num: 1, type: 'EO_OPTICAL', loc: 'LAT: 18.52 N // LNG: 73.85 E' },
  { id: 'cam-02', num: 2, type: 'THERMAL_SENSE', loc: 'ALT: 120M // SPD: 14M/S' },
  { id: 'cam-03', num: 3, type: 'INFRARED_HD', loc: 'LAT: 18.54 N // LNG: 73.87 E' },
  { id: 'cam-04', num: 4, type: 'SAR_RADAR', loc: 'ALT: 450M // HDG: 180 DEG' },
  { id: 'cam-05', num: 5, type: 'MULTISPECTRAL', loc: 'LAT: 18.50 N // LNG: 73.80 E' },
  { id: 'cam-06', num: 6, type: 'LIDAR_POINT', loc: 'ALT: 80M // SPD: 8M/S' },
  { id: 'cam-07', num: 7, type: 'HYPERSPECTRAL_HD', loc: 'LAT: 18.53 N // LNG: 73.86 E' },
];

const FeedImage = ({ feedNum, alt }) => {
  const formats = ['jpg', 'png', 'webp'];
  const [formatIdx, setFormatIdx] = useState(0);
  const [hasError, setHasError] = useState(false);

  const src = `/intel/intel${feedNum}.${formats[formatIdx]}`;

  const handleError = () => {
    if (formatIdx < formats.length - 1) {
      setFormatIdx(prev => prev + 1);
    } else {
      setHasError(true);
    }
  };

  if (hasError) {
    return (
      <div className="sensor-offline-placeholder mono">
        <span className="blink-fast highlight">⚠ FEED_OFFLINE</span>
        <span className="desc">AWAITING_INTEL_CAPTURE</span>
      </div>
    );
  }

  return (
    <img 
      src={src} 
      alt={alt} 
      onError={handleError}
      loading="lazy"
      decoding="async"
    />
  );
};

const Intel = () => {
  const [selectedFeed, setSelectedFeed] = useState(null);

  useEffect(() => {
    const handleEsc = (e) => {
      if (e.key === 'Escape') setSelectedFeed(null);
    };
    window.addEventListener('keydown', handleEsc);
    return () => window.removeEventListener('keydown', handleEsc);
  }, []);

  useEffect(() => {
    if (selectedFeed) {
      document.body.classList.add('modal-open');
    } else {
      document.body.classList.remove('modal-open');
    }
    return () => document.body.classList.remove('modal-open');
  }, [selectedFeed]);

  return (
    <div className="intel-container">
      <h3 className="panel-title">INTEL_RECORDS // LIVE_FEED_SIM</h3>

      <div className="feed-grid">
        {FEEDS.map((feed, i) => (
          <motion.div 
            key={feed.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.08, duration: 0.4 }}
            className="feed-unit tech-card"
            onClick={() => setSelectedFeed(feed)}
          >
            <div className="feed-visual">
              <FeedImage feedNum={feed.num} alt={feed.type} />
              
              <div className="feed-hud">
                <div className="hud-top mono highlight">
                  <span>LIVE // {feed.type}</span>
                  <span>SYNC_STABLE</span>
                </div>
                <div className="hud-center">
                  <div className="crosshair-target">
                    <div className="corner-bracket top-left-b" />
                    <div className="corner-bracket top-right-b" />
                    <div className="corner-bracket bottom-left-b" />
                    <div className="corner-bracket bottom-right-b" />
                  </div>
                </div>
                <div className="hud-bottom mono">
                  <span>{feed.loc}</span>
                  <span className="led-dot" />
                </div>
              </div>
              <div className="interference-layer" />
            </div>
            <div className="feed-info mono">
              <span>OP_HK_07 // FEED_ID: {feed.id}</span>
              <button 
                className="focus-btn highlight"
                onClick={(e) => {
                  e.stopPropagation();
                  setSelectedFeed(feed);
                }}
              >
                <Maximize2 size={10} style={{ marginRight: 6 }} />
                INITIATE_LOCK
              </button>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Fullscreen HD Lightbox Modal */}
      {createPortal(
        <AnimatePresence>
          {selectedFeed && (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="intel-modal-overlay"
              onClick={() => setSelectedFeed(null)}
            >
              <motion.div 
                initial={{ scale: 0.95, y: 15 }}
                animate={{ scale: 1, y: 0 }}
                exit={{ scale: 0.95, y: 15 }}
                transition={{ duration: 0.3, ease: [0.19, 1, 0.22, 1] }}
                className="intel-modal-container tech-card"
                onClick={(e) => e.stopPropagation()}
              >
                <div className="intel-modal-header mono">
                  <div className="header-info">
                    <span className="dot-led pulse-fast" />
                    <span className="highlight">FEED_LOCK // {selectedFeed.id.toUpperCase()} // STATUS: ACTIVE</span>
                  </div>
                  <button className="close-btn" onClick={() => setSelectedFeed(null)}>
                    <X size={20} />
                  </button>
                </div>
                
                <div className="intel-modal-body">
                  <div className="modal-visual-wrap">
                    <div className="modal-image-container">
                      <FeedImage feedNum={selectedFeed.num} alt={selectedFeed.type} />
                    </div>
                    
                    <div className="modal-crosshair">
                      <div className="cross-hair-center" />
                      <div className="cross-line-h" />
                      <div className="cross-line-v" />
                      <div className="hud-corner tl" />
                      <div className="hud-corner tr" />
                      <div className="hud-corner bl" />
                      <div className="hud-corner br" />
                    </div>

                    <div className="modal-telemetry-overlay mono">
                      <div className="tel-block">
                        <div>TYPE: {selectedFeed.type}</div>
                        <div>LOC: {selectedFeed.loc}</div>
                        <div>FPS: 60.0 // HD_STABLE</div>
                      </div>
                      <div className="tel-block text-right">
                        <div>SAT_LINK: ONLINE</div>
                        <div>LATENCY: 12MS</div>
                        <div>GRID_SEC: HK-07</div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="intel-modal-footer mono">
                  SESSION_ID: HK_TMI_07 // ENCRYPT: AES_256 // PRESS_ESC_TO_CLOSE
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>,
        document.body
      )}

      <style jsx>{`
        .intel-container { padding-bottom: 4rem; }
        
        .feed-grid { 
          display: grid; 
          grid-template-columns: 1fr 1fr; 
          gap: 2rem;
          margin-top: 2.5rem;
        }

        .feed-unit { 
          background: #000; 
          padding: 0; 
          overflow: hidden; 
          cursor: pointer;
        }
        
        .feed-visual { 
          position: relative; 
          width: 100%; 
          aspect-ratio: 16/9; 
          overflow: hidden; 
          border-bottom: 1px solid var(--border-dim); 
          display: flex;
          align-items: center;
          justify-content: center;
          background: #030303;
        }
        
        .feed-visual img { 
          width: 100%; 
          height: 100%; 
          object-fit: cover; 
          opacity: 0.7; 
          filter: grayscale(1) contrast(1.1) brightness(0.95);
          transition: opacity 0.4s ease, transform 0.4s ease, filter 0.4s ease; 
          display: block;
        }
        
        .feed-unit:hover img { 
          opacity: 1; 
          transform: scale(1.02); 
          filter: grayscale(0) brightness(1.05) contrast(1.05);
        }

        .sensor-offline-placeholder {
          width: 100%;
          height: 100%;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          gap: 0.6rem;
          background: radial-gradient(circle, #050505 0%, #000000 100%);
          border: 1px dashed rgba(250, 204, 21, 0.08);
          user-select: none;
        }

        .sensor-offline-placeholder .desc {
          font-size: 0.55rem;
          color: var(--text-dim);
          letter-spacing: 2px;
          opacity: 0.6;
        }

        .blink-fast {
          animation: textBlink 1s steps(2) infinite;
          font-size: 0.72rem;
          font-weight: 700;
          letter-spacing: 1px;
        }

        @keyframes textBlink { 50% { opacity: 0.25; } }

        .feed-hud { 
          position: absolute; 
          inset: 0; 
          padding: 1.2rem; 
          display: flex; 
          flex-direction: column; 
          justify-content: space-between; 
          pointer-events: none; 
          z-index: 5;
        }
        
        .hud-top { 
          display: flex; 
          justify-content: space-between; 
          font-size: 0.65rem; 
          text-shadow: 0 1px 3px rgba(0,0,0,0.8);
        }
        
        .hud-bottom { 
          display: flex; 
          justify-content: space-between; 
          font-size: 0.65rem; 
          align-items: center; 
          text-shadow: 0 1px 3px rgba(0,0,0,0.8);
        }

        .led-dot {
          display: inline-block;
          width: 5px;
          height: 5px;
          border-radius: 50%;
          background: var(--emerald);
          box-shadow: 0 0 4px var(--emerald);
          animation: ledBlink 1.2s infinite;
        }
        
        @keyframes ledBlink { 50% { opacity: 0.3; } }

        .hud-center { flex: 1; display: flex; align-items: center; justify-content: center; }
        
        .crosshair-target {
          width: 36px; 
          height: 36px; 
          border: 1px solid rgba(250, 204, 21, 0.2); 
          position: relative;
        }
        .corner-bracket {
          position: absolute;
          width: 6px;
          height: 6px;
          border-color: var(--yellow);
          border-style: solid;
          opacity: 0.6;
        }
        .top-left-b { top: -1px; left: -1px; border-width: 1px 0 0 1px; }
        .top-right-b { top: -1px; right: -1px; border-width: 1px 1px 0 0; }
        .bottom-left-b { bottom: -1px; left: -1px; border-width: 0 0 1px 1px; }
        .bottom-right-b { bottom: -1px; right: -1px; border-width: 0 1px 1px 0; }

        .feed-info { 
          padding: 1rem 1.2rem; 
          display: flex; 
          justify-content: space-between; 
          align-items: center; 
          font-size: 0.65rem; 
        }
        
        .focus-btn { 
          background: transparent; 
          border: 1px solid var(--border-dim); 
          padding: 0.35rem 0.9rem; 
          cursor: pointer; 
          transition: all 0.3s ease; 
          font-family: var(--font-mono); 
          font-size: 0.6rem; 
          display: flex;
          align-items: center;
        }
        .focus-btn:hover { 
          border-color: var(--yellow); 
          background: rgba(250, 204, 21, 0.08); 
          transform: translateY(-1px);
        }

        .interference-layer {
          position: absolute; 
          inset: 0; 
          opacity: 0.02; 
          pointer-events: none;
          background-image: repeating-linear-gradient(transparent, transparent 2px, rgba(255,255,255,0.1) 3px);
          animation: staticNoise 0.5s steps(2) infinite;
          z-index: 2;
        }
        
        @keyframes staticNoise { 
          0% { background-position: 0 0; }
          50% { background-position: 0 3px; }
          100% { background-position: 0 0; }
        }

        /* Lightbox Modal CSS */
        .intel-modal-overlay {
          position: fixed;
          inset: 0;
          background: rgba(0, 0, 0, 0.95);
          z-index: 99999;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 2rem;
          box-sizing: border-box;
        }

        .intel-modal-container {
          width: 100%;
          max-width: min(1000px, calc(100vw - 4rem));
          height: auto;
          max-height: min(90vh, calc(100vh - 4rem));
          background: #080808;
          display: flex;
          flex-direction: column;
          border: 1px solid rgba(250, 204, 21, 0.15);
          box-shadow: 0 0 60px rgba(0,0,0,0.95);
          overflow: hidden;
        }

        .intel-modal-header {
          padding: 1rem 1.8rem;
          background: #0c0c0c;
          display: flex;
          justify-content: space-between;
          align-items: center;
          font-size: 0.75rem;
          border-bottom: 1px solid var(--border-dim);
          flex-shrink: 0;
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

        .pulse-fast { animation: ledPulse 0.8s infinite; }
        @keyframes ledPulse { 50% { opacity: 0.3; } }

        .close-btn {
          background: transparent;
          border: none;
          color: var(--text-dim);
          cursor: pointer;
          transition: 0.3s;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 4px;
          position: relative;
          z-index: 100002;
        }
        .close-btn:hover { color: var(--red-alert); transform: rotate(90deg); }

        .intel-modal-body {
          flex: 1;
          background: #000;
          overflow: hidden;
          min-height: 0;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .modal-visual-wrap {
          position: relative;
          width: 100%;
          max-height: 100%;
          aspect-ratio: 16/9;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .modal-image-container {
          width: 100%;
          height: 100%;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .modal-image-container img {
          max-width: 100%;
          max-height: 100%;
          width: 100%;
          height: 100%;
          object-fit: contain;
          display: block;
          opacity: 1 !important;
          filter: grayscale(0) !important;
        }

        /* Tactical Crosshair Overlay in Lightbox */
        .modal-crosshair {
          position: absolute;
          inset: 0;
          pointer-events: none;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .cross-hair-center {
          width: 60px;
          height: 60px;
          border: 1px solid rgba(250, 204, 21, 0.35);
          border-radius: 50%;
        }

        .cross-line-h {
          position: absolute;
          left: 10%;
          right: 10%;
          height: 1px;
          background: linear-gradient(90deg, transparent, rgba(250, 204, 21, 0.25) 30%, rgba(250, 204, 21, 0.25) 70%, transparent);
        }

        .cross-line-v {
          position: absolute;
          top: 10%;
          bottom: 10%;
          width: 1px;
          background: linear-gradient(180deg, transparent, rgba(250, 204, 21, 0.25) 30%, rgba(250, 204, 21, 0.25) 70%, transparent);
        }

        .hud-corner {
          position: absolute;
          width: 16px;
          height: 16px;
          border-color: rgba(250, 204, 21, 0.4);
          border-style: solid;
        }
        .tl { top: 20px; left: 20px; border-width: 2px 0 0 2px; }
        .tr { top: 20px; right: 20px; border-width: 2px 2px 0 0; }
        .bl { bottom: 20px; left: 20px; border-width: 0 0 2px 2px; }
        .br { bottom: 20px; right: 20px; border-width: 0 2px 2px 0; }

        .modal-telemetry-overlay {
          position: absolute;
          inset: 30px;
          display: flex;
          justify-content: space-between;
          align-items: flex-end;
          pointer-events: none;
          font-size: 0.7rem;
          color: var(--yellow);
          text-shadow: 0 1px 4px rgba(0,0,0,0.9);
          opacity: 0.8;
        }

        .text-right { text-align: right; }

        .intel-modal-footer {
          padding: 0.8rem 1.8rem;
          background: #0c0c0c;
          font-size: 0.6rem;
          opacity: 0.4;
          border-top: 1px solid var(--border-dim);
          text-align: right;
          letter-spacing: 2px;
          flex-shrink: 0;
        }

        @media (max-width: 900px) { 
          .feed-grid { grid-template-columns: 1fr; gap: 1.5rem; } 
          .intel-modal-overlay { padding: 0; }
          .intel-modal-container { 
            max-width: 100vw;
            height: 100vh;
            max-height: 100vh;
            border-radius: 0;
            border-left: none;
            border-right: none;
          }
          .modal-telemetry-overlay { display: none; }
        }

        @media (max-width: 768px) {
          .feed-info { padding: 0.8rem 1rem; font-size: 0.6rem; }
          .focus-btn { padding: 0.5rem 1rem; font-size: 0.58rem; }
          .hud-top, .hud-bottom { font-size: 0.58rem; }
          .intel-modal-header { padding: 0.8rem 1.2rem; font-size: 0.68rem; }
          .intel-modal-footer { font-size: 0.52rem; padding: 0.6rem 1rem; }
          .close-btn { padding: 8px; }
        }
      `}</style>
    </div>
  );
};

export default Intel;