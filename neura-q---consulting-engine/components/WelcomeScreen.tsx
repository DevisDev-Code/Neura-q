import React, { useEffect, useRef } from 'react';

// CSS Styles injected as a string to maintain the specific design requirements without polluting global Tailwind config
const STYLES = `
  :root {
    --cyan: #00E5FF;
    --cyan-dim: rgba(0,229,255,0.15);
    --cyan-glow: rgba(0,229,255,0.4);
    --red: #FF2D55;
    --bg: #030508;
  }

  .welcome-root {
    width: 100%; height: 100vh; overflow: hidden;
    background: var(--bg);
    font-family: 'Share Tech Mono', monospace;
    cursor: none;
    position: relative;
    color: white;
  }

  /* ── CUSTOM CURSOR ── */
  #cursor {
    position: fixed; z-index: 9999;
    width: 20px; height: 20px;
    border: 1px solid var(--cyan);
    border-radius: 0;
    transform: translate(-50%, -50%);
    pointer-events: none;
    transition: width 0.15s, height 0.15s, background 0.15s;
    mix-blend-mode: difference;
  }
  #cursor-dot {
    position: fixed; z-index: 9999;
    width: 4px; height: 4px;
    background: var(--cyan);
    transform: translate(-50%, -50%);
    pointer-events: none;
  }
  
  /* Hover state for cursor */
  .welcome-root:has(button:hover) #cursor,
  .welcome-root:has(.nav-item:hover) #cursor {
    width: 40px; height: 40px;
    background: var(--cyan-dim);
  }

  /* ── BACKGROUND CANVAS ── */
  #neural-canvas {
    position: absolute; inset: 0; z-index: 0;
  }

  /* ── RADIAL GLOW BEHIND TITLE ── */
  .center-glow {
    position: absolute;
    top: 50%; left: 50%;
    transform: translate(-50%, -52%);
    width: 800px; height: 400px;
    background: radial-gradient(ellipse, rgba(0,180,255,0.06) 0%, transparent 70%);
    pointer-events: none;
    z-index: 1;
    animation: glowPulse 4s ease-in-out infinite;
  }
  @keyframes glowPulse {
    0%, 100% { opacity: 0.6; transform: translate(-50%, -52%) scale(1); }
    50% { opacity: 1; transform: translate(-50%, -52%) scale(1.08); }
  }

  /* ── SCANLINES ── */
  .scanlines {
    position: absolute; inset: 0; z-index: 2; pointer-events: none;
    background: repeating-linear-gradient(
      0deg, transparent, transparent 3px,
      rgba(0,0,0,0.08) 3px, rgba(0,0,0,0.08) 4px
    );
  }

  /* ── VIGNETTE ── */
  .vignette {
    position: absolute; inset: 0; z-index: 2; pointer-events: none;
    background: radial-gradient(ellipse at center, transparent 40%, rgba(0,0,0,0.85) 100%);
  }

  /* ── NOISE GRAIN ── */
  .grain {
    position: absolute; inset: -200%; z-index: 2; pointer-events: none;
    opacity: 0.025;
    background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E");
    animation: grainMove 0.5s steps(2) infinite;
  }
  @keyframes grainMove {
    0% { transform: translate(0, 0); }
    25% { transform: translate(-2%, -1%); }
    50% { transform: translate(1%, 2%); }
    75% { transform: translate(-1%, 1%); }
    100% { transform: translate(2%, -2%); }
  }

  /* ── HORIZONTAL SWEEP LINES ── */
  .sweep-line {
    position: absolute; left: 0; right: 0; height: 1px;
    background: linear-gradient(90deg, transparent, var(--cyan), transparent);
    opacity: 0; z-index: 3; pointer-events: none;
  }
  .sweep-line:nth-child(1) { animation: sweep 8s linear 1s infinite; }
  .sweep-line:nth-child(2) { animation: sweep 12s linear 5s infinite; opacity: 0; }
  .sweep-line:nth-child(3) { animation: sweep 10s linear 9s infinite; opacity: 0; }
  @keyframes sweep {
    0%   { top: -1px; opacity: 0; }
    2%   { opacity: 0.4; }
    98%  { opacity: 0.15; }
    100% { top: 100%; opacity: 0; }
  }

  /* ── MAIN LAYOUT ── */
  .page {
    position: relative; z-index: 10;
    width: 100%; height: 100%;
    display: flex; flex-direction: column;
    justify-content: space-between;
    padding: 0;
  }

  /* ── TOP BAR ── */
  .top-bar {
    display: flex; align-items: center; justify-content: space-between;
    padding: 28px 48px 0;
    animation: fadeDown 1s ease 0.2s both;
  }
  .top-bar-left {
    display: flex; align-items: center; gap: 32px;
  }
  .top-line {
    width: 280px; height: 1px;
    background: linear-gradient(90deg, rgba(0,229,255,0.6), transparent);
  }
  .top-meta {
    font-family: 'Rajdhani', sans-serif;
    font-size: 11px; letter-spacing: 4px; color: rgba(0,229,255,0.6);
    display: flex; gap: 32px;
  }
  .top-meta span { position: relative; }
  .top-meta span::after {
    content: ''; position: absolute; right: -16px; top: 50%;
    transform: translateY(-50%);
    width: 1px; height: 10px; background: rgba(0,229,255,0.2);
  }
  .top-meta span:last-child::after { display: none; }
  .status-badge {
    font-size: 10px; letter-spacing: 3px;
    color: var(--red); border: 1px solid rgba(255,45,85,0.4);
    padding: 4px 10px; background: rgba(255,45,85,0.08);
    animation: blink 2s ease infinite;
  }
  @keyframes blink {
    0%, 100% { opacity: 1; } 50% { opacity: 0.5; }
  }

  /* ── HERO ── */
  .hero {
    flex: 1; display: flex; flex-direction: column;
    justify-content: center; padding: 0 10vw;
  }

  /* GLITCH TITLE */
  .glitch-wrapper {
    position: relative; margin-bottom: 32px;
    animation: fadeUp 1s ease 0.5s both;
  }
  .glitch-title {
    font-family: 'Orbitron', sans-serif;
    font-size: clamp(60px, 9vw, 130px);
    font-weight: 900;
    color: var(--cyan);
    letter-spacing: -2px;
    line-height: 1;
    text-shadow:
      0 0 30px rgba(0,229,255,0.5),
      0 0 80px rgba(0,229,255,0.2),
      0 0 120px rgba(0,229,255,0.1);
    position: relative;
    animation: titleLoad 1.2s cubic-bezier(0.16, 1, 0.3, 1) 0.4s both;
  }
  @keyframes titleLoad {
    from { opacity: 0; letter-spacing: 20px; filter: blur(8px); }
    to   { opacity: 1; letter-spacing: -2px; filter: blur(0); }
  }

  /* Glitch layers */
  .glitch-title::before,
  .glitch-title::after {
    content: attr(data-text);
    position: absolute; top: 0; left: 0;
    font-family: inherit; font-size: inherit; font-weight: inherit;
    line-height: inherit; letter-spacing: inherit;
  }
  .glitch-title::before {
    color: rgba(255,45,85,0.7);
    animation: glitchA 6s steps(1) 2s infinite;
    clip-path: polygon(0 0, 100% 0, 100% 33%, 0 33%);
  }
  .glitch-title::after {
    color: rgba(0,229,255,0.6);
    animation: glitchB 6s steps(1) 2s infinite;
    clip-path: polygon(0 66%, 100% 66%, 100% 100%, 0 100%);
  }
  @keyframes glitchA {
    0%,85%,100% { transform: translate(0); opacity: 0; }
    86% { transform: translate(-4px, -2px); opacity: 1; }
    88% { transform: translate(3px, 1px); opacity: 1; }
    90% { transform: translate(-2px, 0); opacity: 0; }
    92% { transform: translate(5px, -1px); opacity: 1; }
    94% { transform: translate(0); opacity: 0; }
  }
  @keyframes glitchB {
    0%,85%,100% { transform: translate(0); opacity: 0; }
    86% { transform: translate(4px, 2px); opacity: 1; }
    88% { transform: translate(-3px, -1px); opacity: 1; }
    90% { transform: translate(2px, 0); opacity: 0; }
    92% { transform: translate(-5px, 1px); opacity: 1; }
    94% { transform: translate(0); opacity: 0; }
  }

  /* Horizontal glitch bars */
  .glitch-bars {
    position: absolute; inset: 0; pointer-events: none;
    animation: glitchBars 6s steps(1) 2s infinite;
    z-index: 2;
  }
  @keyframes glitchBars {
    0%,85%,100% { opacity: 0; background: none; }
    87% {
      opacity: 1;
      background:
        linear-gradient(transparent 28%, rgba(0,229,255,0.15) 28%, rgba(0,229,255,0.15) 31%, transparent 31%),
        linear-gradient(transparent 61%, rgba(255,45,85,0.12) 61%, rgba(255,45,85,0.12) 65%, transparent 65%);
    }
    89% { opacity: 0; }
    91% { opacity: 1;
      background: linear-gradient(transparent 42%, rgba(0,229,255,0.1) 42%, rgba(0,229,255,0.1) 44%, transparent 44%);
    }
    93% { opacity: 0; }
  }

  /* ── BODY TEXT ── */
  .hero-body {
    border-left: 2px solid rgba(0,229,255,0.3);
    padding-left: 24px; margin-bottom: 48px;
    animation: fadeUp 1s ease 0.8s both;
  }
  .hero-body p {
    font-family: 'Rajdhani', sans-serif;
    font-size: clamp(14px, 1.6vw, 18px);
    font-weight: 300; line-height: 1.8;
    color: rgba(200,215,230,0.7);
    max-width: 560px;
  }
  .hero-body p:first-child {
    font-size: clamp(15px, 1.8vw, 20px);
    font-weight: 400; color: rgba(200,215,230,0.85);
    margin-bottom: 10px;
  }

  /* ── CTA ROW ── */
  .cta-row {
    display: flex; align-items: center; gap: 48px;
    animation: fadeUp 1s ease 1s both;
    flex-wrap: wrap;
  }

  .btn-init {
    position: relative; overflow: hidden;
    padding: 16px 40px;
    border: 1px solid var(--cyan);
    background: transparent;
    color: var(--cyan);
    font-family: 'Share Tech Mono', monospace;
    font-size: 12px; letter-spacing: 4px;
    cursor: none; text-transform: uppercase;
    transition: color 0.3s;
    clip-path: polygon(0 0, calc(100% - 12px) 0, 100% 12px, 100% 100%, 12px 100%, 0 calc(100% - 12px));
  }
  .btn-init::before {
    content: ''; position: absolute; inset: 0;
    background: var(--cyan);
    transform: scaleX(0); transform-origin: left;
    transition: transform 0.4s cubic-bezier(0.16, 1, 0.3, 1);
    z-index: 0;
  }
  .btn-init:hover::before { transform: scaleX(1); }
  .btn-init:hover { color: #030508; }
  .btn-init span { position: relative; z-index: 1; }
  /* Corner accent */
  .btn-init::after {
    content: ''; position: absolute;
    top: -1px; right: -1px;
    border-top: 12px solid var(--cyan);
    border-left: 12px solid transparent;
  }
  /* Ripple on click */
  .btn-init .ripple {
    position: absolute; border-radius: 0;
    background: rgba(0,229,255,0.3);
    transform: scale(0); animation: ripple 0.5s linear;
    pointer-events: none;
  }
  @keyframes ripple { to { transform: scale(4); opacity: 0; } }

  .stats {
    display: flex; flex-direction: column; gap: 12px;
  }
  .stat {
    display: flex; align-items: center; gap: 10px;
    font-family: 'Rajdhani', sans-serif;
    font-size: 11px; letter-spacing: 3px;
    color: rgba(180,200,220,0.5);
  }
  .stat-dot {
    width: 6px; height: 6px; border-radius: 50%;
    background: var(--cyan); flex-shrink: 0;
    box-shadow: 0 0 8px var(--cyan);
    animation: dotPulse 2s ease infinite;
  }
  .stat-dot.red { background: var(--red); box-shadow: 0 0 8px var(--red); animation-delay: 1s; }
  .stat-dot.amber { background: #FFB800; box-shadow: 0 0 8px #FFB800; animation-delay: 0.5s; }
  @keyframes dotPulse {
    0%, 100% { opacity: 1; transform: scale(1); }
    50% { opacity: 0.4; transform: scale(0.7); }
  }

  /* ── BOTTOM BAR ── */
  .bottom-bar {
    display: flex; align-items: center; justify-content: space-between;
    padding: 0 48px 28px;
    animation: fadeUp 1s ease 1.2s both;
  }
  .bottom-brand {
    font-size: 10px; letter-spacing: 4px; color: rgba(0,229,255,0.35);
    display: flex; align-items: center; gap: 12px;
  }
  .bottom-brand span { color: rgba(255,255,255,0.15); }
  .bottom-nav {
    display: flex; gap: 36px;
  }
  .nav-item {
    font-size: 10px; letter-spacing: 3px;
    color: rgba(180,200,220,0.3); cursor: none;
    transition: color 0.2s; position: relative;
    display: flex; align-items: center; gap: 8px;
  }
  .nav-item::before {
    content: attr(data-num);
    font-size: 8px; color: rgba(0,229,255,0.4);
  }
  .nav-item:hover { color: rgba(0,229,255,0.8); }
  .nav-item:hover::after {
    content: '';
    position: absolute; bottom: -4px; left: 0; right: 0; height: 1px;
    background: var(--cyan);
  }
  .secure {
    font-size: 10px; letter-spacing: 3px; color: rgba(0,229,255,0.3);
    display: flex; align-items: center; gap: 8px;
  }
  .secure::before {
    content: ''; width: 6px; height: 8px;
    border: 1px solid rgba(0,229,255,0.4); border-radius: 1px;
    display: inline-block;
  }

  /* ── CORNER DECORATIONS ── */
  .corner { position: absolute; z-index: 5; pointer-events: none; }
  .corner-tl { top: 20px; left: 20px; }
  .corner-tr { top: 20px; right: 20px; }
  .corner-bl { bottom: 20px; left: 20px; }
  .corner-br { bottom: 20px; right: 20px; }
  .corner svg { display: block; }

  /* ── DATA TICKER ── */
  .data-ticker {
    position: absolute; right: 28px; top: 50%;
    transform: translateY(-50%);
    z-index: 5; pointer-events: none;
    display: flex; flex-direction: column; gap: 20px;
    animation: fadeIn 1s ease 1.5s both;
  }
  .ticker-item {
    font-size: 9px; letter-spacing: 2px;
    color: rgba(0,229,255,0.25); text-align: right;
    animation: tickerFade 3s ease infinite;
  }
  .ticker-item:nth-child(2) { animation-delay: 1s; }
  .ticker-item:nth-child(3) { animation-delay: 2s; }
  @keyframes tickerFade {
    0%,100% { opacity: 0.25; } 50% { opacity: 0.6; }
  }

  /* ── PROGRESS BAR (decorative) ── */
  .progress-bar {
    position: absolute; bottom: 0; left: 0; right: 0;
    height: 2px; z-index: 5;
    background: rgba(255,255,255,0.03);
    pointer-events: none;
  }
  .progress-fill {
    height: 100%;
    background: linear-gradient(90deg, transparent, var(--cyan), transparent);
    animation: progressSweep 8s linear infinite;
  }
  @keyframes progressSweep {
    from { margin-left: -50%; width: 50%; }
    to { margin-left: 100%; width: 50%; }
  }

  @keyframes fadeDown {
    from { opacity: 0; transform: translateY(-20px); }
    to { opacity: 1; transform: translateY(0); }
  }
  @keyframes fadeUp {
    from { opacity: 0; transform: translateY(20px); }
    to { opacity: 1; transform: translateY(0); }
  }
  @keyframes fadeIn {
    from { opacity: 0; } to { opacity: 1; }
  }

  /* Responsive fixes */
  @media (max-width: 768px) {
    .glitch-title { font-size: 48px; }
    .top-bar { padding: 20px; flex-direction: column; align-items: flex-start; gap: 10px; }
    .bottom-bar { padding: 20px; flex-direction: column; gap: 20px; }
    .bottom-nav { display: none; }
    .data-ticker { display: none; }
    .cta-row { flex-direction: column; align-items: flex-start; gap: 30px; }
  }
`;

export const WelcomeScreen = ({ onStart }: { onStart: () => void }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const cursorRef = useRef<HTMLDivElement>(null);
  const dotRef = useRef<HTMLDivElement>(null);
  const mouseRef = useRef({ x: -100, y: -100 });
  const cursorRefCoords = useRef({ x: -100, y: -100 });

  useEffect(() => {
    // 1. Mouse Event Listener
    const handleMouseMove = (e: MouseEvent) => {
      mouseRef.current = { x: e.clientX, y: e.clientY };
    };
    window.addEventListener('mousemove', handleMouseMove);

    // 2. Cursor Animation Loop
    let cursorAnimId: number;
    const animateCursor = () => {
      const { x: mx, y: my } = mouseRef.current;
      const { x: cx, y: cy } = cursorRefCoords.current;

      const ncx = cx + (mx - cx) * 0.12;
      const ncy = cy + (my - cy) * 0.12;

      cursorRefCoords.current = { x: ncx, y: ncy };

      if (cursorRef.current && dotRef.current) {
        cursorRef.current.style.left = `${ncx}px`;
        cursorRef.current.style.top = `${ncy}px`;
        dotRef.current.style.left = `${mx}px`;
        dotRef.current.style.top = `${my}px`;
      }
      cursorAnimId = requestAnimationFrame(animateCursor);
    };
    animateCursor();

    // 3. Canvas Neural Network Logic
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext('2d');
    
    let canvasAnimId: number;
    
    if (canvas && ctx) {
        let W = window.innerWidth;
        let H = window.innerHeight;
        
        const resize = () => {
            W = canvas.width = window.innerWidth;
            H = canvas.height = window.innerHeight;
        };
        resize();
        window.addEventListener('resize', resize);

        // Nodes
        const nodes: any[] = [];
        const initNodes = () => {
            nodes.length = 0;
            const count = Math.floor((W * H) / 14000);
            for (let i = 0; i < Math.min(count, 90); i++) {
                nodes.push({
                    x: Math.random() * W,
                    y: Math.random() * H,
                    vx: (Math.random() - 0.5) * 0.4,
                    vy: (Math.random() - 0.5) * 0.4,
                    r: Math.random() * 1.5 + 0.5,
                    alpha: Math.random() * 0.5 + 0.2,
                    pulse: Math.random() * Math.PI * 2,
                    hot: Math.random() < 0.12
                });
            }
        };
        initNodes();

        // Packets
        const packets: any[] = [];
        let lastPacketTime = 0;

        const draw = (timestamp: number) => {
            ctx.clearRect(0, 0, W, H);
            
            // Grid
            ctx.strokeStyle = 'rgba(0,229,255,0.025)';
            ctx.lineWidth = 0.5;
            for (let x = 0; x < W; x += 80) {
                ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, H); ctx.stroke();
            }
            for (let y = 0; y < H; y += 80) {
                ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(W, y); ctx.stroke();
            }

            // Update Nodes
            nodes.forEach(n => {
                n.x += n.vx;
                n.y += n.vy;
                n.pulse += 0.03;

                // Mouse influence
                const dx = mouseRef.current.x - n.x;
                const dy = mouseRef.current.y - n.y;
                const dist = Math.sqrt(dx*dx + dy*dy);
                if (dist < 180) {
                    n.vx += dx * 0.00003;
                    n.vy += dy * 0.00003;
                }
                
                // Boundaries
                if (n.x < -20) n.x = W + 20;
                if (n.x > W + 20) n.x = -20;
                if (n.y < -20) n.y = H + 20;
                if (n.y > H + 20) n.y = -20;

                // Draw
                const pAlpha = n.alpha * (0.7 + 0.3 * Math.sin(n.pulse));
                ctx.beginPath();
                ctx.arc(n.x, n.y, n.hot ? n.r * 2 : n.r, 0, Math.PI * 2);
                ctx.fillStyle = n.hot ? `rgba(0,229,255,${pAlpha})` : `rgba(0,180,220,${pAlpha * 0.6})`;
                if (n.hot) {
                    ctx.shadowBlur = 12;
                    ctx.shadowColor = 'rgba(0,229,255,0.6)';
                }
                ctx.fill();
                ctx.shadowBlur = 0;
            });

            // Connections
            for (let i = 0; i < nodes.length; i++) {
                for (let j = i + 1; j < nodes.length; j++) {
                    const a = nodes[i];
                    const b = nodes[j];
                    const dx = a.x - b.x;
                    const dy = a.y - b.y;
                    const dist = Math.sqrt(dx*dx + dy*dy);
                    
                    if (dist < 160) {
                        const alpha = (1 - dist / 160) * 0.25;
                        ctx.beginPath();
                        ctx.moveTo(a.x, a.y);
                        ctx.lineTo(b.x, b.y);
                        ctx.strokeStyle = `rgba(0,229,255,${alpha})`;
                        ctx.lineWidth = dist < 60 ? 1 : 0.5;
                        ctx.stroke();
                    }
                }
            }

            // Mouse connection
            nodes.forEach(n => {
                const dx = n.x - mouseRef.current.x;
                const dy = n.y - mouseRef.current.y;
                if (Math.sqrt(dx*dx + dy*dy) < 200) {
                    ctx.beginPath();
                    ctx.moveTo(mouseRef.current.x, mouseRef.current.y);
                    ctx.lineTo(n.x, n.y);
                    ctx.strokeStyle = `rgba(0,229,255,0.15)`;
                    ctx.stroke();
                }
            });

            // Packets
            if (timestamp - lastPacketTime > 600 && nodes.length > 1) {
                const a = nodes[Math.floor(Math.random() * nodes.length)];
                let b = nodes[Math.floor(Math.random() * nodes.length)];
                if (a !== b) {
                     const dx = a.x - b.x;
                     const dy = a.y - b.y;
                     if (Math.sqrt(dx*dx + dy*dy) < 160) {
                         packets.push({ a, b, t: 0, speed: 0.008 + Math.random() * 0.006 });
                         lastPacketTime = timestamp;
                     }
                }
            }
            
            for (let i = packets.length - 1; i >= 0; i--) {
                const p = packets[i];
                p.t += p.speed;
                if (p.t >= 1) {
                    packets.splice(i, 1);
                    continue;
                }
                const x = p.a.x + (p.b.x - p.a.x) * p.t;
                const y = p.a.y + (p.b.y - p.a.y) * p.t;
                ctx.beginPath();
                ctx.arc(x, y, 2, 0, Math.PI * 2);
                ctx.fillStyle = 'rgba(0,229,255,0.8)';
                ctx.shadowBlur = 8;
                ctx.shadowColor = 'rgba(0,229,255,0.8)';
                ctx.fill();
                ctx.shadowBlur = 0;
            }

            canvasAnimId = requestAnimationFrame(draw);
        };
        canvasAnimId = requestAnimationFrame(draw);
    }

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      cancelAnimationFrame(cursorAnimId);
      if (canvasAnimId) cancelAnimationFrame(canvasAnimId);
    };
  }, []);

  const handleBtnClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    const btn = e.currentTarget;
    const rect = btn.getBoundingClientRect();
    const ripple = document.createElement('span');
    ripple.className = 'ripple';
    const size = Math.max(rect.width, rect.height) * 2;
    ripple.style.cssText = `width:${size}px;height:${size}px;left:${e.clientX - rect.left - size/2}px;top:${e.clientY - rect.top - size/2}px`;
    btn.appendChild(ripple);
    setTimeout(() => ripple.remove(), 500);
    onStart();
  };

  return (
    <>
      <style>{STYLES}</style>
      <div className="welcome-root">
        {/* Custom Cursor */}
        <div id="cursor" ref={cursorRef}></div>
        <div id="cursor-dot" ref={dotRef}></div>

        {/* Background Layers */}
        <canvas id="neural-canvas" ref={canvasRef}></canvas>
        <div className="center-glow"></div>
        <div className="scanlines"></div>
        <div className="vignette"></div>
        <div className="grain"></div>
        <div className="sweep-line"></div>
        <div className="sweep-line"></div>
        <div className="sweep-line"></div>
        <div className="progress-bar"><div className="progress-fill"></div></div>

        {/* Corner Decorations */}
        <div className="corner corner-tl">
          <svg width="30" height="30" fill="none"><path d="M0 30 L0 0 L30 0" stroke="rgba(0,229,255,0.3)" strokeWidth="1"/></svg>
        </div>
        <div className="corner corner-tr">
          <svg width="30" height="30" fill="none"><path d="M30 30 L30 0 L0 0" stroke="rgba(0,229,255,0.3)" strokeWidth="1"/></svg>
        </div>
        <div className="corner corner-bl">
          <svg width="30" height="30" fill="none"><path d="M0 0 L0 30 L30 30" stroke="rgba(0,229,255,0.3)" strokeWidth="1"/></svg>
        </div>
        <div className="corner corner-br">
          <svg width="30" height="30" fill="none"><path d="M30 0 L30 30 L0 30" stroke="rgba(0,229,255,0.3)" strokeWidth="1"/></svg>
        </div>

        {/* Data Ticker */}
        <div className="data-ticker">
          <div className="ticker-item">NODES: 247</div>
          <div className="ticker-item">ROUND: 04/06</div>
          <div className="ticker-item">MECE: ACTIVE</div>
          <div className="ticker-item">ENGINE: LIVE</div>
        </div>

        {/* Main Content */}
        <div className="page">
          
          {/* Top Bar */}
          <div className="top-bar">
            <div className="top-bar-left">
              <div className="top-line"></div>
              <div className="top-meta">
                <span>CONSULTING ENGINE V2.0</span>
                <span>RESTRICTED ACCESS</span>
              </div>
            </div>
            <div className="status-badge">● ACTIVE SESSION</div>
          </div>

          {/* Hero Section */}
          <div className="hero">
            <div className="glitch-wrapper">
              <div className="glitch-bars"></div>
              <h1 className="glitch-title" data-text="NEURA-Q">NEURA-Q</h1>
            </div>

            <div className="hero-body">
              <p>We do not give advice. We destroy weak thinking.</p>
              <p>Enter the War Room. Three elite AI agents—The Architect, The Destroyer, and The Arbiter—will ruthlessly stress-test your business strategy.</p>
            </div>

            <div className="cta-row">
              <button className="btn-init" onClick={handleBtnClick}>
                <span>INITIALIZE PROTOCOL &nbsp;›</span>
              </button>
              <div className="stats">
                <div className="stat"><div className="stat-dot"></div>6–10 ROUND DEBATE</div>
                <div className="stat"><div className="stat-dot red"></div>MECE CHECKPOINT: ROUND 4 &amp; 7</div>
                <div className="stat"><div className="stat-dot amber"></div>CONSENSUS REQUIRED FOR REPORT</div>
              </div>
            </div>
          </div>

          {/* Bottom Bar */}
          <div className="bottom-bar">
            <div className="bottom-brand">
              NEURA-Q <span>·</span> ENGINE V2.0
            </div>
            <nav className="bottom-nav">
              <div className="nav-item" data-num="01">SITUATION</div>
              <div className="nav-item" data-num="02">INTEL</div>
              <div className="nav-item" data-num="03">WAR ROOM</div>
              <div className="nav-item" data-num="04">VERDICT</div>
            </nav>
            <div className="secure">SECURE CONNECTION</div>
          </div>

        </div>
      </div>
    </>
  );
};