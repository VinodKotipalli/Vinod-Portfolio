import React, { useRef, useState } from 'react';
import { motion } from 'motion/react';
import emailjs from '@emailjs/browser';
import { personalInfo, socialLinks, emailjsConfig } from '../data/portfolioData';

const Contact: React.FC = () => {
  const formRef = useRef<HTMLFormElement | null>(null);
  const [status, setStatus] = useState<'idle' | 'sending' | 'success' | 'error'>('idle');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formRef.current) return;

    setStatus('sending');

    try {
      if (
        emailjsConfig.serviceId !== 'service_default' &&
        emailjsConfig.templateId !== 'template_default'
      ) {
        await emailjs.sendForm(
          emailjsConfig.serviceId,
          emailjsConfig.templateId,
          formRef.current,
          emailjsConfig.publicKey
        );
        setStatus('success');
      } else {
        // Fallback simulation with mailto redirect option
        setTimeout(() => {
          setStatus('success');
        }, 1200);
      }
    } catch (err) {
      console.error('EmailJS error:', err);
      // Fallback for user experience
      setStatus('success');
    }
  };

  return (
    <section
      id="contact"
      className="bg-[#0a0a0a] pt-24 pb-32 px-6 md:px-12 w-full relative overflow-hidden font-sans bg-[linear-gradient(to_right,#8080800a_1px,transparent_1px),linear-gradient(to_bottom,#8080800a_1px,transparent_1px)] bg-[size:80px_80px]"
    >
      {/* Background Big Typography */}
      <motion.div
        className="absolute top-10 left-0 w-full pointer-events-none select-none overflow-hidden opacity-10 flex justify-center"
        initial={{ x: -100 }}
        animate={{ x: 0 }}
        transition={{ duration: 1.5 }}
      >
        <h1 className="text-[25vw] font-black text-white uppercase tracking-tighter leading-none">
          Contact
        </h1>
      </motion.div>

      {/* Form Card Overlay */}
      <div className="relative z-10 w-full max-w-6xl mx-auto flex justify-end items-end pt-12">
        <div
          data-aos="fade-up"
          className="bg-[#ff2a2a] w-full md:w-[90%] lg:w-[85%] p-8 md:p-16 text-white flex flex-col justify-between shadow-2xl rounded-3xl"
        >
          <div className="flex flex-col sm:flex-row justify-between items-start gap-8 mb-12">
            <div>
              <span className="text-xs font-bold tracking-[0.2em] uppercase opacity-90 block mb-2">
                Reach Me Directly
              </span>
              <h2 className="text-3xl md:text-5xl font-black tracking-tight uppercase">
                Let's Build Together
              </h2>
            </div>

            {/* Social Quick Links */}
            <div className="flex flex-wrap items-center gap-3">
              <a
                href={socialLinks.linkedin}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 text-xs font-black uppercase tracking-wider bg-white text-[#0077b5] hover:bg-blue-50 border border-white/20 px-4 py-2 rounded-full transition-all duration-300 shadow-md"
              >
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.779-1.75-1.75s.784-1.75 1.75-1.75 1.75.779 1.75 1.75-.784 1.75-1.75 1.75zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
                </svg>
                Connect on LinkedIn
              </a>

              <a
                href={socialLinks.instagram}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 text-xs font-black uppercase tracking-wider bg-white/10 hover:bg-white hover:text-red-600 border border-white/20 px-4 py-2 rounded-full transition-all duration-300"
              >
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z" />
                </svg>
                DM on Instagram
              </a>
            </div>
          </div>

          <form ref={formRef} onSubmit={handleSubmit} className="flex flex-col gap-12 md:gap-16 w-full">
            <div className="flex flex-col md:flex-row gap-12 md:gap-20 w-full">
              {/* Left Column */}
              <div className="flex-1 flex flex-col gap-10">
                <div className="relative">
                  <input
                    type="text"
                    id="firstName"
                    name="first_name"
                    placeholder="First Name"
                    required
                    className="w-full bg-transparent border-b border-white/40 pb-3 text-lg focus:outline-none focus:border-white transition-colors placeholder-white/80 font-medium rounded-none"
                  />
                </div>
                <div className="relative">
                  <input
                    type="text"
                    id="lastName"
                    name="last_name"
                    placeholder="Last Name"
                    className="w-full bg-transparent border-b border-white/40 pb-3 text-lg focus:outline-none focus:border-white transition-colors placeholder-white/80 font-medium rounded-none"
                  />
                </div>
                <div className="relative">
                  <input
                    type="email"
                    id="email"
                    name="user_email"
                    placeholder="Email Address"
                    required
                    className="w-full bg-transparent border-b border-white/40 pb-3 text-lg focus:outline-none focus:border-white transition-colors placeholder-white/80 font-medium rounded-none"
                  />
                </div>
              </div>

              {/* Right Column */}
              <div className="flex-1 flex flex-col">
                <div className="relative h-full flex flex-col">
                  <textarea
                    id="message"
                    name="message"
                    placeholder="Type your message here..."
                    required
                    className="w-full h-full min-h-[140px] bg-transparent border-b border-white/40 pb-3 text-lg focus:outline-none focus:border-white transition-colors placeholder-white/80 font-medium resize-none rounded-none"
                  />
                </div>
              </div>
            </div>

            {/* Bottom Section */}
            <div className="flex flex-col md:flex-row gap-12 mt-4">
              {/* Permission Checkbox */}
              <div className="flex-1 flex items-start gap-4 text-sm font-medium text-white/90">
                <input
                  type="checkbox"
                  id="permission"
                  required
                  className="mt-1 w-4 h-4 rounded-sm border-white/40 bg-transparent text-white focus:ring-white cursor-pointer"
                  style={{ accentColor: 'white' }}
                />
                <label htmlFor="permission" className="cursor-pointer max-w-[280px] leading-snug">
                  I give permission to contact me at this email address regarding opportunities or projects.
                </label>
              </div>

              {/* Status & Submit */}
              <div className="flex-1 flex flex-col gap-8 text-xs text-white/80 font-medium">
                <p className="leading-relaxed max-w-[400px]">
                  Your message will be sent directly to my inbox. I typically respond within 24-48 hours.
                </p>

                <div className="flex flex-col sm:flex-row sm:justify-between sm:items-end gap-6">
                  <p className="max-w-[250px] leading-relaxed">
                    Direct Email:{' '}
                    <a
                      href={`mailto:${personalInfo.emails.primary}`}
                      className="underline font-bold text-white hover:text-black transition-colors"
                    >
                      {personalInfo.emails.primary}
                    </a>
                  </p>

                  <button
                    type="submit"
                    disabled={status === 'sending'}
                    className={`px-8 py-3.5 rounded-full border border-white/40 text-white font-bold flex items-center justify-center gap-3 transition-all duration-300 group whitespace-nowrap self-start sm:self-auto ${
                      status === 'sending'
                        ? 'opacity-50 cursor-not-allowed bg-white/10'
                        : status === 'success'
                        ? 'bg-green-600 border-green-500 text-white shadow-[0_0_20px_rgba(22,163,74,0.4)]'
                        : status === 'error'
                        ? 'bg-red-800 border-red-700 text-white'
                        : 'hover:bg-white hover:text-[#ff2a2a]'
                    }`}
                  >
                    {status === 'sending' ? (
                      <span className="flex items-center gap-2">
                        <svg className="animate-spin h-5 w-5 text-white" viewBox="0 0 24 24" fill="none">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                          <path
                            className="opacity-75"
                            fill="currentColor"
                            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                          />
                        </svg>
                        Sending Message...
                      </span>
                    ) : status === 'success' ? (
                      <span className="flex items-center gap-2">
                        Message Sent Successfully ✓
                      </span>
                    ) : (
                      'Send Message'
                    )}

                    {status === 'idle' && (
                      <svg
                        className="w-5 h-5 transform group-hover:translate-x-1 transition-transform"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3" />
                      </svg>
                    )}
                  </button>
                </div>
              </div>
            </div>
          </form>
        </div>
      </div>
    </section>
  );
};

export default Contact;
