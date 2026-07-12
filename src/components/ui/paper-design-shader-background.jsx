import React from "react";
import { GrainGradient } from "@paper-design/shaders-react";
import ErrorBoundary from "../ErrorBoundary";

function GradientBackgroundInner({ 
  colors = ["#FACC15", "#D4A017", "#FFE08A", "#111111", "#000000"],
  blur = "0px",
  opacity = 1,
  speed = 1,
  softness = 0.76,
  intensity = 0.45,
  noise = 0.15,
  colorBack = "#000000"
}) {
  return (
    <div style={{ 
      position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh', 
      zIndex: -1, overflow: 'hidden', pointerEvents: 'none',
      filter: `blur(${blur})`,
      transition: 'filter 1s ease-in-out, opacity 1s ease-in-out',
      opacity: opacity
    }}>
      <GrainGradient
        style={{ height: "100%", width: "100%", opacity: 1 }}
        colorBack={colorBack}
        softness={softness}
        intensity={intensity}
        noise={noise}
        shape="corners"
        offsetX={0}
        offsetY={0}
        scale={1}
        rotation={0}
        speed={speed}
        colors={colors}
      />
    </div>
  );
}

export function GradientBackground(props) {
  return (
    <ErrorBoundary fallback={<div style={{ position: 'fixed', inset: 0, background: '#0a0a0a', zIndex: -1 }} />}>
      <GradientBackgroundInner {...props} />
    </ErrorBoundary>
  );
}
