import React, { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { Mail, Globe, Linkedin, Github } from 'lucide-react';

// Stable session ID — generated once per mount, not on every render
const SESSION_ID = Math.floor(Math.random() * 10000).toString().padStart(4, '0');

const Uplink = () => {
  const [isRadarHover, setIsRadarHover] = useState(false);

  return (
    <div className={`uplink-container ${isRadarHover ? 'active-green-mode' : ''}`}>
      <h3 className="panel-title">UPLINK_STATION // SAT_COM_07</h3>

      <div className="uplink-grid">
        <div 
          className="radar-station tech-card"
          onMouseEnter={() => setIsRadarHover(true)}
          onMouseLeave={() => setIsRadarHover(false)}
        >
          <div className="radar-base">
            <div className="radar-rings">
              <div className="ring" /><div className="ring" /><div className="ring" />
            </div>
            <motion.div 
              animate={{ rotate: 360 }}
              transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
              className="radar-sweep"
              style={{ 
                background: isRadarHover 
                  ? 'linear-gradient(45deg, rgba(5, 150, 105, 0.2) 0%, transparent 70%)' 
                  : 'linear-gradient(45deg, rgba(250, 204, 21, 0.12) 0%, transparent 70%)' 
              }}
            />
            <div className="blip b1" />
            <div className="blip b2" />
            <div className="blip b3 blip-red" />
          </div>
          <div className={`radar-telemetry mono highlight ${isRadarHover ? 'glow-text-green' : ''}`}>
            {isRadarHover ? "AIRSPACE_LOCKED_SECURE" : "LINK_STATUS: STABLE // ENCRYPTION: AES_256"}
          </div>
        </div>

        <div className="contact-terminal tech-card">
          <div className="terminal-header mono">UPLINK_TERMINAL_v4.5</div>
          <div className="terminal-body">
            <div className="mono operator-id">
              <span className="uplink-glow-text highlight"> HARSHWARDHAN_KARANJE</span>
              {' '}// ID: HK_TMI_07
            </div>
            
            <div className="channel-list">
              <a href="mailto:karanjeharshwardhan@gmail.com" className="chan-btn tech-card">
                <Mail size={15} className="highlight" />
                <div className="chan-text">
                  <span className="mono chan-proto">DIRECT_LINK_PROTO_SMTP</span>
                  <span className="mono uplink-glow-text chan-val">karanjeharshwardhan@gmail.com</span>
                </div>
              </a>

              <a href="https://www.teammaverickindia.com/" target="_blank" rel="noopener noreferrer" className="chan-btn tech-card">
                <Globe size={15} className="highlight" />
                <div className="chan-text">
                  <span className="mono chan-proto">ORGANIZATION_EXTERNAL</span>
                  <span className="mono uplink-glow-text chan-val">TEAM MAVERICK INDIA</span>
                </div>
              </a>

              <div className="social-row">
                <a href="#" className="soc-link tech-card uplink-glow-text"><Linkedin size={17} /></a>
                <a href="#" className="soc-link tech-card uplink-glow-text"><Github size={17} /></a>
              </div>
            </div>
          </div>
          <div className={`terminal-footer mono highlight ${isRadarHover ? 'glow-text-green' : ''}`}>
            UPLINK_ESTABLISHED_HK07_SESSION_ID_{SESSION_ID}
          </div>
        </div>
      </div>

      <style jsx>{`
        .uplink-container { 
          padding-bottom: 4rem; 
          transition: all 0.5s ease; 
        }
        
        .uplink-grid { 
          display: grid; 
          grid-template-columns: 1.1fr 1fr; 
          gap: 3.5rem; 
          align-items: center; 
          margin-top: 2.5rem;
        }

        .radar-station { 
          display: flex; 
          flex-direction: column; 
          align-items: center; 
          gap: 2.5rem; 
          padding: 3.5rem; 
          background: #000; 
          position: relative; 
          cursor: crosshair !important;
          transition: border-color 0.4s ease, background 0.4s ease;
          border-color: var(--border-dim);
        }
        .radar-station:hover { 
          border-color: rgba(5, 150, 105, 0.28); 
          background: rgba(5, 150, 105, 0.03); 
        }

        .radar-base { 
          position: relative; 
          width: 260px; 
          height: 260px; 
          border: 1px solid rgba(255,255,255,0.04); 
          border-radius: 50%; 
          overflow: hidden; 
          background: radial-gradient(circle, rgba(250, 204, 21, 0.025) 0%, transparent 80%); 
        }
        
        .radar-rings .ring { 
          position: absolute; 
          top: 50%; 
          left: 50%; 
          transform: translate(-50%, -50%); 
          border: 1px solid rgba(255,255,255,0.025); 
          border-radius: 50%; 
        }
        .ring:nth-child(1) { width: 33%; height: 33%; }
        .ring:nth-child(2) { width: 66%; height: 66%; }
        .ring:nth-child(3) { width: 100%; height: 100%; }
        
        .radar-sweep { 
          position: absolute; 
          top: 50%; 
          left: 50%; 
          width: 50%; 
          height: 50%; 
          transform-origin: 0% 0%; 
          will-change: transform;
        }
        
        .blip { 
          position: absolute; 
          width: 5px; 
          height: 5px; 
          border-radius: 50%; 
          background: var(--emerald); 
          box-shadow: 0 0 5px var(--emerald-glow); 
        }
        .blip-red { background: #ef4444; box-shadow: 0 0 5px rgba(239, 68, 68, 0.35); }
        .b1 { top: 30%; left: 60%; } 
        .b2 { top: 70%; left: 40%; } 
        .b3 { top: 40%; left: 30%; }
        
        .radar-telemetry { 
          font-size: 0.65rem; 
          letter-spacing: 2.5px; 
          font-weight: 700; 
          text-align: center;
        }

        .contact-terminal { padding: 0; overflow: hidden; border-color: var(--border-dim); }
        
        .terminal-header { 
          padding: 0.9rem 1.6rem; 
          background: #111; 
          font-size: 0.65rem; 
          color: var(--yellow); 
          border-bottom: 1px solid var(--border-dim); 
          font-weight: 800; 
        }
        
        .terminal-body { padding: 2.5rem 2rem; }
        
        .operator-id {
          margin-bottom: 2.2rem;
          font-size: 0.8rem;
          font-weight: 700;
        }
        
        .channel-list { display: flex; flex-direction: column; gap: 1.2rem; }
        
        .chan-btn { 
          display: flex; 
          align-items: center; 
          gap: 1.3rem; 
          padding: 1rem; 
          text-decoration: none; 
          color: #fff; 
          transition: border-color 0.3s ease, background 0.3s ease; 
          border-color: rgba(255,255,255,0.04); 
        }
        .chan-btn:hover { 
          border-color: rgba(5, 150, 105, 0.35); 
          background: rgba(5, 150, 105, 0.04); 
        }
        
        .chan-text { display: flex; flex-direction: column; gap: 0.25rem; }
        .chan-proto { font-size: 0.55rem; opacity: 0.38; letter-spacing: 2px; }
        .chan-val { font-size: 0.88rem; font-weight: 700; }
        
        .social-row { display: flex; gap: 1.2rem; }
        .soc-link { 
          flex: 1; 
          display: flex; 
          justify-content: center; 
          padding: 0.9rem; 
          color: var(--text-dim); 
          transition: color 0.3s ease, border-color 0.3s ease, background 0.3s ease; 
          border-color: rgba(255,255,255,0.04); 
          text-decoration: none;
        }
        .soc-link:hover { 
          color: var(--emerald); 
          border-color: var(--emerald); 
          background: rgba(5, 150, 105, 0.04); 
        }
        
        .terminal-footer { 
          padding: 0.9rem; 
          text-align: center; 
          border-top: 1px solid var(--border-dim); 
          font-size: 0.6rem; 
          letter-spacing: 2.5px; 
          opacity: 0.55; 
        }

        .active-green-mode .highlight { color: var(--emerald); }
        .glow-text-green { 
          text-shadow: 0 0 6px var(--emerald-glow); 
          color: var(--emerald) !important; 
        }

        @media (max-width: 1024px) { 
          .uplink-grid { grid-template-columns: 1fr; }
          .radar-base { width: 220px; height: 220px; }
          .radar-station { padding: 2.5rem; }
        }
      `}</style>
    </div>
  );
};

export default Uplink;