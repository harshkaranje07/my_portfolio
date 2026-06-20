import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Mail, Globe, Linkedin, Github, Radio, ShieldCheck, Activity, Zap, Wifi, Clock } from 'lucide-react';

const SESSION_ID = Math.floor(Math.random() * 10000).toString().padStart(4, '0');

const Uplink = () => {
  const [isRadarHover, setIsRadarHover] = useState(false);

  return (
    <div className={`uplink-container ${isRadarHover ? 'active-green-mode' : ''}`}>
      <div className="uplink-header">
        <h3 className="panel-title mono">UPLINK_STATION // SAT_COM_07</h3>
        <p className="mono panel-meta">GROUND_CONTROL_SYSTEM // ID: HK_TMI_07</p>
      </div>

      <div className="dashboard-grid">
        
        {/* ========================================= */}
        {/* RADAR PANEL (Primary Focus)               */}
        {/* ========================================= */}
        <div 
          className="radar-panel tech-glass-panel"
          onMouseEnter={() => setIsRadarHover(true)}
          onMouseLeave={() => setIsRadarHover(false)}
        >
          <div className="panel-header mono">
            <span className="tick-sm" /> RADAR_TRACKING // AIRSPACE_MONITOR
          </div>

          <div className="radar-wrapper">
            <div className="radar-base">
              <div className="radar-rings">
                <div className="ring" />
                <div className="ring" />
                <div className="ring" />
                <div className="ring" />
                <div className="crosshair-h" />
                <div className="crosshair-v" />
              </div>

              <motion.div 
                animate={{ rotate: 360 }}
                transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
                className="radar-sweep"
              />

              <div className="blip b1" />
              <div className="blip b2" />
              <div className="blip b3 blip-red" />
            </div>
          </div>
          
          <div className={`radar-telemetry mono highlight ${isRadarHover ? 'glow-text-green' : ''}`}>
            {isRadarHover ? "AIRSPACE_LOCKED_SECURE" : "LINK_STATUS: STABLE // ENCRYPTION: AES_256"}
          </div>
        </div>

        {/* ========================================= */}
        {/* TELEMETRY STATUS PANEL                    */}
        {/* ========================================= */}
        <div className="status-panel tech-glass-panel">
          <div className="panel-header mono">
            <span className="tick-sm" /> TELEMETRY_DATA
          </div>
          
          <div className="status-grid">
            <div className="status-item">
              <Wifi size={14} className="status-icon" />
              <div className="status-text">
                <span className="mono lbl">LINK STATUS</span>
                <span className="mono val good">STABLE</span>
              </div>
            </div>
            <div className="status-item">
              <ShieldCheck size={14} className="status-icon" />
              <div className="status-text">
                <span className="mono lbl">ENCRYPTION</span>
                <span className="mono val">AES-256</span>
              </div>
            </div>
            <div className="status-item">
              <Activity size={14} className="status-icon" />
              <div className="status-text">
                <span className="mono lbl">SIGNAL QUALITY</span>
                <span className="mono val good">OPTIMAL</span>
              </div>
            </div>
            <div className="status-item">
              <Radio size={14} className="status-icon" />
              <div className="status-text">
                <span className="mono lbl">TELEMETRY</span>
                <span className="mono val good">ACTIVE</span>
              </div>
            </div>
            <div className="status-item">
              <Zap size={14} className="status-icon" />
              <div className="status-text">
                <span className="mono lbl">PACKET LOSS</span>
                <span className="mono val">0.00%</span>
              </div>
            </div>
            <div className="status-item">
              <Clock size={14} className="status-icon" />
              <div className="status-text">
                <span className="mono lbl">LATENCY</span>
                <span className="mono val">12ms</span>
              </div>
            </div>
          </div>
        </div>

        {/* ========================================= */}
        {/* SECURE COMM CHANNELS (Contact Info)       */}
        {/* ========================================= */}
        <div className="comm-panel tech-glass-panel">
          <div className="panel-header mono">
            <span className="tick-sm" /> SECURE_COMM_CHANNELS
          </div>
          
          <div className="channel-list">
            <a href="mailto:karanjeharshwardhan@gmail.com" className="chan-btn">
              <Mail size={16} className="highlight" />
              <div className="chan-text">
                <span className="mono chan-proto">DIRECT_LINK_PROTO_SMTP</span>
                <span className="mono chan-val">karanjeharshwardhan@gmail.com</span>
              </div>
            </a>

            <a href="https://www.teammaverickindia.com/" target="_blank" rel="noopener noreferrer" className="chan-btn">
              <Globe size={16} className="highlight" />
              <div className="chan-text">
                <span className="mono chan-proto">ORGANIZATION_EXTERNAL</span>
                <span className="mono chan-val">TEAM MAVERICK INDIA</span>
              </div>
            </a>

            <div className="social-row">
              <a href="https://www.linkedin.com/in/harshwardhankaranje/" target="_blank" rel="noopener noreferrer" className="soc-link"><Linkedin size={18} /></a>
              <a href="https://github.com/harshkaranje07" target="_blank" rel="noopener noreferrer" className="soc-link"><Github size={18} /></a>
            </div>
          </div>
          
          <div className="terminal-footer mono">
            SESSION_ID_{SESSION_ID} // LINK_ESTABLISHED
          </div>
        </div>

      </div>

      <style jsx>{`
        .uplink-container { 
          padding-bottom: 4rem; 
        }

        .uplink-header {
          margin-bottom: 2.5rem;
        }

        .panel-meta {
          font-size: 0.65rem;
          opacity: 0.4;
          letter-spacing: 3px;
          margin-top: 0.5rem;
        }

        .dashboard-grid { 
          display: grid; 
          grid-template-columns: 1fr 340px; 
          grid-template-rows: auto auto;
          gap: 2rem; 
          align-items: start;
        }

        @media (max-width: 1024px) { 
          .dashboard-grid { 
            grid-template-columns: 1fr; 
          }
        }

        /* ------------------------------------- */
        /* COMMON PANEL HEADER                   */
        /* ------------------------------------- */
        .panel-header {
          padding: 1.2rem 1.5rem;
          border-bottom: 1px solid rgba(250, 204, 21, 0.1);
          font-size: 0.7rem;
          letter-spacing: 2px;
          color: var(--text-dim);
          display: flex;
          align-items: center;
          gap: 8px;
          background: rgba(0,0,0,0.2);
        }

        .tick-sm {
          display: inline-block;
          width: 3px;
          height: 10px;
          background: var(--yellow);
        }

        /* ------------------------------------- */
        /* RADAR PANEL                           */
        /* ------------------------------------- */
        .radar-panel {
          grid-column: 1;
          grid-row: 1 / 3;
          display: flex;
          flex-direction: column;
          height: 100%;
          min-height: 600px;
        }

        @media (max-width: 1024px) { 
          .radar-panel {
            grid-row: auto;
            min-height: 500px;
          }
        }

        .radar-wrapper {
          flex: 1;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 2rem;
          position: relative;
        }

        .radar-base { 
          position: relative; 
          width: 400px; 
          height: 400px; 
          border: 1px solid rgba(250, 204, 21, 0.2); 
          border-radius: 50%; 
          overflow: hidden; 
          background: radial-gradient(circle, rgba(250, 204, 21, 0.05) 0%, transparent 70%); 
        }

        @media (max-width: 600px) {
          .radar-base {
            width: 300px;
            height: 300px;
          }
        }
        
        .radar-rings .ring { 
          position: absolute; 
          top: 50%; 
          left: 50%; 
          transform: translate(-50%, -50%); 
          border: 1px solid rgba(250, 204, 21, 0.08); 
          border-radius: 50%; 
        }
        .ring:nth-child(1) { width: 25%; height: 25%; }
        .ring:nth-child(2) { width: 50%; height: 50%; }
        .ring:nth-child(3) { width: 75%; height: 75%; }
        .ring:nth-child(4) { width: 100%; height: 100%; }

        .crosshair-h {
          position: absolute;
          top: 50%;
          left: 0;
          right: 0;
          height: 1px;
          background: rgba(250, 204, 21, 0.08);
        }
        
        .crosshair-v {
          position: absolute;
          left: 50%;
          top: 0;
          bottom: 0;
          width: 1px;
          background: rgba(250, 204, 21, 0.08);
        }
        
        .radar-sweep { 
          position: absolute; 
          top: 50%; 
          left: 50%; 
          width: 50%; 
          height: 50%; 
          transform-origin: 0% 0%; 
          background: linear-gradient(45deg, rgba(250, 204, 21, 0.15) 0%, transparent 60%);
          will-change: transform;
        }
        
        .blip { 
          position: absolute; 
          width: 6px; 
          height: 6px; 
          border-radius: 50%; 
          background: var(--yellow); 
          box-shadow: 0 0 8px var(--yellow-glow); 
        }
        .blip-red { 
          background: #ef4444; 
          box-shadow: 0 0 8px rgba(239, 68, 68, 0.6); 
        }
        .b1 { top: 25%; left: 65%; } 
        .b2 { top: 70%; left: 35%; } 
        .b3 { top: 40%; left: 25%; }
        
        .radar-telemetry { 
          font-size: 0.65rem; 
          letter-spacing: 2px; 
          text-align: center;
          padding: 1.5rem;
          border-top: 1px solid rgba(250, 204, 21, 0.1);
          color: var(--text-dim);
          background: rgba(0,0,0,0.2);
        }

        /* ------------------------------------- */
        /* STATUS PANEL                          */
        /* ------------------------------------- */
        .status-panel {
          grid-column: 2;
          grid-row: 1;
        }

        .status-grid {
          padding: 1.5rem;
          display: grid;
          grid-template-columns: 1fr;
          gap: 1.2rem;
        }

        .status-item {
          display: flex;
          align-items: center;
          gap: 1rem;
        }

        .status-icon {
          color: var(--yellow);
          opacity: 0.8;
        }

        .status-text {
          display: flex;
          flex-direction: column;
          gap: 0.2rem;
        }

        .status-text .lbl {
          font-size: 0.55rem;
          color: var(--text-dim);
          letter-spacing: 1px;
        }

        .status-text .val {
          font-size: 0.8rem;
          color: #fff;
          font-weight: 600;
          letter-spacing: 1px;
        }

        .status-text .val.good {
          color: var(--yellow);
        }

        /* ------------------------------------- */
        /* COMM PANEL (Contact Links)            */
        /* ------------------------------------- */
        .comm-panel {
          grid-column: 2;
          grid-row: 2;
          display: flex;
          flex-direction: column;
        }

        .channel-list { 
          padding: 1.5rem;
          display: flex; 
          flex-direction: column; 
          gap: 1rem; 
        }
        
        .chan-btn { 
          display: flex; 
          align-items: center; 
          gap: 1rem; 
          padding: 1rem; 
          text-decoration: none; 
          background: rgba(0,0,0,0.3);
          border: 1px solid rgba(255,255,255,0.05); 
          transition: all 0.3s ease; 
        }

        .chan-btn:hover { 
          border-color: rgba(250, 204, 21, 0.3); 
          background: rgba(250, 204, 21, 0.05); 
        }

        .chan-btn .highlight {
          color: var(--yellow);
        }
        
        .chan-text { 
          display: flex; 
          flex-direction: column; 
          gap: 0.25rem; 
        }

        .chan-proto { 
          font-size: 0.55rem; 
          color: var(--text-dim);
          letter-spacing: 1px; 
        }

        .chan-val { 
          font-size: 0.8rem; 
          color: #fff;
          font-weight: 600; 
        }
        
        .social-row { 
          display: flex; 
          gap: 1rem; 
        }

        .soc-link { 
          flex: 1; 
          display: flex; 
          justify-content: center; 
          padding: 0.9rem; 
          color: var(--yellow); 
          background: rgba(0,0,0,0.3);
          border: 1px solid rgba(255,255,255,0.05); 
          transition: all 0.3s ease; 
          text-decoration: none;
        }

        .soc-link:hover { 
          color: #fff;
          border-color: rgba(250, 204, 21, 0.3); 
          background: rgba(250, 204, 21, 0.05); 
        }
        
        .terminal-footer { 
          margin-top: auto;
          padding: 1.2rem; 
          text-align: center; 
          border-top: 1px solid rgba(250, 204, 21, 0.1); 
          font-size: 0.6rem; 
          letter-spacing: 2px; 
          color: var(--text-dim);
          background: rgba(0,0,0,0.2);
        }

        /* ------------------------------------- */
        /* ACTIVE GREEN MODE (Subtle handling)   */
        /* ------------------------------------- */
        .active-green-mode .radar-sweep {
          background: linear-gradient(45deg, rgba(16, 185, 129, 0.15) 0%, transparent 60%);
        }
        
        .glow-text-green { 
          color: var(--emerald) !important; 
          text-shadow: 0 0 6px rgba(16, 185, 129, 0.4); 
        }
      `}</style>
    </div>
  );
};

export default Uplink;