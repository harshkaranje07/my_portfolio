import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  FileText, 
  ChevronDown, 
  Terminal,
  Target,
  Box,
  Github,
  Crosshair,
  Zap,
  Settings,
  X,
  Maximize2
} from 'lucide-react';

const UAV_DOSSIERS = [
  {
    id: 'hexa',
    title: 'HEXACOPTER UAV',
    type: 'Multi-Rotor Heavy Lift',
    icon: <Target size={18} />,
    missionSummary: 'Designed for stability and redundancy in high-payload surveillance operations.',
    flightController: 'Cube Orange (ArduPilot)',
    sensors: 'Here3 GNSS, TFmini LiDAR',
    telemetry: 'Sik Radio 915MHz',
    features: ['Waypoint Navigation', 'RTL on Signal Loss', 'Vibration Dampening', 'Terrain Following'],
    contributions: 'Led the integration of the flight controller, performed PID tuning for stability, and calibrated the compass and accelerometer for accurate navigation.',
    imagePlaceholder: 'HEXA_UAV_SYS_01.jpg'
  },
  {
    id: 'vtol',
    title: 'VTOL UAV PLATFORM',
    type: 'Hybrid Fixed-Wing',
    icon: <Box size={18} />,
    missionSummary: 'Long-endurance aerial mapping combining multirotor agility with fixed-wing efficiency.',
    flightController: 'Pixhawk 4 (ArduPlane)',
    sensors: 'RTK GPS, Airspeed Sensor',
    telemetry: 'RFD900 Long Range',
    features: ['VTOL Transition', 'Forward Flight PID', 'Loiter & Orbit', 'Geofencing'],
    contributions: 'Configured transition parameters between hover and forward flight, optimized airspeed limits, and established failsafe behaviors.',
    imagePlaceholder: 'VTOL_AERO_02.jpg'
  }
];

const GITHUB_PROJECTS = [
  {
    id: 'aeropulse',
    title: 'aeropulse',
    desc: 'Repository for aeropulse projects and implementations.',
    tags: ['Python'],
    link: 'https://github.com/harshkaranje07/aeropulse'
  },
  {
    id: 'DSAprograms',
    title: 'DSAprograms',
    desc: 'codes for DSA',
    tags: ['C++'],
    link: 'https://github.com/harshkaranje07/DSAprograms'
  },
  {
    id: 'ien-club',
    title: 'ien-club',
    desc: 'Innovation and Entrepreneurship Network club website and resources.',
    tags: ['TypeScript'],
    link: 'https://github.com/harshkaranje07/ien-club'
  },
  {
    id: 'my_portfolio',
    title: 'my_portfolio',
    desc: 'React-based interactive terminal portfolio with custom UI components and animations.',
    tags: ['JavaScript'],
    link: 'https://github.com/harshkaranje07/my_portfolio'
  },
  {
    id: 'research-project-system',
    title: 'research-project-system',
    desc: 'System for managing and documenting research projects.',
    tags: ['JavaScript'],
    link: 'https://github.com/harshkaranje07/research-project-system'
  }
];

const Arsenal = () => {
  const [expandedUAV, setExpandedUAV] = useState(null);
  const [isDocViewerOpen, setIsDocViewerOpen] = useState(false);

  const toggleUAV = (id) => setExpandedUAV(expandedUAV === id ? null : id);

  // Close modal on Escape key
  useEffect(() => {
    const handleEsc = (e) => {
      if (e.key === 'Escape') setIsDocViewerOpen(false);
    };
    window.addEventListener('keydown', handleEsc);
    return () => window.removeEventListener('keydown', handleEsc);
  }, []);

  return (
    <div className="arsenal-view">
      <div className="arsenal-bg-layer">
        <div className="hud-grid" />
        <div className="unified-scanline" />
      </div>

      <div className="arsenal-content-container">
        <div className="arsenal-header">
          <h3 className="panel-title mono">ENGINEERING_PROJECTS // UAV_DEVELOPMENT</h3>
          <p className="mono panel-meta">AEROSPACE_SYSTEMS_OVERVIEW // OP_HK07</p>
        </div>

        {/* ========================================== */}
        {/* SECTION 1: FEATURED UAV PROJECTS           */}
        {/* ========================================== */}
        <div className="section-block">
          <div className="section-title mono">
            <span className="tick" /> FEATURED UAV PROJECTS
          </div>

          <div className="uav-grid">
            {UAV_DOSSIERS.map((uav) => (
              <div 
                key={uav.id} 
                className={`arsenal-card tech-glass-panel ${expandedUAV === uav.id ? 'active' : ''}`}
                onClick={() => toggleUAV(uav.id)}
              >
                <div className="card-header">
                  <div className="header-left">
                    <div className="icon-wrap">{uav.icon}</div>
                    <div className="header-text">
                      <span className="mono module-tag">TYPE: {uav.type.toUpperCase()}</span>
                      <h4 className="mono module-title">{uav.title}</h4>
                    </div>
                  </div>
                  <ChevronDown className={`expand-icon ${expandedUAV === uav.id ? 'rotate' : ''}`} size={16} />
                </div>

                <AnimatePresence>
                  {expandedUAV === uav.id && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3 }}
                      className="dossier-expanded-content"
                    >
                      <div className="dossier-grid">
                        <div className="dossier-col">
                          <h5 className="mono info-label"><Settings size={12} /> FLIGHT CONTROLLER</h5>
                          <p className="mono info-val">{uav.flightController}</p>
                          
                          <h5 className="mono info-label"><Zap size={12} /> SENSORS</h5>
                          <p className="mono info-val">{uav.sensors}</p>
                          
                          <h5 className="mono info-label"><Crosshair size={12} /> TELEMETRY</h5>
                          <p className="mono info-val">{uav.telemetry}</p>
                        </div>

                        <div className="dossier-col">
                          <h5 className="mono info-label">AUTONOMOUS FEATURES</h5>
                          <ul className="feature-list">
                            {uav.features.map(f => (
                              <li key={f} className="mono"><span className="tick-sm" /> {f}</li>
                            ))}
                          </ul>

                          <h5 className="mono info-label" style={{ marginTop: '1.5rem' }}>KEY CONTRIBUTIONS</h5>
                          <p className="contribution-text">{uav.contributions}</p>
                        </div>
                      </div>

                      <div className="image-placeholder mono">
                        [ NO VISUAL DATA AVAILABLE ] // {uav.imagePlaceholder}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ))}
          </div>
        </div>

        {/* ========================================== */}
        {/* SECTION 2: GITHUB PROJECTS                 */}
        {/* ========================================== */}
        <div className="section-block">
          <div className="section-title mono">
            <span className="tick" /> GITHUB PROJECTS
          </div>
          
          <div className="repo-grid">
            {GITHUB_PROJECTS.map((repo) => (
              <div key={repo.id} className="repo-card tech-glass-panel">
                <div className="repo-header">
                  <Terminal size={16} className="repo-icon" />
                  <h4 className="mono repo-title">{repo.title}</h4>
                </div>
                
                <p className="repo-desc">{repo.desc || 'No description available.'}</p>
                
                <div className="repo-meta">
                  <div className="repo-tech">
                    {repo.tags.map(tag => (
                      <span key={tag} className="mono repo-tag">[{tag}]</span>
                    ))}
                  </div>
                </div>

                <a href={repo.link} target="_blank" rel="noreferrer" className="github-btn mono">
                  <Github size={14} /> VIEW ON GITHUB
                </a>
              </div>
            ))}
          </div>
        </div>

        {/* ========================================== */}
        {/* SECTION 3: LEARNING & KNOWLEDGE BASE       */}
        {/* ========================================== */}
        <div className="section-block">
          <div className="section-title mono">
            <span className="tick" /> LEARNING & KNOWLEDGE BASE
          </div>
          
          <div className="uav-grid">
            <div className="arsenal-card tech-glass-panel">
              <div className="card-header" style={{ alignItems: 'flex-start' }}>
                <div className="header-left">
                  <div className="icon-wrap"><FileText size={18} /></div>
                  <div className="header-text" style={{ flex: 1 }}>
                    <span className="mono module-tag">DOCUMENTATION_INDEX</span>
                    <h4 className="mono module-title">UAV DESIGN FUNDAMENTALS (UAV DF)</h4>
                    <p className="repo-desc" style={{ marginTop: '0.8rem', marginBottom: '1.5rem', maxWidth: '800px' }}>
                      Complete UAV engineering reference manual including drone architecture, avionics, power systems, flight control, ArduPilot, Mission Planner, telemetry, sensors, testing, and troubleshooting.
                    </p>
                    <div className="doc-action-row" style={{ display: 'flex', gap: '1rem' }}>
                      <button 
                        className="github-btn mono" 
                        onClick={() => setIsDocViewerOpen(true)}
                        style={{ width: 'auto', padding: '0.6rem 1.2rem', gap: '8px' }}
                      >
                        OPEN PDF
                      </button>
                      <a 
                        href="/docs/uav.pdf" 
                        download
                        className="github-btn mono"
                        style={{ width: 'auto', padding: '0.6rem 1.2rem', gap: '8px', color: 'var(--yellow)', borderColor: 'rgba(250, 204, 21, 0.3)' }}
                      >
                        DOWNLOAD PDF
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

      </div>

      {/* ========================================== */}
      {/* DOCUMENT VIEWER MODAL                      */}
      {/* ========================================== */}
      <AnimatePresence>
        {isDocViewerOpen && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="doc-viewer-overlay"
            onClick={() => setIsDocViewerOpen(false)}
          >
            <motion.div 
              initial={{ scale: 0.95, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.95, y: 20 }}
              className="doc-viewer-container tech-glass-panel"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="doc-viewer-header mono">
                <div className="doc-title-bar">
                  <FileText size={14} />
                  <span>UAV_DESIGN_FUNDAMENTALS.PDF</span>
                </div>
                <div className="doc-viewer-controls">
                  <button className="control-btn" title="Maximize"><Maximize2 size={14} /></button>
                  <button className="control-btn close" onClick={() => setIsDocViewerOpen(false)} title="Close"><X size={16} /></button>
                </div>
              </div>
              <div className="doc-viewer-body">
                <iframe 
                  src="/docs/uav.pdf" 
                  title="UAV Design Fundamentals"
                  className="doc-iframe"
                />
                
                <div className="doc-fallback mono">
                  <FileText size={48} style={{ opacity: 0.2, marginBottom: '1rem' }} />
                  <p>LOADING DOCUMENT</p>
                  <span style={{ opacity: 0.5, fontSize: '0.65rem', marginTop: '0.5rem' }}>
                    Source: /docs/uav.pdf
                  </span>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ========================================== */}
      {/* STYLES                                     */}
      {/* ========================================== */}
      <style jsx>{`
        .arsenal-view {
          position: relative;
          min-height: 100%;
          padding-bottom: 4rem;
        }

        .arsenal-bg-layer {
          position: fixed;
          inset: 0;
          z-index: -1;
          pointer-events: none;
        }

        .arsenal-content-container {
          position: relative;
          z-index: 1;
        }

        .arsenal-header {
          margin-bottom: 3.5rem;
        }

        .panel-meta {
          font-size: 0.65rem;
          opacity: 0.4;
          letter-spacing: 3px;
          margin-top: 0.5rem;
        }

        .section-block {
          margin-bottom: 4.5rem;
        }

        .section-title {
          font-size: 0.9rem;
          letter-spacing: 2px;
          color: #fff;
          margin-bottom: 1.5rem;
          display: flex;
          align-items: center;
          gap: 0.8rem;
          opacity: 0.9;
        }

        .tick {
          display: inline-block;
          width: 4px;
          height: 14px;
          background: var(--yellow);
          box-shadow: 0 0 8px var(--yellow-glow);
        }

        .tick-sm {
          display: inline-block;
          width: 3px;
          height: 8px;
          background: var(--yellow);
          margin-right: 8px;
        }

        .uav-grid {
          display: flex;
          flex-direction: column;
          gap: 1.5rem;
          max-width: 900px;
        }

        .repo-grid {
          display: grid;
          grid-template-columns: 1fr;
          gap: 1.5rem;
          max-width: 900px;
        }

        @media (min-width: 768px) {
          .repo-grid { grid-template-columns: 1fr 1fr; }
        }

        /* ------------------------------------- */
        /* ARSENAL CARDS                         */
        /* ------------------------------------- */
        .arsenal-card {
          cursor: pointer;
          overflow: hidden;
        }

        .arsenal-card.active {
          border-color: var(--yellow) !important;
        }

        .card-header {
          padding: 1.5rem 1.8rem;
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        .header-left {
          display: flex;
          align-items: center;
          gap: 1.2rem;
        }

        .icon-wrap {
          color: var(--yellow);
          display: flex;
          align-items: center;
          justify-content: center;
          opacity: 0.9;
        }

        .module-tag {
          display: block;
          font-size: 0.6rem;
          color: var(--yellow);
          margin-bottom: 0.3rem;
          opacity: 0.8;
          letter-spacing: 1px;
        }

        .module-title {
          font-size: 1.1rem;
          color: #fff;
          margin: 0;
          font-weight: 600;
          letter-spacing: 1px;
        }

        .expand-icon {
          color: var(--text-dim);
          transition: transform 0.3s ease;
        }

        .expand-icon.rotate {
          transform: rotate(180deg);
          color: var(--yellow);
        }

        .dossier-expanded-content {
          border-top: 1px solid rgba(255, 255, 255, 0.05);
          overflow: hidden;
        }

        .doc-action-text {
          opacity: 0.6;
          transition: opacity 0.3s ease;
        }

        .arsenal-card:hover .doc-action-text {
          opacity: 1;
        }

        /* UAV DOSSIER CONTENT */
        .dossier-grid {
          padding: 1.8rem;
          display: grid;
          grid-template-columns: 1fr 1.5fr;
          gap: 2.5rem;
          background: rgba(0, 0, 0, 0.2);
        }

        @media (max-width: 768px) {
          .dossier-grid { grid-template-columns: 1fr; gap: 1.5rem; }
        }

        .info-label {
          font-size: 0.65rem;
          color: var(--yellow);
          margin-bottom: 0.4rem;
          letter-spacing: 1px;
          display: flex;
          align-items: center;
          gap: 6px;
          opacity: 0.8;
        }

        .info-val {
          font-size: 0.85rem;
          color: #fff;
          margin-bottom: 1.2rem;
          opacity: 0.9;
        }

        .feature-list {
          list-style: none;
          padding: 0;
          margin: 0;
        }

        .feature-list li {
          font-size: 0.8rem;
          color: #ccc;
          margin-bottom: 0.6rem;
          display: flex;
          align-items: center;
        }

        .contribution-text {
          font-size: 0.88rem;
          line-height: 1.6;
          color: #ccc;
          opacity: 0.9;
        }

        .image-placeholder {
          height: 120px;
          display: flex;
          align-items: center;
          justify-content: center;
          background: repeating-linear-gradient(45deg, rgba(255,255,255,0.02), rgba(255,255,255,0.02) 10px, transparent 10px, transparent 20px);
          border-top: 1px solid rgba(255,255,255,0.05);
          color: var(--text-dim);
          font-size: 0.75rem;
          letter-spacing: 2px;
          border-bottom-left-radius: 4px;
          border-bottom-right-radius: 4px;
        }

        /* ------------------------------------- */
        /* REPO CARDS                            */
        /* ------------------------------------- */
        .repo-card {
          padding: 1.8rem;
          display: flex;
          flex-direction: column;
        }

        .repo-header {
          display: flex;
          align-items: center;
          gap: 0.8rem;
          margin-bottom: 1rem;
        }

        .repo-icon {
          color: var(--yellow);
        }

        .repo-title {
          font-size: 1rem;
          color: #fff;
          font-weight: 600;
          letter-spacing: 1px;
        }

        .repo-desc {
          font-size: 0.85rem;
          line-height: 1.5;
          color: #ccc;
          flex: 1;
          margin-bottom: 1.5rem;
        }

        .repo-tech {
          display: flex;
          flex-wrap: wrap;
          gap: 0.5rem;
          margin-bottom: 1.5rem;
        }

        .repo-tag {
          font-size: 0.65rem;
          color: var(--yellow);
          background: rgba(250, 204, 21, 0.05);
          padding: 0.2rem 0.5rem;
          border: 1px solid rgba(250, 204, 21, 0.1);
        }

        .github-btn {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 0.5rem;
          width: 100%;
          padding: 0.8rem;
          background: transparent;
          border: 1px solid rgba(255, 255, 255, 0.15);
          color: #fff;
          font-size: 0.75rem;
          letter-spacing: 1px;
          text-decoration: none;
          transition: all 0.3s ease;
        }

        .github-btn:hover {
          background: rgba(250, 204, 21, 0.08);
          border-color: rgba(250, 204, 21, 0.25);
          box-shadow: 0 0 10px rgba(250, 204, 21, 0.1);
        }

        /* ------------------------------------- */
        /* DOCUMENT VIEWER MODAL                 */
        /* ------------------------------------- */
        .doc-viewer-overlay {
          position: fixed;
          inset: 0;
          background: rgba(0, 0, 0, 0.75);
          backdrop-filter: blur(8px);
          -webkit-backdrop-filter: blur(8px);
          z-index: 9999;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 2rem;
        }

        .doc-viewer-container {
          width: 100%;
          max-width: 1200px;
          height: 90vh;
          display: flex;
          flex-direction: column;
          overflow: hidden;
        }

        .doc-viewer-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 1rem 1.5rem;
          background: rgba(0, 0, 0, 0.6);
          border-bottom: 1px solid rgba(250, 204, 21, 0.2);
        }

        .doc-title-bar {
          display: flex;
          align-items: center;
          gap: 0.8rem;
          color: var(--yellow);
          font-size: 0.75rem;
          letter-spacing: 2px;
        }

        .doc-viewer-controls {
          display: flex;
          gap: 1rem;
        }

        .control-btn {
          background: none;
          border: none;
          color: var(--text-dim);
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: color 0.2s ease;
          padding: 0;
        }

        .control-btn:hover {
          color: #fff;
        }

        .control-btn.close:hover {
          color: #ef4444;
        }

        .doc-viewer-body {
          flex: 1;
          position: relative;
          background: #000;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .doc-iframe {
          position: absolute;
          inset: 0;
          width: 100%;
          height: 100%;
          border: none;
          z-index: 2; /* Sits above fallback if loaded */
        }

        .doc-fallback {
          display: flex;
          flex-direction: column;
          align-items: center;
          color: var(--text-dim);
          letter-spacing: 2px;
          text-align: center;
        }
      `}</style>
    </div>
  );
};

export default Arsenal;