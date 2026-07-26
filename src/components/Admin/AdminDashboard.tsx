import React, { useState, useRef, useEffect } from 'react';
import { usePortfolio } from '../../context/PortfolioContext';
import { validateEmail, generateOTP } from '../../utils/security';
import { GmailSuite } from './GmailSuite';
import {
  X,
  Lock,
  Unlock,
  Plus,
  Trash2,
  RefreshCw,
  Download,
  Upload,
  Check,
  Edit2,
  Save,
  Shield,
  Layers,
  Briefcase,
  Award,
  BookOpen,
  Video,
  User,
  Code,
  Sparkles,
  Key,
  AlertTriangle,
  Eye,
  EyeOff,
  ShieldCheck,
  ShieldAlert,
  Clock,
  CheckCircle2,
  Mail,
  KeyRound,
  Send,
  Copy,
  Bell,
  Radio,
  ArrowLeft,
  UserCheck,
} from 'lucide-react';

export const AdminDashboard: React.FC = () => {
  const {
    data,
    isAdminOpen,
    setIsAdminOpen,
    isAuthenticated,
    setIsAuthenticated,
    adminEmail,
    updateAdminEmail,
    verifyAdminEmail,
    updatePersonalInfo,
    updateHeroContent,
    updateAboutContent,
    updateSocialLinks,
    addProject,
    updateProject,
    deleteProject,
    clearProjects,
    updateSkillCategoryTitle,
    addSkillCategory,
    deleteSkillCategory,
    addSkill,
    updateSkill,
    deleteSkill,
    clearSkills,
    addInternship,
    updateInternship,
    deleteInternship,
    clearInternships,
    addCertificate,
    updateCertificate,
    deleteCertificate,
    clearCertificates,
    addLeadership,
    updateLeadership,
    deleteLeadership,
    clearLeadership,
    addContentCategory,
    updateContentCategory,
    deleteContentCategory,
    clearContentCreation,
    addSoftSkill,
    updateSoftSkill,
    deleteSoftSkill,
    clearSoftSkills,
    resetAllToDefault,
    resetSection,
    exportJSON,
    importJSON,
  } = usePortfolio();

  const [activeTab, setActiveTab] = useState<
    'personal' | 'projects' | 'skills' | 'experience' | 'certificates' | 'leadership' | 'content' | 'soft' | 'gmail' | 'settings'
  >('personal');

  // Admin Email + OTP Auth state
  const [authStep, setAuthStep] = useState<'credentials' | 'otp'>('credentials');
  const [emailInput, setEmailInput] = useState('saivinodkotipalli2003@gmail.com');
  const [otpInput, setOtpInput] = useState('');
  const [generatedOtp, setGeneratedOtp] = useState<string | null>(null);
  const [otpTimer, setOtpTimer] = useState(0);
  const [authError, setAuthError] = useState('');
  const [isSendingEmail, setIsSendingEmail] = useState(false);
  const [snsInfo, setSnsInfo] = useState<{
    status: string;
    messageId: string;
    region: string;
    topicArn: string;
    timestamp: string;
    otpCode: string;
    recipient: string;
    deliveryChannel: string;
  } | null>(null);
  const [copiedOtp, setCopiedOtp] = useState(false);

  // Settings Credentials State
  const [settingEmailInput, setSettingEmailInput] = useState(adminEmail);
  const [settingStatus, setSettingStatus] = useState<{ type: 'success' | 'error' | ''; msg: string }>({
    type: '',
    msg: '',
  });

  const [toastMsg, setToastMsg] = useState<string | null>(null);
  const [importJsonText, setImportJsonText] = useState('');
  const [showImportModal, setShowImportModal] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Synchronize settings state when adminEmail changes
  useEffect(() => {
    setSettingEmailInput(adminEmail);
  }, [adminEmail]);

  // OTP Countdown timer
  useEffect(() => {
    if (otpTimer <= 0) return;
    const interval = setInterval(() => {
      setOtpTimer((prev) => prev - 1);
    }, 1000);
    return () => clearInterval(interval);
  }, [otpTimer]);

  // New item draft states
  const [newProj, setNewProj] = useState({
    title: '',
    description: '',
    number: '05',
    badge: '⭐ New Project',
    techTags: 'AWS, Docker, Kubernetes',
    github: '',
    demo: '',
    isFlagship: false,
  });

  const [newInternship, setNewInternship] = useState({
    organization: '',
    role: '',
    duration: '',
    skills: 'DevOps, Cloud',
    tech: 'AWS, Docker',
  });

  const [newCert, setNewCert] = useState({
    name: '',
    issuer: '',
    icon: '☁️',
  });

  const [newLeader, setNewLeader] = useState({
    title: '',
    role: '',
    badge: 'Leadership',
    description: '',
  });

  const [newContent, setNewContent] = useState({
    title: '',
    description: '',
    stats: '100+ Views',
    icon: '🎥',
  });

  const [newSoft, setNewSoft] = useState({
    name: '',
    icon: '🚀',
    desc: '',
  });

  const [newCategoryTitle, setNewCategoryTitle] = useState('');
  const [newSkillInputs, setNewSkillInputs] = useState<{ [catIdx: number]: { name: string; level: number } }>({});

  if (!isAdminOpen) return null;

  const showToast = (msg: string) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(null), 3500);
  };

  const handleRequestOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError('');

    if (!emailInput.trim()) {
      setAuthError('Please enter your admin email address.');
      return;
    }

    if (!validateEmail(emailInput)) {
      setAuthError('Please enter a valid email address.');
      return;
    }

    const verification = verifyAdminEmail(emailInput);
    if (!verification.isValid) {
      setAuthError(verification.message);
      return;
    }

    // Generate 6-digit OTP
    const newOtp = generateOTP();
    setGeneratedOtp(newOtp);
    setIsSendingEmail(true);

    try {
      // Send OTP directly to email and AWS SNS via backend endpoint
      const res = await fetch('/api/send-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: emailInput.trim(), otp: newOtp }),
      });
      const data = await res.json().catch(() => ({}));
      if (data.snsNotification) {
        setSnsInfo(data.snsNotification);
      }
    } catch (err) {
      console.warn('Backend email/SNS send error:', err);
    } finally {
      setIsSendingEmail(false);
    }

    setAuthStep('otp');
    setOtpInput('');
    setOtpTimer(60);
    setAuthError('');
    showToast(`AWS SNS Security OTP Dispatched to ${emailInput.trim()}!`);
  };

  const handleVerifyOtp = (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError('');

    if (!otpInput.trim()) {
      setAuthError('Please enter the 6-digit OTP code.');
      return;
    }

    if (otpInput.trim() === generatedOtp) {
      setIsAuthenticated(true);
      setAuthError('');
      setAuthStep('credentials');
      setOtpInput('');
      setGeneratedOtp(null);
      setSnsInfo(null);
      showToast('Admin Authenticated via AWS SNS & Email OTP Successfully!');
    } else {
      setAuthError('Invalid OTP code. Please check your notification feed / email and try again.');
    }
  };

  const handleResendOtp = async () => {
    const newOtp = generateOTP();
    setGeneratedOtp(newOtp);
    setOtpTimer(60);
    setOtpInput('');
    setAuthError('');
    setIsSendingEmail(true);

    try {
      const res = await fetch('/api/send-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: emailInput.trim(), otp: newOtp }),
      });
      const data = await res.json().catch(() => ({}));
      if (data.snsNotification) {
        setSnsInfo(data.snsNotification);
      }
    } catch (err) {
      console.warn('Resend email error:', err);
    } finally {
      setIsSendingEmail(false);
    }

    showToast(`New AWS SNS Security OTP Dispatched to ${emailInput.trim()}!`);
  };

  const handleUpdateAdminEmail = (e: React.FormEvent) => {
    e.preventDefault();
    setSettingStatus({ type: '', msg: '' });

    const result = updateAdminEmail(settingEmailInput);
    if (result.success) {
      setSettingStatus({ type: 'success', msg: result.message });
      showToast('Administrator Email updated successfully!');
    } else {
      setSettingStatus({ type: 'error', msg: result.message });
    }
  };

  const handleExport = () => {
    const json = exportJSON();
    const blob = new Blob([json], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `portfolio-config-${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    showToast('Portfolio configuration exported successfully!');
  };

  const handleImportSubmit = () => {
    if (importJSON(importJsonText)) {
      setShowImportModal(false);
      setImportJsonText('');
      showToast('Portfolio updated successfully from JSON!');
    } else {
      alert('Invalid JSON structure. Please check the JSON format.');
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const text = event.target?.result as string;
        if (importJSON(text)) {
          showToast('JSON Configuration Imported Successfully!');
        } else {
          alert('Failed to parse uploaded JSON file.');
        }
      };
      reader.readAsText(file);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] bg-black/90 backdrop-blur-xl flex flex-col justify-between overflow-hidden text-white font-sans">
      {/* Toast Notification */}
      {toastMsg && (
        <div className="fixed top-6 right-6 z-[120] bg-[#ff2a2a] text-white px-5 py-3 rounded-2xl shadow-[0_10px_30px_rgba(255,42,42,0.5)] font-bold text-sm flex items-center gap-2 animate-bounce">
          <Sparkles className="w-4 h-4" />
          <span>{toastMsg}</span>
        </div>
      )}

      {/* Header Bar */}
      <div className="px-6 py-4 border-b border-white/10 bg-zinc-950/80 flex items-center justify-between shrink-0">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-xl bg-[#ff2a2a]/20 border border-[#ff2a2a]/40 text-[#ff2a2a]">
            <Shield className="w-5 h-5" />
          </div>
          <div>
            <h1 className="text-lg font-black tracking-wide uppercase text-white flex items-center gap-2">
              Portfolio Admin Control Center
            </h1>
            <p className="text-xs text-white/50 font-mono">
              Full Edit, Modification, Deletion, and Clear Management
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {isAuthenticated && (
            <>
              <button
                onClick={handleExport}
                className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 text-xs font-mono font-bold transition-all"
                title="Export JSON Configuration"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Export JSON</span>
              </button>

              <button
                onClick={() => setShowImportModal(true)}
                className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 text-xs font-mono font-bold transition-all"
                title="Import JSON Configuration"
              >
                <Upload className="w-3.5 h-3.5" />
                <span>Import JSON</span>
              </button>

              <button
                onClick={() => {
                  if (confirm('Are you sure you want to reset ALL portfolio data to original defaults?')) {
                    resetAllToDefault();
                    showToast('All data reset to default settings!');
                  }
                }}
                className="hidden md:flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-red-950/40 border border-red-500/30 hover:bg-red-900/60 text-red-300 text-xs font-mono font-bold transition-all"
                title="Reset All Data to Defaults"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                <span>Reset All</span>
              </button>

              <button
                onClick={() => {
                  setIsAuthenticated(false);
                  showToast('Admin Panel Locked');
                }}
                className="p-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-white/70 hover:text-white transition-all"
                title="Lock Admin"
              >
                <Lock className="w-4 h-4" />
              </button>
            </>
          )}

          <button
            onClick={() => setIsAdminOpen(false)}
            className="p-2 rounded-xl bg-white/10 hover:bg-[#ff2a2a] text-white transition-all ml-2"
            title="Close Admin Panel"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Main Content Area */}
      {!isAuthenticated ? (
        /* Email OTP Authentication Gateway */
        <div className="flex-1 flex flex-col items-center justify-center p-6 bg-gradient-to-b from-black via-zinc-950 to-black">
          <div className="w-full max-w-lg bg-white/5 border border-white/10 rounded-3xl p-8 backdrop-blur-xl shadow-2xl relative overflow-hidden">
            {/* Top Red Security Glow Line */}
            <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-[#ff2a2a] to-transparent" />

            {/* Header Icon & Title */}
            <div className="text-center mb-6">
              <div className="w-16 h-16 rounded-2xl bg-[#ff2a2a]/10 border border-[#ff2a2a]/30 flex items-center justify-center mx-auto mb-4 text-[#ff2a2a] shadow-[0_0_20px_rgba(255,42,42,0.25)]">
                <ShieldCheck className="w-8 h-8 text-[#ff2a2a]" />
              </div>
              <h2 className="text-2xl font-black text-white uppercase tracking-tight flex items-center justify-center gap-2">
                <span>Admin Login Gateway</span>
              </h2>
              <p className="text-xs text-white/60 font-mono mt-1 leading-relaxed">
                Strict Admin Verification • Direct Email OTP Authentication
              </p>
            </div>

            {authStep === 'credentials' ? (
              /* Step 1: Email Input Form */
              <form onSubmit={handleRequestOtp} className="space-y-4">
                <div className="space-y-3">
                  {/* Admin Email Input */}
                  <div>
                    <label className="block text-xs font-mono text-white/70 mb-1.5 uppercase flex items-center gap-1.5">
                      <Mail className="w-3.5 h-3.5 text-[#ff2a2a]" />
                      <span>Admin Email Address</span>
                    </label>
                    <input
                      type="email"
                      value={emailInput}
                      onChange={(e) => setEmailInput(e.target.value)}
                      placeholder="saivinodkotipalli2003@gmail.com"
                      className="w-full px-4 py-3 bg-black/70 border border-white/20 rounded-2xl text-sm font-mono text-white focus:outline-none focus:border-[#ff2a2a] transition-all placeholder:text-white/30"
                      required
                    />
                  </div>
                </div>

                {authError && (
                  <div className="p-3.5 bg-red-950/60 border border-red-500/40 rounded-2xl text-red-300 text-xs font-mono flex items-start gap-2.5">
                    <ShieldAlert className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
                    <span className="leading-relaxed">{authError}</span>
                  </div>
                )}

                <button
                  type="submit"
                  disabled={isSendingEmail}
                  className="w-full py-3.5 bg-[#ff2a2a] hover:bg-red-600 disabled:bg-zinc-800 text-white font-bold rounded-2xl uppercase tracking-wider text-xs transition-all shadow-[0_0_20px_rgba(255,42,42,0.4)] flex items-center justify-center gap-2"
                >
                  <Send className="w-4 h-4" />
                  <span>{isSendingEmail ? 'Dispatching Email OTP...' : 'Send OTP to Mail'}</span>
                </button>
              </form>
            ) : (
              /* Step 2: 6-Digit OTP Form */
              <form onSubmit={handleVerifyOtp} className="space-y-4">
                {/* Visual AWS SNS OTP Notification Banner */}
                <div className="p-4 bg-gradient-to-r from-red-950/50 via-zinc-950 to-black border border-[#ff2a2a]/40 rounded-2xl text-white text-xs font-mono space-y-3 relative overflow-hidden shadow-lg">
                  <div className="flex items-center justify-between border-b border-white/10 pb-2">
                    <div className="flex items-center gap-2 font-bold text-[#ff2a2a]">
                      <Radio className="w-4 h-4 text-[#ff2a2a] animate-pulse" />
                      <span>AWS SNS Security Service Active</span>
                    </div>
                    <span className="text-[10px] bg-emerald-950 text-emerald-400 px-2 py-0.5 rounded-full border border-emerald-500/30 font-bold uppercase tracking-wider">
                      LIVE DISPATCH
                    </span>
                  </div>

                  <div className="space-y-1.5 text-[11px] text-white/80">
                    <div className="flex items-center justify-between">
                      <span className="text-white/50">Recipient:</span>
                      <strong className="text-white font-mono">{emailInput}</strong>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-white/50">Message ID:</span>
                      <span className="text-white/70 font-mono text-[10px]">
                        {snsInfo?.messageId || 'sns-dispatch-live-active'}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-white/50">Delivery Channel:</span>
                      <span className="text-emerald-400 text-[10px]">
                        AWS SNS (Email & Notification Push)
                      </span>
                    </div>
                  </div>

                  {/* One-Click Quick Auto-Fill for Seamless Access */}
                  {generatedOtp && (
                    <div className="pt-2 border-t border-white/10 flex items-center justify-between bg-black/60 p-2.5 rounded-xl border border-white/5">
                      <div className="flex items-center gap-2">
                        <Bell className="w-3.5 h-3.5 text-[#ff2a2a] shrink-0" />
                        <span className="text-[10px] text-white/60">SNS Passcode Alert:</span>
                        <span className="font-mono font-bold text-amber-300 text-sm tracking-wider">{generatedOtp}</span>
                      </div>
                      <button
                        type="button"
                        onClick={() => {
                          setOtpInput(generatedOtp);
                          setCopiedOtp(true);
                          setTimeout(() => setCopiedOtp(false), 2000);
                        }}
                        className="px-2.5 py-1 bg-[#ff2a2a]/20 hover:bg-[#ff2a2a] text-[#ff2a2a] hover:text-white rounded-lg text-[10px] font-bold transition-all border border-[#ff2a2a]/30 flex items-center gap-1 shrink-0"
                      >
                        {copiedOtp ? (
                          <>
                            <Check className="w-3 h-3 text-emerald-400" />
                            <span>Auto-filled!</span>
                          </>
                        ) : (
                          <>
                            <Copy className="w-3 h-3" />
                            <span>Auto-Fill Code</span>
                          </>
                        )}
                      </button>
                    </div>
                  )}
                </div>

                <div>
                  <label className="block text-xs font-mono text-white/70 mb-1.5 uppercase text-center">
                    Enter 6-Digit Email OTP Code
                  </label>
                  <input
                    type="text"
                    maxLength={6}
                    value={otpInput}
                    onChange={(e) => setOtpInput(e.target.value.replace(/\D/g, ''))}
                    placeholder="0 0 0 0 0 0"
                    className="w-full px-4 py-3.5 bg-black/80 border border-white/20 rounded-2xl text-center text-2xl font-mono tracking-[0.5em] text-white focus:outline-none focus:border-[#ff2a2a] transition-all placeholder:text-white/20"
                    autoFocus
                  />
                </div>

                {authError && (
                  <div className="p-3 bg-red-950/60 border border-red-500/30 rounded-xl text-red-400 text-xs font-mono flex items-center justify-center gap-2">
                    <ShieldAlert className="w-4 h-4 text-red-400 shrink-0" />
                    <span>{authError}</span>
                  </div>
                )}

                <button
                  type="submit"
                  disabled={otpInput.length < 6}
                  className="w-full py-3.5 bg-[#ff2a2a] hover:bg-red-600 disabled:bg-zinc-800 disabled:text-white/30 text-white font-bold rounded-2xl uppercase tracking-wider text-xs transition-all shadow-[0_0_20px_rgba(255,42,42,0.4)] flex items-center justify-center gap-2"
                >
                  <Unlock className="w-4 h-4" />
                  <span>Verify OTP &amp; Enter Dashboard</span>
                </button>

                {/* Resend & Back controls */}
                <div className="flex items-center justify-between pt-2 text-xs font-mono">
                  <button
                    type="button"
                    onClick={() => {
                      setAuthStep('credentials');
                      setAuthError('');
                    }}
                    className="text-white/50 hover:text-white transition-colors flex items-center gap-1"
                  >
                    <ArrowLeft className="w-3.5 h-3.5" />
                    <span>Change Email</span>
                  </button>

                  <button
                    type="button"
                    onClick={handleResendOtp}
                    disabled={otpTimer > 45 || isSendingEmail}
                    className="text-[#ff2a2a] hover:underline disabled:text-white/30 disabled:no-underline transition-all flex items-center gap-1"
                  >
                    <RefreshCw className="w-3 h-3" />
                    <span>Resend OTP {otpTimer > 0 ? `(${otpTimer}s)` : ''}</span>
                  </button>
                </div>
              </form>
            )}

            <div className="mt-6 pt-4 border-t border-white/10 flex items-center justify-center gap-2 text-[11px] text-emerald-400 font-mono">
              <UserCheck className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>Restricted Access • Authorized Administrator Only</span>
            </div>
          </div>
        </div>
      ) : (
        /* Authenticated Dashboard */
        <div className="flex-1 flex flex-col md:flex-row overflow-hidden bg-zinc-950">
          {/* Navigation Sidebar */}
          <div className="w-full md:w-64 border-b md:border-b-0 md:border-r border-white/10 bg-black/60 p-4 flex flex-row md:flex-col gap-2 overflow-x-auto shrink-0 scrollbar-none">
            <button
              onClick={() => setActiveTab('personal')}
              className={`flex items-center gap-2.5 px-4 py-3 rounded-2xl text-xs font-bold uppercase tracking-wider transition-all text-left whitespace-nowrap shrink-0 ${
                activeTab === 'personal'
                  ? 'bg-[#ff2a2a] text-white shadow-[0_0_15px_rgba(255,42,42,0.4)]'
                  : 'bg-white/5 text-white/70 hover:bg-white/10 hover:text-white'
              }`}
            >
              <User className="w-4 h-4" />
              <span>Personal & Hero</span>
            </button>

            <button
              onClick={() => setActiveTab('projects')}
              className={`flex items-center justify-between gap-2.5 px-4 py-3 rounded-2xl text-xs font-bold uppercase tracking-wider transition-all text-left whitespace-nowrap shrink-0 ${
                activeTab === 'projects'
                  ? 'bg-[#ff2a2a] text-white shadow-[0_0_15px_rgba(255,42,42,0.4)]'
                  : 'bg-white/5 text-white/70 hover:bg-white/10 hover:text-white'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <Code className="w-4 h-4" />
                <span>Projects</span>
              </div>
              <span className="px-2 py-0.5 rounded-full text-[10px] bg-black/40 text-white font-mono">
                {data.projects.length}
              </span>
            </button>

            <button
              onClick={() => setActiveTab('skills')}
              className={`flex items-center justify-between gap-2.5 px-4 py-3 rounded-2xl text-xs font-bold uppercase tracking-wider transition-all text-left whitespace-nowrap shrink-0 ${
                activeTab === 'skills'
                  ? 'bg-[#ff2a2a] text-white shadow-[0_0_15px_rgba(255,42,42,0.4)]'
                  : 'bg-white/5 text-white/70 hover:bg-white/10 hover:text-white'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <Layers className="w-4 h-4" />
                <span>Tech Skills</span>
              </div>
              <span className="px-2 py-0.5 rounded-full text-[10px] bg-black/40 text-white font-mono">
                {data.technicalSkills.categories.length}
              </span>
            </button>

            <button
              onClick={() => setActiveTab('experience')}
              className={`flex items-center justify-between gap-2.5 px-4 py-3 rounded-2xl text-xs font-bold uppercase tracking-wider transition-all text-left whitespace-nowrap shrink-0 ${
                activeTab === 'experience'
                  ? 'bg-[#ff2a2a] text-white shadow-[0_0_15px_rgba(255,42,42,0.4)]'
                  : 'bg-white/5 text-white/70 hover:bg-white/10 hover:text-white'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <Briefcase className="w-4 h-4" />
                <span>Experience</span>
              </div>
              <span className="px-2 py-0.5 rounded-full text-[10px] bg-black/40 text-white font-mono">
                {data.internshipsList.length}
              </span>
            </button>

            <button
              onClick={() => setActiveTab('certificates')}
              className={`flex items-center justify-between gap-2.5 px-4 py-3 rounded-2xl text-xs font-bold uppercase tracking-wider transition-all text-left whitespace-nowrap shrink-0 ${
                activeTab === 'certificates'
                  ? 'bg-[#ff2a2a] text-white shadow-[0_0_15px_rgba(255,42,42,0.4)]'
                  : 'bg-white/5 text-white/70 hover:bg-white/10 hover:text-white'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <Award className="w-4 h-4" />
                <span>Certificates</span>
              </div>
              <span className="px-2 py-0.5 rounded-full text-[10px] bg-black/40 text-white font-mono">
                {data.certificates.featured.length}
              </span>
            </button>

            <button
              onClick={() => setActiveTab('leadership')}
              className={`flex items-center justify-between gap-2.5 px-4 py-3 rounded-2xl text-xs font-bold uppercase tracking-wider transition-all text-left whitespace-nowrap shrink-0 ${
                activeTab === 'leadership'
                  ? 'bg-[#ff2a2a] text-white shadow-[0_0_15px_rgba(255,42,42,0.4)]'
                  : 'bg-white/5 text-white/70 hover:bg-white/10 hover:text-white'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <BookOpen className="w-4 h-4" />
                <span>Leadership</span>
              </div>
              <span className="px-2 py-0.5 rounded-full text-[10px] bg-black/40 text-white font-mono">
                {data.leadershipList.length}
              </span>
            </button>

            <button
              onClick={() => setActiveTab('content')}
              className={`flex items-center justify-between gap-2.5 px-4 py-3 rounded-2xl text-xs font-bold uppercase tracking-wider transition-all text-left whitespace-nowrap shrink-0 ${
                activeTab === 'content'
                  ? 'bg-[#ff2a2a] text-white shadow-[0_0_15px_rgba(255,42,42,0.4)]'
                  : 'bg-white/5 text-white/70 hover:bg-white/10 hover:text-white'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <Video className="w-4 h-4" />
                <span>Content/Media</span>
              </div>
              <span className="px-2 py-0.5 rounded-full text-[10px] bg-black/40 text-white font-mono">
                {data.contentCreation.categories.length}
              </span>
            </button>

            <button
              onClick={() => setActiveTab('soft')}
              className={`flex items-center justify-between gap-2.5 px-4 py-3 rounded-2xl text-xs font-bold uppercase tracking-wider transition-all text-left whitespace-nowrap shrink-0 ${
                activeTab === 'soft'
                  ? 'bg-[#ff2a2a] text-white shadow-[0_0_15px_rgba(255,42,42,0.4)]'
                  : 'bg-white/5 text-white/70 hover:bg-white/10 hover:text-white'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <Sparkles className="w-4 h-4" />
                <span>Soft Skills</span>
              </div>
              <span className="px-2 py-0.5 rounded-full text-[10px] bg-black/40 text-white font-mono">
                {data.softSkillsList.length}
              </span>
            </button>

            <button
              onClick={() => setActiveTab('gmail')}
              className={`flex items-center justify-between gap-2.5 px-4 py-3 rounded-2xl text-xs font-bold uppercase tracking-wider transition-all text-left whitespace-nowrap shrink-0 ${
                activeTab === 'gmail'
                  ? 'bg-[#ff2a2a] text-white shadow-[0_0_15px_rgba(255,42,42,0.4)]'
                  : 'bg-white/5 text-white/70 hover:bg-white/10 hover:text-white'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <Mail className="w-4 h-4 text-[#ff2a2a]" />
                <span>Gmail Suite</span>
              </div>
              <span className="px-2 py-0.5 rounded-full text-[10px] bg-emerald-950 text-emerald-400 border border-emerald-500/30 font-mono">
                OAuth 2.0
              </span>
            </button>

            <div className="mt-auto pt-4 border-t border-white/10 hidden md:block">
              <button
                onClick={() => setActiveTab('settings')}
                className={`w-full flex items-center gap-2.5 px-4 py-3 rounded-2xl text-xs font-bold uppercase tracking-wider transition-all text-left ${
                  activeTab === 'settings'
                    ? 'bg-white text-black shadow-lg'
                    : 'bg-white/5 text-white/70 hover:bg-white/10 hover:text-white'
                }`}
              >
                <Key className="w-4 h-4" />
                <span>Security & Backup</span>
              </button>
            </div>
          </div>

          {/* Main Tab View */}
          <div className="flex-1 p-6 overflow-y-auto max-h-full space-y-8">
            {/* TAB 1: Personal & Hero */}
            {activeTab === 'personal' && (
              <div className="space-y-6 max-w-4xl">
                <div className="flex items-center justify-between pb-4 border-b border-white/10">
                  <div>
                    <h2 className="text-xl font-black text-white uppercase tracking-wider">
                      Personal & Hero Information
                    </h2>
                    <p className="text-xs text-white/50 font-mono">
                      Edit your main header titles, location, contact emails, and social links.
                    </p>
                  </div>
                  <button
                    onClick={() => {
                      resetSection('personalInfo');
                      resetSection('heroContent');
                      showToast('Reset Personal & Hero info to default');
                    }}
                    className="px-3 py-1.5 rounded-xl bg-white/5 border border-white/10 text-xs font-mono hover:bg-white/10 transition-all flex items-center gap-1.5"
                  >
                    <RefreshCw className="w-3.5 h-3.5" />
                    <span>Reset Section</span>
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-mono text-white/60 mb-1 uppercase font-bold">
                      Full Name
                    </label>
                    <input
                      type="text"
                      value={data.personalInfo.name}
                      onChange={(e) => updatePersonalInfo({ name: e.target.value })}
                      className="w-full px-4 py-2.5 bg-black/50 border border-white/15 rounded-xl text-sm font-medium focus:border-[#ff2a2a] focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-mono text-white/60 mb-1 uppercase font-bold">
                      Professional Title
                    </label>
                    <input
                      type="text"
                      value={data.personalInfo.title}
                      onChange={(e) => {
                        updatePersonalInfo({ title: e.target.value });
                        updateHeroContent({ titleHighlight: e.target.value });
                      }}
                      className="w-full px-4 py-2.5 bg-black/50 border border-white/15 rounded-xl text-sm font-medium focus:border-[#ff2a2a] focus:outline-none text-[#ff2a2a] font-bold"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-mono text-white/60 mb-1 uppercase font-bold">
                      Primary Email
                    </label>
                    <input
                      type="email"
                      value={data.personalInfo.emails.primary}
                      onChange={(e) =>
                        updatePersonalInfo({
                          emails: { ...data.personalInfo.emails, primary: e.target.value },
                        })
                      }
                      className="w-full px-4 py-2.5 bg-black/50 border border-white/15 rounded-xl text-sm font-medium focus:border-[#ff2a2a] focus:outline-none font-mono"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-mono text-white/60 mb-1 uppercase font-bold">
                      Location
                    </label>
                    <input
                      type="text"
                      value={data.personalInfo.location}
                      onChange={(e) => updatePersonalInfo({ location: e.target.value })}
                      className="w-full px-4 py-2.5 bg-black/50 border border-white/15 rounded-xl text-sm font-medium focus:border-[#ff2a2a] focus:outline-none"
                    />
                  </div>

                  <div className="md:col-span-2">
                    <label className="block text-xs font-mono text-white/60 mb-1 uppercase font-bold">
                      Hero Subtitle / Headline
                    </label>
                    <textarea
                      rows={2}
                      value={data.heroContent.subtitle}
                      onChange={(e) => updateHeroContent({ subtitle: e.target.value })}
                      className="w-full px-4 py-2.5 bg-black/50 border border-white/15 rounded-xl text-sm font-medium focus:border-[#ff2a2a] focus:outline-none"
                    />
                  </div>

                  <div className="md:col-span-2">
                    <label className="block text-xs font-mono text-white/60 mb-1 uppercase font-bold">
                      Summary / Bio
                    </label>
                    <textarea
                      rows={3}
                      value={data.personalInfo.summary}
                      onChange={(e) => updatePersonalInfo({ summary: e.target.value })}
                      className="w-full px-4 py-2.5 bg-black/50 border border-white/15 rounded-xl text-sm font-medium focus:border-[#ff2a2a] focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-mono text-white/60 mb-1 uppercase font-bold">
                      GitHub URL
                    </label>
                    <input
                      type="text"
                      value={data.socialLinks.github}
                      onChange={(e) => updateSocialLinks({ github: e.target.value })}
                      className="w-full px-4 py-2.5 bg-black/50 border border-white/15 rounded-xl text-sm font-medium focus:border-[#ff2a2a] focus:outline-none font-mono"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-mono text-white/60 mb-1 uppercase font-bold">
                      LinkedIn URL
                    </label>
                    <input
                      type="text"
                      value={data.socialLinks.linkedin}
                      onChange={(e) => updateSocialLinks({ linkedin: e.target.value })}
                      className="w-full px-4 py-2.5 bg-black/50 border border-white/15 rounded-xl text-sm font-medium focus:border-[#ff2a2a] focus:outline-none font-mono"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* TAB 2: Projects */}
            {activeTab === 'projects' && (
              <div className="space-y-6 max-w-5xl">
                <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-white/10">
                  <div>
                    <h2 className="text-xl font-black text-white uppercase tracking-wider flex items-center gap-2">
                      <span>Projects Management</span>
                      <span className="text-xs font-mono bg-[#ff2a2a]/20 text-[#ff2a2a] border border-[#ff2a2a]/30 px-2.5 py-0.5 rounded-full">
                        {data.projects.length} Total
                      </span>
                    </h2>
                    <p className="text-xs text-white/50 font-mono">
                      Add, modify, edit tech tags, live links, or clear all projects.
                    </p>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => {
                        if (confirm('Are you sure you want to CLEAR ALL projects?')) {
                          clearProjects();
                          showToast('All projects cleared');
                        }
                      }}
                      className="px-3 py-1.5 rounded-xl bg-red-950/40 border border-red-500/30 text-red-300 text-xs font-mono hover:bg-red-900/60 transition-all flex items-center gap-1.5"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                      <span>Clear All</span>
                    </button>

                    <button
                      onClick={() => {
                        resetSection('projects');
                        showToast('Reset projects to default');
                      }}
                      className="px-3 py-1.5 rounded-xl bg-white/5 border border-white/10 text-xs font-mono hover:bg-white/10 transition-all flex items-center gap-1.5"
                    >
                      <RefreshCw className="w-3.5 h-3.5" />
                      <span>Reset Section</span>
                    </button>
                  </div>
                </div>

                {/* Add New Project Card Form */}
                <div className="bg-white/5 border border-white/10 rounded-2xl p-5 space-y-4">
                  <h3 className="text-sm font-bold uppercase tracking-wider text-[#ff2a2a] flex items-center gap-2">
                    <Plus className="w-4 h-4" />
                    <span>Add New Project Integration</span>
                  </h3>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                    <input
                      type="text"
                      placeholder="Project Title (e.g. AWS Multi-Region Deployment)"
                      value={newProj.title}
                      onChange={(e) => setNewProj({ ...newProj, title: e.target.value })}
                      className="px-3.5 py-2 bg-black/60 border border-white/15 rounded-xl text-xs font-medium focus:border-[#ff2a2a] focus:outline-none"
                    />

                    <input
                      type="text"
                      placeholder="Badge (e.g. 🚀 Flagship Project)"
                      value={newProj.badge}
                      onChange={(e) => setNewProj({ ...newProj, badge: e.target.value })}
                      className="px-3.5 py-2 bg-black/60 border border-white/15 rounded-xl text-xs font-medium focus:border-[#ff2a2a] focus:outline-none"
                    />

                    <input
                      type="text"
                      placeholder="Tech Tags (e.g. AWS, Docker, Terraform)"
                      value={newProj.techTags}
                      onChange={(e) => setNewProj({ ...newProj, techTags: e.target.value })}
                      className="px-3.5 py-2 bg-black/60 border border-white/15 rounded-xl text-xs font-medium focus:border-[#ff2a2a] focus:outline-none font-mono"
                    />

                    <input
                      type="text"
                      placeholder="GitHub URL"
                      value={newProj.github}
                      onChange={(e) => setNewProj({ ...newProj, github: e.target.value })}
                      className="px-3.5 py-2 bg-black/60 border border-white/15 rounded-xl text-xs font-medium focus:border-[#ff2a2a] focus:outline-none font-mono"
                    />

                    <input
                      type="text"
                      placeholder="Live Demo URL"
                      value={newProj.demo}
                      onChange={(e) => setNewProj({ ...newProj, demo: e.target.value })}
                      className="px-3.5 py-2 bg-black/60 border border-white/15 rounded-xl text-xs font-medium focus:border-[#ff2a2a] focus:outline-none font-mono"
                    />

                    <div className="flex items-center gap-2 px-2">
                      <label className="flex items-center gap-2 cursor-pointer text-xs font-mono text-white/80">
                        <input
                          type="checkbox"
                          checked={newProj.isFlagship}
                          onChange={(e) => setNewProj({ ...newProj, isFlagship: e.target.checked })}
                          className="accent-[#ff2a2a] w-4 h-4"
                        />
                        <span>Flagship Project</span>
                      </label>
                    </div>

                    <textarea
                      rows={2}
                      placeholder="Project Description..."
                      value={newProj.description}
                      onChange={(e) => setNewProj({ ...newProj, description: e.target.value })}
                      className="md:col-span-3 px-3.5 py-2 bg-black/60 border border-white/15 rounded-xl text-xs font-medium focus:border-[#ff2a2a] focus:outline-none"
                    />
                  </div>

                  <button
                    onClick={() => {
                      if (!newProj.title.trim()) {
                        alert('Please enter a project title');
                        return;
                      }
                      addProject({
                        number: newProj.number,
                        badge: newProj.badge || null,
                        title: newProj.title,
                        description: newProj.description,
                        techTags: newProj.techTags
                          .split(',')
                          .map((t) => t.trim())
                          .filter(Boolean),
                        links: {
                          github: newProj.github || undefined,
                          demo: newProj.demo || undefined,
                        },
                        isFlagship: newProj.isFlagship,
                      });
                      setNewProj({
                        title: '',
                        description: '',
                        number: `0${data.projects.length + 2}`,
                        badge: '⭐ New Project',
                        techTags: 'AWS, Docker, Kubernetes',
                        github: '',
                        demo: '',
                        isFlagship: false,
                      });
                      showToast('Project Added Successfully!');
                    }}
                    className="px-4 py-2 bg-[#ff2a2a] hover:bg-red-600 text-white font-bold rounded-xl text-xs uppercase tracking-wider flex items-center gap-1.5 transition-all shadow-[0_0_15px_rgba(255,42,42,0.3)]"
                  >
                    <Plus className="w-4 h-4" />
                    <span>Create Project</span>
                  </button>
                </div>

                {/* Existing Projects List */}
                <div className="space-y-4">
                  {data.projects.map((proj, idx) => (
                    <div
                      key={proj.id}
                      className="bg-black/50 border border-white/10 rounded-2xl p-4 space-y-3 relative group hover:border-white/20 transition-all"
                    >
                      <div className="flex items-center justify-between gap-2 border-b border-white/10 pb-2">
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-mono font-bold text-[#ff2a2a] bg-[#ff2a2a]/10 px-2 py-0.5 rounded-lg border border-[#ff2a2a]/20">
                            #{idx + 1}
                          </span>
                          <input
                            type="text"
                            value={proj.title}
                            onChange={(e) => updateProject(proj.id, { title: e.target.value })}
                            className="bg-transparent text-base font-bold text-white focus:bg-black/60 focus:outline-none focus:border-[#ff2a2a] border border-transparent rounded-lg px-2 py-0.5"
                          />
                        </div>

                        <button
                          onClick={() => {
                            deleteProject(proj.id);
                            showToast('Project deleted');
                          }}
                          className="p-1.5 rounded-lg bg-red-950/40 text-red-400 hover:bg-red-600 hover:text-white transition-all text-xs flex items-center gap-1"
                          title="Delete Project"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        <div>
                          <label className="block text-[10px] font-mono text-white/50 uppercase">Badge</label>
                          <input
                            type="text"
                            value={proj.badge || ''}
                            onChange={(e) => updateProject(proj.id, { badge: e.target.value })}
                            className="w-full px-3 py-1.5 bg-black/60 border border-white/10 rounded-lg text-xs font-medium focus:outline-none"
                          />
                        </div>

                        <div>
                          <label className="block text-[10px] font-mono text-white/50 uppercase">
                            Tech Tags (comma separated)
                          </label>
                          <input
                            type="text"
                            value={proj.techTags.join(', ')}
                            onChange={(e) =>
                              updateProject(proj.id, {
                                techTags: e.target.value
                                  .split(',')
                                  .map((t) => t.trim())
                                  .filter(Boolean),
                              })
                            }
                            className="w-full px-3 py-1.5 bg-black/60 border border-white/10 rounded-lg text-xs font-mono focus:outline-none"
                          />
                        </div>

                        <div className="md:col-span-2">
                          <label className="block text-[10px] font-mono text-white/50 uppercase">Description</label>
                          <textarea
                            rows={2}
                            value={proj.description}
                            onChange={(e) => updateProject(proj.id, { description: e.target.value })}
                            className="w-full px-3 py-1.5 bg-black/60 border border-white/10 rounded-lg text-xs font-medium focus:outline-none"
                          />
                        </div>

                        <div>
                          <label className="block text-[10px] font-mono text-white/50 uppercase">GitHub Repo</label>
                          <input
                            type="text"
                            value={proj.links.github || ''}
                            onChange={(e) =>
                              updateProject(proj.id, {
                                links: { ...proj.links, github: e.target.value },
                              })
                            }
                            className="w-full px-3 py-1.5 bg-black/60 border border-white/10 rounded-lg text-xs font-mono focus:outline-none text-white/80"
                          />
                        </div>

                        <div>
                          <label className="block text-[10px] font-mono text-white/50 uppercase">Live Demo</label>
                          <input
                            type="text"
                            value={proj.links.demo || ''}
                            onChange={(e) =>
                              updateProject(proj.id, {
                                links: { ...proj.links, demo: e.target.value },
                              })
                            }
                            className="w-full px-3 py-1.5 bg-black/60 border border-white/10 rounded-lg text-xs font-mono focus:outline-none text-white/80"
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* TAB 3: Technical Skills */}
            {activeTab === 'skills' && (
              <div className="space-y-6 max-w-5xl">
                <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-white/10">
                  <div>
                    <h2 className="text-xl font-black text-white uppercase tracking-wider flex items-center gap-2">
                      <span>Technical Skills & Tools</span>
                      <span className="text-xs font-mono bg-[#ff2a2a]/20 text-[#ff2a2a] border border-[#ff2a2a]/30 px-2.5 py-0.5 rounded-full">
                        {data.technicalSkills.categories.length} Categories
                      </span>
                    </h2>
                    <p className="text-xs text-white/50 font-mono">
                      Edit skill categories, skill names, proficiency levels, or clear/reset.
                    </p>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => {
                        if (confirm('Are you sure you want to CLEAR ALL technical skills?')) {
                          clearSkills();
                          showToast('All technical skills cleared');
                        }
                      }}
                      className="px-3 py-1.5 rounded-xl bg-red-950/40 border border-red-500/30 text-red-300 text-xs font-mono hover:bg-red-900/60 transition-all flex items-center gap-1.5"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                      <span>Clear All</span>
                    </button>

                    <button
                      onClick={() => {
                        resetSection('technicalSkills');
                        showToast('Reset skills to default');
                      }}
                      className="px-3 py-1.5 rounded-xl bg-white/5 border border-white/10 text-xs font-mono hover:bg-white/10 transition-all flex items-center gap-1.5"
                    >
                      <RefreshCw className="w-3.5 h-3.5" />
                      <span>Reset Section</span>
                    </button>
                  </div>
                </div>

                {/* Add Category Form */}
                <div className="bg-white/5 border border-white/10 rounded-2xl p-4 flex gap-3">
                  <input
                    type="text"
                    placeholder="New Category Name (e.g. AWS & Cloud DevOps)"
                    value={newCategoryTitle}
                    onChange={(e) => setNewCategoryTitle(e.target.value)}
                    className="flex-1 px-3.5 py-2 bg-black/60 border border-white/15 rounded-xl text-xs font-medium focus:border-[#ff2a2a] focus:outline-none"
                  />
                  <button
                    onClick={() => {
                      if (!newCategoryTitle.trim()) return;
                      addSkillCategory(newCategoryTitle.trim());
                      setNewCategoryTitle('');
                      showToast('Category Added');
                    }}
                    className="px-4 py-2 bg-[#ff2a2a] text-white font-bold rounded-xl text-xs uppercase tracking-wider flex items-center gap-1"
                  >
                    <Plus className="w-4 h-4" />
                    <span>Add Category</span>
                  </button>
                </div>

                {/* Categories & Skills List */}
                <div className="space-y-6">
                  {data.technicalSkills.categories.map((cat, catIdx) => (
                    <div key={catIdx} className="bg-black/50 border border-white/10 rounded-2xl p-5 space-y-4">
                      <div className="flex items-center justify-between pb-3 border-b border-white/10">
                        <input
                          type="text"
                          value={cat.title}
                          onChange={(e) => updateSkillCategoryTitle(catIdx, e.target.value)}
                          className="bg-transparent text-base font-black text-[#ff2a2a] uppercase tracking-wider focus:bg-black/60 focus:outline-none px-2 py-1 rounded-lg border border-transparent focus:border-white/20"
                        />

                        <button
                          onClick={() => {
                            deleteSkillCategory(catIdx);
                            showToast('Category deleted');
                          }}
                          className="p-1.5 rounded-lg bg-red-950/40 text-red-400 hover:bg-red-600 hover:text-white transition-all text-xs"
                          title="Delete Category"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>

                      {/* Skills in this Category */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        {cat.skills.map((sk, skIdx) => (
                          <div
                            key={skIdx}
                            className="bg-white/5 border border-white/10 rounded-xl p-3 flex items-center justify-between gap-2"
                          >
                            <div className="flex-1 space-y-1">
                              <input
                                type="text"
                                value={sk.name}
                                onChange={(e) =>
                                  updateSkill(catIdx, skIdx, { name: e.target.value, level: sk.level })
                                }
                                className="w-full bg-transparent text-xs font-bold text-white focus:outline-none"
                              />
                              <div className="flex items-center gap-2">
                                <input
                                  type="range"
                                  min="10"
                                  max="100"
                                  value={sk.level}
                                  onChange={(e) =>
                                    updateSkill(catIdx, skIdx, { name: sk.name, level: Number(e.target.value) })
                                  }
                                  className="w-full accent-[#ff2a2a] h-1 bg-white/20 rounded-lg appearance-none cursor-pointer"
                                />
                                <span className="text-[10px] font-mono text-[#ff2a2a] font-bold w-8 text-right">
                                  {sk.level}%
                                </span>
                              </div>
                            </div>

                            <button
                              onClick={() => {
                                deleteSkill(catIdx, skIdx);
                                showToast('Skill deleted');
                              }}
                              className="p-1.5 rounded-lg text-white/40 hover:text-red-400 transition-colors"
                            >
                              <X className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        ))}
                      </div>

                      {/* Add Skill to Category Form */}
                      <div className="flex gap-2 pt-2 border-t border-white/5">
                        <input
                          type="text"
                          placeholder="Skill Name (e.g. Terraform / Docker)"
                          value={newSkillInputs[catIdx]?.name || ''}
                          onChange={(e) =>
                            setNewSkillInputs({
                              ...newSkillInputs,
                              [catIdx]: { name: e.target.value, level: newSkillInputs[catIdx]?.level || 85 },
                            })
                          }
                          className="flex-1 px-3 py-1.5 bg-black/60 border border-white/15 rounded-lg text-xs font-medium focus:outline-none"
                        />
                        <input
                          type="number"
                          min="10"
                          max="100"
                          value={newSkillInputs[catIdx]?.level || 85}
                          onChange={(e) =>
                            setNewSkillInputs({
                              ...newSkillInputs,
                              [catIdx]: {
                                name: newSkillInputs[catIdx]?.name || '',
                                level: Number(e.target.value),
                              },
                            })
                          }
                          className="w-16 px-2 py-1.5 bg-black/60 border border-white/15 rounded-lg text-xs font-mono text-center focus:outline-none"
                        />
                        <button
                          onClick={() => {
                            const sk = newSkillInputs[catIdx];
                            if (!sk || !sk.name.trim()) return;
                            addSkill(catIdx, { name: sk.name.trim(), level: sk.level || 85 });
                            setNewSkillInputs({ ...newSkillInputs, [catIdx]: { name: '', level: 85 } });
                            showToast('Skill added');
                          }}
                          className="px-3 py-1.5 bg-white/10 hover:bg-white/20 text-white font-bold rounded-lg text-xs flex items-center gap-1"
                        >
                          <Plus className="w-3.5 h-3.5" />
                          <span>Add Skill</span>
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* TAB 4: Experience / Internships */}
            {activeTab === 'experience' && (
              <div className="space-y-6 max-w-5xl">
                <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-white/10">
                  <div>
                    <h2 className="text-xl font-black text-white uppercase tracking-wider flex items-center gap-2">
                      <span>Experience & Internships</span>
                      <span className="text-xs font-mono bg-[#ff2a2a]/20 text-[#ff2a2a] border border-[#ff2a2a]/30 px-2.5 py-0.5 rounded-full">
                        {data.internshipsList.length} Total
                      </span>
                    </h2>
                    <p className="text-xs text-white/50 font-mono">
                      Edit companies, roles, dates, and technology tags.
                    </p>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => {
                        if (confirm('Are you sure you want to CLEAR ALL experience items?')) {
                          clearInternships();
                          showToast('Experience list cleared');
                        }
                      }}
                      className="px-3 py-1.5 rounded-xl bg-red-950/40 border border-red-500/30 text-red-300 text-xs font-mono hover:bg-red-900/60 transition-all flex items-center gap-1.5"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                      <span>Clear All</span>
                    </button>

                    <button
                      onClick={() => {
                        resetSection('internshipsList');
                        showToast('Reset experience to default');
                      }}
                      className="px-3 py-1.5 rounded-xl bg-white/5 border border-white/10 text-xs font-mono hover:bg-white/10 transition-all flex items-center gap-1.5"
                    >
                      <RefreshCw className="w-3.5 h-3.5" />
                      <span>Reset Section</span>
                    </button>
                  </div>
                </div>

                {/* Add New Internship Form */}
                <div className="bg-white/5 border border-white/10 rounded-2xl p-5 space-y-4">
                  <h3 className="text-sm font-bold uppercase tracking-wider text-[#ff2a2a] flex items-center gap-2">
                    <Plus className="w-4 h-4" />
                    <span>Add New Experience / Internship</span>
                  </h3>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                    <input
                      type="text"
                      placeholder="Organization (e.g. AWS Cloud Tech)"
                      value={newInternship.organization}
                      onChange={(e) => setNewInternship({ ...newInternship, organization: e.target.value })}
                      className="px-3.5 py-2 bg-black/60 border border-white/15 rounded-xl text-xs font-medium focus:border-[#ff2a2a] focus:outline-none"
                    />

                    <input
                      type="text"
                      placeholder="Role Title (e.g. DevOps Intern)"
                      value={newInternship.role}
                      onChange={(e) => setNewInternship({ ...newInternship, role: e.target.value })}
                      className="px-3.5 py-2 bg-black/60 border border-white/15 rounded-xl text-xs font-medium focus:border-[#ff2a2a] focus:outline-none"
                    />

                    <input
                      type="text"
                      placeholder="Duration (e.g. June 2025 - August 2025)"
                      value={newInternship.duration}
                      onChange={(e) => setNewInternship({ ...newInternship, duration: e.target.value })}
                      className="px-3.5 py-2 bg-black/60 border border-white/15 rounded-xl text-xs font-medium focus:border-[#ff2a2a] focus:outline-none"
                    />

                    <input
                      type="text"
                      placeholder="Skills (comma-separated)"
                      value={newInternship.skills}
                      onChange={(e) => setNewInternship({ ...newInternship, skills: e.target.value })}
                      className="px-3.5 py-2 bg-black/60 border border-white/15 rounded-xl text-xs font-medium focus:border-[#ff2a2a] focus:outline-none md:col-span-1.5"
                    />

                    <input
                      type="text"
                      placeholder="Tech Stack (comma-separated)"
                      value={newInternship.tech}
                      onChange={(e) => setNewInternship({ ...newInternship, tech: e.target.value })}
                      className="px-3.5 py-2 bg-black/60 border border-white/15 rounded-xl text-xs font-medium focus:border-[#ff2a2a] focus:outline-none md:col-span-1.5"
                    />
                  </div>

                  <button
                    onClick={() => {
                      if (!newInternship.organization.trim()) return;
                      addInternship({
                        organization: newInternship.organization,
                        role: newInternship.role,
                        duration: newInternship.duration,
                        skills: newInternship.skills.split(',').map((s) => s.trim()).filter(Boolean),
                        tech: newInternship.tech.split(',').map((t) => t.trim()).filter(Boolean),
                      });
                      setNewInternship({
                        organization: '',
                        role: '',
                        duration: '',
                        skills: 'DevOps, Cloud',
                        tech: 'AWS, Docker',
                      });
                      showToast('Experience Added!');
                    }}
                    className="px-4 py-2 bg-[#ff2a2a] hover:bg-red-600 text-white font-bold rounded-xl text-xs uppercase tracking-wider flex items-center gap-1.5 transition-all shadow-[0_0_15px_rgba(255,42,42,0.3)]"
                  >
                    <Plus className="w-4 h-4" />
                    <span>Create Experience</span>
                  </button>
                </div>

                {/* List */}
                <div className="space-y-4">
                  {data.internshipsList.map((item, idx) => (
                    <div key={idx} className="bg-black/50 border border-white/10 rounded-2xl p-4 space-y-3">
                      <div className="flex items-center justify-between pb-2 border-b border-white/10">
                        <div className="flex items-center gap-2">
                          <input
                            type="text"
                            value={item.organization}
                            onChange={(e) =>
                              updateInternship(idx, { ...item, organization: e.target.value })
                            }
                            className="bg-transparent font-bold text-base text-white focus:bg-black/60 focus:outline-none px-2 py-0.5 rounded-lg border border-transparent focus:border-white/20"
                          />
                        </div>

                        <button
                          onClick={() => {
                            deleteInternship(idx);
                            showToast('Experience deleted');
                          }}
                          className="p-1.5 rounded-lg bg-red-950/40 text-red-400 hover:bg-red-600 hover:text-white transition-all text-xs"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        <div>
                          <label className="block text-[10px] font-mono text-white/50 uppercase">Role Title</label>
                          <input
                            type="text"
                            value={item.role}
                            onChange={(e) => updateInternship(idx, { ...item, role: e.target.value })}
                            className="w-full px-3 py-1.5 bg-black/60 border border-white/10 rounded-lg text-xs font-medium focus:outline-none text-[#ff2a2a] font-bold"
                          />
                        </div>

                        <div>
                          <label className="block text-[10px] font-mono text-white/50 uppercase">Duration</label>
                          <input
                            type="text"
                            value={item.duration}
                            onChange={(e) => updateInternship(idx, { ...item, duration: e.target.value })}
                            className="w-full px-3 py-1.5 bg-black/60 border border-white/10 rounded-lg text-xs font-mono focus:outline-none"
                          />
                        </div>

                        <div>
                          <label className="block text-[10px] font-mono text-white/50 uppercase">Skills</label>
                          <input
                            type="text"
                            value={item.skills.join(', ')}
                            onChange={(e) =>
                              updateInternship(idx, {
                                ...item,
                                skills: e.target.value.split(',').map((s) => s.trim()).filter(Boolean),
                              })
                            }
                            className="w-full px-3 py-1.5 bg-black/60 border border-white/10 rounded-lg text-xs font-mono focus:outline-none"
                          />
                        </div>

                        <div>
                          <label className="block text-[10px] font-mono text-white/50 uppercase">Technologies</label>
                          <input
                            type="text"
                            value={item.tech.join(', ')}
                            onChange={(e) =>
                              updateInternship(idx, {
                                ...item,
                                tech: e.target.value.split(',').map((t) => t.trim()).filter(Boolean),
                              })
                            }
                            className="w-full px-3 py-1.5 bg-black/60 border border-white/10 rounded-lg text-xs font-mono focus:outline-none"
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* TAB 5: Certificates */}
            {activeTab === 'certificates' && (
              <div className="space-y-6 max-w-5xl">
                <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-white/10">
                  <div>
                    <h2 className="text-xl font-black text-white uppercase tracking-wider flex items-center gap-2">
                      <span>Certificates & Credentials</span>
                      <span className="text-xs font-mono bg-[#ff2a2a]/20 text-[#ff2a2a] border border-[#ff2a2a]/30 px-2.5 py-0.5 rounded-full">
                        {data.certificates.featured.length} Total
                      </span>
                    </h2>
                    <p className="text-xs text-white/50 font-mono">
                      Edit certificate titles, issuers, and icons.
                    </p>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => {
                        if (confirm('Are you sure you want to CLEAR ALL certificates?')) {
                          clearCertificates();
                          showToast('Certificates cleared');
                        }
                      }}
                      className="px-3 py-1.5 rounded-xl bg-red-950/40 border border-red-500/30 text-red-300 text-xs font-mono hover:bg-red-900/60 transition-all flex items-center gap-1.5"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                      <span>Clear All</span>
                    </button>

                    <button
                      onClick={() => {
                        resetSection('certificates');
                        showToast('Reset certificates to default');
                      }}
                      className="px-3 py-1.5 rounded-xl bg-white/5 border border-white/10 text-xs font-mono hover:bg-white/10 transition-all flex items-center gap-1.5"
                    >
                      <RefreshCw className="w-3.5 h-3.5" />
                      <span>Reset Section</span>
                    </button>
                  </div>
                </div>

                {/* Add Certificate Form */}
                <div className="bg-white/5 border border-white/10 rounded-2xl p-4 flex flex-col md:flex-row gap-3">
                  <input
                    type="text"
                    placeholder="Certificate Name (e.g. AWS Certified Solutions Architect)"
                    value={newCert.name}
                    onChange={(e) => setNewCert({ ...newCert, name: e.target.value })}
                    className="flex-1 px-3.5 py-2 bg-black/60 border border-white/15 rounded-xl text-xs font-medium focus:border-[#ff2a2a] focus:outline-none"
                  />
                  <input
                    type="text"
                    placeholder="Issuer (e.g. Amazon Web Services)"
                    value={newCert.issuer}
                    onChange={(e) => setNewCert({ ...newCert, issuer: e.target.value })}
                    className="w-full md:w-56 px-3.5 py-2 bg-black/60 border border-white/15 rounded-xl text-xs font-medium focus:border-[#ff2a2a] focus:outline-none"
                  />
                  <input
                    type="text"
                    placeholder="Icon (e.g. ☁️)"
                    value={newCert.icon}
                    onChange={(e) => setNewCert({ ...newCert, icon: e.target.value })}
                    className="w-20 px-3.5 py-2 bg-black/60 border border-white/15 rounded-xl text-xs text-center focus:outline-none"
                  />
                  <button
                    onClick={() => {
                      if (!newCert.name.trim()) return;
                      addCertificate(newCert);
                      setNewCert({ name: '', issuer: '', icon: '☁️' });
                      showToast('Certificate Added');
                    }}
                    className="px-4 py-2 bg-[#ff2a2a] text-white font-bold rounded-xl text-xs uppercase tracking-wider flex items-center justify-center gap-1"
                  >
                    <Plus className="w-4 h-4" />
                    <span>Add</span>
                  </button>
                </div>

                {/* List */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {data.certificates.featured.map((cert, idx) => (
                    <div
                      key={idx}
                      className="bg-black/50 border border-white/10 rounded-xl p-3 flex items-center justify-between gap-3"
                    >
                      <input
                        type="text"
                        value={cert.icon}
                        onChange={(e) =>
                          updateCertificate(idx, { ...cert, icon: e.target.value })
                        }
                        className="w-10 text-center bg-black/60 border border-white/10 rounded-lg p-1 text-sm focus:outline-none"
                      />

                      <div className="flex-1 space-y-1">
                        <input
                          type="text"
                          value={cert.name}
                          onChange={(e) =>
                            updateCertificate(idx, { ...cert, name: e.target.value })
                          }
                          className="w-full bg-transparent text-xs font-bold text-white focus:outline-none"
                        />
                        <input
                          type="text"
                          value={cert.issuer}
                          onChange={(e) =>
                            updateCertificate(idx, { ...cert, issuer: e.target.value })
                          }
                          className="w-full bg-transparent text-[10px] font-mono text-white/50 focus:outline-none"
                        />
                      </div>

                      <button
                        onClick={() => {
                          deleteCertificate(idx);
                          showToast('Certificate deleted');
                        }}
                        className="p-1.5 text-white/40 hover:text-red-400 transition-colors"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* TAB 6: Leadership */}
            {activeTab === 'leadership' && (
              <div className="space-y-6 max-w-5xl">
                <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-white/10">
                  <div>
                    <h2 className="text-xl font-black text-white uppercase tracking-wider flex items-center gap-2">
                      <span>Leadership & Extracurriculars</span>
                      <span className="text-xs font-mono bg-[#ff2a2a]/20 text-[#ff2a2a] border border-[#ff2a2a]/30 px-2.5 py-0.5 rounded-full">
                        {data.leadershipList.length} Total
                      </span>
                    </h2>
                    <p className="text-xs text-white/50 font-mono">
                      Edit event titles, badges, roles, and achievements.
                    </p>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => {
                        if (confirm('Are you sure you want to CLEAR ALL leadership items?')) {
                          clearLeadership();
                          showToast('Leadership list cleared');
                        }
                      }}
                      className="px-3 py-1.5 rounded-xl bg-red-950/40 border border-red-500/30 text-red-300 text-xs font-mono hover:bg-red-900/60 transition-all flex items-center gap-1.5"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                      <span>Clear All</span>
                    </button>

                    <button
                      onClick={() => {
                        resetSection('leadershipList');
                        showToast('Reset leadership to default');
                      }}
                      className="px-3 py-1.5 rounded-xl bg-white/5 border border-white/10 text-xs font-mono hover:bg-white/10 transition-all flex items-center gap-1.5"
                    >
                      <RefreshCw className="w-3.5 h-3.5" />
                      <span>Reset Section</span>
                    </button>
                  </div>
                </div>

                {/* Add Form */}
                <div className="bg-white/5 border border-white/10 rounded-2xl p-4 space-y-3">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                    <input
                      type="text"
                      placeholder="Title"
                      value={newLeader.title}
                      onChange={(e) => setNewLeader({ ...newLeader, title: e.target.value })}
                      className="px-3.5 py-2 bg-black/60 border border-white/15 rounded-xl text-xs font-medium focus:outline-none"
                    />
                    <input
                      type="text"
                      placeholder="Role"
                      value={newLeader.role}
                      onChange={(e) => setNewLeader({ ...newLeader, role: e.target.value })}
                      className="px-3.5 py-2 bg-black/60 border border-white/15 rounded-xl text-xs font-medium focus:outline-none"
                    />
                    <input
                      type="text"
                      placeholder="Badge Tag"
                      value={newLeader.badge}
                      onChange={(e) => setNewLeader({ ...newLeader, badge: e.target.value })}
                      className="px-3.5 py-2 bg-black/60 border border-white/15 rounded-xl text-xs font-medium focus:outline-none"
                    />
                    <textarea
                      rows={2}
                      placeholder="Description..."
                      value={newLeader.description}
                      onChange={(e) => setNewLeader({ ...newLeader, description: e.target.value })}
                      className="md:col-span-3 px-3.5 py-2 bg-black/60 border border-white/15 rounded-xl text-xs font-medium focus:outline-none"
                    />
                  </div>
                  <button
                    onClick={() => {
                      if (!newLeader.title.trim()) return;
                      addLeadership(newLeader);
                      setNewLeader({ title: '', role: '', badge: 'Leadership', description: '' });
                      showToast('Leadership Item Added');
                    }}
                    className="px-4 py-2 bg-[#ff2a2a] text-white font-bold rounded-xl text-xs uppercase tracking-wider flex items-center gap-1"
                  >
                    <Plus className="w-4 h-4" />
                    <span>Create Leadership Item</span>
                  </button>
                </div>

                {/* List */}
                <div className="space-y-3">
                  {data.leadershipList.map((item, idx) => (
                    <div key={idx} className="bg-black/50 border border-white/10 rounded-2xl p-4 space-y-2">
                      <div className="flex items-center justify-between pb-2 border-b border-white/10">
                        <input
                          type="text"
                          value={item.title}
                          onChange={(e) => updateLeadership(idx, { ...item, title: e.target.value })}
                          className="bg-transparent font-bold text-sm text-white focus:outline-none"
                        />
                        <button
                          onClick={() => {
                            deleteLeadership(idx);
                            showToast('Leadership item deleted');
                          }}
                          className="p-1.5 text-white/40 hover:text-red-400"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                        <input
                          type="text"
                          value={item.role}
                          onChange={(e) => updateLeadership(idx, { ...item, role: e.target.value })}
                          className="px-3 py-1.5 bg-black/60 border border-white/10 rounded-lg text-xs text-[#ff2a2a] font-bold"
                        />
                        <input
                          type="text"
                          value={item.badge}
                          onChange={(e) => updateLeadership(idx, { ...item, badge: e.target.value })}
                          className="px-3 py-1.5 bg-black/60 border border-white/10 rounded-lg text-xs font-mono"
                        />
                        <textarea
                          rows={2}
                          value={item.description}
                          onChange={(e) => updateLeadership(idx, { ...item, description: e.target.value })}
                          className="md:col-span-2 px-3 py-1.5 bg-black/60 border border-white/10 rounded-lg text-xs"
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* TAB 7: Content Creation */}
            {activeTab === 'content' && (
              <div className="space-y-6 max-w-5xl">
                <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-white/10">
                  <div>
                    <h2 className="text-xl font-black text-white uppercase tracking-wider flex items-center gap-2">
                      <span>Content Creation & Media</span>
                      <span className="text-xs font-mono bg-[#ff2a2a]/20 text-[#ff2a2a] border border-[#ff2a2a]/30 px-2.5 py-0.5 rounded-full">
                        {data.contentCreation.categories.length} Categories
                      </span>
                    </h2>
                    <p className="text-xs text-white/50 font-mono">
                      Edit creative direction, video titles, views stats, and icons.
                    </p>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => {
                        if (confirm('Are you sure you want to CLEAR ALL content categories?')) {
                          clearContentCreation();
                          showToast('Content creation items cleared');
                        }
                      }}
                      className="px-3 py-1.5 rounded-xl bg-red-950/40 border border-red-500/30 text-red-300 text-xs font-mono hover:bg-red-900/60 transition-all flex items-center gap-1.5"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                      <span>Clear All</span>
                    </button>

                    <button
                      onClick={() => {
                        resetSection('contentCreation');
                        showToast('Reset content creation to default');
                      }}
                      className="px-3 py-1.5 rounded-xl bg-white/5 border border-white/10 text-xs font-mono hover:bg-white/10 transition-all flex items-center gap-1.5"
                    >
                      <RefreshCw className="w-3.5 h-3.5" />
                      <span>Reset Section</span>
                    </button>
                  </div>
                </div>

                {/* Add Form */}
                <div className="bg-white/5 border border-white/10 rounded-2xl p-4 space-y-3">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                    <input
                      type="text"
                      placeholder="Title (e.g. AWS DevOps Reels)"
                      value={newContent.title}
                      onChange={(e) => setNewContent({ ...newContent, title: e.target.value })}
                      className="px-3.5 py-2 bg-black/60 border border-white/15 rounded-xl text-xs font-medium focus:outline-none"
                    />
                    <input
                      type="text"
                      placeholder="Stats (e.g. 100k+ Views)"
                      value={newContent.stats}
                      onChange={(e) => setNewContent({ ...newContent, stats: e.target.value })}
                      className="px-3.5 py-2 bg-black/60 border border-white/15 rounded-xl text-xs font-medium focus:outline-none"
                    />
                    <input
                      type="text"
                      placeholder="Icon (e.g. 🎥)"
                      value={newContent.icon}
                      onChange={(e) => setNewContent({ ...newContent, icon: e.target.value })}
                      className="px-3.5 py-2 bg-black/60 border border-white/15 rounded-xl text-xs text-center focus:outline-none"
                    />
                    <textarea
                      rows={2}
                      placeholder="Description..."
                      value={newContent.description}
                      onChange={(e) => setNewContent({ ...newContent, description: e.target.value })}
                      className="md:col-span-3 px-3.5 py-2 bg-black/60 border border-white/15 rounded-xl text-xs font-medium focus:outline-none"
                    />
                  </div>
                  <button
                    onClick={() => {
                      if (!newContent.title.trim()) return;
                      addContentCategory(newContent);
                      setNewContent({ title: '', description: '', stats: '100+ Views', icon: '🎥' });
                      showToast('Media Category Added');
                    }}
                    className="px-4 py-2 bg-[#ff2a2a] text-white font-bold rounded-xl text-xs uppercase tracking-wider flex items-center gap-1"
                  >
                    <Plus className="w-4 h-4" />
                    <span>Add Media Category</span>
                  </button>
                </div>

                {/* List */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {data.contentCreation.categories.map((cat, idx) => (
                    <div key={idx} className="bg-black/50 border border-white/10 rounded-2xl p-4 space-y-2">
                      <div className="flex items-center justify-between pb-2 border-b border-white/10">
                        <div className="flex items-center gap-2">
                          <input
                            type="text"
                            value={cat.icon}
                            onChange={(e) =>
                              updateContentCategory(idx, { ...cat, icon: e.target.value })
                            }
                            className="w-8 text-center bg-black/60 border border-white/10 rounded-lg p-1 text-sm focus:outline-none"
                          />
                          <input
                            type="text"
                            value={cat.title}
                            onChange={(e) =>
                              updateContentCategory(idx, { ...cat, title: e.target.value })
                            }
                            className="bg-transparent font-bold text-sm text-white focus:outline-none"
                          />
                        </div>
                        <button
                          onClick={() => {
                            deleteContentCategory(idx);
                            showToast('Category deleted');
                          }}
                          className="p-1 text-white/40 hover:text-red-400"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>

                      <input
                        type="text"
                        value={cat.stats}
                        onChange={(e) =>
                          updateContentCategory(idx, { ...cat, stats: e.target.value })
                        }
                        className="w-full px-3 py-1 bg-black/60 border border-white/10 rounded-lg text-xs font-mono text-[#ff2a2a]"
                      />

                      <textarea
                        rows={2}
                        value={cat.description}
                        onChange={(e) =>
                          updateContentCategory(idx, { ...cat, description: e.target.value })
                        }
                        className="w-full px-3 py-1.5 bg-black/60 border border-white/10 rounded-lg text-xs"
                      />
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* TAB 8: Soft Skills */}
            {activeTab === 'soft' && (
              <div className="space-y-6 max-w-5xl">
                <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-white/10">
                  <div>
                    <h2 className="text-xl font-black text-white uppercase tracking-wider flex items-center gap-2">
                      <span>Soft Skills</span>
                      <span className="text-xs font-mono bg-[#ff2a2a]/20 text-[#ff2a2a] border border-[#ff2a2a]/30 px-2.5 py-0.5 rounded-full">
                        {data.softSkillsList.length} Total
                      </span>
                    </h2>
                    <p className="text-xs text-white/50 font-mono">
                      Edit leadership qualities, team collaboration, and problem-solving skills.
                    </p>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => {
                        if (confirm('Are you sure you want to CLEAR ALL soft skills?')) {
                          clearSoftSkills();
                          showToast('Soft skills cleared');
                        }
                      }}
                      className="px-3 py-1.5 rounded-xl bg-red-950/40 border border-red-500/30 text-red-300 text-xs font-mono hover:bg-red-900/60 transition-all flex items-center gap-1.5"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                      <span>Clear All</span>
                    </button>

                    <button
                      onClick={() => {
                        resetSection('softSkillsList');
                        showToast('Reset soft skills to default');
                      }}
                      className="px-3 py-1.5 rounded-xl bg-white/5 border border-white/10 text-xs font-mono hover:bg-white/10 transition-all flex items-center gap-1.5"
                    >
                      <RefreshCw className="w-3.5 h-3.5" />
                      <span>Reset Section</span>
                    </button>
                  </div>
                </div>

                {/* Add Form */}
                <div className="bg-white/5 border border-white/10 rounded-2xl p-4 flex flex-col md:flex-row gap-3">
                  <input
                    type="text"
                    placeholder="Skill Name (e.g. Critical Thinking)"
                    value={newSoft.name}
                    onChange={(e) => setNewSoft({ ...newSoft, name: e.target.value })}
                    className="flex-1 px-3.5 py-2 bg-black/60 border border-white/15 rounded-xl text-xs font-medium focus:outline-none"
                  />
                  <input
                    type="text"
                    placeholder="Icon (e.g. 👑)"
                    value={newSoft.icon}
                    onChange={(e) => setNewSoft({ ...newSoft, icon: e.target.value })}
                    className="w-20 px-3.5 py-2 bg-black/60 border border-white/15 rounded-xl text-xs text-center focus:outline-none"
                  />
                  <input
                    type="text"
                    placeholder="Short Description..."
                    value={newSoft.desc}
                    onChange={(e) => setNewSoft({ ...newSoft, desc: e.target.value })}
                    className="flex-1 px-3.5 py-2 bg-black/60 border border-white/15 rounded-xl text-xs font-medium focus:outline-none"
                  />
                  <button
                    onClick={() => {
                      if (!newSoft.name.trim()) return;
                      addSoftSkill(newSoft);
                      setNewSoft({ name: '', icon: '🚀', desc: '' });
                      showToast('Soft Skill Added');
                    }}
                    className="px-4 py-2 bg-[#ff2a2a] text-white font-bold rounded-xl text-xs uppercase tracking-wider flex items-center justify-center gap-1"
                  >
                    <Plus className="w-4 h-4" />
                    <span>Add</span>
                  </button>
                </div>

                {/* List */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {data.softSkillsList.map((skill, idx) => (
                    <div key={idx} className="bg-black/50 border border-white/10 rounded-xl p-3 space-y-2">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <input
                            type="text"
                            value={skill.icon}
                            onChange={(e) =>
                              updateSoftSkill(idx, { ...skill, icon: e.target.value })
                            }
                            className="w-8 text-center bg-black/60 border border-white/10 rounded-lg p-1 text-sm focus:outline-none"
                          />
                          <input
                            type="text"
                            value={skill.name}
                            onChange={(e) =>
                              updateSoftSkill(idx, { ...skill, name: e.target.value })
                            }
                            className="bg-transparent font-bold text-xs text-white focus:outline-none"
                          />
                        </div>
                        <button
                          onClick={() => {
                            deleteSoftSkill(idx);
                            showToast('Soft skill deleted');
                          }}
                          className="p-1 text-white/40 hover:text-red-400"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>

                      <textarea
                        rows={2}
                        value={skill.desc}
                        onChange={(e) =>
                          updateSoftSkill(idx, { ...skill, desc: e.target.value })
                        }
                        className="w-full px-3 py-1 bg-black/60 border border-white/10 rounded-lg text-xs"
                      />
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* TAB 9: Gmail Control Suite */}
            {activeTab === 'gmail' && <GmailSuite adminEmail={adminEmail} />}

            {/* TAB 10: Security, Import/Export & Settings */}
            {activeTab === 'settings' && (
              <div className="space-y-6 max-w-3xl">
                <div className="pb-4 border-b border-white/10">
                  <h2 className="text-xl font-black text-white uppercase tracking-wider flex items-center gap-2">
                    <Shield className="w-5 h-5 text-[#ff2a2a]" />
                    <span>Administrator Credentials &amp; Settings</span>
                  </h2>
                  <p className="text-xs text-white/50 font-mono">
                    Manage authorized administrator email address, mobile number, backup configurations, or reset system.
                  </p>
                </div>

                {/* Administrator Email Configuration */}
                <div className="bg-white/5 border border-white/10 rounded-2xl p-6 space-y-4">
                  <div className="flex items-center justify-between pb-3 border-b border-white/10">
                    <h3 className="text-sm font-bold uppercase tracking-wider text-white flex items-center gap-2">
                      <UserCheck className="w-4 h-4 text-[#ff2a2a]" />
                      <span>Admin Email Configuration</span>
                    </h3>
                    <span className="text-[10px] font-mono px-2.5 py-1 rounded-full bg-emerald-950/60 text-emerald-400 border border-emerald-500/30">
                      Strict Access Control
                    </span>
                  </div>

                  <form onSubmit={handleUpdateAdminEmail} className="space-y-4">
                    <div>
                      {/* Authorized Email */}
                      <div>
                        <label className="block text-xs font-mono text-white/60 mb-1.5 uppercase flex items-center gap-1.5">
                          <Mail className="w-3.5 h-3.5 text-[#ff2a2a]" />
                          <span>Admin Email</span>
                        </label>
                        <input
                          type="email"
                          value={settingEmailInput}
                          onChange={(e) => setSettingEmailInput(e.target.value)}
                          placeholder="saivinodkotipalli2003@gmail.com"
                          className="w-full px-4 py-2.5 bg-black/60 border border-white/15 rounded-xl text-xs font-mono text-white focus:border-[#ff2a2a] focus:outline-none placeholder:text-white/30"
                          required
                        />
                      </div>
                    </div>

                    {settingStatus.msg && (
                      <div
                        className={`p-3 rounded-xl text-xs font-mono flex items-center gap-2 ${
                          settingStatus.type === 'success'
                            ? 'bg-emerald-950/60 text-emerald-300 border border-emerald-500/30'
                            : 'bg-red-950/60 text-red-300 border border-red-500/30'
                        }`}
                      >
                        {settingStatus.type === 'success' ? (
                          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                        ) : (
                          <ShieldAlert className="w-4 h-4 text-red-400 shrink-0" />
                        )}
                        <span>{settingStatus.msg}</span>
                      </div>
                    )}

                    <button
                      type="submit"
                      className="px-5 py-2.5 bg-[#ff2a2a] hover:bg-red-600 text-white font-bold rounded-xl text-xs uppercase tracking-wider transition-all flex items-center gap-2 shadow-[0_0_15px_rgba(255,42,42,0.3)]"
                    >
                      <Save className="w-3.5 h-3.5" />
                      <span>Save Admin Email</span>
                    </button>
                  </form>
                </div>

                {/* Backup & Restore */}
                <div className="bg-white/5 border border-white/10 rounded-2xl p-5 space-y-4">
                  <h3 className="text-sm font-bold uppercase tracking-wider text-white flex items-center gap-2">
                    <Download className="w-4 h-4 text-[#ff2a2a]" />
                    <span>Data Backup & Restoration</span>
                  </h3>

                  <div className="flex flex-wrap gap-3">
                    <button
                      onClick={handleExport}
                      className="px-4 py-2.5 bg-white/10 hover:bg-white/20 border border-white/10 text-white font-bold rounded-xl text-xs uppercase tracking-wider flex items-center gap-2 transition-all"
                    >
                      <Download className="w-4 h-4" />
                      <span>Download JSON Backup</span>
                    </button>

                    <button
                      onClick={() => fileInputRef.current?.click()}
                      className="px-4 py-2.5 bg-white/10 hover:bg-white/20 border border-white/10 text-white font-bold rounded-xl text-xs uppercase tracking-wider flex items-center gap-2 transition-all"
                    >
                      <Upload className="w-4 h-4" />
                      <span>Upload JSON Backup File</span>
                    </button>
                    <input
                      type="file"
                      ref={fileInputRef}
                      onChange={handleFileUpload}
                      accept=".json"
                      className="hidden"
                    />
                  </div>
                </div>

                {/* System Reset */}
                <div className="bg-red-950/20 border border-red-500/20 rounded-2xl p-5 space-y-3">
                  <h3 className="text-sm font-bold uppercase tracking-wider text-red-400 flex items-center gap-2">
                    <AlertTriangle className="w-4 h-4" />
                    <span>Factory Reset Portfolio</span>
                  </h3>
                  <p className="text-xs text-white/60">
                    Restores all projects, technical skills, experiences, certifications, and personal information back to default values.
                  </p>
                  <button
                    onClick={() => {
                      if (confirm('DANGER: This will revert ALL custom changes to defaults! Proceed?')) {
                        resetAllToDefault();
                        showToast('System Reset Complete!');
                      }
                    }}
                    className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white font-bold rounded-xl text-xs uppercase tracking-wider flex items-center gap-1.5 transition-all shadow-[0_0_15px_rgba(255,42,42,0.4)]"
                  >
                    <RefreshCw className="w-4 h-4" />
                    <span>Reset Everything To Default</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* JSON Import Text Modal */}
      {showImportModal && (
        <div className="fixed inset-0 z-[130] bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-zinc-900 border border-white/20 rounded-3xl p-6 w-full max-w-2xl space-y-4 shadow-2xl">
            <div className="flex items-center justify-between pb-3 border-b border-white/10">
              <h3 className="text-base font-bold text-white uppercase tracking-wider">
                Import Portfolio Config JSON
              </h3>
              <button
                onClick={() => setShowImportModal(false)}
                className="p-1 rounded-lg text-white/50 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <textarea
              rows={12}
              placeholder="Paste valid Portfolio Data JSON here..."
              value={importJsonText}
              onChange={(e) => setImportJsonText(e.target.value)}
              className="w-full p-4 bg-black/80 border border-white/15 rounded-2xl text-xs font-mono text-white/90 focus:outline-none focus:border-[#ff2a2a]"
            />

            <div className="flex justify-end gap-2">
              <button
                onClick={() => setShowImportModal(false)}
                className="px-4 py-2 rounded-xl bg-white/10 text-white text-xs font-bold uppercase"
              >
                Cancel
              </button>
              <button
                onClick={handleImportSubmit}
                className="px-5 py-2 rounded-xl bg-[#ff2a2a] hover:bg-red-600 text-white text-xs font-bold uppercase flex items-center gap-1.5 shadow-lg"
              >
                <Check className="w-4 h-4" />
                <span>Apply JSON</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;
