/* Ambient multi-agent simulation for the hero canvas.
   Three squads of boid-like agents seek shared waypoints while keeping
   formation — a quiet nod to what the lab actually studies. */
(function () {
    const canvas = document.getElementById('swarm-canvas');
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    const SQUADS = [
        { color: 'rgba(153, 0, 0, 0.70)', link: 'rgba(153, 0, 0, 0.10)', n: 12 },
        { color: 'rgba(87, 83, 78, 0.65)', link: 'rgba(28, 25, 23, 0.09)', n: 14 },
        { color: 'rgba(120, 113, 108, 0.60)', link: 'rgba(28, 25, 23, 0.08)', n: 14 },
    ];

    let agents = [];
    let waypoints = [];
    let width = 0, height = 0, dpr = 1;
    let rafId = null;

    function rand(min, max) { return min + Math.random() * (max - min); }

    function resize() {
        const rect = canvas.parentElement.getBoundingClientRect();
        dpr = Math.min(window.devicePixelRatio || 1, 2);
        width = rect.width;
        height = rect.height;
        canvas.width = width * dpr;
        canvas.height = height * dpr;
        canvas.style.width = width + 'px';
        canvas.style.height = height + 'px';
        ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    }

    function init() {
        agents = [];
        waypoints = [];
        SQUADS.forEach(function (squad, s) {
            waypoints.push({ x: rand(width * 0.2, width * 0.9), y: rand(height * 0.2, height * 0.8), ttl: rand(400, 700) });
            for (let i = 0; i < squad.n; i++) {
                agents.push({
                    squad: s,
                    x: rand(0, width),
                    y: rand(0, height),
                    vx: rand(-0.5, 0.5),
                    vy: rand(-0.5, 0.5),
                });
            }
        });
    }

    function step() {
        waypoints.forEach(function (w) {
            w.ttl -= 1;
            if (w.ttl <= 0) {
                w.x = rand(width * 0.1, width * 0.95);
                w.y = rand(height * 0.15, height * 0.85);
                w.ttl = rand(400, 700);
            }
        });

        const MAX_SPEED = 0.9;
        agents.forEach(function (a) {
            let sepX = 0, sepY = 0, cohX = 0, cohY = 0, aliX = 0, aliY = 0, mates = 0;

            agents.forEach(function (b) {
                if (a === b) return;
                const dx = b.x - a.x, dy = b.y - a.y;
                const d2 = dx * dx + dy * dy;
                if (d2 < 625) { // separation radius 25px, any squad
                    sepX -= dx; sepY -= dy;
                }
                if (b.squad === a.squad && d2 < 8100) { // squad radius 90px
                    cohX += b.x; cohY += b.y;
                    aliX += b.vx; aliY += b.vy;
                    mates++;
                }
            });

            if (mates > 0) {
                a.vx += ((cohX / mates - a.x) * 0.0015) + (aliX / mates - a.vx) * 0.02;
                a.vy += ((cohY / mates - a.y) * 0.0015) + (aliY / mates - a.vy) * 0.02;
            }
            a.vx += sepX * 0.004;
            a.vy += sepY * 0.004;

            const w = waypoints[a.squad];
            a.vx += (w.x - a.x) * 0.0006;
            a.vy += (w.y - a.y) * 0.0006;

            const speed = Math.hypot(a.vx, a.vy) || 1;
            if (speed > MAX_SPEED) {
                a.vx = (a.vx / speed) * MAX_SPEED;
                a.vy = (a.vy / speed) * MAX_SPEED;
            }

            a.x += a.vx;
            a.y += a.vy;

            // soft wrap
            if (a.x < -20) a.x = width + 20;
            if (a.x > width + 20) a.x = -20;
            if (a.y < -20) a.y = height + 20;
            if (a.y > height + 20) a.y = -20;
        });
    }

    function draw() {
        ctx.clearRect(0, 0, width, height);

        // teammate links
        for (let i = 0; i < agents.length; i++) {
            for (let j = i + 1; j < agents.length; j++) {
                const a = agents[i], b = agents[j];
                if (a.squad !== b.squad) continue;
                const dx = b.x - a.x, dy = b.y - a.y;
                if (dx * dx + dy * dy < 4900) {
                    ctx.strokeStyle = SQUADS[a.squad].link;
                    ctx.beginPath();
                    ctx.moveTo(a.x, a.y);
                    ctx.lineTo(b.x, b.y);
                    ctx.stroke();
                }
            }
        }

        // waypoints: faint crosshairs
        ctx.strokeStyle = 'rgba(28, 25, 23, 0.12)';
        waypoints.forEach(function (w) {
            ctx.beginPath();
            ctx.moveTo(w.x - 5, w.y); ctx.lineTo(w.x + 5, w.y);
            ctx.moveTo(w.x, w.y - 5); ctx.lineTo(w.x, w.y + 5);
            ctx.stroke();
        });

        // agents: heading triangles
        agents.forEach(function (a) {
            const ang = Math.atan2(a.vy, a.vx);
            ctx.save();
            ctx.translate(a.x, a.y);
            ctx.rotate(ang);
            ctx.fillStyle = SQUADS[a.squad].color;
            ctx.beginPath();
            ctx.moveTo(5, 0);
            ctx.lineTo(-3.5, 2.6);
            ctx.lineTo(-3.5, -2.6);
            ctx.closePath();
            ctx.fill();
            ctx.restore();
        });
    }

    function loop() {
        step();
        draw();
        rafId = requestAnimationFrame(loop);
    }

    resize();
    init();

    if (reducedMotion) {
        // settle the simulation off-screen, then render a single static frame
        for (let i = 0; i < 300; i++) step();
        draw();
        return;
    }

    loop();

    window.addEventListener('resize', function () {
        resize();
    });

    document.addEventListener('visibilitychange', function () {
        if (document.hidden) {
            if (rafId) cancelAnimationFrame(rafId);
            rafId = null;
        } else if (!rafId) {
            loop();
        }
    });
})();
