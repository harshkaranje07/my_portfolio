import React, { useEffect, useRef, useMemo, useCallback } from 'react';
import { motion, useMotionValue } from 'framer-motion';

// Pure SVG drone icon — no Framer Motion animation on propellers (use CSS instead)
const DroneIcon = React.memo(({ alert = false, solidGreen = false, size = 46, color = "var(--yellow)" }) => {
  const finalColor = solidGreen ? "var(--emerald)" : (alert ? "var(--red-alert)" : color);
  
  return (
    <svg width={size} height={size} viewBox="0 0 100 100" fill="none" style={{ filter: `drop-shadow(0 0 10px ${finalColor})` }}>
      {/* Central Tactical Core */}
      <rect x="42" y="38" width="16" height="24" rx="2" fill="#050505" stroke={finalColor} strokeWidth="1.5" />
      <rect x="46" y="44" width="8" height="12" fill={finalColor} opacity="0.1" />
      
      {/* Aerodynamic Arms */}
      <line x1="42" y1="42" x2="10" y2="10" stroke={finalColor} strokeWidth="3.5" strokeLinecap="round" />
      <line x1="58" y1="42" x2="90" y2="10" stroke={finalColor} strokeWidth="3.5" strokeLinecap="round" />
      <line x1="42" y1="58" x2="10" y2="90" stroke={finalColor} strokeWidth="3.5" strokeLinecap="round" />
      <line x1="58" y1="58" x2="90" y2="90" stroke={finalColor} strokeWidth="3.5" strokeLinecap="round" />

      {/* Propeller Units — CSS animated, not Framer */}
      {[[10,10],[90,10],[10,90],[90,90]].map(([x, y]) => (
        <g key={`${x}-${y}`}>
          <circle cx={x} cy={y} r="8" fill="#000" stroke={finalColor} strokeWidth="1" />
          <line 
            x1={x-10} y1={y} x2={x+10} y2={y}
            stroke={finalColor} 
            strokeWidth="0.8"
            className="prop-spin"
            style={{ transformOrigin: `${x}px ${y}px` }}
          />
        </g>
      ))}

      {/* Tactical Status LEDs */}
      <circle cx="45" cy="42" r="1.5" fill="#10b981" opacity="0.7" />
      <circle cx="55" cy="42" r="1.5" fill={alert ? "#ef4444" : "#10b981"} opacity="0.7" />
    </svg>
  );
});

DroneIcon.displayName = 'DroneIcon';

const Drone = ({ activeTab, isHomeZone, isOffline }) => {
  const isPDFOpenRef = useRef(false);
  const isAlertRef = useRef(false);
  const rotationRef = useRef(0);
  const clickTimeoutRef = useRef(null);
  
  // Motion values — no state, no re-renders
  const mouseX = useMotionValue(typeof window !== 'undefined' ? window.innerWidth / 2 : 0);
  const mouseY = useMotionValue(typeof window !== 'undefined' ? window.innerHeight / 2 : 0);
  const smoothX = useMotionValue(typeof window !== 'undefined' ? window.innerWidth / 2 : 0);
  const smoothY = useMotionValue(typeof window !== 'undefined' ? window.innerHeight / 2 : 0);
  const rotation = useMotionValue(0);
  const clickScale = useMotionValue(1);
  
  const lastX = useRef(typeof window !== 'undefined' ? window.innerWidth / 2 : 0);
  const lastY = useRef(typeof window !== 'undefined' ? window.innerHeight / 2 : 0);
  
  // Refs for DOM elements to avoid re-renders
  const labelRef = useRef(null);
  const containerRef = useRef(null);

  // Single unified animation loop — LERP position + rotation + label update
  useEffect(() => {
    let animationFrameId;
    let frameCount = 0;
    
    const loop = () => {
      const currentX = smoothX.get();
      const currentY = smoothY.get();
      const targetX = mouseX.get();
      const targetY = mouseY.get();
      
      // LERP with 0.14 factor for faster cinematic glide
      const nextX = currentX + (targetX - currentX) * 0.14;
      const nextY = currentY + (targetY - currentY) * 0.14;
      
      smoothX.set(nextX);
      smoothY.set(nextY);
      
      // Update label text every 6th frame (performance)
      frameCount++;
      if (frameCount % 6 === 0 && labelRef.current) {
        if (isHomeZone) {
          labelRef.current.textContent = "AIRSPACE_LOCKED // ACTIVE";
        } else {
          labelRef.current.textContent = `LAT: ${nextX.toFixed(1)} // LNG: ${nextY.toFixed(1)}`;
        }
      }
      
      animationFrameId = requestAnimationFrame(loop);
    };
    
    animationFrameId = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(animationFrameId);
  }, [mouseX, mouseY, smoothX, smoothY, isHomeZone]);

  // Mouse tracking + rotation — rAF throttled
  useEffect(() => {
    let rafId = null;
    let lastEvent = null;

    const processMove = () => {
      if (!lastEvent) return;
      const { clientX, clientY, target } = lastEvent;
      
      mouseX.set(clientX);
      mouseY.set(clientY);
      
      const dx = clientX - lastX.current;
      const dy = clientY - lastY.current;
      
      if (Math.abs(dx) > 0.5 || Math.abs(dy) > 0.5) {
        const targetAngle = Math.atan2(dy, dx) * (180 / Math.PI) + 90;
        let current = rotationRef.current;
        let diff = targetAngle - current;
        while (diff < -180) diff += 360;
        while (diff > 180) diff -= 360;
        const newRotation = current + diff * 0.4;
        rotationRef.current = newRotation;
        rotation.set(newRotation);
      }
      
      lastX.current = clientX;
      lastY.current = clientY;

      // Alert detection — only check if target has closest method
      if (target && target.closest) {
        isAlertRef.current = !!target.closest('button, a, .interest-card, .nav-btn, .blueprint-card, .tech-card, .chan-btn');
      }
      
      rafId = null;
    };

    const handleMove = (e) => {
      lastEvent = { clientX: e.clientX, clientY: e.clientY, target: e.target };
      if (!rafId) {
        rafId = requestAnimationFrame(processMove);
      }
    };

    const handleClick = () => {
      if (isOffline) return;
      // Pulse effect via motion value
      clickScale.set(0.5);
      if (clickTimeoutRef.current) clearTimeout(clickTimeoutRef.current);
      clickTimeoutRef.current = setTimeout(() => clickScale.set(1), 300);
    };

    // PDF state observer
    const checkPDFState = () => {
      isPDFOpenRef.current = document.body.classList.contains('pdf-open');
    };
    const observer = new MutationObserver(checkPDFState);
    observer.observe(document.body, { attributes: true, attributeFilter: ['class'] });

    window.addEventListener('mousemove', handleMove, { passive: true });
    window.addEventListener('mousedown', handleClick);
    
    return () => {
      window.removeEventListener('mousemove', handleMove);
      window.removeEventListener('mousedown', handleClick);
      observer.disconnect();
      if (rafId) cancelAnimationFrame(rafId);
      if (clickTimeoutRef.current) clearTimeout(clickTimeoutRef.current);
    };
  }, [mouseX, mouseY, rotation, clickScale, isOffline]);

  if (isOffline) return null;

  const labelColor = isHomeZone ? 'var(--emerald)' : 'var(--yellow)';

  return (
    <>
      <motion.div
        ref={containerRef}
        style={{
          position: 'fixed',
          left: 0,
          top: 0,
          x: smoothX,
          y: smoothY,
          translateX: '-50%',
          translateY: '-50%',
          zIndex: 99999,
          pointerEvents: 'none',
          willChange: 'transform',
        }}
      >
        <motion.div style={{ rotate: rotation }}>
          <DroneIcon 
            alert={isAlertRef.current} 
            solidGreen={isHomeZone} 
            size={46} 
            color={isHomeZone ? "var(--emerald)" : "var(--yellow)"} 
          />
        </motion.div>

        <div 
          ref={labelRef}
          className="mono" 
          style={{
            position: 'absolute',
            top: 55,
            left: 36,
            fontSize: '8px',
            color: labelColor,
            whiteSpace: 'nowrap',
            backgroundColor: 'rgba(0,0,0,0.9)',
            padding: '2px 8px',
            border: `1px solid ${isHomeZone ? 'var(--emerald-glow)' : 'rgba(255,255,255,0.08)'}`,
            boxShadow: isHomeZone ? '0 0 12px var(--emerald-glow)' : 'none',
            opacity: 0.85,
            willChange: 'contents',
          }}
        >
          {isHomeZone ? "AIRSPACE_LOCKED // ACTIVE" : "INITIALIZING..."}
        </div>
      </motion.div>

      <style jsx>{`
        .prop-spin {
          animation: propRotate 0.08s linear infinite;
        }
        @keyframes propRotate {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      `}</style>
    </>
  );
};

export default React.memo(Drone);