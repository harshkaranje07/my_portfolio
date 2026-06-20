import React, { useRef, useEffect } from 'react';

// Shader source — Black/Dark Gray/Yellow palette
const SHADER_SRC = `#version 300 es
precision highp float;
out vec4 O;
uniform vec2 resolution;
uniform float time;
#define FC gl_FragCoord.xy
#define T time
#define R resolution
#define MN min(R.x,R.y)

float rnd(vec2 p) {
  p=fract(p*vec2(12.9898,78.233));
  p+=dot(p,p+34.56);
  return fract(p.x*p.y);
}
float noise(in vec2 p) {
  vec2 i=floor(p),f=fract(p),u=f*f*(3.-2.*f);
  float a=rnd(i),b=rnd(i+vec2(1,0)),c=rnd(i+vec2(0,1)),d=rnd(i+1.);
  return mix(mix(a,b,u.x),mix(c,d,u.x),u.y);
}
float fbm(vec2 p) {
  float t=.0,a=1.;mat2 m=mat2(1.,-.5,.2,1.2);
  for(int i=0;i<5;i++){t+=a*noise(p);p*=2.*m;a*=.5;}
  return t;
}
float clouds(vec2 p){
  float d=1.,t=.0;
  for(float i=.0;i<3.;i++){
    float a=d*fbm(i*10.+p.x*.2+.2*(1.+i)*p.y+d+i*i+p);
    t=mix(t,d,a);d=a;p*=2./(i+1.);
  }
  return t;
}
void main(void){
  vec2 uv=(FC-.5*R)/MN,st=uv*vec2(2,1);
  vec3 col=vec3(0);
  float bg=clouds(vec2(st.x+T*.8,-st.y)); // Faster movement
  
  // Radial fade for depth (brighter center, darker edges)
  float vignette = smoothstep(1.5, 0.0, length(uv));
  
  // Premium Aerospace Atmosphere (Warm Gold + Soft Amber haze over Deep Black)
  // Base haze combines dark charcoal and soft illuminated gold
  vec3 haze = vec3(0.04, 0.04, 0.04)*bg + vec3(0.83, 0.63, 0.09)*bg*0.12;
  haze *= vignette; // Fade out at the edges
  
  uv*=0.7-0.2*(sin(T*.3)*.5+.5); // Scale up to reduce dead space
  for(float i=1.;i<12.;i++){
    uv+=.12*cos(i*vec2(.1+.01*i,.8)+i*i+T*.8+.1*uv.x); // Faster sweep
    vec2 p=uv;
    float d=length(p);
    
    // Core motion streaks (#FACC15)
    vec3 streakColor = vec3(0.98, 0.8, 0.08);
    col+=.0018/d*(cos(sin(i)*vec3(1.0,1.0,1.0))+1.)*streakColor; 
    
    float b=noise(i+p+bg*1.731);
    
    // Soft amber bloom scattered into the fog near the energy trails
    col+=.0025*b/length(max(p,vec2(b*p.x*.02,p.y))) * vec3(1.0, 0.88, 0.54);
    
    // Mix the streak energy with the illuminated atmosphere to create depth
    col=mix(col, haze, d);
  }
  O=vec4(col,1);
}`;

const VERTEX_SRC = `#version 300 es
precision highp float;
in vec4 position;
void main(){gl_Position=position;}`;

import ErrorBoundary from '../ErrorBoundary';

const AnimatedShaderBackgroundInner = () => {
  const canvasRef = useRef(null);
  const stateRef = useRef({
    gl: null, program: null, buffer: null,
    raf: null, uniforms: {},
    w: 0, h: 0, dpr: 1,
  });

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const s = stateRef.current;

    // ── Init WebGL ──────────────────────────────────────────────
    const gl = canvas.getContext('webgl2');
    if (!gl) return;
    s.gl = gl;

    const compile = (type, src) => {
      const sh = gl.createShader(type);
      gl.shaderSource(sh, src);
      gl.compileShader(sh);
      if (!gl.getShaderParameter(sh, gl.COMPILE_STATUS))
        console.error('Shader error:', gl.getShaderInfoLog(sh));
      return sh;
    };

    const vs = compile(gl.VERTEX_SHADER, VERTEX_SRC);
    const fs = compile(gl.FRAGMENT_SHADER, SHADER_SRC);
    const prog = gl.createProgram();
    gl.attachShader(prog, vs); gl.attachShader(prog, fs);
    gl.linkProgram(prog);
    s.program = prog;

    // Buffer
    s.buffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, s.buffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1,1,-1,-1,1,1,1,-1]), gl.STATIC_DRAW);
    const pos = gl.getAttribLocation(prog, 'position');
    gl.enableVertexAttribArray(pos);
    gl.vertexAttribPointer(pos, 2, gl.FLOAT, false, 0, 0);

    // Uniforms
    s.uniforms = {
      resolution: gl.getUniformLocation(prog, 'resolution'),
      time:       gl.getUniformLocation(prog, 'time'),
      move:       gl.getUniformLocation(prog, 'move'),
      touch:      gl.getUniformLocation(prog, 'touch'),
      pointerCount: gl.getUniformLocation(prog, 'pointerCount'),
      pointers:   gl.getUniformLocation(prog, 'pointers'),
    };

    // ── Resize ──────────────────────────────────────────────────
    const resize = () => {
      const dpr = Math.max(1, 0.5 * window.devicePixelRatio);
      s.dpr = dpr;
      // Fill the full viewport — canvas is position:fixed so we use window dims
      s.w = window.innerWidth;
      s.h = window.innerHeight;
      canvas.width  = s.w * dpr;
      canvas.height = s.h * dpr;
      gl.viewport(0, 0, canvas.width, canvas.height);
    };
    resize();
    window.addEventListener('resize', resize);

    // ── Render loop ─────────────────────────────────────────────
    const loop = (now) => {
      const { gl: g, program: p, uniforms: u, w, h } = s;
      if (!p) return;
      g.clearColor(0,0,0,1);
      g.clear(g.COLOR_BUFFER_BIT);
      g.useProgram(p);
      g.bindBuffer(g.ARRAY_BUFFER, s.buffer);
      g.uniform2f(u.resolution, w, h);
      g.uniform1f(u.time, now * 1e-3);
      g.uniform2f(u.move, 0, 0);
      g.uniform2f(u.touch, 0, 0);
      g.uniform1i(u.pointerCount, 0);
      g.uniform2fv(u.pointers, [0, 0]);
      g.drawArrays(g.TRIANGLE_STRIP, 0, 4);
      s.raf = requestAnimationFrame(loop);
    };
    s.raf = requestAnimationFrame(loop);

    return () => {
      window.removeEventListener('resize', resize);
      if (s.raf) cancelAnimationFrame(s.raf);
      if (s.program) {
        gl.deleteProgram(s.program);
        s.program = null;
      }
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100vw',
        height: '100vh',
        display: 'block',
        background: '#000',
        opacity: 0.72,
        pointerEvents: 'none',
        zIndex: 0,
      }}
    />
  );
};

const AnimatedShaderBackground = () => (
  <ErrorBoundary>
    <AnimatedShaderBackgroundInner />
  </ErrorBoundary>
);

export default AnimatedShaderBackground;
