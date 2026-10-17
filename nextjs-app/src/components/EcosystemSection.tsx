"use client";

import { motion } from "framer-motion";

const NODES = [
  {
    name: "Mother", role: "Wears smart ring",
    icon: (
      <svg viewBox="0 0 24 24" className="w-9 h-9 stroke-rose fill-none" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" style={{ filter: "drop-shadow(0 0 6px rgba(200,135,122,0.3))" }}>
        <path d="M12 2a4 4 0 0 1 4 4 4 4 0 0 1-4 4 4 4 0 0 1-4-4 4 4 0 0 1 4-4z" />
        <path d="M16 22H8a2 2 0 0 1-2-2v-1a6 6 0 0 1 12 0v1a2 2 0 0 1-2 2z" />
        <circle cx="17" cy="18" r="2" />
      </svg>
    ),
  },
  {
    name: "ASHA Worker", role: "Receives alerts",
    icon: (
      <svg viewBox="0 0 24 24" className="w-9 h-9 stroke-rose fill-none" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" style={{ filter: "drop-shadow(0 0 6px rgba(200,135,122,0.3))" }}>
        <path d="M12 2a4 4 0 0 1 4 4 4 4 0 0 1-4 4 4 4 0 0 1-4-4 4 4 0 0 1 4-4z" />
        <path d="M16 22H8a2 2 0 0 1-2-2v-1a6 6 0 0 1 12 0v1a2 2 0 0 1-2 2z" />
        <path d="M9 14h6" /><path d="M12 11v6" />
      </svg>
    ),
  },
  {
    name: "PHC", role: "Reviews dashboard",
    icon: (
      <svg viewBox="0 0 24 24" className="w-9 h-9 stroke-rose fill-none" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" style={{ filter: "drop-shadow(0 0 6px rgba(200,135,122,0.3))" }}>
        <rect x="3" y="8" width="18" height="14" rx="2" />
        <path d="M9 8V6a3 3 0 0 1 6 0v2" />
        <path d="M9 14h6" /><path d="M12 11v6" />
      </svg>
    ),
  },
  {
    name: "Hospital", role: "Full health history",
    icon: (
      <svg viewBox="0 0 24 24" className="w-9 h-9 stroke-rose fill-none" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" style={{ filter: "drop-shadow(0 0 6px rgba(200,135,122,0.3))" }}>
        <rect x="2" y="6" width="20" height="16" rx="2" />
        <path d="M2 10h20" /><path d="M9 6V2" /><path d="M15 6V2" />
        <path d="M9 15h6" /><path d="M12 12v6" />
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

function Connector({ delayMs }: { delayMs: number }) {
  return (
    <div className="flex-1 max-w-[80px] flex items-center justify-center px-2 relative -top-5 max-md:rotate-90 max-md:w-10 max-md:max-w-[40px] max-md:h-[30px]">
      <div className="flex-1 h-px relative overflow-visible" style={{ background: "linear-gradient(90deg,var(--rose-lt),var(--lavender))" }}>
        <div
          className="absolute top-1/2 left-0 w-1.5 h-1.5 rounded-full bg-rose -translate-y-1/2"
          style={{ boxShadow: "0 0 8px 2px rgba(200,135,122,0.6)", animation: `connTravel 2.5s ease-in-out infinite ${delayMs}ms` }}
        />
      </div>
    </div>
  );
}

export default function EcosystemSection() {
  return (
    <section
      id="ecosystem"
      className="relative overflow-hidden py-36 px-6 md:px-16 text-center max-md:!py-20 max-md:!px-6"
      style={{ background: "linear-gradient(135deg,var(--lav-lt) 0%,var(--blush) 100%)" }}
    >
      <motion.div {...reveal} className="flex items-center justify-center gap-2.5 text-[0.7rem] tracking-[0.22em] uppercase text-rose mb-5">
        <span className="inline-block w-[22px] h-px bg-rose" />
        Connected Care
      </motion.div>
      <motion.h2 {...reveal} className="font-serif text-[clamp(2rem,3.5vw,3rem)] font-normal leading-[1.2] text-plum max-md:text-[1.6rem]">
        The <em className="italic text-rose">Ecosystem</em>
      </motion.h2>
      <motion.p {...reveal} className="text-warm-gray max-w-[480px] mx-auto mt-4 text-[0.95rem] leading-[1.75]">
        Every stakeholder connected. Every signal monitored. Every emergency intercepted before it becomes critical.
      </motion.p>

      {/* Horizontal flow */}
      <motion.div
        {...reveal}
        transition={{ ...reveal.transition, delay: 0.15 }}
        className="flex items-center justify-center mt-20 flex-nowrap max-md:flex-col max-md:gap-6"
      >
        {NODES.map((node, i) => (
          <div key={node.name} className="contents">
            <div className="flex flex-col items-center gap-3.5 hover:-translate-y-2 transition-transform duration-300">
              <div className="w-[90px] h-[90px] rounded-[28px] bg-cream/90 border border-rose/20 flex items-center justify-center shadow-[0_12px_40px_rgba(42,21,37,0.08)] hover:shadow-[0_20px_60px_rgba(200,135,122,0.25)] hover:border-rose/40 transition-all duration-300 max-md:w-[72px] max-md:h-[72px] max-md:rounded-[22px]">
                {node.icon}
              </div>
              <div className="font-serif text-base font-medium text-plum">{node.name}</div>
              <div className="text-[0.72rem] text-warm-gray tracking-[0.08em]">{node.role}</div>
            </div>
            {i < NODES.length - 1 && <Connector delayMs={i * 800} />}
          </div>
        ))}
      </motion.div>

      {/* Quote */}
      <motion.div {...reveal} transition={{ ...reveal.transition, delay: 0.3 }} className="mt-12">
        <p className="font-serif text-2xl text-plum italic">
          &ldquo;Zero gaps. Continuous care. Every mother. Every week.&rdquo;
        </p>
      </motion.div>
    </section>
  );
}
