"use client";

import Image from "next/image";
import { motion } from "framer-motion";

const SENSORS = [
  { label: "Heart Rate", delay: 0 },
  { label: "SpO₂ Monitoring", delay: 0.4 },
  { label: "Body Temperature", delay: 0.8 },
  { label: "Activity Tracking", delay: 1.2 },
  { label: "SOS Emergency", delay: 1.6 },
  { label: "7-Day Battery", delay: 2.0 },
];

const reveal = {
  initial: { opacity: 0, y: 40 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, amount: 0.12 },
  transition: { duration: 0.8, ease: "easeOut" as const },
};

export default function RingRevealSection() {
  return (
    <section
      id="ring-reveal"
      className="relative py-28 px-6 md:px-16 text-center overflow-hidden max-md:!py-20 max-md:!px-6"
      style={{ background: "linear-gradient(160deg,#FFF8F6 0%,#FEF0ED 30%,#F8E8F0 60%,#F0DDE8 85%,#EDE0F2 100%)" }}
    >
      {/* Atmospheric fog */}
      <div className="absolute w-[700px] h-[700px] -left-[200px] -top-[100px] rounded-full pointer-events-none z-0" style={{ background: "radial-gradient(circle,rgba(232,180,172,0.2) 0%,transparent 65%)", filter: "blur(80px)", animation: "glowDrift 16s ease-in-out infinite" }} />
      <div className="absolute w-[600px] h-[600px] -right-[150px] -bottom-[150px] rounded-full pointer-events-none z-0" style={{ background: "radial-gradient(circle,rgba(196,168,212,0.18) 0%,transparent 65%)", filter: "blur(90px)", animation: "glowDrift 20s ease-in-out infinite reverse" }} />
      <div className="absolute bottom-0 left-0 w-full h-px pointer-events-none" style={{ background: "linear-gradient(90deg,transparent,rgba(200,135,122,0.15),transparent)" }} />

      <motion.div {...reveal} className="flex items-center justify-center gap-2.5 text-[0.7rem] tracking-[0.22em] uppercase text-rose mb-5">
        <span className="inline-block w-[22px] h-px bg-rose" />
        The Device
      </motion.div>
      <motion.h2 {...reveal} className="font-serif text-[clamp(2rem,3.5vw,3rem)] font-normal leading-[1.2] text-plum max-md:text-[1.6rem]">
        Meet the Kannamma <em className="italic text-rose">Smart Ring</em>
      </motion.h2>
      <motion.p {...reveal} className="text-warm-gray max-w-[500px] mx-auto mt-4 text-[0.95rem] leading-[1.75]">
        Designed to feel like jewellery. Built to function like a medical device. Worn continuously. Monitoring silently.
      </motion.p>

      {/* Split media showcase */}
      <motion.div
        {...reveal}
        transition={{ ...reveal.transition, delay: 0.15 }}
        className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12 items-center mt-12 relative z-[1]"
      >
        {/* Left — Product image */}
        <div className="relative flex items-center justify-center group">
          <div className="absolute -inset-[15%] rounded-full z-0 animate-glowPulse" style={{ background: "radial-gradient(ellipse,rgba(232,180,172,0.3) 0%,rgba(196,168,212,0.12) 40%,transparent 70%)", filter: "blur(50px)" }} />
          <Image
            src="/ringcuff.jpeg"
            alt="Kannamma Smart Ring"
            width={480}
            height={480}
            className="relative z-[1] w-full max-w-[480px] rounded-[28px] animate-ringFloat transition-[filter] duration-400 max-md:max-w-[360px]"
            style={{ filter: "drop-shadow(0 40px 80px rgba(200,135,122,0.35)) drop-shadow(0 15px 30px rgba(42,21,37,0.12))" }}
          />
        </div>

        {/* Right — Video */}
        <div className="relative flex items-center justify-center">
          <div className="absolute -inset-[12%] rounded-full z-0" style={{ background: "radial-gradient(ellipse,rgba(196,168,212,0.22) 0%,rgba(232,180,172,0.12) 40%,transparent 70%)", filter: "blur(50px)", animation: "glowPulse 6s ease-in-out infinite 1s" }} />
          <div className="relative z-[1] w-full max-w-[480px] rounded-3xl overflow-hidden bg-cream/40 border border-rose/15 backdrop-blur-[8px] hover:shadow-[0_40px_100px_rgba(200,135,122,0.25),0_12px_32px_rgba(42,21,37,0.15)] hover:-translate-y-1 transition-all duration-400 max-md:max-w-[360px]"
            style={{ boxShadow: "0 30px 80px rgba(42,21,37,0.1), 0 8px 24px rgba(200,135,122,0.12), inset 0 1px 0 rgba(255,255,255,0.4)" }}
          >
            <video
              className="block w-full h-auto rounded-3xl object-cover"
              autoPlay muted loop playsInline
            >
              <source src="/assets/videos/ring-showcase.mp4" type="video/mp4" />
            </video>
          </div>
        </div>
      </motion.div>

      {/* Sensor pills */}
      <motion.div
        {...reveal}
        transition={{ ...reveal.transition, delay: 0.3 }}
        className="flex justify-center gap-3 flex-wrap mt-10 relative z-[1] max-md:gap-2"
      >
        {SENSORS.map((s) => (
          <div
            key={s.label}
            className="flex items-center gap-2 px-5 py-2.5 bg-cream/65 backdrop-blur-[14px] border border-rose/15 rounded-full text-[0.78rem] text-plum shadow-[0_4px_16px_rgba(42,21,37,0.04)] hover:border-rose hover:bg-cream/85 hover:-translate-y-0.5 hover:shadow-[0_8px_28px_rgba(200,135,122,0.18)] transition-all duration-300 max-md:text-[0.72rem] max-md:px-4 max-md:py-2"
          >
            <span
              className="w-1.5 h-1.5 rounded-full bg-rose animate-dotBlink"
              style={{ boxShadow: "0 0 8px 2px rgba(200,135,122,0.5)", animationDelay: `${s.delay}s` }}
            />
            {s.label}
          </div>
        ))}
      </motion.div>
    </section>
  );
}
