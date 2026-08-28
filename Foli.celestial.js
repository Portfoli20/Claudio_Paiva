/* Live celestial illustration: black hole in dark mode, white sun in light mode. */
(() => {
    const hero = document.querySelector('.hero');
    if (!hero) return;
    const canvas = document.createElement('canvas');
    canvas.className = 'celestial-canvas';
    canvas.setAttribute('aria-hidden', 'true');
    hero.prepend(canvas);
    const ctx = canvas.getContext('2d');
    const motionReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const state = { x: 0, y: 0, scroll: 0, width: 0, height: 0, ratio: 1 };

    const resize = () => {
        const rect = hero.getBoundingClientRect();
        state.ratio = Math.min(window.devicePixelRatio || 1, 2);
        state.width = rect.width; state.height = rect.height;
        canvas.width = Math.floor(rect.width * state.ratio);
        canvas.height = Math.floor(rect.height * state.ratio);
        canvas.style.width = `${rect.width}px`; canvas.style.height = `${rect.height}px`;
        ctx.setTransform(state.ratio, 0, 0, state.ratio, 0, 0);
    };
    const fillGlow = (x, y, radius, inner, outer) => {
        const glow = ctx.createRadialGradient(x, y, 0, x, y, radius);
        glow.addColorStop(0, inner); glow.addColorStop(1, outer);
        ctx.fillStyle = glow; ctx.beginPath(); ctx.arc(x, y, radius, 0, Math.PI * 2); ctx.fill();
    };
    const drawSun = (cx, cy, time, size) => {
        const pulse = 1 + Math.sin(time * 1.8) * .045;
        ctx.save(); ctx.globalCompositeOperation = 'screen';
        fillGlow(cx, cy, size * 4.8 * pulse, 'rgba(215,237,255,.24)', 'rgba(154,199,255,0)');
        fillGlow(cx, cy, size * 2.2 * pulse, 'rgba(255,255,255,.72)', 'rgba(205,230,255,0)');
        const core = ctx.createRadialGradient(cx - size * .18, cy - size * .2, 0, cx, cy, size);
        core.addColorStop(0, '#ffffff'); core.addColorStop(.5, '#f5fbff'); core.addColorStop(1, '#c9e7ff');
        ctx.fillStyle = core; ctx.beginPath(); ctx.arc(cx, cy, size, 0, Math.PI * 2); ctx.fill();
        for (let ray = 0; ray < 16; ray++) {
            const angle = ray / 16 * Math.PI * 2 + time * .08;
            const length = size * (1.5 + (ray % 4) * .33 + Math.sin(time + ray) * .15);
            ctx.strokeStyle = `rgba(130,188,255,${.09 + (ray % 3) * .025})`;
            ctx.lineWidth = ray % 3 === 0 ? 2 : 1;
            ctx.beginPath(); ctx.moveTo(cx + Math.cos(angle) * size * 1.1, cy + Math.sin(angle) * size * 1.1);
            ctx.lineTo(cx + Math.cos(angle) * length, cy + Math.sin(angle) * length); ctx.stroke();
        }
        ctx.restore();
    };
    const drawBlackHole = (cx, cy, time, size) => {
        const sourceX = cx - size * 3.35, sourceY = cy - size * .32;
        ctx.save(); ctx.globalCompositeOperation = 'screen';
        fillGlow(sourceX, sourceY, size * 1.35, 'rgba(255,245,214,.68)', 'rgba(255,188,82,0)');
        ctx.fillStyle = '#fff9e9'; ctx.beginPath(); ctx.arc(sourceX, sourceY, size * .22, 0, Math.PI * 2); ctx.fill();
        for (let stream = 0; stream < 7; stream++) {
            const offset = (stream - 3) * size * .19;
            ctx.strokeStyle = `rgba(${190 + stream * 8},${145 + stream * 11},255,${.12 + stream * .025})`;
            ctx.lineWidth = 1 + (stream % 2);
            ctx.beginPath(); ctx.moveTo(sourceX + size * .22, sourceY + offset);
            ctx.bezierCurveTo(cx - size * 2.2, sourceY + offset * 1.5, cx - size * 1.45, cy + offset * .6, cx - size * .55, cy + offset * .16);
            ctx.stroke();
        }
        ctx.translate(cx, cy); ctx.rotate(-.24 + time * .08); ctx.scale(1.15, .34);
        for (let ring = 0; ring < 8; ring++) {
            ctx.strokeStyle = `rgba(${99 + ring * 17},${90 + ring * 18},255,${.12 + ring * .045})`;
            ctx.lineWidth = 1.3 + ring * .32;
            ctx.beginPath(); ctx.arc(0, 0, size * (1.12 + ring * .17), time * .45 + ring * .7, time * .45 + ring * .7 + Math.PI * 1.26); ctx.stroke();
        }
        ctx.restore();
        fillGlow(cx, cy, size * 1.5, 'rgba(28,15,80,.36)', 'rgba(43,210,255,0)');
        const eventHorizon = ctx.createRadialGradient(cx, cy, size * .16, cx, cy, size * 1.05);
        eventHorizon.addColorStop(0, '#000000'); eventHorizon.addColorStop(.62, '#01030a'); eventHorizon.addColorStop(1, 'rgba(8,8,23,.12)');
        ctx.fillStyle = eventHorizon; ctx.beginPath(); ctx.arc(cx, cy, size * 1.05, 0, Math.PI * 2); ctx.fill();
    };
    const render = now => {
        const time = now / 1000;
        const light = document.documentElement.getAttribute('data-theme') === 'light';
        ctx.clearRect(0, 0, state.width, state.height);
        const mobile = state.width < 768;
        const baseX = mobile ? .52 : (light ? .62 : .82);
        const cx = state.width * baseX + state.x * 12;
        const cy = state.height * (mobile ? .43 : .48) + state.y * 9 - state.scroll * 28;
        const size = Math.min(state.width, state.height) * (mobile ? .14 : .12);
        if (light) drawSun(cx, cy, time, size); else drawBlackHole(cx, cy, time, size);
        if (!motionReduced) requestAnimationFrame(render);
    };
    window.addEventListener('resize', resize, { passive: true });
    window.addEventListener('pointermove', event => { state.x = event.clientX / innerWidth - .5; state.y = event.clientY / innerHeight - .5; }, { passive: true });
    window.addEventListener('scroll', () => { state.scroll = scrollY / Math.max(innerHeight, 1); }, { passive: true });
    resize(); requestAnimationFrame(render);
})();
