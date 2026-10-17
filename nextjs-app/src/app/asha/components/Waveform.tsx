'use client';

import { motion } from 'framer-motion';

export default function Waveform({ active }: { active: boolean }) {
  const bars = Array.from({ length: 15 });
  return (
    <div className="flex items-center gap-1 justify-center h-8">
      {bars.map((_, i) => (
        <motion.div
          key={i}
          className="w-1 rounded-full bg-gradient-to-t from-[#C8877A] to-[#D8A48F]"
          initial={{ height: 4 }}
          animate={
            active
              ? {
                  height: [4, 8 + Math.sin(i * 0.5) * 16 + Math.random() * 10, 4],
                }
              : { height: 4 }
          }
          transition={
            active
              ? {
                  duration: 0.4 + (i % 3) * 0.1,
                  repeat: Infinity,
                  repeatType: 'reverse',
                  delay: i * 0.02,
                }
              : { duration: 0.2 }
          }
        />
      ))}
    </div>
  );
}
