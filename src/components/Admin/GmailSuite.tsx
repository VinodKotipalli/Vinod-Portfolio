import React, { useState, useEffect } from 'react';
import {
  Mail,
  Send,
  Trash2,
  RefreshCw,
  Search,
  User,
  LogOut,
  Plus,
  Inbox,
  AlertTriangle,
  CheckCircle2,
  ArrowLeft,
  Reply,
  ShieldCheck,
  ExternalLink,
} from 'lucide-react';
import {
  googleSignIn,
  logoutGoogle,
  initAuth,
  getGmailProfile,
  listGmailMessages,
  getGmailMessage,
  sendGmailMessage,
  deleteGmailMessage,
  ParsedEmail,
  GmailProfile,
} from '../../lib/gmail';

interface GmailSuiteProps {
  adminEmail: string;
}

export const GmailSuite: React.FC<GmailSuiteProps> = ({ adminEmail }) => {
  const [googleUser, setGoogleUser] = useState<any>(null);
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [profile, setProfile] = useState<GmailProfile | null>(null);
  const [isLoadingAuth, setIsLoadingAuth] = useState(true);
  const [isSigningIn, setIsSigningIn] = useState(false);

  // Email State
  const [messages, setMessages] = useState<ParsedEmail[]>([]);
  const [selectedMessage, setSelectedMessage] = useState<ParsedEmail | null>(null);
  const [isLoadingList, setIsLoadingList] = useState(false);
  const [isLoadingMsg, setIsLoadingMsg] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFolder, setActiveFolder] = useState<'inbox' | 'sent'>('inbox');

  // Composer Modal State
  const [showComposer, setShowComposer] = useState(false);
  const [composerTo, setComposerTo] = useState('');
  const [composerSubject, setComposerSubject] = useState('');
  const [composerBody, setComposerBody] = useState('');

  // Confirmation Modals (Mandatory for mutating/sending/deleting Workspace operations)
  const [confirmSendModal, setConfirmSendModal] = useState(false);
  const [confirmDeleteModal, setConfirmDeleteModal] = useState<string | null>(null);

  // Status & Toast
  const [statusMsg, setStatusMsg] = useState<{ type: 'success' | 'error' | 'info'; text: string } | null>(null);
  const [isSending, setIsSending] = useState(false);

  const showToast = (text: string, type: 'success' | 'error' | 'info' = 'success') => {
    setStatusMsg({ type, text });
    setTimeout(() => setStatusMsg(null), 4000);
  };

  useEffect(() => {
    const unsubscribe = initAuth(
      (user, token) => {
        setGoogleUser(user);
        setAccessToken(token);
        setIsLoadingAuth(false);
        fetchGmailData(token, activeFolder);
      },
      () => {
        setGoogleUser(null);
        setAccessToken(null);
        setIsLoadingAuth(false);
      }
    );
    return () => unsubscribe();
  }, []);

  const fetchGmailData = async (token: string, folder: 'inbox' | 'sent' = 'inbox', query: string = '') => {
    setIsLoadingList(true);
    try {
      // Fetch user profile
      const prof = await getGmailProfile(token);
      setProfile(prof);

      // Construct search query
      let fullQuery = folder === 'inbox' ? 'in:inbox' : 'in:sent';
      if (query.trim()) {
        fullQuery += ` ${query.trim()}`;
      }

      const listRes = await listGmailMessages(token, fullQuery, 15);
      if (listRes.messages && listRes.messages.length > 0) {
        const fullMsgs = await Promise.all(
          listRes.messages.slice(0, 10).map((m) => getGmailMessage(token, m.id).catch(() => null))
        );
        setMessages(fullMsgs.filter((m): m is ParsedEmail => m !== null));
      } else {
        setMessages([]);
      }
    } catch (err: any) {
      console.error('Error fetching Gmail messages:', err);
      showToast(err?.message || 'Failed to sync with Gmail API', 'error');
    } finally {
      setIsLoadingList(false);
    }
  };

  const handleGoogleLogin = async () => {
    setIsSigningIn(true);
    try {
      const res = await googleSignIn();
      if (res) {
        setGoogleUser(res.user);
        setAccessToken(res.accessToken);
        showToast(`Connected to Gmail as ${res.user.email}`);
        fetchGmailData(res.accessToken, 'inbox');
      }
    } catch (err: any) {
      showToast(err?.message || 'Google Sign-In failed', 'error');
    } finally {
      setIsSigningIn(false);
    }
  };

  const handleLogout = async () => {
    await logoutGoogle();
    setGoogleUser(null);
    setAccessToken(null);
    setProfile(null);
    setMessages([]);
    setSelectedMessage(null);
    showToast('Signed out of Gmail account');
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (accessToken) {
      fetchGmailData(accessToken, activeFolder, searchQuery);
    }
  };

  // Step 1 of Email Dispatch: Trigger Confirmation Dialog (MANDATORY User Confirmation)
  const initiateSendEmail = (e: React.FormEvent) => {
    e.preventDefault();
    if (!composerTo.trim() || !composerTo.includes('@')) {
      showToast('Please enter a valid recipient email address', 'error');
      return;
    }
    if (!composerSubject.trim()) {
      showToast('Please specify an email subject', 'error');
      return;
    }
    if (!composerBody.trim()) {
      showToast('Please enter message body content', 'error');
      return;
    }

    // Open User Confirmation Modal
    setConfirmSendModal(true);
  };

  // Step 2 of Email Dispatch: Confirmed by user in modal
  const executeSendEmail = async () => {
    if (!accessToken) return;
    setIsSending(true);
    try {
      await sendGmailMessage(accessToken, composerTo.trim(), composerSubject.trim(), composerBody);
      showToast(`Email dispatched successfully to ${composerTo.trim()} via Gmail!`);
      setShowComposer(false);
      setComposerTo('');
      setComposerSubject('');
      setComposerBody('');
      setConfirmSendModal(false);

      // Refresh list
      fetchGmailData(accessToken, activeFolder);
    } catch (err: any) {
      showToast(err?.message || 'Failed to send email via Gmail API', 'error');
    } finally {
      setIsSending(false);
    }
  };

  // Step 1 of Delete Email: Trigger Confirmation Dialog (MANDATORY User Confirmation)
  const initiateDeleteEmail = (msgId: string) => {
    setConfirmDeleteModal(msgId);
  };

  // Step 2 of Delete Email: Confirmed by user
  const executeDeleteEmail = async () => {
    if (!accessToken || !confirmDeleteModal) return;
    try {
      await deleteGmailMessage(accessToken, confirmDeleteModal);
      showToast('Email moved to Gmail Trash successfully');
      setConfirmDeleteModal(null);
      if (selectedMessage?.id === confirmDeleteModal) {
        setSelectedMessage(null);
      }
      fetchGmailData(accessToken, activeFolder);
    } catch (err: any) {
      showToast(err?.message || 'Failed to trash email', 'error');
    }
  };

  const handleReply = (msg: ParsedEmail) => {
    // Extract raw email address from "Sender Name <email@example.com>"
    let replyToEmail = msg.from;
    const match = msg.from.match(/<([^>]+)>/);
    if (match) {
      replyToEmail = match[1];
    }

    setComposerTo(replyToEmail);
    setComposerSubject(msg.subject.startsWith('Re:') ? msg.subject : `Re: ${msg.subject}`);
    setComposerBody(`\n\n--- On ${msg.date}, ${msg.from} wrote:\n> ${msg.snippet}`);
    setShowComposer(true);
  };

  if (isLoadingAuth) {
    return (
      <div className="p-8 text-center font-mono text-white/50 animate-pulse flex items-center justify-center gap-2">
        <RefreshCw className="w-4 h-4 animate-spin text-[#ff2a2a]" />
        <span>Initializing Google Workspace Security Suite...</span>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Toast Alert */}
      {statusMsg && (
        <div
          className={`p-4 rounded-2xl text-xs font-mono border flex items-center justify-between ${
            statusMsg.type === 'error'
              ? 'bg-red-950/80 border-red-500/50 text-red-200'
              : statusMsg.type === 'info'
              ? 'bg-blue-950/80 border-blue-500/50 text-blue-200'
              : 'bg-emerald-950/80 border-emerald-500/50 text-emerald-200'
          }`}
        >
          <div className="flex items-center gap-2">
            {statusMsg.type === 'error' ? (
              <AlertTriangle className="w-4 h-4 text-red-400 shrink-0" />
            ) : (
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
            )}
            <span>{statusMsg.text}</span>
          </div>
        </div>
      )}

      {/* Main Gmail Container */}
      {!googleUser || !accessToken ? (
        /* Unauthenticated Gmail Welcome & Connect Card */
        <div className="bg-white/5 border border-white/10 rounded-3xl p-8 backdrop-blur-xl space-y-6 max-w-2xl mx-auto text-center">
          <div className="w-16 h-16 bg-[#ff2a2a]/10 border border-[#ff2a2a]/30 rounded-2xl flex items-center justify-center mx-auto text-[#ff2a2a]">
            <Mail className="w-8 h-8" />
          </div>

          <div className="space-y-2">
            <h2 className="text-xl font-extrabold uppercase tracking-wider text-white">
              Google Workspace Gmail Integration
            </h2>
            <p className="text-xs text-white/60 font-mono max-w-md mx-auto leading-relaxed">
              Connect your authorized Google account (<strong className="text-white">{adminEmail}</strong>) to send, receive, and manage portfolio communication directly through Gmail.
            </p>
          </div>

          <div className="p-4 bg-black/60 border border-white/10 rounded-2xl text-left font-mono text-xs text-white/70 space-y-2 max-w-md mx-auto">
            <div className="flex items-center gap-2 text-emerald-400 font-bold text-[11px] uppercase">
              <ShieldCheck className="w-4 h-4" />
              <span>OAuth 2.0 Security Scopes Granted</span>
            </div>
            <ul className="text-[11px] text-white/60 list-disc list-inside space-y-1">
              <li>Direct email delivery for single-use OTPs</li>
              <li>Read &amp; respond to recruiter portfolio inquiries</li>
              <li>Official Google Workspace API connection</li>
            </ul>
          </div>

          {/* Official Google Sign-In Button Component */}
          <div className="pt-2 flex justify-center">
            <button
              onClick={handleGoogleLogin}
              disabled={isSigningIn}
              className="gsi-material-button group transition-all transform active:scale-95 disabled:opacity-50"
              style={{
                backgroundColor: '#ffffff',
                border: '1px solid #dadce0',
                borderRadius: '12px',
                padding: '12px 24px',
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                cursor: 'pointer',
                boxShadow: '0 4px 20px rgba(0,0,0,0.3)',
              }}
            >
              <div className="gsi-material-button-icon" style={{ width: '20px', height: '20px' }}>
                <svg
                  version="1.1"
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 48 48"
                  style={{ display: 'block' }}
                >
                  <path
                    fill="#EA4335"
                    d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"
                  ></path>
                  <path
                    fill="#4285F4"
                    d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"
                  ></path>
                  <path
                    fill="#FBBC05"
                    d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"
                  ></path>
                  <path
                    fill="#34A853"
                    d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"
                  ></path>
                </svg>
              </div>
              <span
                style={{
                  color: '#1f1f1f',
                  fontWeight: 700,
                  fontSize: '14px',
                  fontFamily: 'Roboto, sans-serif',
                }}
              >
                {isSigningIn ? 'Connecting to Google...' : 'Sign in with Google'}
              </span>
            </button>
          </div>
        </div>
      ) : (
        /* Authenticated Full Gmail Interface */
        <div className="bg-white/5 border border-white/10 rounded-3xl p-6 backdrop-blur-xl space-y-6">
          {/* Top Gmail Header & Profile Status */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-white/10">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-[#ff2a2a]/20 border border-[#ff2a2a]/40 rounded-xl flex items-center justify-center text-[#ff2a2a]">
                <Mail className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-base font-extrabold uppercase tracking-wider text-white flex items-center gap-2">
                  <span>Gmail Control Suite</span>
                  <span className="text-[10px] bg-emerald-950 text-emerald-400 border border-emerald-500/40 px-2 py-0.5 rounded-full font-mono">
                    Live Sync
                  </span>
                </h2>
                <p className="text-xs text-white/50 font-mono">
                  Connected: <strong className="text-white">{googleUser.email}</strong>
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <button
                onClick={() => setShowComposer(true)}
                className="px-4 py-2 bg-[#ff2a2a] hover:bg-red-600 text-white font-bold rounded-xl text-xs uppercase tracking-wider transition-all flex items-center gap-2 shadow-[0_0_15px_rgba(255,42,42,0.3)]"
              >
                <Plus className="w-4 h-4" />
                <span>Compose Mail</span>
              </button>

              <button
                onClick={handleLogout}
                className="px-3 py-2 bg-white/10 hover:bg-white/20 text-white/80 hover:text-white rounded-xl text-xs font-mono transition-all flex items-center gap-1.5"
                title="Disconnect Google Account"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Disconnect</span>
              </button>
            </div>
          </div>

          {/* Folder Tabs & Search Bar */}
          <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
            <div className="flex items-center gap-2 bg-black/60 p-1 rounded-2xl border border-white/10">
              <button
                onClick={() => {
                  setActiveFolder('inbox');
                  if (accessToken) fetchGmailData(accessToken, 'inbox');
                }}
                className={`px-4 py-2 rounded-xl text-xs font-mono font-bold uppercase transition-all flex items-center gap-2 ${
                  activeFolder === 'inbox'
                    ? 'bg-[#ff2a2a] text-white shadow-lg'
                    : 'text-white/60 hover:text-white hover:bg-white/5'
                }`}
              >
                <Inbox className="w-3.5 h-3.5" />
                <span>Inbox</span>
              </button>
              <button
                onClick={() => {
                  setActiveFolder('sent');
                  if (accessToken) fetchGmailData(accessToken, 'sent');
                }}
                className={`px-4 py-2 rounded-xl text-xs font-mono font-bold uppercase transition-all flex items-center gap-2 ${
                  activeFolder === 'sent'
                    ? 'bg-[#ff2a2a] text-white shadow-lg'
                    : 'text-white/60 hover:text-white hover:bg-white/5'
                }`}
              >
                <Send className="w-3.5 h-3.5" />
                <span>Sent</span>
              </button>
            </div>

            <form onSubmit={handleSearchSubmit} className="flex items-center gap-2 flex-1 max-w-md">
              <div className="relative flex-1">
                <Search className="w-4 h-4 text-white/40 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search Gmail messages..."
                  className="w-full pl-10 pr-4 py-2 bg-black/60 border border-white/15 rounded-xl text-xs font-mono text-white focus:outline-none focus:border-[#ff2a2a] placeholder:text-white/30"
                />
              </div>
              <button
                type="submit"
                className="px-3.5 py-2 bg-white/10 hover:bg-white/20 text-white font-mono text-xs rounded-xl transition-all flex items-center gap-1"
              >
                <RefreshCw className={`w-3.5 h-3.5 ${isLoadingList ? 'animate-spin' : ''}`} />
                <span className="hidden sm:inline">Sync</span>
              </button>
            </form>
          </div>

          {/* Email View Area (List + Detail Split) */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 min-h-[420px]">
            {/* Email List Column */}
            <div className={`lg:col-span-5 space-y-3 ${selectedMessage ? 'hidden lg:block' : 'block'}`}>
              <div className="text-[11px] font-mono text-white/50 uppercase tracking-wider flex items-center justify-between px-1">
                <span>
                  {activeFolder === 'inbox' ? 'Inbox Messages' : 'Sent Messages'} ({messages.length})
                </span>
                {profile && <span>Profile Total: {profile.messagesTotal}</span>}
              </div>

              {isLoadingList ? (
                <div className="p-12 text-center text-xs font-mono text-white/40 animate-pulse space-y-2 border border-white/10 rounded-2xl bg-black/40">
                  <RefreshCw className="w-5 h-5 animate-spin text-[#ff2a2a] mx-auto" />
                  <p>Fetching messages from Gmail API...</p>
                </div>
              ) : messages.length === 0 ? (
                <div className="p-12 text-center text-xs font-mono text-white/40 border border-white/10 rounded-2xl bg-black/40 space-y-2">
                  <Mail className="w-8 h-8 text-white/20 mx-auto" />
                  <p>No messages found in {activeFolder}.</p>
                </div>
              ) : (
                <div className="space-y-2 max-h-[500px] overflow-y-auto pr-1">
                  {messages.map((msg) => (
                    <div
                      key={msg.id}
                      onClick={() => setSelectedMessage(msg)}
                      className={`p-4 rounded-2xl border text-left cursor-pointer transition-all space-y-1.5 ${
                        selectedMessage?.id === msg.id
                          ? 'bg-[#ff2a2a]/10 border-[#ff2a2a] text-white shadow-[0_0_15px_rgba(255,42,42,0.15)]'
                          : 'bg-black/60 border-white/10 hover:border-white/30 text-white/80'
                      }`}
                    >
                      <div className="flex items-center justify-between text-[11px] font-mono text-white/50">
                        <span className="font-bold text-white truncate max-w-[180px]">{msg.from}</span>
                        <span className="shrink-0">{msg.date.split(',')[0]}</span>
                      </div>

                      <h4 className="text-xs font-bold text-white truncate">{msg.subject}</h4>
                      <p className="text-[11px] text-white/50 line-clamp-2 leading-relaxed">{msg.snippet}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Email Detail Column */}
            <div className={`lg:col-span-7 ${!selectedMessage ? 'hidden lg:flex' : 'flex'} flex-col`}>
              {selectedMessage ? (
                <div className="bg-black/70 border border-white/10 rounded-2xl p-6 flex-1 flex flex-col justify-between space-y-6">
                  {/* Top Bar inside Detail */}
                  <div className="space-y-4 pb-4 border-b border-white/10">
                    <div className="flex items-center justify-between">
                      <button
                        onClick={() => setSelectedMessage(null)}
                        className="lg:hidden text-xs font-mono text-[#ff2a2a] flex items-center gap-1 hover:underline"
                      >
                        <ArrowLeft className="w-3.5 h-3.5" />
                        <span>Back to list</span>
                      </button>

                      <div className="flex items-center gap-2 ml-auto">
                        <button
                          onClick={() => handleReply(selectedMessage)}
                          className="px-3 py-1.5 bg-white/10 hover:bg-white/20 text-white text-xs font-mono rounded-xl transition-all flex items-center gap-1.5"
                        >
                          <Reply className="w-3.5 h-3.5" />
                          <span>Reply</span>
                        </button>
                        <button
                          onClick={() => initiateDeleteEmail(selectedMessage.id)}
                          className="p-1.5 bg-red-950/60 hover:bg-red-900/80 text-red-400 border border-red-500/30 rounded-xl transition-all"
                          title="Trash Message"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>

                    <div>
                      <h3 className="text-base font-extrabold text-white leading-snug">
                        {selectedMessage.subject}
                      </h3>
                      <div className="mt-2 text-xs font-mono text-white/60 space-y-0.5">
                        <p>
                          From: <strong className="text-white">{selectedMessage.from}</strong>
                        </p>
                        <p>Date: {selectedMessage.date}</p>
                      </div>
                    </div>
                  </div>

                  {/* Body Content */}
                  <div className="flex-1 overflow-y-auto max-h-[350px] text-xs font-mono text-white/80 leading-relaxed space-y-3 p-4 bg-white/5 rounded-xl border border-white/5">
                    {selectedMessage.bodyHtml ? (
                      <div
                        className="prose prose-invert max-w-none text-xs"
                        dangerouslySetInnerHTML={{ __html: selectedMessage.bodyHtml }}
                      />
                    ) : (
                      <pre className="whitespace-pre-wrap font-mono text-xs">{selectedMessage.bodyText}</pre>
                    )}
                  </div>
                </div>
              ) : (
                <div className="h-full border border-dashed border-white/10 rounded-2xl flex flex-col items-center justify-center p-8 text-center text-xs font-mono text-white/40 space-y-2">
                  <Mail className="w-8 h-8 text-white/20" />
                  <p>Select an email message from the list to view full details.</p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Composer Modal */}
      {showComposer && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fade-in">
          <div className="w-full max-w-lg bg-zinc-950 border border-white/15 rounded-3xl p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-white/10">
              <h3 className="text-sm font-extrabold uppercase tracking-wider text-white flex items-center gap-2">
                <Send className="w-4 h-4 text-[#ff2a2a]" />
                <span>Compose Gmail Message</span>
              </h3>
              <button
                onClick={() => setShowComposer(false)}
                className="text-white/40 hover:text-white text-xs font-mono"
              >
                Close ✕
              </button>
            </div>

            <form onSubmit={initiateSendEmail} className="space-y-4">
              <div>
                <label className="block text-xs font-mono text-white/60 mb-1 uppercase">Recipient (To)</label>
                <input
                  type="email"
                  value={composerTo}
                  onChange={(e) => setComposerTo(e.target.value)}
                  placeholder="recipient@example.com"
                  className="w-full px-4 py-2.5 bg-black/70 border border-white/20 rounded-xl text-xs font-mono text-white focus:outline-none focus:border-[#ff2a2a]"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-mono text-white/60 mb-1 uppercase">Subject</label>
                <input
                  type="text"
                  value={composerSubject}
                  onChange={(e) => setComposerSubject(e.target.value)}
                  placeholder="Portfolio Inquiry Response"
                  className="w-full px-4 py-2.5 bg-black/70 border border-white/20 rounded-xl text-xs font-mono text-white focus:outline-none focus:border-[#ff2a2a]"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-mono text-white/60 mb-1 uppercase">Message Content</label>
                <textarea
                  rows={6}
                  value={composerBody}
                  onChange={(e) => setComposerBody(e.target.value)}
                  placeholder="Write your email body message here..."
                  className="w-full px-4 py-3 bg-black/70 border border-white/20 rounded-xl text-xs font-mono text-white focus:outline-none focus:border-[#ff2a2a] resize-none"
                  required
                />
              </div>

              <div className="pt-2 flex items-center justify-end gap-3 border-t border-white/10">
                <button
                  type="button"
                  onClick={() => setShowComposer(false)}
                  className="px-4 py-2 bg-white/10 hover:bg-white/20 text-white/80 rounded-xl text-xs font-mono uppercase"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  className="px-5 py-2.5 bg-[#ff2a2a] hover:bg-red-600 text-white font-bold rounded-xl text-xs font-mono uppercase tracking-wider flex items-center gap-2 shadow-[0_0_15px_rgba(255,42,42,0.4)]"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>Send via Gmail</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MANDATORY USER CONFIRMATION DIALOG FOR SENDING EMAIL */}
      {confirmSendModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md">
          <div className="w-full max-w-md bg-zinc-950 border border-red-500/40 rounded-3xl p-6 shadow-2xl space-y-4">
            <div className="flex items-center gap-3 text-red-400">
              <AlertTriangle className="w-6 h-6 shrink-0" />
              <h3 className="text-sm font-bold uppercase tracking-wider text-white">
                Confirm Email Dispatch
              </h3>
            </div>

            <p className="text-xs font-mono text-white/80 leading-relaxed">
              Are you sure you want to send this message on behalf of your Google Workspace account?
            </p>

            <div className="p-3 bg-black/80 border border-white/10 rounded-xl font-mono text-[11px] text-white/70 space-y-1">
              <p>
                <span className="text-white/40">Recipient:</span> {composerTo}
              </p>
              <p>
                <span className="text-white/40">Subject:</span> {composerSubject}
              </p>
            </div>

            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                onClick={() => setConfirmSendModal(false)}
                className="px-4 py-2 bg-white/10 hover:bg-white/20 text-white/80 rounded-xl text-xs font-mono uppercase"
              >
                Cancel
              </button>
              <button
                onClick={executeSendEmail}
                disabled={isSending}
                className="px-5 py-2 bg-[#ff2a2a] hover:bg-red-600 disabled:bg-zinc-800 text-white font-bold rounded-xl text-xs font-mono uppercase tracking-wider flex items-center gap-2"
              >
                {isSending ? 'Sending...' : 'Confirm & Dispatch'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MANDATORY USER CONFIRMATION DIALOG FOR TRASHING EMAIL */}
      {confirmDeleteModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md">
          <div className="w-full max-w-md bg-zinc-950 border border-red-500/40 rounded-3xl p-6 shadow-2xl space-y-4">
            <div className="flex items-center gap-3 text-red-400">
              <Trash2 className="w-6 h-6 shrink-0" />
              <h3 className="text-sm font-bold uppercase tracking-wider text-white">
                Trash Gmail Message
              </h3>
            </div>

            <p className="text-xs font-mono text-white/80 leading-relaxed">
              Are you sure you want to move this message to your Gmail Trash folder?
            </p>

            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                onClick={() => setConfirmDeleteModal(null)}
                className="px-4 py-2 bg-white/10 hover:bg-white/20 text-white/80 rounded-xl text-xs font-mono uppercase"
              >
                Cancel
              </button>
              <button
                onClick={executeDeleteEmail}
                className="px-5 py-2 bg-red-600 hover:bg-red-700 text-white font-bold rounded-xl text-xs font-mono uppercase tracking-wider"
              >
                Confirm Trash
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
