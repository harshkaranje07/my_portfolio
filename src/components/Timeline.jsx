import React, { useState, useCallback, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Layers } from 'lucide-react';

const MISSIONS = [
  {
    id: 'nidar',
    year: '2026',
    title: 'NIDAR UAV CHALLENGE',
    location: 'INDIA',
    team: 'Team Maverick India',
    role: 'JR AUTONOMOUS ENGINEER',
    rank: 'AIR 2',
    status: 'MISSION_CRITICAL',
    sections: [
      {
        title: 'HEXA PLATFORM',
        type: 'Multirotor Hexacopter',
        role: 'Jr Autonomous Engineer',
        contributions: [
          'Autonomous mission tuning',
          'Mission Planner waypoint optimization',
          'Flight testing',
          'PID refinement',
          'Telemetry analysis'
        ],
        modelLabel: 'HEXA_MODEL_CONTAINER'
      },
      {
        title: 'VTOL PLATFORM',
        type: 'VTOL UAV',
        role: 'Jr Autonomous Engineer',
        contributions: [
          'Transition tuning',
          'ArduPilot configuration',
          'Control surface calibration',
          'Stability optimization'
        ],
        modelLabel: 'VTOL_MODEL_CONTAINER'
      }
    ]
  },
  {
    id: 'sae',
    year: '2025',
    title: 'SAE AERO DESIGN WEST',
    location: 'USA',
    team: 'Team Maverick India',
    role: 'Intern // Photography & Media',
    rank: 'DESIGN RANK 1',
    secondaryRank: 'WORLD RANK 6',
    status: 'MISSION_ARCHIVED',
    sections: [
      {
        title: 'FIXED WING AIRCRAFT',
        type: 'Heavy Lift Cargo Platform',
        role: 'Photography & Intern',
        contributions: [
          'Aircraft documentation',
          'Event coverage',
          'Team technical presentation support'
        ],
        modelLabel: 'FIXED_WING_MODEL_CONTAINER'
      }
    ]
  },
  {
    id: 'future',
    year: 'UPCOMING',
    title: 'UPCOMING MISSIONS',
    location: 'TBD',
    team: 'Team Maverick India',
    role: 'Autonomous Systems Engineer',
    rank: 'DEPLOYING',
    status: 'IN_PROGRESS',
    sections: [
      {
        title: 'NEXT-GEN PROTOTYPES',
        type: 'Autonomous Systems',
        role: 'Lead Developer',
        contributions: [
          'System architecture design',
          'Edge compute integration',
          'Prototype flight testing'
        ],
        modelLabel: 'FUTURE_PROTO_CONTAINER'
      }
    ]
  }
];

const Timeline = () => {
  const [selectedMission, setSelectedMission] = useState(null);
  const closeMission = useCallback(() => setSelectedMission(null), []);

  useEffect(() => {
    if (selectedMission) {
      document.body.classList.add('modal-open');
    } else {
      document.body.classList.remove('modal-open');
    }
    return () => document.body.classList.remove('modal-open');
  }, [selectedMission]);

  return (
    <div className="mission-log-view">
      <div className="timeline-bg-layer">
        <div className="depth-gradient" />
        <div className="faint-grid-wide" />
        <div className="vertical-scan-mount">
          <div className="energy-vertical-line" />
        </div>
      </div>

      <div className="mission-header-mount">
        <h3 className="panel-title mono">MISSION_LOG // UAV_HISTORY</h3>
        <p className="mono panel-meta">UAV_PROGRAM_ARCHIVE // ID: HK_TMI_07</p>
      </div>

      <div className="timeline-content-mount">
        <div className="vertical-spine" />

        <div className="mission-list">
          {MISSIONS.map((m) => (
            <div key={m.id} className="mission-node-row" onClick={() => setSelectedMission(m)}>
              <div className="node-axis">
                <div className="status-dot" />
              </div>

              <div className="card-cell">
                <div className="mission-card tech-card">
                  <div className="card-inner">
                    <h4 className="mission-name mono">{m.title}</h4>
                    <div className="mission-meta-strip mono">
                      <span className="year-tag">{m.year}</span>
                      <span className="divider-char">|</span>
                      <span className="location-tag">{m.location}</span>
                    </div>

                    <div className="mission-essential-data mono">
                      <div className="data-row">
                        <span className="lbl">ROLE:</span>
                        <span className="val">{m.role}</span>
                      </div>
                      <div className="data-row">
                        <span className="lbl">TEAM:</span>
                        <span className="val">{m.team}</span>
                      </div>
                    </div>

                    <div className="rank-highlight-zone">
                      <span className="rank-lbl mono">OFFICIAL_RANKING</span>
                      <div className="rank-value mono">{m.rank}</div>
                      {m.secondaryRank && <div className="rank-sub mono">{m.secondaryRank}</div>}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Viewport-safe mission dossier overlay */}
      <AnimatePresence>
        {selectedMission && (
          <div className="overlay-root">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="overlay-backdrop"
              onClick={closeMission}
            />
           
            <motion.div
              initial={{ opacity: 0, scale: 0.96, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.96, y: 20 }}
              transition={{ duration: 0.35, ease: [0.19, 1, 0.22, 1] }}
              className="engineering-panel tech-card"
            >
              <div className="panel-internal-bg">
                <div className="panel-grid-lines-static" />
              </div>

              <div className="panel-header mono">
                <div className="header-title highlight">MISSION_DOSSIER // {selectedMission.id.toUpperCase()}</div>
                <button className="close-panel" onClick={closeMission}>
                  <X size={20} />
                </button>
              </div>

              <div className="panel-body">
                <div className="panel-scroll">
                  <div className="dossier-content-flow">
                    {selectedMission.sections.map((section, idx) => (
                      <div key={idx} className="dossier-section-block">
                        {idx > 0 && (
                          <div className="divider-wrapper">
                            <div className="section-divider-line" />
                          </div>
                        )}
                       
                        <div className="section-grid">
                          <div className="section-text-area">
                           
                            <h5 className="section-heading mono highlight"> {section.title}</h5>
                           
                            <div className="metadata-box mono">
                              <div className="meta-item">
                                <span className="m-lbl">PLATFORM_TYPE:</span>
                                <span className="m-val">{section.type}</span>
                              </div>
                              <div className="meta-item">
                                <span className="m-lbl">ASSIGNED_ROLE:</span>
                                <span className="m-val">{section.role}</span>
                              </div>
                            </div>

                            <div className="contribution-list">
                              <h6 className="list-title mono highlight">TECHNICAL_CONTRIBUTIONS:</h6>
                              {section.contributions.map((item, i) => (
                                <div key={i} className="contribution-item mono">
                                  <span className="tick">■</span> {item}
                                </div>
                              ))}
                            </div>
                          </div>

                          <div className="section-visual-area">
                            <div className="model-slot tech-card">
                              <div className="model-placeholder">
                                <Layers size={36} className="p-icon" />
                                <span className="mono p-text">{section.modelLabel}</span>
                                <span className="mono p-status">AWAITING_RENDER_LINK...</span>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div className="panel-footer mono">
                UAV_ENGINEERING_ARCHIVE // CONFIDENTIAL // STATUS: {selectedMission.status}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <style jsx>{`
        .mission-log-view {
          position: relative;
          padding-bottom: 4rem;
          min-height: 100%;
          background: #000;
        }

        .timeline-bg-layer {
          position: fixed;
          inset: 0;
          z-index: 0;
          pointer-events: none;
          background: #000;
        }

        .depth-gradient {
          position: absolute;
          inset: 0;
          background: linear-gradient(to bottom, #050505 0%, #000 100%);
          z-index: 1;
        }

        .faint-grid-wide {
          position: absolute;
          inset: 0;
          background-image:
            linear-gradient(rgba(250, 204, 21, 0.04) 1px, transparent 1px),
            linear-gradient(90deg, rgba(250, 204, 21, 0.04) 1px, transparent 1px);
          background-size: 180px 180px;
          z-index: 2;
        }

        .vertical-scan-mount {
          position: absolute;
          inset: 0;
          overflow: hidden;
          z-index: 3;
        }

        .energy-vertical-line {
          position: absolute;
          top: 0;
          bottom: 0;
          width: 1px;
          background: rgba(250, 204, 21, 0.25);
          animation: verticalScanSlow 18s linear infinite;
          will-change: transform;
        }

        .energy-vertical-line::after {
          content: '';
          position: absolute;
          top: 0;
          bottom: 0;
          left: -50px;
          width: 50px;
          background: linear-gradient(to right, transparent 0%, rgba(250, 204, 21, 0.06) 100%);
          mix-blend-mode: screen;
          pointer-events: none;
        }

        @keyframes verticalScanSlow {
          0% { left: -2%; }
          100% { left: 102%; }
        }

        .mission-header-mount {
          margin-bottom: 3.5rem;
          position: relative;
          z-index: 10;
        }

        .panel-meta {
          font-size: 0.65rem;
          opacity: 0.45;
          letter-spacing: 4px;
          margin-top: 0.4rem;
          color: var(--yellow);
        }

        .timeline-content-mount {
          position: relative;
          max-width: 860px;
          padding-left: 55px;
          z-index: 10;
        }

        .vertical-spine {
          position: absolute;
          left: 0;
          top: 0;
          bottom: 0;
          width: 1px;
          background: rgba(250, 204, 21, 0.4);
          box-shadow: 0 0 5px rgba(250, 204, 21, 0.2);
        }

        .mission-list {
          display: flex;
          flex-direction: column;
          gap: 3.5rem;
        }

        .mission-node-row {
          position: relative;
          cursor: pointer;
        }

        .node-axis {
          position: absolute;
          left: -55px;
          top: 35px;
          width: 55px;
          display: flex;
          justify-content: center;
          align-items: center;
        }

        .status-dot {
          width: 9px;
          height: 9px;
          background: #1a1a1a;
          border: 1px solid rgba(250, 204, 21, 0.2);
          border-radius: 50%;
          transition: 0.3s;
        }

        .mission-node-row:hover .status-dot {
          background: var(--yellow);
          box-shadow: 0 0 8px var(--yellow-glow);
          transform: scale(1.2);
        }

        .card-cell { padding-left: 25px; }

        .mission-card {
          padding: 2.2rem;
          background: rgba(8, 8, 8, 0.9);
          transition: transform 0.3s ease, border-color 0.3s ease;
        }

        .mission-card:hover {
          transform: translateX(3px);
          border-color: rgba(250, 204, 21, 0.3);
        }

        .mission-name {
          font-size: 1.45rem;
          font-weight: 800;
          color: var(--yellow);
          margin-bottom: 0.35rem;
        }

        .mission-meta-strip {
          font-size: 0.75rem;
          margin-bottom: 1.8rem;
          display: flex;
          gap: 0.9rem;
          align-items: center;
        }

        .year-tag { color: rgba(255,255,255,0.65); }
        .divider-char { color: rgba(255,255,255,0.1); }
        .location-tag { color: #16A34A; font-weight: 700; }

        .mission-essential-data {
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
          margin-bottom: 2rem;
        }

        .data-row {
          display: flex;
          gap: 1rem;
          font-size: 0.75rem;
        }

        .data-row .lbl { color: rgba(255,255,255,0.28); width: 55px; flex-shrink: 0; }
        .data-row .val { color: #fff; }

        .rank-highlight-zone {
          border-top: 1px solid rgba(255,255,255,0.04);
          padding-top: 1.3rem;
        }

        .rank-lbl {
          font-size: 0.58rem;
          letter-spacing: 2px;
          color: rgba(255,255,255,0.18);
          display: block;
          margin-bottom: 0.4rem;
        }

        .rank-value {
          font-size: 2rem;
          font-weight: 900;
          color: var(--yellow);
          text-shadow: 0 0 8px rgba(250, 204, 21, 0.15);
        }

        .rank-sub {
          font-size: 0.65rem;
          color: rgba(255,255,255,0.35);
          margin-top: 0.15rem;
        }

        /* Viewport-safe overlay */
        .overlay-root {
          position: fixed;
          inset: 0;
          z-index: 5000;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 2rem;
          box-sizing: border-box;
        }

        .overlay-backdrop {
          position: absolute;
          inset: 0;
          background: rgba(0, 0, 0, 0.88);
        }

        .engineering-panel {
          position: relative;
          width: min(88vw, 1100px);
          height: min(88vh, 900px);
          max-height: calc(100vh - 4rem);
          background: #080808;
          border: 1px solid rgba(250, 204, 21, 0.15);
          display: flex;
          flex-direction: column;
          overflow: hidden;
          z-index: 1;
        }

        .panel-internal-bg {
          position: absolute;
          inset: 0;
          z-index: 0;
          pointer-events: none;
        }

        .panel-grid-lines-static {
          position: absolute;
          inset: 0;
          background-image:
            linear-gradient(rgba(250, 204, 21, 0.025) 1px, transparent 1px),
            linear-gradient(90deg, rgba(250, 204, 21, 0.025) 1px, transparent 1px);
          background-size: 160px 160px;
          opacity: 0.5;
        }

        .panel-header {
          padding: 1.5rem 2.5rem;
          background: #0c0c0c;
          border-bottom: 1px solid rgba(255,255,255,0.07);
          display: flex;
          justify-content: space-between;
          align-items: center;
          flex-shrink: 0;
          position: relative;
          z-index: 10;
        }

        .header-title {
          font-size: 0.92rem;
          font-weight: 800;
          letter-spacing: 3px;
        }

        .close-panel {
          background: transparent; border: none; color: var(--text-dim); cursor: pointer; transition: 0.3s;
          padding: 4px;
        }

        .close-panel:hover {
          color: var(--yellow);
          transform: rotate(90deg);
        }

        .panel-body {
          flex: 1;
          overflow: hidden;
          position: relative;
          z-index: 10;
          min-height: 0;
        }

        .panel-scroll {
          height: 100%;
          overflow-y: auto;
          padding: 3rem 4rem;
        }

        .dossier-content-flow {
          display: flex;
          flex-direction: column;
          gap: 5rem;
        }

        .dossier-section-block { width: 100%; }

        .divider-wrapper {
          width: 100%;
          margin: 5rem 0;
          display: flex;
          justify-content: center;
        }

        .section-divider-line {
          height: 1px;
          background: rgba(250, 204, 21, 0.15);
          width: 100%;
        }

        .section-grid {
          display: grid;
          grid-template-columns: 1fr 360px;
          gap: 4rem;
          align-items: start;
        }

        .section-heading {
          font-size: 1rem;
          margin-bottom: 1.8rem;
          letter-spacing: 3px;
          font-weight: 800;
        }

        .metadata-box {
          margin-bottom: 2rem;
          display: flex;
          flex-direction: column;
          gap: 0.7rem;
        }

        .meta-item {
          display: flex; gap: 1rem; font-size: 0.8rem;
        }

        .m-lbl { opacity: 0.28; width: 130px; flex-shrink: 0; }
        .m-val { color: #fff; font-weight: 700; }

        .contribution-list {
          display: flex;
          flex-direction: column;
          gap: 0.9rem;
        }

        .list-title {
          font-size: 0.7rem;
          letter-spacing: 2px;
          margin-bottom: 1rem;
        }

        .contribution-item {
          font-size: 0.85rem;
          color: #ccc;
          display: flex;
          gap: 0.9rem;
          line-height: 1.55;
        }

        .tick { color: var(--yellow); font-size: 0.55rem; margin-top: 0.45rem; opacity: 0.55; }

        .model-slot {
          width: 100%;
          aspect-ratio: 1/1;
          background: #030303;
          border: 1px solid rgba(250, 204, 21, 0.08);
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .model-placeholder {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 1.2rem;
          opacity: 0.25;
        }

        .p-icon { color: var(--yellow); }
        .p-text { font-size: 0.65rem; letter-spacing: 2px; color: #fff; }
        .p-status { font-size: 0.52rem; color: var(--yellow); letter-spacing: 1px; }

        .panel-footer {
          padding: 1rem 2.5rem;
          background: #0c0c0c;
          border-top: 1px solid rgba(255,255,255,0.07);
          font-size: 0.6rem;
          letter-spacing: 4px;
          opacity: 0.35;
          text-align: center;
          flex-shrink: 0;
          position: relative;
          z-index: 10;
        }

        @media (max-width: 1100px) {
          .section-grid { grid-template-columns: 1fr; gap: 2.5rem; }
          .section-visual-area { order: -1; }
          .model-slot { aspect-ratio: 16/9; }
          .panel-scroll { padding: 2rem; }
          .divider-wrapper { margin: 3.5rem 0; }
        }

        @media (max-width: 768px) {
          .engineering-panel { width: min(96vw, 1100px); height: calc(100vh - 2rem); }
          .panel-scroll { padding: 1.5rem; }
          .section-heading { font-size: 0.9rem; }
          .rank-value { font-size: 1.6rem; }
          .overlay-root { padding: 1rem; }
        }
      `}</style>
    </div>
  );
};

export default Timeline;