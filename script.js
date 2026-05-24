
document.addEventListener('DOMContentLoaded', () => {
    
    // CACHED DOM ELEMENTS
    const body = document.body;
    const bootSequence = document.getElementById('boot-sequence');
    const cursor = document.getElementById("cursor-reticle");
    const reticleCircle = cursor.querySelector('.reticle-circle');
    const curXLabel = document.getElementById('cur-x');
    const curYLabel = document.getElementById('cur-y');
    const telPitch = document.getElementById('tel-pitch');
    const telRoll = document.getElementById('tel-roll');
    const telYaw = document.getElementById('tel-yaw');
    const droneContainer = document.getElementById('bg-drone-container');
    const droneModel = document.getElementById('bg-drone');
    const radar = document.getElementById('main-radar');
    const clockEl = document.getElementById('clock');
    const sigEl = document.querySelector('.pulse-text');

    const navModules = document.querySelectorAll('.nav-module');
    const sections = document.querySelectorAll('.tab-content');
    
    // SELECTOR CACHES
    const interactiveSelector = 'button, a, .nav-module, .log-entry-v6, .bp-card, .file-entry, .channel, .rank-item, .f-access, .dossier-panel, .isr-stream';
    const glowSelector = '.hero-main-title, .panel-title, h4, .r-val, .highlight, .rank-num, .ch-val';
    let glowElements = document.querySelectorAll(glowSelector);

    // STATE
    let mouseX = window.innerWidth / 2, mouseY = window.innerHeight / 2;
    let curX = mouseX, curY = mouseY;
    let isDragging = false;
    let isLocked = false;
    let dragStartX = 0;
    let baseYaw = 0;
    let currentYaw = 0;
    let dronePos = { x: mouseX, y: mouseY };
    let tick = 0;
    let shiftManeuver = 0;
    let glowThrottle = 0;

    // BOOT SEQUENCE CLEANUP
    setTimeout(() => {
        body.classList.remove('booting');
        setTimeout(() => { if(bootSequence) bootSequence.remove(); }, 1000);
    }, 2400);

    // MOUSE TRACKING
    document.addEventListener("mousedown", e => {
        if (e.target.closest(interactiveSelector)) return;
        isDragging = true;
        dragStartX = e.clientX;
        reticleCircle.style.transform = 'scale(1.25)';
    });

    document.addEventListener("mouseup", () => {
        isDragging = false;
        reticleCircle.style.transform = 'scale(1)';
        baseYaw = currentYaw;
    });

    // DRONE CLICK FOCUS
    droneContainer.addEventListener("click", () => {
        isLocked = !isLocked;
        if (isLocked) {
            body.classList.add('drone-locked');
            reticleCircle.style.borderColor = 'var(--azure)';
        } else {
            body.classList.remove('drone-locked');
            reticleCircle.style.borderColor = 'var(--yellow)';
        }
    });

    document.addEventListener("mousemove", e => {
        mouseX = e.clientX;
        mouseY = e.clientY;
        
        if (isDragging) {
            const deltaX = e.clientX - dragStartX;
            currentYaw = baseYaw + (deltaX * 0.45);
        }

        // TARGETING DETECTION
        const targetable = e.target.closest(interactiveSelector);
        if (targetable) {
            if (!body.classList.contains('targeting')) {
                body.classList.add('targeting');
                if (!isLocked) reticleCircle.style.borderColor = '#fff';
            }
        } else {
            if (body.classList.contains('targeting')) {
                body.classList.remove('targeting');
                if (!isLocked) reticleCircle.style.borderColor = 'var(--yellow)';
            }
        }
    }, { passive: true });

    // TAB MANAGEMENT
    navModules.forEach(mod => {
        mod.addEventListener('click', () => {
            const targetId = mod.getAttribute('data-target');
            if (mod.classList.contains('active')) return;
            
            navModules.forEach(m => m.classList.remove('active'));
            mod.classList.add('active');
            
            sections.forEach(sec => {
                if (sec.id === targetId) {
                    sec.classList.add('active');
                } else {
                    sec.classList.remove('active');
                }
            });

            glowElements = document.querySelectorAll(glowSelector);
            shiftManeuver = 1.0;
            body.style.filter = 'brightness(1.5) contrast(1.15)';
            setTimeout(() => body.style.filter = 'none', 150);
        });
    });

    // ARSENAL & DOSSIER INTERACTIONS
    document.addEventListener("click", e => {
        const bpCard = e.target.closest('.blueprint-expandable');
        if (bpCard) bpCard.classList.toggle('expanded');

        const dossPanel = e.target.closest('.dossier-panel');
        if (dossPanel) {
            dossPanel.style.borderColor = 'var(--yellow)';
            setTimeout(() => dossPanel.style.borderColor = '', 800);
        }
    });

    // UNIFIED ANIMATION LOOP (High Perf)
    function unifiedLoop() {
        tick += 0.085;
        glowThrottle++;

        // Cursor
        curX += (mouseX - curX) * 0.35;
        curY += (mouseY - curY) * 0.35;
        cursor.style.transform = `translate3d(${curX}px, ${curY}px, 0)`;

        // HUD Text (Low Freq Update)
        if (tick % 5 < 0.1) {
            const mapX = Math.round((mouseX / window.innerWidth) * 9999);
            const mapY = Math.round((mouseY / window.innerHeight) * 9999);
            if(curXLabel) curXLabel.textContent = mapX.toString().padStart(4, '0');
            if(curYLabel) curYLabel.textContent = mapY.toString().padStart(4, '0');
        }

        // Drone Physics
        if (!isDragging && currentYaw !== 0) {
            currentYaw *= 0.95; 
            if (Math.abs(currentYaw) < 0.1) currentYaw = 0;
            baseYaw = currentYaw;
        }

        dronePos.x += (mouseX - dronePos.x) * 0.09;
        dronePos.y += (mouseY - dronePos.y) * 0.09;
        
        const vx = (mouseX - dronePos.x) * 0.06;
        const vy = (mouseY - dronePos.y) * 0.06;
        
        let tiltX = Math.max(-22, Math.min(22, vy));
        let tiltY = Math.max(-22, Math.min(22, -vx));
        let baseScale = isLocked ? 1.35 : 1.0;

        if (shiftManeuver > 0) {
            tiltX -= 720 * Math.sin(shiftManeuver * Math.PI);
            baseScale += 0.35 * Math.sin(shiftManeuver * Math.PI);
            shiftManeuver -= 0.06;
        }

        const hX = Math.sin(tick * 1.6) * 7;
        const hY = Math.cos(tick * 1.3) * 7;

        droneContainer.style.transform = `translate3d(calc(-50% + ${dronePos.x - window.innerWidth/2 + hX}px), calc(-50% + ${dronePos.y - window.innerHeight/2 + hY}px), 0) scale(${baseScale})`;
        droneModel.style.transform = `rotateX(${tiltX}deg) rotateY(${tiltY}deg) rotateZ(${currentYaw}deg)`;

        // Radar Tracking
        if (radar) {
            const radarRect = radar.getBoundingClientRect();
            const droneCenterX = dronePos.x;
            const droneCenterY = dronePos.y;
            
            const isInside = (
                droneCenterX >= radarRect.left && 
                droneCenterX <= radarRect.right &&
                droneCenterY >= radarRect.top &&
                droneCenterY <= radarRect.bottom
            );

            if (isInside) {
                if (!radar.classList.contains('active')) {
                    radar.classList.add('active');
                    radar.querySelector('.radar-coords').textContent = `LOCK: ${Math.round(droneCenterX)},${Math.round(droneCenterY)}`;
                }
            } else {
                if (radar.classList.contains('active')) {
                    radar.classList.remove('active');
                    radar.querySelector('.radar-coords').textContent = `SCANNING...`;
                }
            }
        }

        // Telemetry Update
        if(telPitch) telPitch.textContent = `${tiltX.toFixed(1)}°`;
        if(telRoll) telRoll.textContent = `${tiltY.toFixed(1)}°`;
        if(telYaw) telYaw.textContent = `${(currentYaw % 360).toFixed(1)}°`;

        // Throttled Glow (Perf optimization)
        if (glowThrottle >= 4) {
            glowThrottle = 0;
            glowElements.forEach(el => {
                const rect = el.getBoundingClientRect();
                const cx = rect.left + rect.width / 2;
                const cy = rect.top + rect.height / 2;
                const dist = Math.hypot(mouseX - cx, mouseY - cy);
                
                if (dist < 180) {
                    const intensity = Math.max(0, 1 - dist / 180);
                    el.style.textShadow = `0 0 ${25 * intensity}px var(--yellow-glow)`;
                } else {
                    el.style.textShadow = 'none';
                }
            });
        }

        requestAnimationFrame(unifiedLoop);
    }

    requestAnimationFrame(unifiedLoop);

    // LOW PRIORITY SYNC
    setInterval(() => {
        const now = new Date();
        if(clockEl) clockEl.textContent = now.toTimeString().split(' ')[0] + " Z";
        
        if (sigEl) {
            const glitch = Math.random() > 0.98;
            sigEl.style.opacity = glitch ? 0.3 : 1;
            sigEl.textContent = glitch ? "LOST_SYNC" : "CRYPTO_OK";
        }
    }, 1000);
});
