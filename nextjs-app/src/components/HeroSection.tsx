"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";

export default function HeroSection() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const artworkRef = useRef<HTMLDivElement>(null);

  /* ── Parallax on mouse move ── */
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (!artworkRef.current) return;
      const cx = window.innerWidth / 2, cy = window.innerHeight / 2;
      const dx = (e.clientX - cx) / cx;
      const dy = (e.clientY - cy) / cy;
      artworkRef.current.style.transform = `translateY(calc(-50% + ${dy * -6}px)) translateX(${dx * -4}px)`;
    };
    document.addEventListener("mousemove", handler);
    return () => document.removeEventListener("mousemove", handler);
  }, []);

  /* ── Canvas particle system ── */
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    let W = (canvas.width = window.innerWidth);
    let H = (canvas.height = window.innerHeight);
    const COLORS = ["rgba(200,135,122,", "rgba(196,168,212,", "rgba(232,180,172,"];
    const particles = Array.from({ length: 55 }, () => ({
      x: Math.random() * 1400, y: Math.random() * 900,
      r: Math.random() * 3 + 1.5,
      vx: (Math.random() - 0.5) * 0.35, vy: (Math.random() - 0.5) * 0.35,
      c: COLORS[Math.floor(Math.random() * COLORS.length)],
      o: Math.random() * 0.5 + 0.15, phase: Math.random() * Math.PI * 2,
    }));
    const onResize = () => { W = canvas.width = window.innerWidth; H = canvas.height = window.innerHeight; };
    window.addEventListener("resize", onResize);
    let raf: number;
    const draw = (t: number) => {
      ctx.clearRect(0, 0, W, H);
      particles.forEach((p) => {
        p.x += p.vx; p.y += p.vy;
        if (p.x < 0) p.x = W; if (p.x > W) p.x = 0;
        if (p.y < 0) p.y = H; if (p.y > H) p.y = 0;
        const alpha = p.o + Math.sin(t * 0.001 + p.phase) * 0.15;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = p.c + alpha + ")";
        ctx.fill();
      });
      raf = requestAnimationFrame(draw);
    };
    raf = requestAnimationFrame(draw);
    return () => { cancelAnimationFrame(raf); window.removeEventListener("resize", onResize); };
  }, []);



  return (
    <section
      id="hero"
      className="relative min-h-screen flex items-center px-6 md:px-16 overflow-hidden"
      style={{ background: "linear-gradient(135deg,#FFF8F6 0%,#FEF0ED 20%,#F8E8F0 40%,#F0DDE8 60%,#EDE0F2 80%,#F5E8F5 100%)" }}
    >
      {/* Atmospheric blurred glow blobs */}
      <div className="absolute w-[1100px] h-[1100px] -right-[250px] -top-[200px] rounded-full pointer-events-none z-0 animate-glowDrift" style={{ background: "radial-gradient(circle,rgba(232,180,172,0.4) 0%,rgba(196,168,212,0.18) 35%,transparent 65%)", filter: "blur(100px)" }} />
      <div className="absolute w-[800px] h-[800px] right-[5%] -bottom-[200px] rounded-full pointer-events-none z-0" style={{ background: "radial-gradient(circle,rgba(200,135,122,0.22) 0%,rgba(196,168,212,0.12) 40%,transparent 65%)", filter: "blur(120px)", animation: "glowDrift 18s ease-in-out infinite reverse" }} />
      <div className="absolute w-[500px] h-[500px] left-[25%] top-[15%] rounded-full pointer-events-none z-0" style={{ background: "radial-gradient(circle,rgba(232,180,172,0.12) 0%,transparent 70%)", filter: "blur(70px)", animation: "glowDrift 10s ease-in-out infinite 2s" }} />
      <div className="absolute w-[900px] h-[900px] -right-[100px] top-1/2 -translate-y-1/2 rounded-full pointer-events-none z-0 animate-symbolGlowPulse" style={{ background: "radial-gradient(ellipse,rgba(232,180,172,0.3) 0%,rgba(196,168,212,0.15) 30%,rgba(245,232,245,0.08) 50%,transparent 70%)", filter: "blur(80px)" }} />

      {/* Particle canvas */}
      <canvas ref={canvasRef} className="absolute inset-0 z-[2] pointer-events-none" />

      {/* Mother-baby artwork */}
      <div
        ref={artworkRef}
        className="absolute right-[-8%] top-1/2 -translate-y-1/2 w-[60vw] max-w-[950px] min-w-[500px] z-[1] pointer-events-none max-md:w-[85vw] max-md:right-auto max-md:left-1/2 max-md:min-w-[280px] max-md:max-w-[500px]"
        style={{ opacity: 0, animation: "artworkReveal 2.2s 0.3s cubic-bezier(0.25,0.46,0.45,0.94) forwards" }}
      >
        <div className="absolute -inset-[20%] rounded-full z-[-1] animate-symbolGlowPulse" style={{ background: "radial-gradient(ellipse 70% 75% at 48% 50%,rgba(232,180,172,0.28) 0%,rgba(196,168,212,0.14) 30%,rgba(245,232,245,0.06) 50%,transparent 70%)", filter: "blur(50px)" }} />
        <Image
          src="/mother-symbol.png"
          alt="Mother and baby symbol"
          width={950}
          height={950}
          priority
          className="w-full h-auto opacity-[0.78] mix-blend-multiply mask-radial-artwork max-md:opacity-40"
          style={{ filter: "drop-shadow(0 0 80px rgba(200,135,122,0.25)) drop-shadow(0 0 160px rgba(196,168,212,0.15)) drop-shadow(0 0 40px rgba(232,180,172,0.2))" }}
        />
      </div>

      {/* Left content */}
      <div className="relative z-[4] max-w-[520px] pr-8 max-md:max-w-full max-md:pr-0 max-md:text-center">
        <div className="hero-fadeup hero-fadeup-1 inline-flex items-center gap-2.5 text-[0.72rem] tracking-[0.2em] uppercase text-rose mb-7">
          <span className="inline-block w-7 h-px bg-rose" />
          AI-Powered Maternal Healthcare
        </div>

        <h1
          className="hero-fadeup hero-fadeup-2 font-serif text-[clamp(2.8rem,4.8vw,4.4rem)] font-normal leading-[1.12] text-plum mb-6 max-md:text-[clamp(2.2rem,8vw,3rem)]"
        >
          Continuous<br />
          <em className="italic text-rose">Maternal</em><br />
          Healthcare Intelligence
        </h1>

        <p className="hero-fadeup hero-fadeup-3 text-base leading-[1.8] text-warm-gray max-w-[420px] mb-10 max-md:max-w-full max-md:text-[0.9rem]">
          An AI-powered ecosystem connecting mothers, ASHA workers, PHCs and hospitals through continuous real-time monitoring — securing the dangerous gap between ANC visits.
        </p>

        <div className="hero-fadeup hero-fadeup-4 flex gap-4 flex-wrap max-md:justify-center max-md:flex-col max-md:items-center">
          <a href="#ecosystem" className="inline-flex items-center gap-2 px-8 py-3.5 bg-plum text-white rounded-full text-[0.85rem] tracking-[0.08em] uppercase no-underline hover:bg-rose hover:-translate-y-0.5 transition-all duration-250 max-md:w-full max-md:max-w-[320px] max-md:justify-center">
            Explore Ecosystem
            <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M5 12h14M12 5l7 7-7 7" /></svg>
          </a>
          <a href="/login" className="inline-flex items-center gap-2.5 px-8 py-3.5 border border-rose/40 text-plum rounded-full text-[0.85rem] tracking-[0.08em] uppercase no-underline bg-cream/50 backdrop-blur-[12px] hover:border-rose hover:text-rose hover:-translate-y-0.5 hover:shadow-[0_4px_20px_rgba(200,135,122,0.2)] transition-all duration-300 max-md:w-full max-md:max-w-[320px] max-md:justify-center">
            <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24"><path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4M10 17l5-5-5-5M15 12H3" /></svg>
            Login
          </a>
        </div>

        <div className="hero-fadeup hero-fadeup-5 flex items-center gap-2.5 mt-12 max-md:justify-center">
          <div className="w-7 h-7 rounded-full bg-rose/10 flex items-center justify-center text-xs">
            <svg width="14" height="14" fill="none" stroke="var(--rose)" strokeWidth="2" viewBox="0 0 24 24"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" /></svg>
          </div>
          <span className="text-[0.78rem] text-warm-gray leading-snug">
            Trusted by healthcare professionals<br />Empowering safer motherhood
          </span>
        </div>
      </div>

      {/* Scroll indicator */}
      <div
        className="hero-fadeup hero-fadeup-6 absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1.5 text-[0.68rem] tracking-[0.15em] uppercase text-warm-gray z-[5]"
      >
        <div className="w-px h-10 animate-scrollPulse origin-top" style={{ background: "linear-gradient(to bottom,var(--rose),transparent)" }} />
        <span>Scroll</span>
      </div>
    </section>
  );
}
