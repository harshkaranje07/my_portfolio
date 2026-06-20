import React, { useEffect, useRef, useCallback } from 'react';

// Pure SVG Drone Icon — no Framer, renders statically
const DroneIcon = React.memo(({ size = 44, color = '#FACC15', isAlert = false }) => {
  const c = isAlert ? '#ef4444' : color;
  return (
    <svg width={size} height={size} viewBox="0 0 100 100" fill="none"
      style={{ filter: `drop-shadow(0 0 8px ${c}) drop-shadow(0 0 20px ${c}33)`, display: 'block' }}>
      {/* Central Body */}
      <rect x="43" y="38" width="14" height="24" rx="2" fill="#050505" stroke={c} strokeWidth="1.5" />
      <rect x="47" y="44" width="6" height="12" fill={c} opacity="0.15" />
      {/* Arms */}
      <line x1="43" y1="43" x2="12" y2="12" stroke={c} strokeWidth="3" strokeLinecap="round" />
      <line x1="57" y1="43" x2="88" y2="12" stroke={c} strokeWidth="3" strokeLinecap="round" />
      <line x1="43" y1="57" x2="12" y2="88" stroke={c} strokeWidth="3" strokeLinecap="round" />
      <line x1="57" y1="57" x2="88" y2="88" stroke={c} strokeWidth="3" strokeLinecap="round" />
      {/* Motor hubs */}
      {[[12, 12], [88, 12], [12, 88], [88, 88]].map(([x, y]) => (
        <g key={`${x}-${y}`}>
          <circle cx={x} cy={y} r="7" fill="#000" stroke={c} strokeWidth="1" />
          <line x1={x - 9} y1={y} x2={x + 9} y2={y}
            stroke={c} strokeWidth="0.9" className="prop-spin"
            style={{ transformOrigin: `${x}px ${y}px` }} />
        </g>
      ))}
      {/* Status LEDs */}
      <circle cx="46" cy="43" r="1.5" fill="#10b981" opacity="0.8" />
      <circle cx="54" cy="43" r="1.5" fill={isAlert ? '#ef4444' : '#10b981'} opacity="0.8" />
    </svg>
  );
});
DroneIcon.displayName = 'DroneIcon';

const Drone = ({ isOffline }) => {
  const containerRef = useRef(null);
  const labelRef = useRef(null);

  // Pure rAF state — no React re-renders for position
  const posRef = useRef({ x: window.innerWidth / 2, y: window.innerHeight / 2 });
  const targetRef = useRef({ x: window.innerWidth / 2, y: window.innerHeight / 2 });
  const rotRef = useRef(0);
  const prevPosRef = useRef({ x: window.innerWidth / 2, y: window.innerHeight / 2 });
  const rafRef = useRef(null);

  const animate = useCallback(() => {
    const pos = posRef.current;
    const tgt = targetRef.current;

    // Smooth LERP — 0.12 feels premium and fluid without lag
    const lerpFactor = 0.12;
    pos.x += (tgt.x - pos.x) * lerpFactor;
    pos.y += (tgt.y - pos.y) * lerpFactor;

    // Rotation based on movement direction
    const dx = pos.x - prevPosRef.current.x;
    const dy = pos.y - prevPosRef.current.y;
    if (Math.abs(dx) > 0.2 || Math.abs(dy) > 0.2) {
      const targetAngle = Math.atan2(dy, dx) * (180 / Math.PI) + 90;
      let diff = targetAngle - rotRef.current;
      while (diff < -180) diff += 360;
      while (diff > 180) diff -= 360;
      rotRef.current += diff * 0.1;
    }
    prevPosRef.current = { x: pos.x, y: pos.y };

    // Direct DOM manipulation — zero React overhead
    if (containerRef.current) {
      containerRef.current.style.transform =
        `translate(${pos.x - 22}px, ${pos.y - 22}px)`;
      containerRef.current.children[0].style.transform =
        `rotate(${rotRef.current}deg)`;
    }

    rafRef.current = requestAnimationFrame(animate);
  }, []);

  useEffect(() => {
    if (isOffline) return;

    const onMouseMove = (e) => {
      targetRef.current = { x: e.clientX, y: e.clientY };
    };

    window.addEventListener('mousemove', onMouseMove, { passive: true });
    rafRef.current = requestAnimationFrame(animate);

    return () => {
      window.removeEventListener('mousemove', onMouseMove);
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [isOffline, animate]);

  // Don't render on touch devices or when offline
  const isTouchDevice = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
  if (isOffline || isTouchDevice) return null;

  return (
    <>
      <div
        ref={containerRef}
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          zIndex: 99999,
          pointerEvents: 'none',
          willChange: 'transform',
        }}
      >
        <div style={{ willChange: 'transform' }}>
          <DroneIcon size={44} color="#FACC15" />
        </div>
      </div>

      <style>{`
        .prop-spin {
          animation: propRotate 0.06s linear infinite;
        }
        @keyframes propRotate {
          from { transform: rotate(0deg); }
          to   { transform: rotate(360deg); }
        }
      `}</style>
    </>
  );
};

export default React.memo(Drone);
