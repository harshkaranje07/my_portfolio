import React, { useEffect, useRef, useState, useCallback } from 'react';
import { motion, AnimatePresence, useDragControls } from 'framer-motion';
import { X, Zap, Target, Cpu, Activity, Share2 } from 'lucide-react';

const CORE_CAPABILITIES = [
  { 
    id: 'aero',
    name: 'DRONE & AERODYNAMICS', 
    level: 90, 
    isTech: true,
    icon: <Zap size={15} />,
    details: [
      'Multirotor UAVs (Hexacopters)',
      'VTOL UAV platforms',
      'Frame & propulsion understanding',
      'ESC & motor selection',
      'Stability & flight behavior awareness'
    ],
    techSpecs: [
      'Propeller Pitch/Diameter Optimization',
      'Wing Loading & Reynolds Number Analysis',
      'Drag Coefficient Reduction',
      'Lift-to-Drag Ratio Calibration',
      'Thrust-to-Weight Ratio Mapping'
    ]
  },
  { 
    id: 'mission',
    name: 'MISSION PLANNING (ARDUPILOT)', 
    level: 90, 
    isTech: true,
    icon: <Target size={15} />,
    details: [
      'Mission Planner',
      'Waypoint-based autonomous missions',
      'Failsafe & safety configuration',
      'Telemetry monitoring',
      'Log analysis'
    ],
    techSpecs: [
      'Waypoint Radius & Acceptance Logic',
      'Loiter Pattern Synthesis',
      'RTL Altitude & Terrain Following',
      'Geofence Breach Automated Recovery',
      'MAVLink Protocol Packet Analysis'
    ]
  },
  { 
    id: 'avionics',
    name: 'AVIONICS & FLIGHT CONTROL', 
    level: 88, 
    isTech: true,
    icon: <Cpu size={15} />,
    details: [
      'Pixhawk / Cube flight controllers',
      'ArduPilot firmware',
      'Sensor integration',
      'PID tuning (multirotor)',
      'Preliminary VTOL tuning'
    ],
    techSpecs: [
      'EKF3 Tuning & Filter Calibration',
      'PID Overshoot Mitigation',
      'I-Term Windup Prevention',
      'IMU Vibration Dampening',
      'PWM Scaling & Servo Output Mapping'
    ]
  },
  { 
    id: 'ai',
    name: 'EMBEDDED AI & COMPUTE', 
    level: 78, 
    isTech: false,
    icon: <Activity size={15} />,
    details: [
      'Jetson Nano',
      'Camera integration',
      'Basic machine learning pipelines',
      'Data handling for onboard systems'
    ],
    techSpecs: [
      'TensorRT Model Optimization',
      'CUDA Core Utilization Tracking',
      'OpenCV Visual Odometry Pipelines',
      'Inference Latency Minimization',
      'GStreamer Hardware Acceleration'
    ]
  },
  { 
    id: 'marketing',
    name: 'MARKETING & SOCIAL MEDIA', 
    level: 72, 
    isTech: false,
    icon: <Share2 size={15} />,
    details: [
      'Team branding',
      'Competition documentation',
      'Event photography',
      'Technical storytelling'
    ],
    techSpecs: [
      'Technical Copywriting & Press Kits',
      'Visual Identity Consistency',
      'Aerial Cinematography Planning',
      'Brand Outreach Metrics',
      'Public Technical Presentations'
    ]
  },
];

const DOSSIER = [
  { label: "FULL_NAME", val: "HARSHWARDHAN KARANJE" },
  { label: "OP_ID", val: "HK_TMI_07" },
  { label: "DESIGNATION", val: "JR_AUTONOMOUS_ENGINEER" },
  { label: "CLEARANCE", val: "LEVEL_04_TMI" },
];

const Operative = () => {
  const containerRef = useRef(null);
  const elementsRef = useRef([]);
  const [expandedSkill, setExpandedSkill] = useState(null);
  const dragControls = useDragControls();
  const rafRef = useRef(null);

  const registerElement = useCallback((el) => {
    if (el && !elementsRef.current.includes(el)) {
      elementsRef.current.push(el);
    }
  }, []);

  // rAF-throttled glow, direct DOM writes (zero re-renders)
  useEffect(() => {
    let lastMousePos = null;
    let frameCount = 0;

    const processGlow = () => {
      if (!lastMousePos) return;
      frameCount++;
      if (frameCount % 3 !== 0) {
        rafRef.current = requestAnimationFrame(processGlow);
        return;
      }

      const { x: clientX, y: clientY } = lastMousePos;
      const threshold = 160;

      // Batch read — avoid layout thrash
      const rects = elementsRef.current.map(el => {
        if (!el || !document.contains(el)) return null;
        return { el, rect: el.getBoundingClientRect() };
      });

      // Batch write
      rects.forEach(item => {
        if (!item) return;
        const { el, rect } = item;
        const cx = rect.left + rect.width / 2;
        const cy = rect.top + rect.height / 2;
        const dx = clientX - cx;
        const dy = clientY - cy;
        const distance = Math.sqrt(dx * dx + dy * dy);

        if (distance < threshold) {
          const intensity = 1 - (distance / threshold);
          el.style.textShadow = `0 0 ${8 * intensity}px var(--yellow-glow)`;
          el.style.opacity = String(0.85 + (0.15 * intensity));
        } else {
          el.style.textShadow = 'none';
          el.style.opacity = '0.85';
        }
      });

      rafRef.current = null;
    };

    const handleMouseMove = (e) => {
      lastMousePos = { x: e.clientX, y: e.clientY };
      if (!rafRef.current) {
        rafRef.current = requestAnimationFrame(processGlow);
      }
    };

    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, []);

  return (
    <div className="operative-container" ref={containerRef}>
      <div className="operative-bg-layer">
        <div className="hud-grid" />
        <div className="unified-scanline" />
      </div>

      <div className="operative-header-block">
        <h3 className="panel-title" ref={registerElement}>OPERATIVE_DOSSIER // DATA_HK_07</h3>
        <p className="mono dossier-sub" ref={registerElement}>SYSTEMS_INIT: 100% // LINK_STABLE</p>
      </div>

      <div className="dossier-grid">
        <div className="dossier-left">
          <div className="profile-section-wrap">
            <div className="profile-container tech-card">
              <div className="corner ct-l" /><div className="corner ct-r" />
              <div className="corner cb-l" /><div className="corner cb-r" />
              <div className="profile-image-wrap">
                <img 
                  src="/images/harshwardhan.jpg" 
                  alt="Harshwardhan Karanje" 
                  className="profile-img"
                  loading="eager"
                />
                <div className="scan-line-overlay" />
              </div>
            </div>
            
            <div className="id-tags mono">
              {DOSSIER.map(d => (
                <div key={d.label} className="tag-item" ref={registerElement}>
                  <span className="label" style={{ opacity: 0.45 }}>{d.label}:</span>
                  <span className="value highlight">{d.val}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="mission-objective-block">
            <h4 className="mono highlight section-header" ref={registerElement}> MISSION_OBJECTIVE</h4>
            <div className="technical-paragraph">
              <p ref={registerElement}>
                Developing reliable <span className="highlight">Autonomous UAV platforms</span> for surveillance and high-precision mission execution. 
                Bridging the gap between aerodynamics and real-world implementation.
              </p>
            </div>
          </div>
        </div>

        <div className="dossier-right">
          <div className="capabilities-section">
            <h4 className="mono highlight section-header main-cap-header" ref={registerElement}> CORE_CAPABILITIES</h4>
            
            <div className="skills-stack">
              {CORE_CAPABILITIES.map((cap, i) => (
                <div 
                  key={cap.id} 
                  className={`capability-card tech-card ${expandedSkill?.id === cap.id ? 'active' : ''}`}
                  onClick={() => setExpandedSkill(expandedSkill?.id === cap.id ? null : cap)}
                >
                  <div className="skill-header mono">
                    <div className="cap-label-group">
                      <span className="skill-icon">{cap.icon}</span>
                      <span className="cap-name" ref={registerElement}>{cap.name}</span>
                    </div>
                    <span className="highlight capability-level" ref={registerElement}>{cap.level}%</span>
                  </div>
                  
                  <div className="skill-bar-track">
                    <motion.div 
                      initial={{ width: 0 }}
                      whileInView={{ width: `${cap.level}%` }}
                      viewport={{ once: true }}
                      transition={{ duration: 1.6, delay: i * 0.12, ease: [0.19, 1, 0.22, 1] }}
                      className={`skill-bar-fill ${cap.isTech ? 'tech-priority' : 'standard-skill'}`}
                    >
                      <div className="bar-pulse" />
                    </motion.div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Viewport-safe draggable popup */}
          <AnimatePresence>
            {expandedSkill && (
              <motion.div 
                initial={{ opacity: 0, scale: 0.96 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.96 }}
                transition={{ duration: 0.25, ease: [0.19, 1, 0.22, 1] }}
                drag
                dragControls={dragControls}
                dragListener={false}
                dragConstraints={{ left: -400, right: 400, top: -250, bottom: 250 }}
                dragMomentum={false}
                className="skill-detail-panel tech-card"
              >
                <div 
                  className="panel-header mono" 
                  onPointerDown={(e) => dragControls.start(e)}
                  style={{ cursor: 'grab' }}
                >
                  <div className="highlight panel-expansion-title" ref={registerElement}>
                    ENG_DATA // {expandedSkill.name}
                  </div>
                  <button className="close-btn" onClick={() => setExpandedSkill(null)}>
                    <X size={16} />
                  </button>
                </div>
                <div className="panel-content mono">
                  <p className="detail-desc" ref={registerElement}>{expandedSkill.details.join('. ')}.</p>
                  <div className="divider" />
                  <div className="specs-list">
                    <div className="specs-title highlight" ref={registerElement}> TECHNICAL_SPECIFICATIONS</div>
                    {expandedSkill.techSpecs.map((spec, sIdx) => (
                      <motion.div 
                        key={sIdx}
                        initial={{ opacity: 0, x: -8 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: sIdx * 0.07 }}
                        className="spec-item"
                        ref={registerElement}
                      >
                        <span className="bullet">■</span> {spec}
                      </motion.div>
                    ))}
                  </div>
                </div>
                <div className="panel-footer mono" ref={registerElement}>
                  ID: {expandedSkill.id.toUpperCase()} // STATUS: VERIFIED
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          <div className="tech-footer-paragraph">
            <h4 className="mono highlight section-header" ref={registerElement}> TECHNICAL_KNOWLEDGE_OVERVIEW</h4>
            <div className="footer-technical-content">
              <p ref={registerElement}>
                Advanced exposure to <span className="highlight">Jetson Nano</span>, <span className="highlight">LoRa modules</span>, and <span className="highlight">Pixhawk controllers</span>. 
                Proficient in UAV power systems, ESC calibration, and resilient autonomous communication links.
              </p>
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        .operative-container { 
          padding-bottom: 4rem; 
          position: relative;
          min-height: 80vh;
          z-index: 1;
        }

        .operative-bg-layer {
          position: fixed;
          inset: 0;
          z-index: -1;
          pointer-events: none;
        }

        .operative-header-block {
          margin-bottom: 3rem;
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
        }
        
        .dossier-sub {
          font-size: 0.65rem; 
          opacity: 0.35;
          letter-spacing: 3px;
          padding-left: 1.2rem;
        }

        .dossier-grid { 
          display: grid; 
          grid-template-columns: 350px 1fr; 
          gap: 4rem; 
          position: relative;
          align-items: start;
        }
        
        .profile-section-wrap {
          margin-bottom: 3.5rem;
        }

        .profile-container { 
          position: relative; 
          padding: 7px; 
          background: #080808;
        }
        
        .profile-image-wrap { position: relative; overflow: hidden; }
        
        .profile-img {
          width: 100%;
          display: block;
          object-fit: cover;
          filter: grayscale(100%) contrast(110%);
          transition: filter 0.5s ease;
        }

        .profile-image-wrap:hover .profile-img {
          filter: grayscale(0%) contrast(100%);
        }

        .scan-line-overlay {
          position: absolute; top: 0; left: 0; width: 100%; height: 2px;
          background: var(--yellow); box-shadow: 0 0 8px var(--yellow);
          animation: profileScanInner 4s infinite linear; pointer-events: none;
          will-change: top;
        }
        @keyframes profileScanInner { 0% { top: 0; } 100% { top: 100%; } }

        .id-tags { 
          margin-top: 1.8rem; 
          display: flex; 
          flex-direction: column; 
          gap: 0.9rem; 
        }
        .tag-item { 
          display: flex; 
          justify-content: space-between; 
          font-size: 0.82rem; 
          border-bottom: 1px solid var(--border-dim); 
          padding-bottom: 0.8rem; 
          line-height: 1.4;
          font-weight: 500;
        }

        .capabilities-section { margin-bottom: 4.5rem; }
        .section-header { 
          margin-bottom: 1.8rem; 
          font-size: 0.95rem; 
          letter-spacing: 2px; 
          font-weight: 800; 
        }
        .main-cap-header { 
          border-bottom: 1px solid var(--border-dim); 
          padding-bottom: 1rem;
          font-size: 1rem; 
        }
        
        .skills-stack { 
          display: flex; 
          flex-direction: column; 
          gap: 1.8rem; 
        }
        
        .capability-card {
          padding: 1.3rem 1.8rem;
          border-left-width: 3px;
          transition: all 0.3s cubic-bezier(0.19, 1, 0.22, 1);
          cursor: pointer;
          position: relative;
          background: #0a0a0a;
        }

        .capability-card:hover {
          background: rgba(250, 204, 21, 0.03);
          border-left-color: var(--yellow);
          transform: translateX(3px);
        }
        
        .capability-card.active {
          border-left-color: var(--yellow);
          background: #0b0b0b;
        }

        .cap-label-group { display: flex; align-items: center; gap: 0.9rem; }
        .skill-icon { color: var(--yellow); display: flex; opacity: 0.75; }

        .skill-header { 
          display: flex; 
          justify-content: space-between; 
          align-items: flex-end; 
          font-size: 0.8rem; 
          margin-bottom: 1rem; 
          letter-spacing: 1px; 
        }
        .cap-name { color: #fff; font-weight: 800; }
        .capability-level { font-size: 1rem; font-weight: 900; }

        .skill-bar-track { height: 3px; background: rgba(255,255,255,0.03); width: 100%; border-radius: 1px; overflow: hidden; position: relative; }
        .skill-bar-fill { height: 100%; background: var(--yellow); position: relative; box-shadow: 0 0 6px var(--yellow-glow); }
        
        .bar-pulse {
          position: absolute; top: 0; left: 0; bottom: 0; width: 30px;
          background: linear-gradient(90deg, transparent, rgba(255,255,255,0.12), transparent);
          animation: barShimmer 2.5s infinite linear;
          will-change: transform;
        }
        @keyframes barShimmer { 0% { left: -100%; } 100% { left: 200%; } }

        .skill-bar-fill.tech-priority {
          background: linear-gradient(90deg, var(--yellow), var(--emerald));
          box-shadow: 0 0 8px var(--emerald-glow);
        }
        
        /* Viewport-safe fixed panel */
        .skill-detail-panel {
          position: fixed; 
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          width: min(90vw, 380px);
          max-height: min(85vh, 520px);
          z-index: 2000;
          overflow-y: auto;
          background: #080808;
          border-color: rgba(250, 204, 21, 0.2);
          box-shadow: 0 0 40px rgba(0,0,0,0.8);
        }
        
        .panel-header {
          padding: 1rem 1.5rem; 
          background: #111; 
          border-bottom: 1px solid var(--border-dim);
          display: flex; 
          justify-content: space-between; 
          align-items: center; 
          font-size: 0.78rem;
          user-select: none; 
          font-weight: 800;
          position: sticky;
          top: 0;
          z-index: 1;
        }
        
        .close-btn { background: transparent; border: none; color: var(--text-dim); cursor: pointer; transition: 0.3s; padding: 4px; }
        .close-btn:hover { color: var(--yellow); transform: rotate(90deg); }
        
        .panel-content { padding: 1.8rem; }
        
        .detail-desc { 
          color: var(--text-main); 
          line-height: 1.65; 
          margin-bottom: 1.8rem; 
          opacity: 0.9;
          font-size: 0.88rem;
        }
        
        .divider { height: 1px; background: var(--border-dim); margin-bottom: 1.8rem; }
        
        .specs-title { 
          margin-bottom: 1.2rem; 
          font-size: 0.78rem; 
          letter-spacing: 2px; 
          font-weight: 800;
        }
        
        .spec-item { 
          margin-bottom: 0.85rem; 
          color: #ccc; 
          display: flex; 
          gap: 0.8rem; 
          line-height: 1.5; 
          font-size: 0.85rem; 
        }
        
        .bullet { color: var(--yellow); font-size: 0.55rem; margin-top: 0.4rem; opacity: 0.8; }
        
        .panel-expansion-title {
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
          max-width: calc(100% - 40px);
          font-size: 0.72rem;
        }

        .panel-footer { 
          padding: 1rem 1.5rem; 
          border-top: 1px solid var(--border-dim); 
          font-size: 0.62rem; 
          opacity: 0.4; 
          color: #fff; 
          text-align: center; 
          letter-spacing: 2px; 
        }

        .technical-paragraph {
          font-size: 1.05rem; 
          line-height: 1.7;
          color: #fff;
          opacity: 0.88;
          border-left: 2px solid var(--yellow);
          padding-left: 1.8rem;
          margin-top: 0.8rem;
          font-weight: 400;
        }

        .technical-paragraph p { margin-bottom: 1.2rem; }

        .tech-footer-paragraph { margin-top: 4.5rem; max-width: 900px; }
        .footer-technical-content {
          border-left: 2px solid var(--border-dim);
          padding-left: 1.8rem;
        }
        .footer-technical-content p { 
          font-size: 0.95rem; 
          color: #fff; 
          opacity: 0.7; 
          line-height: 1.6; 
        }

        .mission-objective-block { 
          margin-top: 3.5rem;
          padding-right: 1rem;
        }

        @media (max-width: 1100px) {
          .dossier-grid { grid-template-columns: 1fr; gap: 3rem; }
          .profile-section-wrap { display: flex; gap: 2.5rem; align-items: start; }
          .profile-container { width: 280px; flex-shrink: 0; }
          .id-tags { flex: 1; margin-top: 0; }
        }

        @media (max-width: 900px) { 
          .profile-section-wrap { flex-direction: column; }
          .profile-container { width: 100%; }
          .id-tags { width: 100%; margin-top: 1.8rem; }
          .skill-detail-panel { width: min(95vw, 380px); }
        }
      `}</style>
    </div>
  );
};

export default Operative;