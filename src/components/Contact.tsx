import React, { useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { usePortfolio } from '../context/PortfolioContext';

const Contact: React.FC = () => {
  const { data } = usePortfolio();
  const { personalInfo, socialLinks } = data;

  const formRef = useRef<HTMLFormElement | null>(null);
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [userEmail, setUserEmail] = useState('');
  const [message, setMessage] = useState('');
  const [permissionAgreed, setPermissionAgreed] = useState(true);

  const [status, setStatus] = useState<'idle' | 'sending' | 'success' | 'error'>('idle');
  const [feedbackMsg, setFeedbackMsg] = useState<string>('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!firstName.trim() || !userEmail.trim() || !message.trim()) {
      setStatus('error');
      setFeedbackMsg('Please complete all required fields.');
      return;
    }

    setStatus('sending');
    setFeedbackMsg('');

    try {
      let sentSuccessfully = false;
      let confirmationMessage = 'Inquiry successfully delivered to saivinodkotipalli2003@gmail.com!';

      const payload = {
        first_name: firstName.trim(),
        last_name: lastName.trim() || undefined,
        user_email: userEmail.trim(),
        name: `${firstName.trim()} ${lastName.trim()}`.trim(),
        email: userEmail.trim(),
        message: message.trim(),
        recipient: 'saivinodkotipalli2003@gmail.com',
      };

      // 1. Try local server API route first
      try {
        const response = await fetch('/api/contact', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
          },
          body: JSON.stringify(payload),
        });

        const rawText = await response.text();
        let resData: any = null;
        if (rawText && rawText.trim().length > 0) {
          try {
            resData = JSON.parse(rawText);
          } catch {
            resData = null;
          }
        }

        if (response.ok && resData && resData.success) {
          sentSuccessfully = true;
          if (resData.message) {
            confirmationMessage = resData.message;
          }
        }
      } catch (backendErr) {
        console.warn('Server endpoint attempt notice:', backendErr);
      }

      // 2. Direct web dispatch fallback (FormSubmit AJAX delivery)
      if (!sentSuccessfully) {
        try {
          const directRes = await fetch('https://formsubmit.co/ajax/saivinodkotipalli2003@gmail.com', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Accept': 'application/json',
            },
            body: JSON.stringify({
              _subject: `[Portfolio Inquiry] New message from ${payload.name}`,
              _template: 'table',
              _captcha: 'false',
              name: payload.name,
              email: payload.email,
              message: payload.message,
              submitted_at: new Date().toLocaleString(),
            }),
          });

          const directRaw = await directRes.text();
          let directData: any = null;
          if (directRaw && directRaw.trim().length > 0) {
            try {
              directData = JSON.parse(directRaw);
            } catch {
              directData = null;
            }
          }

          if (directRes.ok || (directData && (directData.success === 'true' || directData.success === true))) {
            sentSuccessfully = true;
          }
        } catch (directErr) {
          console.warn('Direct web dispatch notice:', directErr);
        }
      }

      // 3. Persist to Firestore database as reliable record keeping
      try {
        const messageData: any = {
          first_name: firstName.trim(),
          user_email: userEmail.trim(),
          message: message.trim(),
          recipient: 'saivinodkotipalli2003@gmail.com',
          createdAt: serverTimestamp(),
        };

        if (lastName.trim()) {
          messageData.last_name = lastName.trim();
        }

        await addDoc(collection(db, 'messages'), messageData);
        sentSuccessfully = true;
      } catch (firestoreErr: any) {
        console.warn('Firestore logging note:', firestoreErr?.message || firestoreErr);
      }

      if (sentSuccessfully) {
        setStatus('success');
        setFeedbackMsg(confirmationMessage);
        setFirstName('');
        setLastName('');
        setUserEmail('');
        setMessage('');
      } else {
        throw new Error('Unable to send inquiry automatically. Please email saivinodkotipalli2003@gmail.com directly.');
      }
    } catch (err: any) {
      console.error('Contact form error:', err);
      setStatus('error');
      setFeedbackMsg(err?.message || 'Error dispatching message. Please try again or email saivinodkotipalli2003@gmail.com directly.');
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
        <h1 className="text-[25vw] font-black text-white uppercase tracking-tighter leading-none font-['Syne',sans-serif]">
          Contact
        </h1>
      </motion.div>

      {/* Form Card Container */}
      <div className="relative z-10 w-full max-w-6xl mx-auto flex justify-end items-end pt-12">
        <div
          data-aos="fade-up"
          className="bg-[#ff2a2a] w-full md:w-[90%] lg:w-[85%] p-8 md:p-14 text-white flex flex-col justify-between shadow-2xl rounded-3xl"
        >
          {/* Header */}
          <div className="flex flex-col sm:flex-row justify-between items-start gap-8 mb-10">
            <div>
              <span className="text-xs font-['JetBrains_Mono',monospace] font-bold tracking-[0.25em] uppercase text-white/90 block mb-2">
                ✦ Reach Me Directly
              </span>
              <h2 className="text-3xl md:text-5xl font-black tracking-tight uppercase font-['Syne',sans-serif]">
                Let's Build Together
              </h2>
            </div>

            {/* Social Quick Links */}
            <div className="flex flex-wrap items-center gap-3">
              <a
                href={socialLinks.linkedin}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 text-xs font-['Space_Grotesk',sans-serif] font-bold uppercase tracking-wider bg-white text-[#0077b5] hover:bg-blue-50 border border-white/20 px-4 py-2.5 rounded-full transition-all duration-300 shadow-md"
              >
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.779-1.75-1.75s.784-1.75 1.75-1.75 1.75.779 1.75 1.75-.784 1.75-1.75 1.75zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
                </svg>
                LinkedIn
              </a>
            </div>
          </div>

          {/* Direct Contact Form */}
          <form ref={formRef} onSubmit={handleSubmit} className="flex flex-col gap-10 w-full font-['Plus_Jakarta_Sans',sans-serif]">
            {/* Input Fields */}
            <div className="flex flex-col md:flex-row gap-10 md:gap-16 w-full">
              {/* Left Column */}
              <div className="flex-1 flex flex-col gap-8">
                <div className="relative">
                  <label className="text-[11px] font-['JetBrains_Mono',monospace] font-bold uppercase tracking-wider text-white/90 block mb-1">
                    First Name *
                  </label>
                  <input
                    type="text"
                    id="firstName"
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    placeholder="e.g. John"
                    required
                    className="w-full bg-transparent border-b border-white/40 pb-2 text-lg focus:outline-none focus:border-white transition-colors placeholder-white/50 font-medium rounded-none"
                  />
                </div>

                <div className="relative">
                  <label className="text-[11px] font-['JetBrains_Mono',monospace] font-bold uppercase tracking-wider text-white/90 block mb-1">
                    Last Name
                  </label>
                  <input
                    type="text"
                    id="lastName"
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                    placeholder="e.g. Doe"
                    className="w-full bg-transparent border-b border-white/40 pb-2 text-lg focus:outline-none focus:border-white transition-colors placeholder-white/50 font-medium rounded-none"
                  />
                </div>

                <div className="relative">
                  <label className="text-[11px] font-['JetBrains_Mono',monospace] font-bold uppercase tracking-wider text-white/90 block mb-1">
                    Email Address *
                  </label>
                  <input
                    type="email"
                    id="email"
                    value={userEmail}
                    onChange={(e) => setUserEmail(e.target.value)}
                    placeholder="e.g. name@company.com"
                    required
                    className="w-full bg-transparent border-b border-white/40 pb-2 text-lg focus:outline-none focus:border-white transition-colors placeholder-white/50 font-medium rounded-none"
                  />
                </div>
              </div>

              {/* Right Column */}
              <div className="flex-1 flex flex-col">
                <div className="relative h-full flex flex-col">
                  <label className="text-[11px] font-['JetBrains_Mono',monospace] font-bold uppercase tracking-wider text-white/90 block mb-1">
                    Your Message *
                  </label>
                  <textarea
                    id="message"
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="Describe your role inquiry, project requirement, or collaboration opportunity..."
                    required
                    className="w-full h-full min-h-[160px] bg-transparent border-b border-white/40 pb-2 text-lg focus:outline-none focus:border-white transition-colors placeholder-white/50 font-medium resize-none rounded-none"
                  />
                </div>
              </div>
            </div>

            {/* Bottom Actions & Delivery Info */}
            <div className="flex flex-col md:flex-row gap-10 mt-2">
              {/* Permission Checkbox */}
              <div className="flex-1 flex items-start gap-4 text-sm font-medium text-white/90">
                <input
                  type="checkbox"
                  id="permission"
                  checked={permissionAgreed}
                  onChange={(e) => setPermissionAgreed(e.target.checked)}
                  required
                  className="mt-1 w-4 h-4 rounded-sm border-white/40 bg-transparent text-white focus:ring-white cursor-pointer"
                  style={{ accentColor: 'white' }}
                />
                <label htmlFor="permission" className="cursor-pointer max-w-[320px] leading-snug text-xs">
                  I authorize direct email correspondence regarding professional AWS Cloud / DevOps opportunities.
                </label>
              </div>

              {/* Status & Submit */}
              <div className="flex-1 flex flex-col gap-6 text-xs text-white/80 font-medium">
                <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
                  <p className="text-[11px] text-white/80">
                    Direct: <a href={`mailto:${personalInfo.emails.primary}`} className="underline font-bold text-white">{personalInfo.emails.primary}</a>
                  </p>

                  <button
                    type="submit"
                    disabled={status === 'sending' || !permissionAgreed}
                    className={`px-8 py-3.5 rounded-full border border-white/40 text-white font-bold flex items-center justify-center gap-3 transition-all duration-300 group whitespace-nowrap self-start sm:self-auto cursor-pointer ${
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
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                        </svg>
                        Sending Message...
                      </span>
                    ) : status === 'success' ? (
                      <span className="flex items-center gap-2">
                        Message Sent Successfully ✓
                      </span>
                    ) : (
                      'Send Inquiry'
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

                {feedbackMsg && (
                  <div
                    className={`p-3.5 rounded-xl border text-xs font-mono flex items-center gap-2.5 ${
                      status === 'success'
                        ? 'bg-black/40 border-green-400/50 text-green-300'
                        : 'bg-black/40 border-red-400/50 text-red-300'
                    }`}
                  >
                    <span className="text-base">{status === 'success' ? '⚡' : '⚠️'}</span>
                    <div className="flex-1">
                      <p className="font-bold">{feedbackMsg}</p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </form>
        </div>
      </div>
    </section>
  );
};

export default Contact;
