"use client";

import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";

function useAnimatedCounter(target: number, inView: boolean, duration = 2000) {
  const [value, setValue] = useState(0);
  const hasRun = useRef(false);
  useEffect(() => {
    if (!inView || hasRun.current) return;
    hasRun.current = true;
    const start = performance.now();
    const tick = (now: number) => {
      const p = Math.min((now - start) / duration, 1);
      const ease = 1 - Math.pow(1 - p, 3);
      setValue(Math.round(ease * target));
      if (p < 1) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  }, [inView, target, duration]);
  return value;
}

const KPIS = [
  { target: 26, suffix: "M+", label: "Annual pregnancies in India" },
  { target: 45000, suffix: "", label: "Preventable maternal deaths" },
  { target: 0, fixed: "₹0", label: "Dominant digital solution exists" },
];

const reveal = {
  initial: { opacity: 0, y: 40 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, amount: 0.12 },
  transition: { duration: 0.8, ease: "easeOut" as const },
};

function KPICounter({ kpi, inView }: { kpi: typeof KPIS[0]; inView: boolean }) {
  const val = useAnimatedCounter(kpi.target, inView);
  if (kpi.fixed) return <div className="font-serif text-[3.5rem] font-light text-rose-lt leading-none mb-1.5 max-md:text-[2.5rem]">{kpi.fixed}</div>;
  const display = kpi.target >= 1000 ? val.toLocaleString() : val;
  return <div className="font-serif text-[3.5rem] font-light text-rose-lt leading-none mb-1.5 max-md:text-[2.5rem]">{display}{kpi.suffix}</div>;
}

export default function CTASection() {
  const ref = useRef<HTMLDivElement>(null);
  const [inView, setInView] = useState(false);

  useEffect(() => {
    if (!ref.current) return;
    const obs = new IntersectionObserver(
      (entries) => { if (entries[0].isIntersecting) setInView(true); },
      { threshold: 0.3 }
    );
    obs.observe(ref.current);
    return () => obs.disconnect();
  }, []);

  return (
    <section id="cta" className="relative overflow-hidden py-36 px-6 md:px-16 bg-plum text-center max-md:!py-20 max-md:!px-6">
      <div className="absolute inset-0" style={{ background: "radial-gradient(ellipse at 50% 50%,rgba(200,135,122,0.15) 0%,transparent 65%)" }} />

      {/* KPI counters */}
      <motion.div {...reveal} ref={ref} className="flex justify-center gap-12 md:gap-20 mb-20 flex-wrap relative z-10">
        {KPIS.map((kpi) => (
          <div key={kpi.label} className="text-center">
            <KPICounter kpi={kpi} inView={inView} />
            <div className="text-[0.78rem] tracking-[0.12em] uppercase text-white/35">{kpi.label}</div>
          </div>
        ))}
      </motion.div>

      <motion.h2 {...reveal} className="font-serif text-[clamp(2rem,3.5vw,3rem)] font-normal leading-[1.2] text-white mb-5 relative z-10 max-md:text-[1.6rem]">
        The future of <em className="italic text-rose-lt">maternal healthcare</em><br />begins here
      </motion.h2>
      <motion.p {...reveal} transition={{ ...reveal.transition, delay: 0.15 }} className="text-base text-white/50 max-w-[500px] mx-auto mb-12 leading-[1.75] relative z-10">
        Join hospitals, researchers and healthcare leaders building the operating system for maternal care in India.
      </motion.p>
      <motion.a
        {...reveal}
        transition={{ ...reveal.transition, delay: 0.3 }}
        href="/login"
        className="relative z-10 inline-block px-12 py-4 text-white rounded-full text-[0.9rem] tracking-[0.1em] uppercase no-underline hover:-translate-y-1 hover:shadow-[0_16px_50px_rgba(200,135,122,0.5)] transition-all duration-250 max-md:px-10 max-md:py-3.5 max-md:text-[0.82rem]"
        style={{
          background: "linear-gradient(135deg,var(--rose) 0%,#B5648C 100%)",
          boxShadow: "0 8px 30px rgba(200,135,122,0.35)",
        }}
      >
        Login
      </motion.a>
    </section>
  );
}
