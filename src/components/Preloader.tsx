import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { personalInfo } from '../data/portfolioData';

const Preloader: React.FC = () => {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Hide preloader after animation completes
    const timer = setTimeout(() => {
      setLoading(false);
    }, 2200);

    return () => clearTimeout(timer);
  }, []);

  return (
    <AnimatePresence>
      {loading && (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black text-white"
          initial={{ y: 0 }}
          exit={{ y: '-100%' }}
          transition={{ duration: 0.8, ease: [0.76, 0, 0.24, 1] }}
        >
          <motion.div
            className="flex items-center text-4xl sm:text-6xl md:text-8xl font-black tracking-tighter uppercase"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
          >
            <motion.div
              className="bg-[#ff2a2a] px-4 py-2 rounded-2xl text-white overflow-hidden whitespace-nowrap"
              initial={{ clipPath: 'inset(100% 0 0 0)' }}
              animate={{ clipPath: 'inset(0% 0 0 0)' }}
              transition={{ duration: 1.6, ease: 'easeInOut', delay: 0.2 }}
            >
              {personalInfo.brandName}<span className="text-black">.</span>
            </motion.div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default Preloader;
