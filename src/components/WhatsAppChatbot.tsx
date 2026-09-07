import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  X,
  Send,
  CheckCheck,
  Paperclip,
  ExternalLink,
  Phone,
  FileText,
  Trash2,
  Minimize2,
  Maximize2,
  Sparkles,
  ArrowRight,
  Smile,
  Mic
} from 'lucide-react';
import { usePortfolio } from '../context/PortfolioContext';
import { useTheme } from '../context/ThemeContext';

interface ChatMessage {
  id: string;
  sender: 'user' | 'saivinod';
  text: string;
  time: string;
  isWhatsAppHandover?: boolean;
}

const DEFAULT_PROMPTS = [
  'What AWS certifications does Saivinod hold?',
  'Explain his experience with Terraform & Kubernetes',
  'How does he monitor infrastructure using Prometheus & Grafana?',
  'Can I schedule an interview or hire Saivinod?',
];

export const WhatsAppChatbot: React.FC = () => {
  const { data } = usePortfolio();
  const { theme } = useTheme();
  const { personalInfo } = data;

  const [isOpen, setIsOpen] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const [inputMessage, setInputMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [showAttachMenu, setShowAttachMenu] = useState(false);
  const [hasUnread, setHasUnread] = useState(true);
  const [showTooltip, setShowTooltip] = useState(true);

  const rawPhone = personalInfo.phoneRaw || '8520899337';
  const whatsappBaseUrl = `https://wa.me/91${rawPhone}`;

  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'msg-welcome-1',
      sender: 'saivinod',
      text: `👋 **Hi! I'm Saivinod Kotipalli's WhatsApp Assistant.**\n\nI can answer questions about my **AWS Cloud Operations** background, **Terraform IaC**, **Kubernetes (EKS)**, **Prometheus/Grafana observability**, and **AWS Certifications (SAA-C03)**.\n\nYou can chat with me here, or tap **Open in WhatsApp** to message me directly on my phone!`,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    },
  ]);

  const messagesEndRef = useRef<HTMLDivElement | null>(null);
  const inputRef = useRef<HTMLInputElement | null>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (isOpen) {
      setHasUnread(false);
      setShowTooltip(false);
      scrollToBottom();
      setTimeout(() => inputRef.current?.focus(), 150);
    }
  }, [isOpen, messages]);

  // Handle sending message
  const handleSendMessage = async (customText?: string) => {
    const textToSend = (customText || inputMessage).trim();
    if (!textToSend || isTyping) return;

    const currentTime = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const userMsg: ChatMessage = {
      id: `user-${Date.now()}`,
      sender: 'user',
      text: textToSend,
      time: currentTime,
    };

    const updatedHistory = [...messages, userMsg];
    setMessages(updatedHistory);
    setInputMessage('');
    setShowAttachMenu(false);
    setIsTyping(true);

    try {
      // 1. Attempt AI server response via /api/chat
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: updatedHistory.map((m) => ({
            role: m.sender === 'user' ? 'user' : 'model',
            content: m.text,
          })),
          mode: 'fast',
        }),
      });

      const resData = await response.json();

      if (response.ok && resData.success && resData.reply) {
        const botMsg: ChatMessage = {
          id: `saivinod-${Date.now()}`,
          sender: 'saivinod',
          text: resData.reply,
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          isWhatsAppHandover: true,
        };
        setMessages((prev) => [...prev, botMsg]);
      } else {
        throw new Error(resData.error || 'Unable to fetch response');
      }
    } catch {
      // 2. Intelligent client-side fallback based on keywords
      const reply = generateSmartFallback(textToSend, personalInfo);
      const fallbackMsg: ChatMessage = {
        id: `saivinod-${Date.now()}`,
        sender: 'saivinod',
        text: reply,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        isWhatsAppHandover: true,
      };
      setMessages((prev) => [...prev, fallbackMsg]);
    } finally {
      setIsTyping(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const handleClearChat = () => {
    setMessages([
      {
        id: `msg-reset-${Date.now()}`,
        sender: 'saivinod',
        text: `Chat cleared. Feel free to ask anything about my AWS Cloud Ops experience or tap below to open WhatsApp!`,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      },
    ]);
  };

  // Open direct WhatsApp conversation with pre-filled query
  const openDirectWhatsApp = (customText?: string) => {
    const text = customText || inputMessage || "Hi Saivinod! I was looking at your AWS Cloud Operations portfolio and would like to connect.";
    const url = `${whatsappBaseUrl}?text=${encodeURIComponent(text)}`;
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  return (
    <aside aria-label="WhatsApp Assistant" className="fixed bottom-5 right-4 sm:bottom-6 sm:right-6 z-50 font-sans">
      {/* Floating WhatsApp Trigger Button */}
      <AnimatePresence>
        {!isOpen && (
          <div className="relative flex items-center group">
            {/* Tooltip Badge */}
            {showTooltip && (
              <motion.div
                initial={{ opacity: 0, x: 20, scale: 0.9 }}
                animate={{ opacity: 1, x: 0, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                className="absolute right-16 sm:right-18 bg-white dark:bg-[#1f2c34] text-slate-800 dark:text-slate-100 text-xs py-2 px-3.5 rounded-2xl shadow-xl border border-emerald-500/30 whitespace-nowrap flex items-center gap-2 cursor-pointer backdrop-blur-md"
                onClick={() => setIsOpen(true)}
              >
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
                <span className="font-semibold">Chat with Saivinod on WhatsApp</span>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setShowTooltip(false);
                  }}
                  className="text-slate-400 hover:text-slate-600 dark:hover:text-white ml-1"
                >
                  <X className="w-3 h-3" />
                </button>
              </motion.div>
            )}

            {/* Main WhatsApp Trigger Button */}
            <motion.button
              id="whatsapp-chatbot-launcher-btn"
              onClick={() => setIsOpen(true)}
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0, opacity: 0 }}
              whileHover={{ scale: 1.08 }}
              whileTap={{ scale: 0.92 }}
              aria-label="Open WhatsApp Chatbot"
              title="Chat with Saivinod on WhatsApp"
              className="relative w-12 h-12 sm:w-14 sm:h-14 rounded-full bg-[#25D366]/20 hover:bg-[#25D366]/30 backdrop-blur-md border border-[#25D366]/40 text-[#25D366] flex items-center justify-center shadow-[0_8px_30px_rgba(37,211,102,0.25)] hover:shadow-[0_10px_35px_rgba(37,211,102,0.4)] cursor-pointer transition-all duration-300"
            >
              {/* Outer Ripple Ring */}
              <span className="absolute inset-0 rounded-full border-2 border-[#25D366] opacity-40 animate-ping" />

              {/* Official WhatsApp SVG Icon */}
              <svg className="w-6 h-6 sm:w-7 sm:h-7 text-[#25D366] relative z-10 fill-current" viewBox="0 0 24 24">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.888 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
              </svg>

              {/* Unread Message Badge */}
              {hasUnread && (
                <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white font-bold text-[10px] rounded-full flex items-center justify-center border-2 border-white shadow-md">
                  1
                </span>
              )}
            </motion.button>
          </div>
        )}
      </AnimatePresence>

      {/* WhatsApp Interactive Chat Window */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 35, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 35, scale: 0.95 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            className={`flex flex-col shadow-2xl rounded-2xl overflow-hidden border border-emerald-600/30 transition-all duration-300 z-50 ${
              isExpanded
                ? 'w-[95vw] sm:w-[540px] h-[85vh] max-h-[780px]'
                : 'w-[92vw] sm:w-[380px] md:w-[410px] h-[580px] max-h-[82vh]'
            } ${theme === 'dark' ? 'bg-[#0b141a]' : 'bg-[#efeae2]'}`}
          >
            {/* WhatsApp Header */}
            <header className="bg-[#075E54] dark:bg-[#202c33] text-white px-4 py-3 flex items-center justify-between shadow-md select-none shrink-0">
              <div className="flex items-center gap-3">
                {/* Avatar with Online Pulse */}
                <div className="relative">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-emerald-500 to-cyan-500 flex items-center justify-center font-bold text-white text-sm shadow border border-white/20">
                    SK
                  </div>
                  <span className="absolute bottom-0 right-0 w-3 h-3 rounded-full bg-[#25D366] border-2 border-[#075E54] dark:border-[#202c33]" />
                </div>

                <div className="flex flex-col">
                  <div className="flex items-center gap-1.5">
                    <h3 className="font-bold text-sm tracking-wide text-white leading-tight">
                      {personalInfo.name}
                    </h3>
                    <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-[#25D366]/20 text-[#25D366] font-semibold">
                      DevOps
                    </span>
                  </div>
                  <span className="text-[11px] text-emerald-100 dark:text-emerald-400 font-medium">
                    {isTyping ? 'typing...' : 'online • AWS Cloud Ops'}
                  </span>
                </div>
              </div>

              {/* Header Action Buttons */}
              <div className="flex items-center gap-1 sm:gap-2">
                {/* Direct WhatsApp App Button */}
                <button
                  id="header-open-whatsapp-app"
                  onClick={() => openDirectWhatsApp()}
                  className="p-1.5 text-white/80 hover:text-white hover:bg-white/10 rounded-full transition-colors"
                  title="Open chat in WhatsApp App (+91 8520899337)"
                  aria-label="Open in WhatsApp"
                >
                  <svg className="w-4.5 h-4.5 fill-current" viewBox="0 0 24 24">
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.888 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                  </svg>
                </button>

                {/* Direct Phone Call */}
                <a
                  href={`tel:${personalInfo.phone}`}
                  className="p-1.5 text-white/80 hover:text-white hover:bg-white/10 rounded-full transition-colors"
                  title={`Call ${personalInfo.phone}`}
                >
                  <Phone className="w-4 h-4" />
                </a>

                {/* Clear Chat */}
                <button
                  onClick={handleClearChat}
                  className="p-1.5 text-white/80 hover:text-white hover:bg-white/10 rounded-full transition-colors"
                  title="Clear conversation"
                >
                  <Trash2 className="w-4 h-4" />
                </button>

                {/* Expand / Minimize Window */}
                <button
                  onClick={() => setIsExpanded(!isExpanded)}
                  className="p-1.5 text-white/80 hover:text-white hover:bg-white/10 rounded-full transition-colors hidden sm:block"
                  title={isExpanded ? "Standard view" : "Expand view"}
                >
                  {isExpanded ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
                </button>

                {/* Close Window */}
                <button
                  id="close-whatsapp-chat-btn"
                  onClick={() => setIsOpen(false)}
                  className="p-1.5 text-white/80 hover:text-white hover:bg-white/10 rounded-full transition-colors"
                  title="Close chat"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </header>

            {/* WhatsApp Chat Body with Authentic Wallpaper Background */}
            <div
              className={`flex-1 p-3.5 sm:p-4 overflow-y-auto space-y-3 relative ${
                theme === 'dark' ? 'bg-[#0b141a]' : 'bg-[#efeae2]'
              }`}
              style={{
                backgroundImage: theme === 'dark'
                  ? `radial-gradient(#1f2c34 1px, transparent 1px)`
                  : `radial-gradient(#d1d7db 1px, transparent 1px)`,
                backgroundSize: '16px 16px',
              }}
            >
              {/* Date Chip */}
              <div className="flex justify-center my-1">
                <span className="text-[10px] uppercase font-bold tracking-wider px-3 py-1 rounded-lg bg-black/10 dark:bg-[#182229] text-slate-600 dark:text-slate-400 shadow-xs">
                  TODAY
                </span>
              </div>

              {/* Encryption Notice */}
              <div className="bg-[#fff9c4] dark:bg-[#182229] text-[#54656f] dark:text-[#8696a0] text-[10.5px] p-2.5 rounded-lg text-center shadow-xs border border-yellow-200/50 dark:border-white/5 flex items-center justify-center gap-1.5 leading-tight">
                <span className="text-yellow-600 dark:text-yellow-400">🔒</span>
                <span>
                  Messages are end-to-end encrypted. You are chatting with Saivinod Kotipalli's AWS Ops AI Assistant.
                </span>
              </div>

              {/* Chat Messages */}
              {messages.map((msg) => {
                const isUser = msg.sender === 'user';

                return (
                  <div
                    key={msg.id}
                    className={`flex flex-col ${isUser ? 'items-end' : 'items-start'}`}
                  >
                    <div
                      className={`max-w-[85%] rounded-2xl p-3 shadow-xs relative text-xs sm:text-[13px] leading-relaxed break-words ${
                        isUser
                          ? 'bg-[#d9fdd3] dark:bg-[#005c4b] text-slate-900 dark:text-white rounded-tr-none'
                          : 'bg-white dark:bg-[#202c33] text-slate-900 dark:text-slate-100 rounded-tl-none border border-slate-200/60 dark:border-transparent'
                      }`}
                    >
                      {/* Message Content with Markdown Parsing */}
                      <div className="space-y-1.5 whitespace-pre-wrap font-normal">
                        {renderMessageText(msg.text)}
                      </div>

                      {/* Optional: Continue on WhatsApp Button for Bot Responses */}
                      {!isUser && msg.isWhatsAppHandover && (
                        <div className="mt-2.5 pt-2 border-t border-slate-200 dark:border-white/10 flex items-center justify-between gap-2">
                          <button
                            onClick={() => openDirectWhatsApp(msg.text.slice(0, 150))}
                            className="flex items-center gap-1.5 text-[11px] font-bold text-[#128C7E] dark:text-[#25D366] hover:underline"
                          >
                            <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
                              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.888 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                            </svg>
                            <span>Chat on WhatsApp</span>
                          </button>
                        </div>
                      )}

                      {/* Timestamp & Delivery Double Ticks */}
                      <div className="flex items-center justify-end gap-1 mt-1 text-[10px] text-slate-400 dark:text-slate-400 select-none">
                        <span>{msg.time}</span>
                        {isUser && (
                          <CheckCheck className="w-3.5 h-3.5 text-[#53bdeb] inline-block" />
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}

              {/* Typing Indicator */}
              {isTyping && (
                <div className="flex items-start">
                  <div className="bg-white dark:bg-[#202c33] rounded-2xl rounded-tl-none p-3 shadow-xs border border-slate-200/60 dark:border-transparent flex items-center gap-1.5 text-xs text-slate-500 dark:text-slate-400">
                    <span className="w-2 h-2 rounded-full bg-[#25D366] animate-bounce" style={{ animationDelay: '0ms' }} />
                    <span className="w-2 h-2 rounded-full bg-[#25D366] animate-bounce" style={{ animationDelay: '150ms' }} />
                    <span className="w-2 h-2 rounded-full bg-[#25D366] animate-bounce" style={{ animationDelay: '300ms' }} />
                    <span className="text-[11px] ml-1 text-slate-400 font-medium">Saivinod is typing...</span>
                  </div>
                </div>
              )}

              {/* WhatsApp Quick Reply Chips */}
              <div className="pt-2 pb-1">
                <p className="text-[11px] font-semibold text-slate-500 dark:text-slate-400 mb-2 flex items-center gap-1">
                  <Sparkles className="w-3 h-3 text-[#25D366]" />
                  <span>Quick Questions</span>
                </p>
                <div className="flex flex-wrap gap-1.5">
                  {DEFAULT_PROMPTS.map((prompt, idx) => (
                    <button
                      key={idx}
                      onClick={() => handleSendMessage(prompt)}
                      disabled={isTyping}
                      className="text-left text-[11px] py-1.5 px-3 rounded-full bg-white dark:bg-[#202c33] hover:bg-[#d9fdd3] dark:hover:bg-[#005c4b] text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-white/10 shadow-2xs transition-colors flex items-center gap-1 disabled:opacity-50 cursor-pointer"
                    >
                      <span>{prompt}</span>
                    </button>
                  ))}
                  <button
                    onClick={() => openDirectWhatsApp()}
                    className="text-left text-[11px] py-1.5 px-3 rounded-full bg-[#25D366]/15 hover:bg-[#25D366]/30 text-[#128C7E] dark:text-[#25D366] border border-[#25D366]/30 font-bold transition-colors flex items-center gap-1 cursor-pointer"
                  >
                    <span>💬 Direct WhatsApp (+91 {rawPhone})</span>
                    <ExternalLink className="w-3 h-3" />
                  </button>
                </div>
              </div>

              <div ref={messagesEndRef} />
            </div>

            {/* Attachment Dropup Menu */}
            <AnimatePresence>
              {showAttachMenu && (
                <motion.div
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 15 }}
                  className="bg-white dark:bg-[#202c33] border-t border-slate-200 dark:border-white/10 p-3 grid grid-cols-3 gap-2 shadow-lg shrink-0"
                >
                  <a
                    href={personalInfo.resumeUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex flex-col items-center gap-1.5 p-2 rounded-xl hover:bg-slate-100 dark:hover:bg-[#182229] text-center text-[11px] text-slate-700 dark:text-slate-200 transition-colors"
                  >
                    <div className="w-8 h-8 rounded-full bg-blue-500/20 text-blue-500 flex items-center justify-center">
                      <FileText className="w-4 h-4" />
                    </div>
                    <span>Resume PDF</span>
                  </a>

                  <button
                    onClick={() => {
                      openDirectWhatsApp("Hi Saivinod, I'd like to discuss a job opportunity or freelance AWS project.");
                      setShowAttachMenu(false);
                    }}
                    className="flex flex-col items-center gap-1.5 p-2 rounded-xl hover:bg-slate-100 dark:hover:bg-[#182229] text-center text-[11px] text-slate-700 dark:text-slate-200 transition-colors"
                  >
                    <div className="w-8 h-8 rounded-full bg-emerald-500/20 text-emerald-500 flex items-center justify-center">
                      <Phone className="w-4 h-4" />
                    </div>
                    <span>WhatsApp</span>
                  </button>

                  <a
                    href={`mailto:${personalInfo.email}`}
                    className="flex flex-col items-center gap-1.5 p-2 rounded-xl hover:bg-slate-100 dark:hover:bg-[#182229] text-center text-[11px] text-slate-700 dark:text-slate-200 transition-colors"
                  >
                    <div className="w-8 h-8 rounded-full bg-purple-500/20 text-purple-500 flex items-center justify-center">
                      <ExternalLink className="w-4 h-4" />
                    </div>
                    <span>Send Email</span>
                  </a>
                </motion.div>
              )}
            </AnimatePresence>

            {/* WhatsApp Input Bar */}
            <footer className="bg-[#f0f2f5] dark:bg-[#202c33] p-2.5 sm:p-3 flex items-center gap-2 border-t border-slate-200 dark:border-white/10 shrink-0">
              {/* Attachment Clip */}
              <button
                onClick={() => setShowAttachMenu(!showAttachMenu)}
                className={`p-2 rounded-full transition-colors ${
                  showAttachMenu
                    ? 'text-[#25D366] bg-emerald-500/15'
                    : 'text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-white'
                }`}
                title="Share attachment or resume"
              >
                <Paperclip className="w-4.5 h-4.5" />
              </button>

              {/* Text Input Pill */}
              <div className="flex-1 relative flex items-center">
                <input
                  ref={inputRef}
                  type="text"
                  value={inputMessage}
                  onChange={(e) => setInputMessage(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder="Type a WhatsApp message..."
                  className="w-full py-2.5 px-4 rounded-full bg-white dark:bg-[#2a3942] text-slate-900 dark:text-white text-xs sm:text-sm placeholder:text-slate-400 focus:outline-none shadow-xs border border-transparent focus:border-emerald-500"
                />
              </div>

              {/* Send Button or Direct WhatsApp Trigger */}
              {inputMessage.trim().length > 0 ? (
                <button
                  id="whatsapp-chat-send-btn"
                  onClick={() => handleSendMessage()}
                  disabled={isTyping}
                  className="w-10 h-10 rounded-full bg-[#128C7E] hover:bg-[#075E54] text-white flex items-center justify-center shadow-md transition-all transform active:scale-95 disabled:opacity-50 cursor-pointer shrink-0"
                  title="Send message"
                >
                  <Send className="w-4.5 h-4.5" />
                </button>
              ) : (
                <button
                  onClick={() => openDirectWhatsApp()}
                  className="w-10 h-10 rounded-full bg-[#25D366] hover:bg-[#1ebd5b] text-white flex items-center justify-center shadow-md transition-all transform active:scale-95 cursor-pointer shrink-0"
                  title="Open in WhatsApp app (+91 8520899337)"
                >
                  <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.888 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                  </svg>
                </button>
              )}
            </footer>
          </motion.div>
        )}
      </AnimatePresence>
    </aside>
  );
};

// Helper: Markdown parser for chat messages
function renderMessageText(text: string) {
  const lines = text.split('\n');
  return lines.map((line, idx) => {
    // Bold formatting **text**
    const parts = line.split(/(\*\*.*?\*\*)/g);

    return (
      <div key={idx} className={line.trim().startsWith('-') || line.trim().startsWith('•') ? 'pl-2' : ''}>
        {parts.map((part, pIdx) => {
          if (part.startsWith('**') && part.endsWith('**')) {
            return (
              <strong key={pIdx} className="font-bold text-emerald-950 dark:text-emerald-300">
                {part.slice(2, -2)}
              </strong>
            );
          }
          return <span key={pIdx}>{part}</span>;
        })}
      </div>
    );
  });
}

// Helper: Smart instant fallback responses
function generateSmartFallback(query: string, info: any): string {
  const q = query.toLowerCase();

  if (q.includes('certif') || q.includes('saa') || q.includes('aws certified')) {
    return `📜 **Saivinod's AWS Certifications**:\n• **AWS Certified Solutions Architect – Associate** (Validation: \`fdf0684f88e442888e25d214ec3b5bf3\`)\n• **AWS Certified Cloud Practitioner** (Validation: \`e976db57f2bb42c5896b0ee1b9b4742c\`)\n\nBoth certifications demonstrate strong domain mastery across highly available, fault-tolerant cloud architectures.`;
  }

  if (q.includes('terraform') || q.includes('iac') || q.includes('cloudformation')) {
    return `🛠️ **Infrastructure as Code (IaC)**:\nSaivinod uses **Terraform** and **AWS CloudFormation** to provision multi-tier VPCs, subnets, NAT Gateways, Auto Scaling EC2 groups, and RDS clusters. He maintains modular, reproducible configurations with remote state locking.`;
  }

  if (q.includes('kubernetes') || q.includes('k8s') || q.includes('docker') || q.includes('container')) {
    return `🐳 **Containers & Kubernetes**:\nExperienced managing containerized microservices on **AWS EKS** and Docker. Configures Helm charts, Horizontal Pod Autoscaling (HPA), ingress controllers, and zero-downtime rolling updates.`;
  }

  if (q.includes('prometheus') || q.includes('grafana') || q.includes('monitor') || q.includes('sre') || q.includes('observability')) {
    return `📊 **Observability & SRE**:\nSpecializes in centralized monitoring with **Prometheus**, **Grafana**, **Node Exporter**, and **Alertmanager**. Automates alerting to Slack and email, cutting Mean Time to Detect (MTTD) by 40%.`;
  }

  if (q.includes('hire') || q.includes('interview') || q.includes('contact') || q.includes('email') || q.includes('phone') || q.includes('call')) {
    return `🤝 **Let's Connect Directly**:\n• **Email**: ${info.email}\n• **Phone / WhatsApp**: ${info.phone}\n• **Location**: ${info.location}\n\nTap **Chat on WhatsApp** below to message Saivinod directly on his phone!`;
  }

  if (q.includes('resume') || q.includes('cv')) {
    return `📄 **Resume Download**:\nYou can review Saivinod's full credentials by downloading his resume: [Download Resume PDF](${info.resumeUrl}).\nOr tap the paperclip icon to open the direct link!`;
  }

  return `Saivinod Kotipalli is an **AWS Cloud Operations & DevOps Engineer** specializing in AWS infrastructure automation, Terraform IaC, Kubernetes, CI/CD, and Prometheus/Grafana observability.\n\nWould you like to discuss an opportunity, or continue this chat directly with Saivinod on WhatsApp at **${info.phone}**?`;
}

export default WhatsAppChatbot;
