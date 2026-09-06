import React from 'react';
import { motion, useScroll } from 'framer-motion';

export const ScrollProgress: React.FC = () => {
  const { scrollYProgress } = useScroll();

  return (
    <div
      className="fixed top-0 left-0 right-0 h-[3px] z-[100] pointer-events-none bg-transparent"
      style={{ transform: 'translateZ(0)' }}
    >
      <motion.div
        className="h-full bg-gradient-to-r from-cyan-500 via-blue-500 to-indigo-500 origin-left shadow-[0_0_12px_rgba(6,182,212,0.8)]"
        style={{ scaleX: scrollYProgress, willChange: 'transform' }}
      />
    </div>
  );
};

export default ScrollProgress;
