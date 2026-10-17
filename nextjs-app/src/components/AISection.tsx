"use client";

import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";

const FEATURES = [
  {
    title: "Predictive Risk Scoring",
    desc: "AI analyses continuous vitals to detect preeclampsia, anemia progression, and gestational diabetes indicators before symptoms appear.",
    icon: (
      <svg viewBox="0 0 24 24" className="w-[22px] h-[22px] stroke-rose fill-none" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" style={{ filter: "drop-shadow(0 0 4px rgba(200,135,122,0.3))" }}>
        <circle cx="12" cy="12" r="3" /><path d="M12 1v4M12 19v4M4.22 4.22l2.83 2.83M16.95 16.95l2.83 2.83M1 12h4M19 12h4M4.22 19.78l2.83-2.83M16.95 7.05l2.83-2.83" />
      </svg>
    ),
  },
  {
    title: "Instant ASHA Alerts",
    desc: "When risk elevates, the nearest ASHA worker is notified within seconds — with context, history, and recommended action.",
    icon: (
      <svg viewBox="0 0 24 24" className="w-[22px] h-[22px] stroke-rose fill-none" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" style={{ filter: "drop-shadow(0 0 4px rgba(200,135,122,0.3))" }}>
        <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" /><path d="M13.73 21a2 2 0 0 1-3.46 0" /><path d="M12 2v2" />
      </svg>
    ),
  },
  {
    title: "Longitudinal Health Record",
    desc: "Every data point across 9 months builds a complete maternal health graph — available to doctors in real time during emergencies.",
    icon: (
      <svg viewBox="0 0 24 24" className="w-[22px] h-[22px] stroke-rose fill-none" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" style={{ filter: "drop-shadow(0 0 4px rgba(200,135,122,0.3))" }}>
        <path d="M3 3h18v18H3z" fill="none" /><path d="M3 12h4l3-9 4 18 3-9h4" />
      </svg>
    ),
  },
];

const reveal = {
  initial: { opacity: 0, y: 40 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, amount: 0.12 },
  transition: { duration: 0.8, ease: "easeOut" as const },
};

export default function AISection() {
  const hbRef = useRef<SVGPathElement>(null);
  const [hbAnimate, setHbAnimate] = useState(false);

  useEffect(() => {
    if (!hbRef.current) return;
    const obs = new IntersectionObserver(
      (entries) => { if (entries[0].isIntersecting) setHbAnimate(true); },
      { threshold: 0.3 }
    );
    const el = hbRef.current;
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  return (
    <section id="ai" className="relative overflow-hidden py-36 px-6 md:px-16 bg-cream max-md:!py-20 max-md:!px-6">
      <motion.div {...reveal} className="inline-flex items-center gap-2.5 text-[0.7rem] tracking-[0.22em] uppercase text-rose mb-5">
        <span className="inline-block w-[22px] h-px bg-rose" />
        Intelligence Layer
      </motion.div>
      <motion.h2 {...reveal} className="font-serif text-[clamp(2rem,3.5vw,3rem)] font-normal leading-[1.2] text-plum max-md:text-[1.6rem]">
        AI that <em className="italic text-rose">predicts</em>, not just monitors
      </motion.h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-12 md:gap-24 items-center mt-16">
        {/* Left — Heartbeat visual */}
        <motion.div {...reveal} transition={{ ...reveal.transition, delay: 0.15 }} className="relative">
          <div className="bg-plum rounded-3xl p-10 relative overflow-hidden max-md:p-6">
            <div className="text-[0.68rem] tracking-[0.18em] uppercase text-white/35 mb-4">
              Live Maternal Signal — Continuous
            </div>
            <svg className="w-full h-20 overflow-visible" viewBox="0 0 400 80">
              <path
                ref={hbRef}
                className={`hb-path ${hbAnimate ? "animate" : ""}`}
                d="M0,40 L60,40 L75,40 L82,10 L90,70 L98,5 L106,75 L114,40 L130,40 L200,40 L215,40 L222,15 L230,65 L238,8 L246,72 L254,40 L280,40 L340,40 L355,40 L362,18 L370,62 L378,12 L386,68 L394,40 L400,40"
              />
            </svg>
            <div className="flex items-center gap-4 mt-7 p-4 bg-rose-lt/10 border border-rose-lt/20 rounded-[14px]">
              <div className="w-2.5 h-2.5 rounded-full bg-[#4CAF9A] animate-dotBlink" style={{ boxShadow: "0 0 10px 3px rgba(76,175,154,0.5)" }} />
              <div className="text-[0.82rem] text-white/65">
                AI Risk Score: <strong className="text-[#4CAF9A] font-medium">Low — Normal Range</strong>
              </div>
            </div>
            <div className="absolute -bottom-[50px] -right-[50px] w-[200px] h-[200px] rounded-full" style={{ background: "radial-gradient(circle,rgba(200,135,122,0.25) 0%,transparent 70%)" }} />
          </div>
        </motion.div>

        {/* Right — Feature rows */}
        <div className="flex flex-col gap-8">
          {FEATURES.map((feat, i) => (
            <motion.div
              key={feat.title}
              {...reveal}
              transition={{ ...reveal.transition, delay: 0.15 * (i + 1) }}
              className="flex gap-5 items-start p-6 rounded-[18px] border border-transparent hover:border-rose/20 hover:bg-blush/50 transition-all duration-300"
            >
              <div className="w-11 h-11 rounded-[14px] flex-shrink-0 flex items-center justify-center border border-rose/20" style={{ background: "linear-gradient(135deg,var(--blush),rgba(196,168,212,0.3))" }}>
                {feat.icon}
              </div>
              <div>
                <h4 className="font-serif text-lg font-medium text-plum mb-1">{feat.title}</h4>
                <p className="text-[0.85rem] leading-relaxed text-warm-gray">{feat.desc}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
