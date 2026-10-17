"use client";

import { useEffect, useRef, useState } from "react";
import { motion, useInView } from "framer-motion";

/* ── Animated counter hook ── */
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

const STATS = [
  { target: 45000, label: "Maternal deaths every year in India", suffix: "" },
  { target: 67, label: "% of complications occur between ANC visits", suffix: "%" },
  { target: 26, label: "Million pregnancies annually in India", suffix: "M" },
  { target: 2, label: "% of maternal health data is currently digital", suffix: "%" },
];

const TIMELINE_DOTS = [
  { type: "anc", label: "ANC 1" }, { type: "gap", label: "Gap" }, { type: "gap", label: "Gap" },
  { type: "anc", label: "ANC 2" }, { type: "gap", label: "Gap" },
  { type: "anc", label: "ANC 3" }, { type: "gap", label: "Gap" }, { type: "gap", label: "Gap" },
  { type: "anc", label: "ANC 4" },
];

function StatCard({ stat, inView }: { stat: typeof STATS[0]; inView: boolean }) {
  const val = useAnimatedCounter(stat.target, inView);
  const display = stat.target >= 1000 ? val.toLocaleString() : val;
  return (
    <div className="p-7 border border-rose-lt/20 rounded-[20px] hover:border-rose/50 hover:-translate-y-1 transition-all duration-300 max-md:p-5">
      <div className="font-serif text-[2.8rem] font-light text-rose-lt leading-none mb-2 max-md:text-[2rem]">
        {display}{stat.suffix}
      </div>
      <div className="text-[0.82rem] leading-relaxed text-white/45">{stat.label}</div>
    </div>
  );
}

export default function ProblemSection() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const inView = useInView(sectionRef, { once: true, amount: 0.12 });
  const [timelineFill, setTimelineFill] = useState(false);
  const timelineRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!timelineRef.current) return;
    const obs = new IntersectionObserver(
      (entries) => { if (entries[0].isIntersecting) setTimelineFill(true); },
      { threshold: 0.3 }
    );
    obs.observe(timelineRef.current);
    return () => obs.disconnect();
  }, []);

  const reveal = {
    initial: { opacity: 0, y: 40 },
    whileInView: { opacity: 1, y: 0 },
    viewport: { once: true, amount: 0.12 },
    transition: { duration: 0.8, ease: "easeOut" as const },
  };

  return (
    <section id="problem" ref={sectionRef} className="relative overflow-hidden py-36 px-6 md:px-16 bg-plum text-white max-md:!py-20 max-md:!px-6">
      <motion.div {...reveal} className="inline-flex items-center gap-2.5 text-[0.7rem] tracking-[0.22em] uppercase text-rose-lt mb-5">
        <span className="inline-block w-[22px] h-px bg-rose-lt" />
        The Crisis
      </motion.div>
      <motion.h2 {...reveal} className="font-serif text-[clamp(2rem,3.5vw,3rem)] font-normal leading-[1.2] text-white max-md:text-[1.6rem]">
        A dangerous gap between <em className="italic text-rose-lt">every</em> clinic visit
      </motion.h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-10 md:gap-20 items-center mt-16">
        {/* Left — text + timeline */}
        <motion.div {...reveal} transition={{ ...reveal.transition, delay: 0.15 }}>
          <p className="text-[1.05rem] leading-[1.85] text-white/60 mb-6">
            Pregnant women receive only 4–6 ANC visits across 9 months. Between visits: no monitoring, no alerts, no continuity of care.
          </p>
          <p className="text-[1.05rem] leading-[1.85] text-white/60 mb-6">
            When emergencies arrive, doctors lack vital health history. Complications develop silently. Every week of silence is a risk.
          </p>

          {/* Timeline */}
          <div className="mt-14" ref={timelineRef}>
            <div className="text-[0.72rem] tracking-[0.15em] uppercase text-white/35 mb-4">
              Pregnancy journey — 40 weeks
            </div>
            <div className="relative h-1 bg-white/[0.08] rounded-full overflow-visible">
              <div
                className="h-full rounded-full transition-all duration-[1500ms] ease-[cubic-bezier(0.4,0,0.2,1)]"
                style={{
                  width: timelineFill ? "100%" : "0%",
                  background: "linear-gradient(90deg,var(--rose),var(--lavender))",
                }}
              />
              <div className="absolute top-1/2 -translate-y-1/2 w-full flex justify-between">
                {TIMELINE_DOTS.map((dot, i) => (
                  <div
                    key={i}
                    className={`w-3 h-3 rounded-full relative transition-all duration-300
                      ${dot.type === "anc"
                        ? "bg-rose border-2 border-rose"
                        : "bg-plum border-2 border-white/15 animate-gapPulse"
                      }`}
                  >
                    <span className={`absolute top-[18px] left-1/2 -translate-x-1/2 text-[0.6rem] whitespace-nowrap ${dot.type === "anc" ? "text-rose-lt" : "text-white/40"}`}>
                      {dot.label}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </motion.div>

        {/* Right — stat cards */}
        <motion.div
          {...reveal}
          transition={{ ...reveal.transition, delay: 0.3 }}
          className="grid grid-cols-2 gap-6 max-md:gap-4 max-[480px]:grid-cols-1"
        >
          {STATS.map((stat, i) => (
            <StatCard key={i} stat={stat} inView={inView} />
          ))}
        </motion.div>
      </div>
    </section>
  );
}
