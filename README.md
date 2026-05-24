# AEROSPACE COMMAND HUD INTERFACE
> **Tactical Engineering Console & Interactive 3D Flight Systems Portfolio**

[![Vercel Deployment](https://img.shields.io/badge/Vercel-Deployed-black?style=for-the-badge&logo=vercel)](https://my-portfolio-three-gray-69.vercel.app)
[![React Version](https://img.shields.io/badge/React-18.2.0-blue?style=for-the-badge&logo=react)](https://react.dev)
[![Vite Powered](https://img.shields.io/badge/Vite-5.4-purple?style=for-the-badge&logo=vite)](https://vitejs.dev)
[![Graphics](https://img.shields.io/badge/Three.js-R3F-orange?style=for-the-badge&logo=three.js)](https://threejs.org)

An elite, high-fidelity aerospace engineering command interface that acts as a production-grade portfolio. Features interactive 3D flight system hardware simulations, real-time Intel Records (ISR) telemetry, digital target acquisition grids, and secure document decryption modules.

---

## ⚡ SYSTEM OVERVIEW
```text
[SYSTEM_INIT] .......................... OK
[3D_RENDERER] (Three.js / WebGL) ....... ACTIVE (60 FPS)
[INTEL_FEEDS] (6 HD Cam Channels) ...... CALIBRATED
[MISSION_LOG] (Tactical Timeline) ...... ENCRYPTED [AES_256]
[NETWORK_LINK] ......................... SECURE
```

---

## 🚀 KEY SYSTEMS & OPERATIONAL MODULES

### 1. 🕹️ Dashboard & 3D Flight Hardware Simulation (`src/components/Drone.jsx`)
* **Core:** Features an interactive, low-latency 3D drone hardware model built with **React Three Fiber (R3F)** and **Three.js**.
* **Interactions:** The aircraft model dynamically pitches, rolls, and yaws relative to mouse movements across the screen, functioning as a real-time responsive aerodynamic telemetry visualizer.
* **Physics HUD:** Bordered by vertical scale scrolls, dynamic coordinate trackers, and target acquisition bracket locks.

### 2. 📡 Tactical ISR Intel Feeds (`src/components/Intel.jsx`)
* **Visual Aesthetic:** Consists of 6 live tactical feeds (`cam-01` to `cam-06`) loading dynamic JPG/PNG/WebP captures.
* **Aero-Sensor Filters:** Custom CSS pipeline displays feeds in high-contrast cinematic grayscale by default. Hovering over a channel initiates optical synchronization, fading smoothly to rich full color.
* **Telemetry Lightbox Overlay:** Clicking a feed launches a dedicated full-screen React portal lightbox. Displays active coordinate overlays, latency metrics (`12ms`), satellite link status, and targeting crosshairs.

### 3. 📂 Mission Log & Decryption Modules (`src/components/Timeline.jsx`)
* **Mission Log:** A sleek vertical grid mapping aerospace milestones, flight logs, and project histories.
* **Usability:** Integrates dynamic state-controlled `body.modal-open` class toggling to seamlessly swap custom drone cursor reticles back to standard mouse pointers for optimal click-to-close interactions.

### 4. 🎛️ Unified Command Styling (`src/styles/hud.css`)
* Standardizes responsive font sizing, glow variables, cybernetic corner indicators, dynamic vertical tape rolls, and optimized linear scanline overlays utilizing GPU-accelerated transforms (`will-change: transform`).

---

## 🛠️ LOCAL CONFIGURATION & DEPLOYMENT

### System Dependencies
Verify that your local system has [Node.js](https://nodejs.org/) installed (V18+ recommended).

```bash
# Clone the repository
git clone https://github.com/harshkaranje07/my_portfolio.git

# Navigate to the workspace directory
cd my_portfolio

# Install core dependencies
npm install

# Start local telemetry server (Vite dev server)
npm run dev
```

### Production Build compilation
Ensure all assets and chunked routes build cleanly for deployment:
```bash
npm run build
```

---

## 📂 DIRECTORY STRUCTURE
```text
portfolio/
 ├── public/
 │    ├── intel/             # Camera sensor captures (intel1 - intel6)
 │    ├── slides/            # Telemetry slides & UAV PDFs
 │    └── models/            # 3D Drone assets (gltf/glb)
 ├── src/
 │    ├── components/        # Individual HUD system panels (Intel, Drone, Timeline)
 │    ├── styles/            # Core HUD color and animation palettes (hud.css)
 │    ├── App.jsx            # System controller and coordinate tracker
 │    └── main.jsx           # Render initiator
 ├── vercel.json             # Single Page Application (SPA) routing & asset caching headers
 └── vite.config.js          # Dynamic bundler configuration with manual chunking
```

---

## 🛰️ DEPLOYMENT (VERCEL READY)
This repository is configured with a custom `vercel.json` routing matrix ensuring:
* Complete single-page React router rewrites.
* Production caching policies (`Cache-Control: public, max-age=31536000, immutable`) for blistering fast page load speeds on live CDN nodes.

---
**OP_HK_07 // SECURE COMMUNICATION PROTOCOL TERMINATED // PORTFOLIO LIVE**
