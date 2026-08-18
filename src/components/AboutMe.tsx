import React from 'react';
import { motion } from 'framer-motion';

const AboutMe: React.FC = () => {
  return (
    <section id="about" className="relative w-full min-h-screen flex flex-col justify-center items-center py-20 px-5 sm:px-8 md:px-10 bg-[#0C0C0C]">
      {/* Decorative Floating Images */}
      {/* Top-left Moon */}
      <motion.img
        src="https://shrug-person-78902957.figma.site/_components/v2/ebb2b8f25d8e24d5f0a5ca8af4c950de81aa2fd7/moon_icon.11395d36.png"
        alt="Moon Icon"
        className="absolute top-[4%] left-[1%] sm:left-[2%] md:left-[4%] w-[120px] sm:w-[160px] md:w-[210px] h-auto z-0"
        initial={{ x: -80, y: 0, opacity: 0 }}
        whileInView={{ x: 0, y: 0, opacity: 1 }}
        viewport={{ once: true }}
        transition={{ delay: 0.1, duration: 0.9 }}
      />
      {/* Bottom-left 3D Object */}
      <motion.img
        src="https://shrug-person-78902957.figma.site/_components/v2/ebb2b8f25d8e24d5f0a5ca8af4c950de81aa2fd7/3d_object_2.a1db8e5a.png"
        alt="3D Object"
        className="absolute bottom-[2%] left-[1%] sm:left-[2%] md:left-[4%] w-[80px] sm:w-[110px] md:w-[150px] h-auto z-0"
        initial={{ x: -60, y: 30, opacity: 0 }}
        whileInView={{ x: 0, y: 0, opacity: 1 }}
        viewport={{ once: true }}
        transition={{ delay: 0.3, duration: 0.9 }}
      />
      {/* Top-right Sun */}
      <motion.img
        src="https://shrug-person-78902957.figma.site/_components/v2/ebb2b8f25d8e24d5f0a5ca8af4c950de81aa2fd7/sun_icon.e644b415.png"
        alt="Sun Icon"
        className="absolute top-[5%] right-[2%] sm:right-[3%] md:right-[5%] w-[100px] sm:w-[130px] md:w-[170px] h-auto z-0"
        initial={{ x: 60, y: -20, opacity: 0 }}
        whileInView={{ x: 0, y: 0, opacity: 1 }}
        viewport={{ once: true }}
        transition={{ delay: 0.2, duration: 0.9 }}
      />
      {/* Bottom-right 3D Object */}
      <motion.img
        src="https://shrug-person-78902957.figma.site/_components/v2/ebb2b8f25d8e24d5f0a5ca8af4c950de81aa2fd7/3d_object_1.cfad73a3.png"
        alt="3D Object"
        className="absolute bottom-[4%] right-[1%] sm:right-[2%] md:right-[4%] w-[130px] sm:w-[180px] md:w-[240px] h-auto z-0"
        initial={{ x: 80, y: 40, opacity: 0 }}
        whileInView={{ x: 0, y: 0, opacity: 1 }}
        viewport={{ once: true }}
        transition={{ delay: 0.4, duration: 0.9 }}
      />

      {/* Main Content Container */}
      <motion.div
        className="relative z-10 w-full max-w-4xl text-center font-['Kanit',sans-serif]"
        initial={{ y: 50, opacity: 0 }}
        whileInView={{ y: 0, opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8 }}
      >
        <h2 className="text-white text-5xl sm:text-6xl md:text-7xl lg:text-[100px] font-black leading-tight tracking-tight mb-8">
          ABOUT ME
        </h2>
        
        <p className="text-white text-lg sm:text-xl md:text-2xl font-light leading-relaxed max-w-3xl mx-auto mb-8 sm:mb-12 md:mb-16">
          I am a dedicated AWS Cloud Operations Engineer / Site Reliability & DevOps professional. I specialize in cloud infrastructure, automation, and continuous delivery, always striving to build resilient and scalable systems.
        </p>
        
        {/* Buttons Row */}
        <div className="flex flex-row justify-center items-center gap-6 md:gap-10">
          <motion.a
            href="#experience"
            className="flex items-center gap-3 px-8 py-3 rounded-[30px] bg-white text-black font-semibold text-lg md:text-xl hover:scale-105 transition-transform"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <span className="w-8 h-8 rounded-full bg-black text-white flex items-center justify-center font-bold">
              →
            </span>
            Experience
          </motion.a>
          
          <motion.a
            href="/resume.pdf"
            download
            className="flex items-center gap-3 px-8 py-3 rounded-[30px] border border-white text-white font-semibold text-lg md:text-xl hover:bg-white hover:text-black transition-colors"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            Resume
          </motion.a>
        </div>
      </motion.div>
    </section>
  );
};

export default AboutMe;
