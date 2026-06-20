import React, { useState, useRef } from 'react';

const Hero = ({ isHomeZone, setActiveTab }) => {
  const [mousePos, setMousePos] = useState({ x: -1000, y: -1000 });
  const sectionRef = useRef(null);

  const handleMouseMove = (e) => {
    if (!sectionRef.current) return;
    const rect = sectionRef.current.getBoundingClientRect();
    setMousePos({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top
    });
  };

  const handleMouseLeave = () => {
    // Move the glow far off screen when mouse leaves
    setMousePos({ x: -1000, y: -1000 });
  };

  const areasOfInterest = [
    'UAV Systems', 'Avionics', 'ROS2', 'ArduPilot',
    'Computer Vision', 'Machine Learning', 'Embedded Systems', 'Jetson Nano',
    'VTOL Platforms', 'Sensor Fusion', 'IoT', 'AI Systems'
  ];

  return (
    <section 
      className="hero-section"
      style={{
        position: 'relative',
        width: '100%',
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '4rem 2rem',
        boxSizing: 'border-box',
        overflow: 'hidden',
      }}
    >
      
      {/* ══ LAYER 1 — Global Background handles this now ══ */}

      {/* ══ LAYER 3 — Centered Content ══ */}
      <div style={{
        position: 'relative', 
        zIndex: 10,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        textAlign: 'center',
        width: '100%',
        maxWidth: '800px',
        margin: '0 auto',
      }}>

        {/* ── Name — the hero element ── */}
        <h1
          className="hero-name"
        >
          HARSHWARDHAN<br />KARANJE
        </h1>

        {/* Role */}
        <h2 className="hero-role">
          Computer Engineering Student
        </h2>

        {/* Description */}
        <p style={{
          fontSize: '1rem',
          lineHeight: 1.85,
          color: 'rgba(255,255,255,0.85)',
          maxWidth: '700px',
          margin: '0 0 3rem 0',
        }}>
          Passionate about UAV Systems, Avionics, Embedded Systems, ROS2, ArduPilot, Computer Vision, Machine Learning, IoT, Jetson Nano, and VTOL Technologies. 
          <br /><br />
          Focused on building intelligent aerospace systems through software, electronics, autonomy, and engineering.
        </p>

        {/* ── Interactive Proximity Container (Interests + Buttons) ── */}
        <div 
          ref={sectionRef}
          onMouseMove={handleMouseMove}
          onMouseLeave={handleMouseLeave}
          style={{ 
            width: '100%', 
            position: 'relative',
            padding: '2rem',
            /* Pass CSS variables to children for proximity effects */
            '--mouse-x': `${mousePos.x}px`,
            '--mouse-y': `${mousePos.y}px`,
          }}
        >
          {/* Localized Proximity Glow Overlay */}
          <div style={{
            position: 'absolute',
            top: 0, left: 0, right: 0, bottom: 0,
            pointerEvents: 'none',
            background: `radial-gradient(circle 350px at var(--mouse-x) var(--mouse-y), rgba(250,204,21,0.15) 0%, rgba(250,204,21,0.02) 40%, transparent 100%)`,
            zIndex: 15,
            mixBlendMode: 'color-dodge',
          }} />

          {/* ── Areas of Interest ── */}
          <div style={{ width: '100%', marginBottom: '3rem', position: 'relative', zIndex: 10 }}>
            <h3 className="hero-interest-title">
              AREAS OF INTEREST
            </h3>
            
            <div style={{
              display: 'flex',
              flexWrap: 'wrap',
              justifyContent: 'center',
              gap: '0.8rem',
              maxWidth: '700px',
              margin: '0 auto'
            }}>
              {areasOfInterest.map((area) => (
                <span key={area} className="interest-card">
                  {area}
                </span>
              ))}
            </div>
          </div>

          {/* ── Buttons ── */}
          <div style={{
            display: 'flex',
            gap: '1.5rem',
            flexWrap: 'wrap',
            justifyContent: 'center',
            position: 'relative',
            zIndex: 10
          }}>
            <button
              className="hero-btn-primary"
              onClick={() => setActiveTab('platforms')}
            >
              VIEW PROJECTS
            </button>
            
            <button
              className="hero-btn-secondary"
              onClick={() => setActiveTab('contact')}
            >
              CONTACT
            </button>
          </div>
        </div>

      </div>

      {/* Global Hero Styles */}
      <style>{`
        .hero-name {
          font-family: var(--font-tech, "Inter", sans-serif);
          font-size: clamp(1.8rem, 6vw, 5.5rem);
          font-weight: 800;
          line-height: 1.05;
          letter-spacing: 0.02em;
          margin: 0 0 1rem 0;
          background: linear-gradient(150deg, #ffffff 0%, #FACC15 55%, #B29400 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
          word-break: break-word;
          position: relative;
        }

        .hero-role {
          font-family: var(--font-tech, monospace);
          font-size: clamp(0.9rem, 1.5vw, 1.2rem);
          font-weight: 400;
          letter-spacing: 4px;
          color: #FACC15;
          margin: 0 0 2rem 0;
          text-transform: uppercase;
          position: relative;
        }

        .hero-interest-title {
          font-family: monospace;
          font-size: 0.85rem;
          color: #FACC15;
          font-weight: bold;
          letter-spacing: 3px;
          margin-bottom: 1.5rem;
          text-transform: uppercase;
          position: relative;
          display: inline-block;
        }

        .interest-card {
          font-family: monospace;
          font-size: 0.7rem;
          letter-spacing: 1px;
          color: rgba(255,255,255,0.9);
          padding: 0.4rem 0.8rem;
          background: rgba(255,255,255,0.03);
          border: 1px solid rgba(255,255,255,0.1);
          text-transform: uppercase;
          transition: all 0.3s cubic-bezier(0.19, 1, 0.22, 1);
          cursor: default;
          position: relative;
          overflow: hidden;
        }

        .interest-card:hover {
          transform: scale(1.05);
          border-color: rgba(250,204,21,0.5);
          color: #FACC15;
          box-shadow: 0 0 15px rgba(250,204,21,0.15);
          background: rgba(250,204,21,0.05);
        }

        .hero-btn-primary {
          font-family: monospace;
          background: rgba(250,204,21,0.12);
          border: 1px solid rgba(250,204,21,0.8);
          color: #FACC15;
          padding: 0.85rem 2.4rem;
          font-size: 0.78rem; 
          letter-spacing: 2.5px;
          cursor: pointer;
          transition: all 0.3s ease;
          text-transform: uppercase;
        }
        
        .hero-btn-primary:hover {
          background: rgba(250,204,21,0.25);
          box-shadow: 0 0 20px rgba(250,204,21,0.2);
          transform: translateY(-2px);
        }

        .hero-btn-secondary {
          font-family: monospace;
          background: transparent;
          border: 1px solid rgba(255,255,255,0.3);
          color: #fff;
          padding: 0.85rem 2.4rem;
          font-size: 0.78rem; 
          letter-spacing: 2.5px;
          cursor: pointer;
          transition: all 0.3s ease;
          text-transform: uppercase;
        }

        .hero-btn-secondary:hover {
          background: rgba(250,204,21,0.05);
          border-color: #FACC15;
          color: #FACC15;
          box-shadow: 0 0 15px rgba(250,204,21,0.1);
          transform: translateY(-2px);
        }
      `}</style>
    </section>
  );
};

export default Hero;
