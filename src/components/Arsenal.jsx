import React, { useState, useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  FileText, 
  ChevronDown, 
  Lock,
  Box,
  Cpu,
  Target,
  Zap,
  Activity,
  Layers,
  Radio,
  X,
  Maximize2,
  ExternalLink
} from 'lucide-react';

const TECH_MODULES = [
  {
    id: 'uav-platforms',
    title: 'UAV & DRONE PLATFORMS',
    icon: <Box size={16} />,
    desc: 'Deep dive into aerial airframe architectures, propulsion sizing, and mission-specific lift profiles.',
    pdfName: 'UAV.pdf',
    hasPDF: true,
    bullets: [
      'Multirotor configurations (Quad/Hexa/Octo)',
      'VTOL (Vertical Take-Off and Landing) hybrid systems',
      'Fixed-wing aerodynamic principles for endurance',
      'Thrust-to-weight ratio optimization'
    ]
  },
  {
    id: 'flight-control',
    title: 'FLIGHT CONTROL SYSTEMS',
    icon: <Layers size={16} />,
    desc: 'Analysis of hardware stacks and firmware logic governing stabilized and autonomous flight.',
    pdfName: null,
    hasPDF: false,
    bullets: [
      'Pixhawk and Cube Orange hardware architecture',
      'Firmware stacks: ArduPilot vs PX4 concepts',
      'Internal Measurement Units (IMU) and Dampening',
      'MAVLink communication protocol'
    ]
  },
  {
    id: 'mission-planner',
    title: 'MISSION PLANNER / ARDUPILOT',
    icon: <Target size={16} />,
    desc: 'Technical workflows for mission execution, telemetry monitoring, and safety failsafe parameters.',
    pdfName: null,
    hasPDF: false,
    bullets: [
      'Waypoint-based navigation and mission scripts',
      'Failsafe logic: Low Battery, RC Lost, GCS Heartbeat',
      'Data-flash log analysis and vibration troubleshooting',
      'Geofencing and terrain following'
    ]
  },
  {
    id: 'avionics-power',
    title: 'AVIONICS & POWER SYSTEMS',
    icon: <Zap size={16} />,
    desc: 'Electrical integration of propulsion systems and regulated power distribution networks.',
    pdfName: null,
    hasPDF: false,
    bullets: [
      'BLDC motors and ESC synchronization',
      'LiPo battery chemistry and safety management',
      'BEC / UBEC voltage regulation circuits',
      'Power module calibration and current monitoring'
    ]
  },
  {
    id: 'sensors-nav',
    title: 'SENSORS & NAVIGATION',
    icon: <Activity size={16} />,
    desc: 'Environmental perception modules including redundant positioning and distance estimation.',
    pdfName: null,
    hasPDF: false,
    bullets: [
      'GNSS / RTK (Real-Time Kinematic) precision',
      'LiDAR and Ultrasound for obstacle avoidance',
      'Magnetometer interference mitigation',
      'EKF (Extended Kalman Filter) sensor fusion'
    ]
  },
  {
    id: 'autonomy-compute',
    title: 'AUTONOMY & ONBOARD COMPUTE',
    icon: <Cpu size={16} />,
    desc: 'Integration of companion computers for edge AI, vision-based navigation, and perception.',
    pdfName: null,
    hasPDF: false,
    bullets: [
      'NVIDIA Jetson Nano hardware acceleration',
      'OpenCV for visual odometry and object tracking',
      'MAVProxy for serial data bridging',
      'Perception-based path planning'
    ]
  },
  {
    id: 'comm-systems',
    title: 'COMMUNICATION SYSTEMS',
    icon: <Radio size={16} />,
    desc: 'RF link management for telemetry, command-and-control, and high-bandwidth video streams.',
    pdfName: null,
    hasPDF: false,
    bullets: [
      '915MHz Telemetry link budget and antenna gain',
      'LoRa spread spectrum for extreme range links',
      '5.8GHz VTX visual feedback systems',
      'Encryption and secure handshakes'
    ]
  }
];

const Arsenal = () => {
  const [expandedId, setExpandedId] = useState(null);
  const [selectedPDF, setSelectedPDF] = useState(null);
  const iframeRef = useRef(null);

  useEffect(() => {
    const handleEsc = (e) => {
      if (e.key === 'Escape') setSelectedPDF(null);
    };
    window.addEventListener('keydown', handleEsc);
    return () => window.removeEventListener('keydown', handleEsc);
  }, []);

  useEffect(() => {
    if (selectedPDF) {
      document.body.classList.add('pdf-open');
    } else {
      document.body.classList.remove('pdf-open');
    }
    return () => document.body.classList.remove('pdf-open');
  }, [selectedPDF]);

  const handleOpenPDF = (e, module) => {
    e.stopPropagation();
    if (module.hasPDF) setSelectedPDF(module);
  };

  const toggleFullscreen = () => {
    const el = iframeRef.current;
    if (!el) return;
    if (el.requestFullscreen) el.requestFullscreen();
    else if (el.webkitRequestFullscreen) el.webkitRequestFullscreen();
  };

  return (
    <div className="arsenal-view">
      <div className="arsenal-bg-layer">
        <div className="hud-grid" />
        <div className="unified-scanline" />
      </div>

      <div className="arsenal-content-container">
        <div className="arsenal-header">
          <h3 className="panel-title mono">TECHNICAL_ARSENAL // KNOWLEDGE_VAULT</h3>
          <p className="mono panel-meta">UAV_HANDBOOK_v4.5 // OPERATIVE_REFERENCE_HK07</p>
        </div>

        <div className="handbook-grid">
          {TECH_MODULES.map((module) => (
            <div 
              key={module.id} 
              className={`tech-card arsenal-module ${expandedId === module.id ? 'active' : ''}`}
              onClick={() => setExpandedId(expandedId === module.id ? null : module.id)}
            >
              <div className="bracket-top" />
              <div className="bracket-bottom" />

              <div className="module-header">
                <div className="icon-wrap">{module.icon}</div>
                <div className="header-text">
                  <span className="mono module-tag">DOMAIN_{module.id.toUpperCase()}</span>
                  <h4 className="mono module-title">{module.title}</h4>
                </div>
                <ChevronDown 
                  className={`expand-icon ${expandedId === module.id ? 'rotate' : ''}`} 
                  size={16} 
                />
              </div>

              <AnimatePresence>
                {expandedId === module.id && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.28, ease: "easeInOut" }}
                    className="module-expansion"
                  >
                    <div className="expansion-inner">
                      <p className="mono module-description">{module.desc}</p>
                      
                      <div className="bullet-list">
                        <div className="mono list-label highlight"> KEY_CONCEPTS</div>
                        {module.bullets.map((bullet, idx) => (
                          <div key={idx} className="bullet-item mono">
                            <span className="tick" /> {bullet}
                          </div>
                        ))}
                      </div>

                      <div className="action-row">
                        <button 
                          className={`pdf-launch-btn ${!module.hasPDF ? 'disabled' : ''}`}
                          onClick={(e) => handleOpenPDF(e, module)}
                          disabled={!module.hasPDF}
                        >
                          <div className="btn-icon-wrap">
                            {module.hasPDF ? <ExternalLink size={13} /> : <Lock size={13} />}
                          </div>
                          <span className="mono">
                            {module.hasPDF ? "LAUNCH_TECHNICAL_PDF" : "DATA_ENCRYPTED"}
                          </span>
                        </button>
                        {!module.hasPDF && (
                          <span className="mono status-hint">STATUS: UPLOADING_CONTENT...</span>
                        )}
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ))}
        </div>
      </div>

      {/* PDF Modal — viewport-safe via portal */}
      {createPortal(
        <AnimatePresence>
          {selectedPDF && (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="pdf-modal-overlay"
              onClick={() => setSelectedPDF(null)}
            >
              <motion.div 
                initial={{ scale: 0.97, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.97, opacity: 0 }}
                transition={{ duration: 0.25, ease: [0.19, 1, 0.22, 1] }}
                className="pdf-modal-container tech-card"
                onClick={(e) => e.stopPropagation()}
              >
                <div className="pdf-modal-header mono">
                  <div className="header-info">
                    <FileText size={14} className="highlight" />
                    <span className="highlight">INTEL_STREAM // {selectedPDF.title}</span>
                  </div>
                  <div className="header-actions">
                    <button className="header-action-btn" onClick={toggleFullscreen} title="Toggle Fullscreen">
                      <Maximize2 size={15} />
                    </button>
                    <button className="header-action-btn close-pdf" onClick={() => setSelectedPDF(null)}>
                      <X size={18} />
                    </button>
                  </div>
                </div>
                <div className="pdf-viewer-content">
                  <iframe 
                    ref={iframeRef}
                    src={`/slides/${selectedPDF.pdfName}#toolbar=1&navpanes=0&scrollbar=1`} 
                    className="pdf-iframe"
                    title="Aerospace Document Viewer"
                    allow="fullscreen"
                  />
                </div>
                <div className="pdf-modal-footer mono">
                  ID: HK_7_MAVERICK // MISSION_INTELLIGENCE // SOURCE_LOCAL
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>,
        document.body
      )}

      <style jsx>{`
        .arsenal-view {
          position: relative;
          min-height: 100%;
          padding-bottom: 6rem;
          background: transparent;
          z-index: 1;
        }

        .arsenal-bg-layer {
          position: fixed;
          inset: 0;
          z-index: -1;
          pointer-events: none;
        }

        .arsenal-content-container {
          position: relative;
          z-index: 10;
        }

        .arsenal-header { margin-bottom: 3rem; }

        .panel-meta {
          font-size: 0.65rem;
          opacity: 0.45;
          letter-spacing: 4px;
          margin-top: 0.4rem;
          color: var(--yellow);
        }

        .handbook-grid {
          display: flex;
          flex-direction: column;
          gap: 1.2rem;
          max-width: 860px;
        }

        .arsenal-module {
          padding: 1.3rem 1.8rem;
          cursor: pointer;
          position: relative;
          overflow: hidden;
          background: #0a0a0a;
          border-color: var(--border-dim);
          transition: background 0.3s ease, border-color 0.3s ease;
        }

        .arsenal-module:hover {
          background: rgba(250, 204, 21, 0.04);
          border-color: rgba(250, 204, 21, 0.2);
        }

        .arsenal-module.active {
          border-color: var(--yellow);
          background: #0c0c0c;
        }

        .bracket-top, .bracket-bottom {
          position: absolute;
          left: 0;
          width: 8px;
          height: 8px;
          border-left: 2px solid var(--yellow);
          opacity: 0.25;
        }
        .bracket-top { top: 0; border-top: 2px solid var(--yellow); }
        .bracket-bottom { bottom: 0; border-bottom: 2px solid var(--yellow); }

        .module-header {
          display: flex;
          align-items: center;
          gap: 1.3rem;
        }

        .icon-wrap {
          color: var(--yellow);
          opacity: 0.65;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
        }

        .header-text { flex: 1; }

        .module-tag {
          font-size: 0.58rem;
          letter-spacing: 3px;
          opacity: 0.35;
          display: block;
          margin-bottom: 0.15rem;
        }

        .module-title {
          font-size: 0.92rem;
          font-weight: 700;
          letter-spacing: 2px;
          color: #fff;
        }

        .expand-icon {
          color: var(--text-dim);
          transition: transform 0.28s ease;
          flex-shrink: 0;
        }

        .expand-icon.rotate {
          transform: rotate(180deg);
          color: var(--yellow);
        }

        .module-expansion { overflow: hidden; }

        .expansion-inner {
          padding-top: 1.8rem;
          padding-bottom: 0.8rem;
        }

        .module-description {
          font-size: 0.8rem;
          color: var(--text-dim);
          line-height: 1.6;
          margin-bottom: 1.8rem;
          border-left: 1px solid rgba(255, 255, 255, 0.07);
          padding-left: 1.2rem;
        }

        .bullet-list {
          margin-bottom: 2rem;
          padding-left: 1.2rem;
        }

        .list-label {
          font-size: 0.65rem;
          margin-bottom: 0.9rem;
          letter-spacing: 3px;
        }

        .bullet-item {
          font-size: 0.76rem;
          color: #ccc;
          margin-bottom: 0.65rem;
          display: flex;
          align-items: center;
          gap: 0.9rem;
        }

        .tick {
          width: 4px;
          height: 4px;
          background: var(--yellow);
          box-shadow: 0 0 4px var(--yellow);
          flex-shrink: 0;
        }

        .action-row {
          display: flex;
          align-items: center;
          gap: 1.5rem;
          margin-top: 0.8rem;
          padding-top: 1.2rem;
          border-top: 1px solid rgba(255, 255, 255, 0.04);
        }

        .pdf-launch-btn {
          display: flex;
          align-items: center;
          gap: 0.9rem;
          background: transparent;
          border: 1px solid rgba(250, 204, 21, 0.25);
          color: var(--yellow);
          padding: 0.7rem 1.2rem;
          cursor: pointer;
          transition: all 0.3s cubic-bezier(0.19, 1, 0.22, 1);
          font-size: 0.65rem;
          letter-spacing: 2px;
        }

        .pdf-launch-btn:hover:not(.disabled) {
          background: rgba(250, 204, 21, 0.08);
          border-color: var(--yellow);
          box-shadow: 0 0 12px rgba(250, 204, 21, 0.1);
        }

        .pdf-launch-btn.disabled {
          opacity: 0.35;
          cursor: not-allowed;
          filter: grayscale(1);
          border-color: rgba(255, 255, 255, 0.08);
          color: rgba(255, 255, 255, 0.25);
        }

        .btn-icon-wrap {
          display: flex;
          align-items: center;
          justify-content: center;
          opacity: 0.8;
        }

        .status-hint {
          font-size: 0.58rem;
          letter-spacing: 2px;
          opacity: 0.35;
          color: var(--yellow);
        }

        /* Viewport-safe PDF Modal */
        .pdf-modal-overlay {
          position: fixed;
          inset: 0;
          background: rgba(0, 0, 0, 0.92);
          z-index: 99999;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 2rem;
          box-sizing: border-box;
        }

        .pdf-modal-container {
          width: 100%;
          max-width: min(1200px, calc(100vw - 4rem));
          height: min(90vh, calc(100vh - 4rem));
          background: #080808;
          display: flex;
          flex-direction: column;
          border: 1px solid rgba(250, 204, 21, 0.15);
          box-shadow: 0 0 60px rgba(0,0,0,0.95);
          overflow: hidden;
        }

        .pdf-modal-header {
          padding: 0.9rem 1.8rem;
          background: #111;
          display: flex;
          justify-content: space-between;
          align-items: center;
          font-size: 0.75rem;
          border-bottom: 1px solid var(--border-dim);
          flex-shrink: 0;
        }

        .header-info {
          display: flex;
          align-items: center;
          gap: 1rem;
          overflow: hidden;
        }

        .header-info span {
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
        }

        .header-actions {
          display: flex;
          align-items: center;
          gap: 1.2rem;
          flex-shrink: 0;
        }

        .header-action-btn {
          background: transparent;
          border: none;
          color: var(--text-dim);
          cursor: pointer;
          transition: 0.3s;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 4px;
        }

        .header-action-btn:hover { color: var(--yellow); }
        .header-action-btn.close-pdf:hover { color: var(--red-alert); transform: rotate(90deg); }

        .pdf-viewer-content {
          flex: 1;
          background: #000;
          overflow: hidden;
          min-height: 0;
        }

        .pdf-iframe {
          width: 100%;
          height: 100%;
          border: none;
          background: #000;
          display: block;
        }

        .pdf-modal-footer {
          padding: 0.6rem 1.8rem;
          background: #111;
          font-size: 0.58rem;
          opacity: 0.35;
          border-top: 1px solid var(--border-dim);
          text-align: right;
          letter-spacing: 2px;
          flex-shrink: 0;
        }

        @media (max-width: 768px) {
          .pdf-modal-overlay { padding: 0.8rem; }
          .pdf-modal-container { 
            max-width: calc(100vw - 1.6rem);
            height: calc(100vh - 1.6rem);
          }
          .header-info span { font-size: 0.6rem; }
        }
      `}</style>
    </div>
  );
};

export default Arsenal;