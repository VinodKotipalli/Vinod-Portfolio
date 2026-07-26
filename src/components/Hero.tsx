import React, { useRef, useState } from 'react';
import { heroContent, socialLinks } from '../data/portfolioData';

const Hero: React.FC = () => {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const [isPlaying, setIsPlaying] = useState(true);
  const [isMuted, setIsMuted] = useState(true);

  const toggleVideo = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
        setIsPlaying(false);
      } else {
        videoRef.current.play();
        setIsPlaying(true);
      }
    }
  };

  const toggleMute = () => {
    if (videoRef.current) {
      videoRef.current.muted = !isMuted;
      setIsMuted(!isMuted);
    }
  };

  return (
    <section className="relative w-full min-h-screen bg-black overflow-hidden flex flex-col justify-between pt-24 pb-12">
      {/* Background Video */}
      <div className="absolute inset-0 z-0 overflow-hidden">
        <video
          ref={videoRef}
          autoPlay
          loop
          muted={isMuted}
          playsInline
          className="w-full h-full object-cover opacity-40 filter brightness-75 contrast-125 scale-105"
        >
          <source src={heroContent.heroVideoUrl} type="video/mp4" />
        </video>
        {/* Dark Gradients */}
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-black/60 z-10" />
        <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-transparent to-black/80 z-10" />
      </div>

      {/* Social Sidebar (Desktop) */}
      <div className="hidden lg:flex fixed left-8 top-1/2 -translate-y-1/2 z-30 flex-col items-center gap-6">
        <div className="w-[1px] h-16 bg-white/20" />
        <a
          href={socialLinks.github}
          target="_blank"
          rel="noopener noreferrer"
          className="text-white/60 hover:text-white hover:scale-125 transition-all duration-300"
          aria-label="GitHub"
        >
          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
            <path
              fillRule="evenodd"
              d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"
              clipRule="evenodd"
            />
          </svg>
        </a>
        <a
          href={socialLinks.linkedin}
          target="_blank"
          rel="noopener noreferrer"
          className="text-white/60 hover:text-white hover:scale-125 transition-all duration-300"
          aria-label="LinkedIn"
        >
          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
            <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.779-1.75-1.75s.784-1.75 1.75-1.75 1.75.779 1.75 1.75-.784 1.75-1.75 1.75zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
          </svg>
        </a>
        <a
          href={socialLinks.instagram}
          target="_blank"
          rel="noopener noreferrer"
          className="text-white/60 hover:text-[#ff2a2a] hover:scale-125 transition-all duration-300"
          aria-label="Instagram"
        >
          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
            <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z" />
          </svg>
        </a>
        <div className="w-[1px] h-16 bg-white/20" />
      </div>

      {/* Main Content Container */}
      <div className="relative z-20 px-6 md:px-12 max-w-7xl mx-auto flex flex-col md:flex-row justify-end md:justify-between items-start md:items-end text-left w-full my-auto">
        {/* Left Side: Text and CTA */}
        <div className="flex flex-col items-start text-left max-w-2xl w-full">
          {/* Mobile Socials */}
          <div className="flex items-center gap-4 mb-4 lg:hidden">
            <a
              href={socialLinks.github}
              target="_blank"
              rel="noopener noreferrer"
              className="text-white/60 hover:text-white"
              aria-label="GitHub"
            >
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path
                  fillRule="evenodd"
                  d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"
                  clipRule="evenodd"
                />
              </svg>
            </a>
            <a
              href={socialLinks.linkedin}
              target="_blank"
              rel="noopener noreferrer"
              className="text-white/60 hover:text-white"
              aria-label="LinkedIn"
            >
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.779-1.75-1.75s.784-1.75 1.75-1.75 1.75.779 1.75 1.75-.784 1.75-1.75 1.75zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
              </svg>
            </a>
            <a
              href={socialLinks.instagram}
              target="_blank"
              rel="noopener noreferrer"
              className="text-white/60 hover:text-[#ff2a2a]"
              aria-label="Instagram"
            >
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z" />
              </svg>
            </a>
          </div>

          {/* Greeting Badge */}
          <div className="inline-block px-4 py-1.5 rounded-full bg-white/10 border border-white/20 text-xs font-mono font-bold tracking-widest text-[#ff2a2a] uppercase mb-4 backdrop-blur-md">
            Welcome to my portfolio
          </div>

          {/* Heading */}
          <h1 className="text-white text-3xl md:text-5xl lg:text-6xl font-black mb-4 tracking-tight leading-tight">
            {heroContent.greeting}, <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-white via-red-200 to-[#ff2a2a]">
              {heroContent.titleHighlight}
            </span>
          </h1>

          {/* Subtitle */}
          <p className="text-white/80 text-sm md:text-lg font-medium mb-8 max-w-xl leading-relaxed drop-shadow-md">
            {heroContent.subtitle}
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-row flex-wrap items-center gap-3 w-full">
            <a
              href={heroContent.ctaPrimary.href}
              className="px-6 py-3 text-xs md:text-base rounded-full bg-white text-black font-bold hover:bg-gray-200 transition-all duration-300 transform hover:scale-105 shadow-lg"
            >
              {heroContent.ctaPrimary.text}
            </a>

            <a
              href={heroContent.ctaSecondary.href}
              className="px-6 py-3 text-xs md:text-base rounded-full bg-black/50 border border-white/60 text-white font-bold hover:bg-black/80 transition-all duration-300 backdrop-blur-md"
            >
              {heroContent.ctaSecondary.text}
            </a>

            <a
              href={heroContent.ctaResume.href}
              download
              className="px-6 py-3 text-xs md:text-base rounded-full bg-transparent border border-white/40 text-white font-bold hover:bg-white hover:text-black transition-all duration-300 backdrop-blur-md flex items-center gap-2"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                />
              </svg>
              {heroContent.ctaResume.text}
            </a>
          </div>
        </div>

        {/* Right Side: Play/Mute Reel Controls */}
        <div className="mt-8 md:mt-0 flex flex-col md:flex-row items-center gap-4 self-start md:self-auto">
          <div
            className="flex items-center gap-3 cursor-pointer group"
            onClick={toggleVideo}
          >
            <div className="w-12 h-12 md:w-16 md:h-16 rounded-full border border-white/30 bg-black/40 backdrop-blur-md flex justify-center items-center group-hover:scale-110 group-hover:bg-[#ff2a2a] transition-all duration-500 shadow-[0_0_30px_rgba(255,255,255,0.1)] group-hover:shadow-[0_0_40px_rgba(255,42,42,0.6)]">
              {!isPlaying ? (
                <svg className="w-5 h-5 md:w-7 md:h-7 text-white ml-1" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M8 5v14l11-7z" />
                </svg>
              ) : (
                <svg className="w-5 h-5 md:w-7 md:h-7 text-white" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z" />
                </svg>
              )}
            </div>
            <span className="text-white text-[10px] md:text-xs font-mono font-bold tracking-widest uppercase opacity-70 group-hover:opacity-100 transition-opacity">
              {!isPlaying ? 'Play Reel' : 'Pause Reel'}
            </span>
          </div>

          <button
            onClick={toggleMute}
            className="p-3 rounded-full border border-white/20 bg-black/40 backdrop-blur-md text-white/70 hover:text-white hover:border-white transition-all text-xs flex items-center gap-2"
            aria-label="Toggle Mute"
          >
            {isMuted ? (
              <>
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2" />
                </svg>
                <span className="hidden sm:inline font-mono">Unmute Audio</span>
              </>
            ) : (
              <>
                <svg className="w-4 h-4 text-[#ff2a2a]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.536 8.464a5 5 0 010 7.072M18.364 5.636a9 9 0 010 12.728M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" />
                </svg>
                <span className="hidden sm:inline font-mono text-[#ff2a2a]">Audio On</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Scroll Down Indicator */}
      <div className="relative z-20 pointer-events-none flex justify-center mt-8">
        <a href="#about" className="pointer-events-auto animate-bounce text-white/50 hover:text-white transition-colors">
          <svg
            className="w-6 h-6 drop-shadow-[0_1px_2px_rgba(255,255,255,0.6)]"
            fill="none"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="3"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path d="M19 14l-7 7m0 0l-7 7m7-7V3" />
          </svg>
        </a>
      </div>
    </section>
  );
};

export default Hero;
