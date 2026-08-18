import React, { useRef, useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { db, handleFirestoreError, OperationType } from '../lib/firebase';
import { usePortfolio } from '../context/PortfolioContext';
import { useAuth } from '../context/AuthContext';

const Contact: React.FC = () => {
  const { data } = usePortfolio();
  const { personalInfo, socialLinks } = data;
  const { user, loading: authLoading, signInWithGoogle, logout, authError, clearAuthError } = useAuth();

  const formRef = useRef<HTMLFormElement | null>(null);
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [userEmail, setUserEmail] = useState('');
  const [message, setMessage] = useState('');
  const [permissionAgreed, setPermissionAgreed] = useState(true);

  const [status, setStatus] = useState<'idle' | 'sending' | 'success' | 'error'>('idle');
  const [feedbackMsg, setFeedbackMsg] = useState<string>('');
  const [isSigningIn, setIsSigningIn] = useState(false);

  // Sync Google user details into form fields on sign in
  useEffect(() => {
    if (user) {
      const names = (user.displayName || '').trim().split(' ');
      if (names.length > 0) {
        setFirstName(names[0]);
        setLastName(names.slice(1).join(' '));
      }
      if (user.email) {
        setUserEmail(user.email);
      }
    }
  }, [user]);

  const handleGoogleSignIn = async () => {
    setIsSigningIn(true);
    clearAuthError();
    try {
      await signInWithGoogle();
    } finally {
      setIsSigningIn(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!user) {
      setStatus('error');
      setFeedbackMsg('Please sign in with Google to submit this message.');
      return;
    }

    if (!firstName.trim() || !userEmail.trim() || !message.trim()) {
      setStatus('error');
      setFeedbackMsg('Please complete all required fields.');
      return;
    }

    setStatus('sending');
    setFeedbackMsg('');

    try {
      // 1. Send directly to Saivinod's email via AWS SES backend endpoint
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          first_name: firstName.trim(),
          last_name: lastName.trim() || undefined,
          user_email: userEmail.trim(),
          message: message.trim(),
        }),
      });

      const resData = await response.json();

      // 2. Persist to Firestore /messages collection with authenticated sender info
      try {
        const messageData: any = {
          first_name: firstName.trim(),
          user_email: userEmail.trim(),
          message: message.trim(),
          createdAt: serverTimestamp(),
        };

        if (user) {
          messageData.sender_uid = user.uid;
          if (user.email) messageData.sender_email = user.email;
          if (user.displayName) messageData.sender_name = user.displayName;
          if (user.photoURL) messageData.sender_photo = user.photoURL;
        }

        if (lastName.trim()) {
          messageData.last_name = lastName.trim();
        }

        await addDoc(collection(db, 'messages'), messageData);
      } catch (firestoreErr: any) {
        console.warn('Firestore logging note:', firestoreErr?.message || firestoreErr);
      }

      if (response.ok && resData.success) {
        setStatus('success');
        setFeedbackMsg(resData.message || 'Message sent directly to Saivinod via AWS SES!');
        setMessage('');
      } else {
        throw new Error(resData.error || 'Failed to dispatch email via AWS SES');
      }
    } catch (err: any) {
      console.error('Contact form error:', err);
      setStatus('error');
      setFeedbackMsg(err?.message || 'Error dispatching message. Please try again.');
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

      {/* Form Card Container */}
      <div className="relative z-10 w-full max-w-6xl mx-auto flex justify-end items-end pt-12">
        <div
          data-aos="fade-up"
          className="bg-[#ff2a2a] w-full md:w-[90%] lg:w-[85%] p-8 md:p-14 text-white flex flex-col justify-between shadow-2xl rounded-3xl"
        >
          {/* Header */}
          <div className="flex flex-col sm:flex-row justify-between items-start gap-8 mb-10">
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
                LinkedIn
              </a>
            </div>
          </div>

          {/* Authentication State Section */}
          {authLoading ? (
            <div className="py-16 text-center text-white/80 flex flex-col items-center justify-center gap-3">
              <svg className="animate-spin h-6 w-6 text-white" viewBox="0 0 24 24" fill="none">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
              </svg>
              <span className="text-sm font-mono tracking-wider">Verifying Authentication State...</span>
            </div>
          ) : !user ? (
            /* Unauthenticated Anti-Spam Gate */
            <div className="bg-black/30 border border-white/20 rounded-2xl p-8 md:p-10 flex flex-col items-center text-center my-4 backdrop-blur-sm">
              <div className="w-14 h-14 rounded-2xl bg-white flex items-center justify-center shadow-lg mb-5">
                <svg className="w-7 h-7" viewBox="0 0 24 24">
                  <path
                    fill="#4285F4"
                    d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.8-2.4 3.65v3.03h3.88c2.27-2.09 3.665-5.17 3.665-9.12z"
                  />
                  <path
                    fill="#34A853"
                    d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.03c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.1-6.72-4.93H1.26v3.13C3.27 21.36 7.35 24 12 24z"
                  />
                  <path
                    fill="#FBBC05"
                    d="M5.28 14.29c-.25-.72-.38-1.49-.38-2.29s.13-1.57.38-2.29V6.57H1.26C.46 8.16 0 9.98 0 12s.46 3.84 1.26 5.43l4.02-3.14z"
                  />
                  <path
                    fill="#EA4335"
                    d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.35 0 3.27 2.64 1.26 6.57l4.02 3.14c.95-2.83 3.6-4.96 6.72-4.96z"
                  />
                </svg>
              </div>

              <h3 className="text-xl md:text-2xl font-black uppercase tracking-tight text-white mb-2">
                Google Authentication Required
              </h3>
              <p className="text-sm text-white/80 max-w-md mb-6 leading-relaxed">
                To prevent spam and protect direct inbox delivery, please sign in with your Google account before sending an inquiry.
              </p>

              {authError && (
                <div className="mb-6 p-3 bg-red-950/80 border border-red-500/50 rounded-xl text-xs text-red-200 max-w-md font-mono">
                  {authError}
                </div>
              )}

              <button
                type="button"
                onClick={handleGoogleSignIn}
                disabled={isSigningIn}
                className="bg-white text-gray-900 hover:bg-gray-100 font-bold px-8 py-3.5 rounded-full flex items-center gap-3 transition-all duration-300 shadow-xl hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 cursor-pointer"
              >
                {isSigningIn ? (
                  <svg className="animate-spin h-5 w-5 text-gray-900" viewBox="0 0 24 24" fill="none">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                  </svg>
                ) : (
                  <svg className="w-5 h-5" viewBox="0 0 24 24">
                    <path
                      fill="#4285F4"
                      d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.8-2.4 3.65v3.03h3.88c2.27-2.09 3.665-5.17 3.665-9.12z"
                    />
                    <path
                      fill="#34A853"
                      d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.03c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.1-6.72-4.93H1.26v3.13C3.27 21.36 7.35 24 12 24z"
                    />
                    <path
                      fill="#FBBC05"
                      d="M5.28 14.29c-.25-.72-.38-1.49-.38-2.29s.13-1.57.38-2.29V6.57H1.26C.46 8.16 0 9.98 0 12s.46 3.84 1.26 5.43l4.02-3.14z"
                    />
                    <path
                      fill="#EA4335"
                      d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.35 0 3.27 2.64 1.26 6.57l4.02 3.14c.95-2.83 3.6-4.96 6.72-4.96z"
                    />
                  </svg>
                )}
                <span>{isSigningIn ? 'Connecting to Google...' : 'Sign in with Google'}</span>
              </button>
            </div>
          ) : (
            /* Authenticated Contact Form */
            <form ref={formRef} onSubmit={handleSubmit} className="flex flex-col gap-10 w-full">
              {/* Authenticated User Status Bar */}
              <div className="bg-black/30 border border-white/20 rounded-2xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="flex items-center gap-3.5">
                  {user.photoURL ? (
                    <img
                      src={user.photoURL}
                      alt={user.displayName || 'User'}
                      referrerPolicy="no-referrer"
                      className="w-10 h-10 rounded-full border-2 border-white/60 object-cover shadow-sm"
                    />
                  ) : (
                    <div className="w-10 h-10 rounded-full bg-white/20 border-2 border-white/40 flex items-center justify-center font-bold text-white uppercase">
                      {(user.displayName || user.email || 'U')[0]}
                    </div>
                  )}
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-sm text-white">
                        {user.displayName || 'Google User'}
                      </span>
                      <span className="inline-flex items-center gap-1 text-[10px] bg-green-500/20 text-green-300 border border-green-400/40 px-2 py-0.5 rounded-full font-mono">
                        <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                        Google Verified
                      </span>
                    </div>
                    <span className="text-xs text-white/70 font-mono block">
                      {user.email}
                    </span>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={logout}
                  className="text-xs font-mono text-white/80 hover:text-white underline self-start sm:self-auto transition-colors"
                >
                  Sign Out / Switch Account
                </button>
              </div>

              {/* Input Fields */}
              <div className="flex flex-col md:flex-row gap-10 md:gap-16 w-full">
                {/* Left Column */}
                <div className="flex-1 flex flex-col gap-8">
                  <div className="relative">
                    <label className="text-[11px] font-bold uppercase tracking-wider text-white/80 block mb-1">
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
                    <label className="text-[11px] font-bold uppercase tracking-wider text-white/80 block mb-1">
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
                    <label className="text-[11px] font-bold uppercase tracking-wider text-white/80 block mb-1">
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
                    <label className="text-[11px] font-bold uppercase tracking-wider text-white/80 block mb-1">
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
                          Dispatching via SES...
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
                        {status === 'success' && (
                          <p className="text-[10px] text-white/60 mt-0.5">
                            Dispatched via AWS Simple Email Service (SES) & Logged in Firebase
                          </p>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </form>
          )}
        </div>
      </div>
    </section>
  );
};

export default Contact;
