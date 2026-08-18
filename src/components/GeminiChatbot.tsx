import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  MessageSquare,
  X,
  Send,
  Sparkles,
  Zap,
  Brain,
  Bot,
  User as UserIcon,
  Trash2,
  Minimize2,
  Maximize2,
  ChevronDown,
  Copy,
  Check,
  RotateCcw,
} from 'lucide-react';

interface ChatMessage {
  id: string;
  role: 'user' | 'model';
  content: string;
  timestamp: string;
  modelUsed?: string;
  mode?: 'fast' | 'general' | 'complex';
}

type ModelMode = 'fast' | 'general' | 'complex';

const SUGGESTED_PROMPTS = [
  'What AWS certifications does Saivinod hold?',
  'Explain his experience with Terraform & Kubernetes',
  'How does he implement CI/CD with Jenkins & GitHub Actions?',
  'What is his approach to CloudWatch & Prometheus observability?',
];

const GeminiChatbot: React.FC = () => {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [isExpanded, setIsExpanded] = useState<boolean>(false);
  const [mode, setMode] = useState<ModelMode>('general');
  const [inputMessage, setInputMessage] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'welcome-1',
      role: 'model',
      content: `Hello! I am **Saivinod Kotipalli's AWS Cloud Ops & DevOps AI Advisor**.\n\nI can provide deep technical insights into Saivinod's cloud architectures, AWS certifications (SAA-C03 & Cloud Practitioner), Terraform IaC, Kubernetes clusters, and CI/CD pipelines.\n\nHow can I assist your engineering team today?`,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      modelUsed: 'gemini-3.5-flash',
      mode: 'general',
    },
  ]);

  const messagesEndRef = useRef<HTMLDivElement | null>(null);
  const inputRef = useRef<HTMLTextAreaElement | null>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (isOpen) {
      scrollToBottom();
      inputRef.current?.focus();
    }
  }, [messages, isOpen]);

  const handleSendMessage = async (customPrompt?: string) => {
    const textToSend = (customPrompt || inputMessage).trim();
    if (!textToSend || isLoading) return;

    const userMessageId = `user-${Date.now()}`;
    const newTimestamp = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    const newUserMsg: ChatMessage = {
      id: userMessageId,
      role: 'user',
      content: textToSend,
      timestamp: newTimestamp,
      mode,
    };

    const updatedHistory = [...messages, newUserMsg];
    setMessages(updatedHistory);
    setInputMessage('');
    setIsLoading(true);

    try {
      // Send conversation payload to server-side Gemini route
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: updatedHistory.map((m) => ({
            role: m.role,
            content: m.content,
          })),
          mode: mode,
        }),
      });

      const data = await response.json();

      if (response.ok && data.success) {
        const botMsg: ChatMessage = {
          id: `bot-${Date.now()}`,
          role: 'model',
          content: data.reply,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          modelUsed: data.modelUsed,
          mode: data.mode,
        };
        setMessages((prev) => [...prev, botMsg]);
      } else {
        throw new Error(data.error || 'Failed to receive AI response');
      }
    } catch (err: any) {
      console.error('Chat error:', err);
      const errorMsg: ChatMessage = {
        id: `error-${Date.now()}`,
        role: 'model',
        content: `⚠️ **Unable to generate response**: ${err?.message || 'Please verify network or API configurations.'}`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        mode,
      };
      setMessages((prev) => [...prev, errorMsg]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const handleClearHistory = () => {
    setMessages([
      {
        id: `welcome-${Date.now()}`,
        role: 'model',
        content: `Conversation reset. Ready to answer questions about Saivinod's AWS architecture and cloud experience!`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        modelUsed: 'gemini-3.5-flash',
        mode,
      },
    ]);
  };

  const copyToClipboard = (id: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <aside aria-label="Gemini AI Assistant" className="fixed bottom-6 right-6 z-50 font-sans">
      {/* Floating Launcher Trigger - Compact Icon */}
      <AnimatePresence>
        {!isOpen && (
          <motion.button
            id="open-gemini-chat-btn"
            onClick={() => setIsOpen(true)}
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            aria-label="Open Cloud AI Assistant"
            title="Ask Cloud AI (Gemini 3)"
            className="group relative w-12 h-12 sm:w-13 sm:h-13 rounded-full bg-gradient-to-tr from-[#ff2a2a] to-[#d41c1c] text-white flex items-center justify-center shadow-[0_4px_20px_rgba(255,42,42,0.35)] hover:shadow-[0_6px_25px_rgba(255,42,42,0.55)] border border-white/20 backdrop-blur-md cursor-pointer transition-all duration-300"
          >
            <div className="relative flex items-center justify-center">
              <Bot className="w-5 h-5 sm:w-6 sm:h-6 text-white group-hover:rotate-12 transition-transform duration-300" />
              <span className="absolute -top-1 -right-1 w-2 h-2 bg-yellow-300 rounded-full ring-2 ring-black" />
            </div>
            
            {/* Tooltip on hover */}
            <span className="pointer-events-none absolute right-full mr-3 top-1/2 -translate-y-1/2 px-2.5 py-1 rounded-lg bg-[#141414]/95 text-white text-[11px] font-['Space_Grotesk',sans-serif] font-medium border border-white/10 opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap shadow-lg">
              Ask Cloud AI
            </span>
          </motion.button>
        )}
      </AnimatePresence>

      {/* Chat Window Container */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            id="gemini-chat-window"
            initial={{ opacity: 0, y: 30, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 30, scale: 0.95 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            className={`bg-[#0d0d0d] border border-white/15 rounded-3xl shadow-[0_20px_60px_rgba(0,0,0,0.8)] overflow-hidden flex flex-col transition-all duration-300 ${
              isExpanded
                ? 'w-[95vw] sm:w-[650px] h-[88vh] max-h-[850px]'
                : 'w-[92vw] sm:w-[420px] h-[600px] max-h-[85vh]'
            }`}
          >
            {/* Header */}
            <div className="bg-gradient-to-r from-[#171717] via-[#1a1a1a] to-[#241313] border-b border-white/10 p-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-[#ff2a2a] to-orange-500 flex items-center justify-center text-white shadow-md border border-white/20">
                  <Bot className="w-5 h-5" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="font-bold text-sm text-white tracking-tight">Saivinod AI Advisor</h3>
                    <span className="inline-flex items-center gap-1 text-[9px] font-mono px-2 py-0.5 rounded-full bg-red-500/20 text-red-300 border border-red-500/30">
                      Live
                    </span>
                  </div>
                  <p className="text-[11px] text-white/60 font-mono truncate max-w-[200px]">
                    AWS Ops & DevOps Knowledge Base
                  </p>
                </div>
              </div>

              {/* Header Action Buttons */}
              <div className="flex items-center gap-1.5 text-white/70">
                <button
                  onClick={handleClearHistory}
                  title="Reset conversation"
                  className="p-2 hover:text-white hover:bg-white/10 rounded-lg transition-colors cursor-pointer"
                >
                  <RotateCcw className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setIsExpanded(!isExpanded)}
                  title={isExpanded ? 'Minimize' : 'Expand window'}
                  className="p-2 hover:text-white hover:bg-white/10 rounded-lg transition-colors cursor-pointer hidden sm:block"
                >
                  {isExpanded ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
                </button>
                <button
                  onClick={() => setIsOpen(false)}
                  title="Close chat"
                  className="p-2 hover:text-white hover:bg-white/10 rounded-lg transition-colors cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Model Mode Selector Bar */}
            <div className="bg-[#121212] border-b border-white/10 px-3 py-2 flex items-center justify-between gap-1 overflow-x-auto text-[11px] font-mono">
              <span className="text-white/50 text-[10px] uppercase font-bold tracking-wider pl-1 hidden sm:inline">
                Model Engine:
              </span>

              <div className="flex items-center gap-1 w-full sm:w-auto justify-between sm:justify-end">
                {/* Low-Latency Mode */}
                <button
                  type="button"
                  onClick={() => setMode('fast')}
                  className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg border transition-all cursor-pointer whitespace-nowrap ${
                    mode === 'fast'
                      ? 'bg-yellow-500/20 text-yellow-300 border-yellow-500/50 shadow-sm'
                      : 'bg-white/5 text-white/60 border-transparent hover:text-white hover:bg-white/10'
                  }`}
                  title="Low-Latency Fast Responses (gemini-3.1-flash-lite)"
                >
                  <Zap className="w-3.5 h-3.5 text-yellow-400" />
                  <span>Fast Lite</span>
                </button>

                {/* General Mode */}
                <button
                  type="button"
                  onClick={() => setMode('general')}
                  className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg border transition-all cursor-pointer whitespace-nowrap ${
                    mode === 'general'
                      ? 'bg-blue-500/20 text-blue-300 border-blue-500/50 shadow-sm'
                      : 'bg-white/5 text-white/60 border-transparent hover:text-white hover:bg-white/10'
                  }`}
                  title="General Cloud Q&A (gemini-3.5-flash)"
                >
                  <Sparkles className="w-3.5 h-3.5 text-blue-400" />
                  <span>Flash 3.5</span>
                </button>

                {/* High Thinking Mode */}
                <button
                  type="button"
                  onClick={() => setMode('complex')}
                  className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg border transition-all cursor-pointer whitespace-nowrap ${
                    mode === 'complex'
                      ? 'bg-[#ff2a2a]/20 text-red-300 border-[#ff2a2a]/50 shadow-sm'
                      : 'bg-white/5 text-white/60 border-transparent hover:text-white hover:bg-white/10'
                  }`}
                  title="High Thinking Reasoning Mode (gemini-3.1-pro-preview with ThinkingLevel.HIGH)"
                >
                  <Brain className="w-3.5 h-3.5 text-[#ff2a2a]" />
                  <span>High Thinking</span>
                </button>
              </div>
            </div>

            {/* Scrollable Message Thread */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4 text-sm bg-[radial-gradient(#ffffff08_1px,transparent_1px)] bg-[size:16px_16px]">
              {messages.map((msg) => (
                <motion.div
                  key={msg.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`flex gap-3 ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  {msg.role === 'model' && (
                    <div className="w-7 h-7 rounded-xl bg-gradient-to-tr from-[#ff2a2a] to-orange-500 flex-shrink-0 flex items-center justify-center text-white mt-1 shadow-sm">
                      <Bot className="w-4 h-4" />
                    </div>
                  )}

                  <div
                    className={`max-w-[85%] rounded-2xl p-3.5 text-xs leading-relaxed relative group ${
                      msg.role === 'user'
                        ? 'bg-[#ff2a2a] text-white rounded-br-none shadow-md font-medium'
                        : 'bg-[#1a1a1a] text-white/90 border border-white/10 rounded-bl-none shadow-sm'
                    }`}
                  >
                    {/* Model & Mode Badge for Assistant */}
                    {msg.role === 'model' && (
                      <div className="flex items-center justify-between gap-2 mb-2 pb-1.5 border-b border-white/10 text-[10px] font-mono text-white/50">
                        <span className="flex items-center gap-1 text-white/70">
                          {msg.mode === 'fast' && <Zap className="w-3 h-3 text-yellow-400" />}
                          {msg.mode === 'complex' && <Brain className="w-3 h-3 text-[#ff2a2a]" />}
                          {msg.mode === 'general' && <Sparkles className="w-3 h-3 text-blue-400" />}
                          {msg.modelUsed || (msg.mode === 'complex' ? 'gemini-3.1-pro-preview' : 'gemini-3.5-flash')}
                        </span>
                        <button
                          onClick={() => copyToClipboard(msg.id, msg.content)}
                          className="opacity-0 group-hover:opacity-100 hover:text-white transition-opacity p-0.5 cursor-pointer"
                          title="Copy response"
                        >
                          {copiedId === msg.id ? (
                            <Check className="w-3 h-3 text-green-400" />
                          ) : (
                            <Copy className="w-3 h-3" />
                          )}
                        </button>
                      </div>
                    )}

                    {/* Message Body rendering */}
                    <div className="whitespace-pre-wrap break-words space-y-1.5">
                      {msg.content}
                    </div>

                    <div
                      className={`text-[9px] mt-1.5 font-mono ${
                        msg.role === 'user' ? 'text-white/70 text-right' : 'text-white/40'
                      }`}
                    >
                      {msg.timestamp}
                    </div>
                  </div>

                  {msg.role === 'user' && (
                    <div className="w-7 h-7 rounded-xl bg-white/20 border border-white/20 flex-shrink-0 flex items-center justify-center text-white mt-1">
                      <UserIcon className="w-4 h-4" />
                    </div>
                  )}
                </motion.div>
              ))}

              {/* Loading Indicator */}
              {isLoading && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex gap-3 justify-start items-start"
                >
                  <div className="w-7 h-7 rounded-xl bg-[#ff2a2a] flex items-center justify-center text-white mt-1 animate-pulse">
                    <Bot className="w-4 h-4" />
                  </div>
                  <div className="bg-[#1a1a1a] border border-white/10 rounded-2xl rounded-bl-none p-3.5 text-xs text-white/80 max-w-[80%] flex items-center gap-3">
                    <div className="flex items-center gap-1.5">
                      <span className="w-2 h-2 rounded-full bg-[#ff2a2a] animate-bounce [animation-delay:-0.3s]" />
                      <span className="w-2 h-2 rounded-full bg-orange-400 animate-bounce [animation-delay:-0.15s]" />
                      <span className="w-2 h-2 rounded-full bg-yellow-300 animate-bounce" />
                    </div>
                    <span className="font-mono text-[11px] text-white/70">
                      {mode === 'complex'
                        ? 'Reasoning with High Thinking Mode...'
                        : mode === 'fast'
                        ? 'Streaming low-latency response...'
                        : 'Generating insights with Gemini...'}
                    </span>
                  </div>
                </motion.div>
              )}

              <div ref={messagesEndRef} />
            </div>

            {/* Quick Suggestion Chips */}
            {messages.length <= 2 && !isLoading && (
              <div className="px-4 py-2 bg-[#121212] border-t border-white/5 flex items-center gap-1.5 overflow-x-auto no-scrollbar">
                <span className="text-[10px] text-white/40 uppercase font-mono tracking-wider flex-shrink-0">
                  Suggestions:
                </span>
                {SUGGESTED_PROMPTS.map((prompt, idx) => (
                  <button
                    key={idx}
                    onClick={() => handleSendMessage(prompt)}
                    className="text-[11px] text-white/80 hover:text-white bg-white/5 hover:bg-white/15 border border-white/10 px-2.5 py-1 rounded-full whitespace-nowrap transition-colors cursor-pointer flex-shrink-0"
                  >
                    {prompt}
                  </button>
                ))}
              </div>
            )}

            {/* Input Form Area */}
            <div className="p-3.5 bg-[#141414] border-t border-white/10">
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  handleSendMessage();
                }}
                className="flex items-end gap-2"
              >
                <div className="flex-1 bg-[#1f1f1f] border border-white/15 focus-within:border-[#ff2a2a] rounded-2xl px-3.5 py-2 transition-colors">
                  <textarea
                    ref={inputRef}
                    value={inputMessage}
                    onChange={(e) => setInputMessage(e.target.value)}
                    onKeyDown={handleKeyDown}
                    placeholder={
                      mode === 'complex'
                        ? 'Ask a complex architecture question (High Thinking)...'
                        : mode === 'fast'
                        ? 'Quick question (Low-Latency Flash Lite)...'
                        : "Ask anything about Saivinod's AWS & DevOps experience..."
                    }
                    rows={1}
                    className="w-full bg-transparent text-white placeholder-white/40 text-xs focus:outline-none resize-none max-h-24 font-normal"
                    style={{ minHeight: '24px' }}
                  />
                </div>

                <button
                  type="submit"
                  id="send-gemini-msg-btn"
                  disabled={!inputMessage.trim() || isLoading}
                  className="w-10 h-10 rounded-2xl bg-[#ff2a2a] hover:bg-red-600 disabled:opacity-40 disabled:cursor-not-allowed text-white flex items-center justify-center transition-all duration-200 shadow-md flex-shrink-0 cursor-pointer"
                >
                  <Send className="w-4 h-4" />
                </button>
              </form>
              <div className="flex items-center justify-between text-[10px] text-white/40 font-mono mt-2 px-1">
                <span>Press Enter to send • Shift+Enter for new line</span>
                <span>Gemini 3 Suite</span>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </aside>
  );
};

export default GeminiChatbot;
