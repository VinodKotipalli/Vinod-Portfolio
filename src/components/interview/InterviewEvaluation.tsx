import React from 'react';
import { useInterview } from '../../context/InterviewContext';
import {
  ResponsiveContainer,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Cell,
} from 'recharts';
import {
  Trophy,
  CheckCircle,
  AlertTriangle,
  BookOpen,
  Sparkles,
  RotateCcw,
  PlusCircle,
  History,
  Download,
  Share2,
  Award,
  Cpu,
  Workflow,
  MessageSquare,
  Target,
  Wrench,
} from 'lucide-react';

export const InterviewEvaluation: React.FC = () => {
  const {
    session,
    isEvaluating,
    handleRetrySameTopic,
    handleRestartInterview,
    setView,
  } = useInterview();

  if (isEvaluating || !session?.evaluation) {
    return (
      <div className="w-full max-w-4xl mx-auto px-4 py-20 text-center" data-aos="fade-up">
        <div className="w-16 h-16 rounded-2xl bg-[#ff2a2a]/20 text-[#ff5858] flex items-center justify-center mx-auto mb-6 animate-pulse">
          <Sparkles className="w-8 h-8" />
        </div>
        <h2 className="text-2xl sm:text-3xl font-black text-white font-['Syne',sans-serif] uppercase mb-3">
          Synthesizing Comprehensive DevOps Audit...
        </h2>
        <p className="text-sm text-white/60 font-['Plus_Jakarta_Sans',sans-serif] max-w-md mx-auto">
          Gemini AI is analyzing your technical accuracy, CLI command usage, architecture design, and
          troubleshooting methodology across all questions.
        </p>
        <div className="mt-8 flex justify-center">
          <div className="w-10 h-10 border-4 border-[#ff2a2a]/30 border-t-[#ff2a2a] rounded-full animate-spin" />
        </div>
      </div>
    );
  }

  const { config, evaluation, durationSeconds, messages } = session;
  const {
    overallScore,
    technicalKnowledge,
    problemSolving,
    communication,
    accuracy,
    practicalKnowledge,
    strengths,
    areasForImprovement,
    missingConcepts,
    recommendedTopics,
    interviewReadiness,
    finalFeedback,
  } = evaluation;

  // Radar Data for Recharts
  const radarData = [
    { subject: 'Technical Depth', score: Math.round(technicalKnowledge * 10), fullMark: 100 },
    { subject: 'Problem Solving', score: Math.round(problemSolving * 10), fullMark: 100 },
    { subject: 'Communication', score: Math.round(communication * 10), fullMark: 100 },
    { subject: 'Accuracy', score: Math.round(accuracy * 10), fullMark: 100 },
    { subject: 'Practical Ops', score: Math.round(practicalKnowledge * 10), fullMark: 100 },
  ];

  // Bar Data
  const barData = [
    { name: 'Technical', value: technicalKnowledge, fill: '#ff2a2a' },
    { name: 'Problem Solving', value: problemSolving, fill: '#ff5858' },
    { name: 'Communication', value: communication, fill: '#38bdf8' },
    { name: 'Accuracy', value: accuracy, fill: '#34d399' },
    { name: 'Practical Ops', value: practicalKnowledge, fill: '#a78bfa' },
  ];

  // Score tier color & badge
  const getScoreBadge = (score: number) => {
    if (score >= 85) return { label: 'Top Tier Senior Candidate', color: 'text-emerald-400 border-emerald-400/40 bg-emerald-500/10' };
    if (score >= 70) return { label: 'Solid Mid-Level Proficiency', color: 'text-sky-400 border-sky-400/40 bg-sky-500/10' };
    if (score >= 55) return { label: 'Associate / Developing', color: 'text-amber-400 border-amber-400/40 bg-amber-500/10' };
    return { label: 'Foundational Review Needed', color: 'text-rose-400 border-rose-400/40 bg-rose-500/10' };
  };

  const badge = getScoreBadge(overallScore);

  // Export transcript helper
  const handleExport = () => {
    const textContent = `=====================================================
SAIVINOD KOTIPALLI - AI LIVE MOCK INTERVIEW PERFORMANCE AUDIT
=====================================================
Role: ${config.role}
Experience Target: ${config.experience}
Difficulty: ${config.difficulty}
Topic: ${config.topic}
Date: ${new Date(session.createdAt).toLocaleString()}
Duration: ${Math.round(durationSeconds / 60)} minutes

OVERALL SCORE: ${overallScore}/100
- Technical Knowledge: ${technicalKnowledge}/10
- Problem Solving: ${problemSolving}/10
- Communication: ${communication}/10
- Accuracy: ${accuracy}/10
- Practical Knowledge: ${practicalKnowledge}/10

INTERVIEW READINESS:
${interviewReadiness}

STRENGTHS:
${strengths.map((s) => `• ${s}`).join('\n')}

AREAS FOR IMPROVEMENT:
${areasForImprovement.map((a) => `• ${a}`).join('\n')}

MISSING CONCEPTS:
${missingConcepts.map((m) => `• ${m}`).join('\n')}

RECOMMENDED TOPICS:
${recommendedTopics.map((r) => `• ${r}`).join('\n')}

FINAL FEEDBACK:
${finalFeedback}

=====================================================
COMPLETE TRANSCRIPT:
=====================================================
${messages
  .map(
    (m) =>
      `[${m.role.toUpperCase()} - ${m.timestamp}]:\n${m.content}\n`
  )
  .join('\n-----------------------------------------------------\n')}
`;

    const blob = new Blob([textContent], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `DevOps_Interview_Audit_${config.topic.replace(/\s+/g, '_')}_${Date.now()}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="w-full max-w-5xl mx-auto px-4 py-8 space-y-8" data-aos="fade-up">
      {/* Top Header Card */}
      <div className="bg-[#0b0b0b] border border-white/10 rounded-2xl p-6 sm:p-8 backdrop-blur-xl shadow-2xl">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6 pb-6 border-b border-white/10">
          <div className="space-y-2 text-center md:text-left">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-['JetBrains_Mono',monospace] uppercase font-bold border border-white/10 bg-white/5 text-white/80">
              <Award className="w-3.5 h-3.5 text-[#ff2a2a]" />
              Official Technical Interview Audit
            </div>
            <h1 className="text-2xl sm:text-3xl md:text-4xl font-black text-white font-['Syne',sans-serif] uppercase">
              Interview <span className="text-[#ff2a2a]">Performance Report</span>
            </h1>
            <p className="text-xs sm:text-sm text-white/60 font-['Plus_Jakarta_Sans',sans-serif]">
              {config.role} • {config.topic} • {config.experience} ({config.difficulty}) •{' '}
              {Math.round(durationSeconds / 60)} mins
            </p>
          </div>

          {/* Overall Score Circle Card */}
          <div className="flex flex-col items-center p-4 sm:p-6 rounded-2xl bg-white/5 border border-white/10 shadow-lg text-center shrink-0">
            <div className="relative w-28 h-28 flex items-center justify-center">
              {/* Circular Progress SVG */}
              <svg className="w-full h-full transform -rotate-90" viewBox="0 0 36 36">
                <path
                  className="text-white/10"
                  strokeWidth="3.5"
                  stroke="currentColor"
                  fill="none"
                  d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                />
                <path
                  className="text-[#ff2a2a] transition-all duration-1000 ease-out"
                  strokeDasharray={`${overallScore}, 100`}
                  strokeWidth="3.5"
                  strokeLinecap="round"
                  stroke="currentColor"
                  fill="none"
                  d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                />
              </svg>
              <div className="absolute flex flex-col items-center">
                <span className="text-3xl font-black text-white font-['Syne',sans-serif]">
                  {overallScore}
                </span>
                <span className="text-[10px] text-white/50 font-['JetBrains_Mono',monospace]">/ 100</span>
              </div>
            </div>
            <span
              className={`mt-2 px-2.5 py-1 rounded-full text-[10px] font-bold font-['JetBrains_Mono',monospace] border ${badge.color}`}
            >
              {badge.label}
            </span>
          </div>
        </div>

        {/* 5 Core Metric Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 pt-6">
          {/* 1. Technical Knowledge */}
          <div className="p-3.5 rounded-xl bg-white/5 border border-white/10 flex flex-col justify-between">
            <div className="flex items-center justify-between text-white/50 mb-2">
              <span className="text-[11px] font-['Space_Grotesk',sans-serif] uppercase">Technical</span>
              <Cpu className="w-4 h-4 text-[#ff2a2a]" />
            </div>
            <div className="text-xl font-bold text-white font-['Syne',sans-serif]">
              {technicalKnowledge} <span className="text-xs text-white/40 font-normal">/ 10</span>
            </div>
            <div className="w-full bg-white/10 h-1 rounded-full mt-2 overflow-hidden">
              <div
                className="bg-[#ff2a2a] h-1 rounded-full"
                style={{ width: `${(technicalKnowledge / 10) * 100}%` }}
              />
            </div>
          </div>

          {/* 2. Problem Solving */}
          <div className="p-3.5 rounded-xl bg-white/5 border border-white/10 flex flex-col justify-between">
            <div className="flex items-center justify-between text-white/50 mb-2">
              <span className="text-[11px] font-['Space_Grotesk',sans-serif] uppercase">Problem Solving</span>
              <Workflow className="w-4 h-4 text-[#ff5858]" />
            </div>
            <div className="text-xl font-bold text-white font-['Syne',sans-serif]">
              {problemSolving} <span className="text-xs text-white/40 font-normal">/ 10</span>
            </div>
            <div className="w-full bg-white/10 h-1 rounded-full mt-2 overflow-hidden">
              <div
                className="bg-[#ff5858] h-1 rounded-full"
                style={{ width: `${(problemSolving / 10) * 100}%` }}
              />
            </div>
          </div>

          {/* 3. Communication */}
          <div className="p-3.5 rounded-xl bg-white/5 border border-white/10 flex flex-col justify-between">
            <div className="flex items-center justify-between text-white/50 mb-2">
              <span className="text-[11px] font-['Space_Grotesk',sans-serif] uppercase">Communication</span>
              <MessageSquare className="w-4 h-4 text-sky-400" />
            </div>
            <div className="text-xl font-bold text-white font-['Syne',sans-serif]">
              {communication} <span className="text-xs text-white/40 font-normal">/ 10</span>
            </div>
            <div className="w-full bg-white/10 h-1 rounded-full mt-2 overflow-hidden">
              <div
                className="bg-sky-400 h-1 rounded-full"
                style={{ width: `${(communication / 10) * 100}%` }}
              />
            </div>
          </div>

          {/* 4. Accuracy */}
          <div className="p-3.5 rounded-xl bg-white/5 border border-white/10 flex flex-col justify-between">
            <div className="flex items-center justify-between text-white/50 mb-2">
              <span className="text-[11px] font-['Space_Grotesk',sans-serif] uppercase">Accuracy</span>
              <Target className="w-4 h-4 text-emerald-400" />
            </div>
            <div className="text-xl font-bold text-white font-['Syne',sans-serif]">
              {accuracy} <span className="text-xs text-white/40 font-normal">/ 10</span>
            </div>
            <div className="w-full bg-white/10 h-1 rounded-full mt-2 overflow-hidden">
              <div
                className="bg-emerald-400 h-1 rounded-full"
                style={{ width: `${(accuracy / 10) * 100}%` }}
              />
            </div>
          </div>

          {/* 5. Practical Knowledge */}
          <div className="p-3.5 rounded-xl bg-white/5 border border-white/10 flex flex-col justify-between col-span-2 sm:col-span-1">
            <div className="flex items-center justify-between text-white/50 mb-2">
              <span className="text-[11px] font-['Space_Grotesk',sans-serif] uppercase">Practical Ops</span>
              <Wrench className="w-4 h-4 text-purple-400" />
            </div>
            <div className="text-xl font-bold text-white font-['Syne',sans-serif]">
              {practicalKnowledge} <span className="text-xs text-white/40 font-normal">/ 10</span>
            </div>
            <div className="w-full bg-white/10 h-1 rounded-full mt-2 overflow-hidden">
              <div
                className="bg-purple-400 h-1 rounded-full"
                style={{ width: `${(practicalKnowledge / 10) * 100}%` }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Visual Charts Grid: Radar & Bar */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Radar Chart */}
        <div className="bg-[#0b0b0b] border border-white/10 rounded-2xl p-6 backdrop-blur-xl">
          <h3 className="text-sm font-bold text-white uppercase tracking-wider font-['Syne',sans-serif] mb-4 flex items-center gap-2">
            <Trophy className="w-4 h-4 text-[#ff2a2a]" />
            Competency Radar
          </h3>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <RadarChart data={radarData}>
                <PolarGrid stroke="#333" />
                <PolarAngleAxis dataKey="subject" stroke="#888" tick={{ fill: '#aaa', fontSize: 11 }} />
                <PolarRadiusAxis angle={30} domain={[0, 100]} stroke="#555" tick={false} />
                <Radar
                  name="Score"
                  dataKey="score"
                  stroke="#ff2a2a"
                  fill="#ff2a2a"
                  fillOpacity={0.4}
                />
              </RadarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Bar Chart Breakdown */}
        <div className="bg-[#0b0b0b] border border-white/10 rounded-2xl p-6 backdrop-blur-xl">
          <h3 className="text-sm font-bold text-white uppercase tracking-wider font-['Syne',sans-serif] mb-4 flex items-center gap-2">
            <Cpu className="w-4 h-4 text-sky-400" />
            Pillar Score Breakdown (0 - 10)
          </h3>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={barData} layout="vertical" margin={{ top: 5, right: 20, left: 30, bottom: 5 }}>
                <XAxis type="number" domain={[0, 10]} stroke="#666" tick={{ fill: '#888', fontSize: 11 }} />
                <YAxis dataKey="name" type="category" stroke="#666" tick={{ fill: '#ccc', fontSize: 11 }} width={90} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#111',
                    border: '1px solid #333',
                    borderRadius: '8px',
                    color: '#fff',
                    fontSize: '12px',
                  }}
                />
                <Bar dataKey="value" radius={[0, 4, 4, 0]}>
                  {barData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.fill} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Strengths & Weaknesses 4-Quadrant Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Strengths */}
        <div className="bg-[#0b0b0b] border border-emerald-500/20 rounded-2xl p-6 backdrop-blur-xl">
          <h3 className="text-sm font-bold text-emerald-400 uppercase tracking-wider font-['Syne',sans-serif] mb-3 flex items-center gap-2">
            <CheckCircle className="w-4 h-4" />
            Key Technical Strengths
          </h3>
          <ul className="space-y-2.5">
            {strengths.map((st, i) => (
              <li key={i} className="text-xs sm:text-sm text-white/80 flex items-start gap-2.5 font-['Plus_Jakarta_Sans',sans-serif]">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 mt-2 shrink-0" />
                <span>{st}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Areas for Improvement */}
        <div className="bg-[#0b0b0b] border border-amber-500/20 rounded-2xl p-6 backdrop-blur-xl">
          <h3 className="text-sm font-bold text-amber-400 uppercase tracking-wider font-['Syne',sans-serif] mb-3 flex items-center gap-2">
            <AlertTriangle className="w-4 h-4" />
            Areas for Improvement
          </h3>
          <ul className="space-y-2.5">
            {areasForImprovement.map((area, i) => (
              <li key={i} className="text-xs sm:text-sm text-white/80 flex items-start gap-2.5 font-['Plus_Jakarta_Sans',sans-serif]">
                <span className="w-1.5 h-1.5 rounded-full bg-amber-400 mt-2 shrink-0" />
                <span>{area}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Missing Concepts */}
        <div className="bg-[#0b0b0b] border border-rose-500/20 rounded-2xl p-6 backdrop-blur-xl">
          <h3 className="text-sm font-bold text-rose-400 uppercase tracking-wider font-['Syne',sans-serif] mb-3 flex items-center gap-2">
            <AlertTriangle className="w-4 h-4" />
            Omitted Concepts & Flags
          </h3>
          <ul className="space-y-2.5">
            {missingConcepts.map((item, i) => (
              <li key={i} className="text-xs sm:text-sm text-white/80 flex items-start gap-2.5 font-['Plus_Jakarta_Sans',sans-serif]">
                <span className="w-1.5 h-1.5 rounded-full bg-rose-400 mt-2 shrink-0" />
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Recommended Topics */}
        <div className="bg-[#0b0b0b] border border-sky-500/20 rounded-2xl p-6 backdrop-blur-xl">
          <h3 className="text-sm font-bold text-sky-400 uppercase tracking-wider font-['Syne',sans-serif] mb-3 flex items-center gap-2">
            <BookOpen className="w-4 h-4" />
            Recommended Topics to Study
          </h3>
          <div className="flex flex-wrap gap-2">
            {recommendedTopics.map((topic, i) => (
              <span
                key={i}
                className="px-3 py-1.5 rounded-lg bg-sky-500/10 border border-sky-500/30 text-sky-300 text-xs font-['JetBrains_Mono',monospace]"
              >
                {topic}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Interview Readiness & Final Feedback Card */}
      <div className="bg-[#0b0b0b] border border-white/10 rounded-2xl p-6 sm:p-8 backdrop-blur-xl space-y-4">
        <div>
          <h3 className="text-xs font-bold text-white/50 uppercase tracking-widest font-['JetBrains_Mono',monospace] mb-1">
            Interview Readiness Verdict
          </h3>
          <p className="text-base sm:text-lg font-bold text-white font-['Outfit',sans-serif]">
            {interviewReadiness}
          </p>
        </div>

        <div className="pt-3 border-t border-white/10">
          <h3 className="text-xs font-bold text-white/50 uppercase tracking-widest font-['JetBrains_Mono',monospace] mb-2">
            Principal Hiring Manager Feedback
          </h3>
          <p className="text-xs sm:text-sm text-white/80 font-['Plus_Jakarta_Sans',sans-serif] leading-relaxed whitespace-pre-wrap">
            {finalFeedback}
          </p>
        </div>
      </div>

      {/* Bottom Action Controls */}
      <div className="flex flex-wrap items-center justify-between gap-4 pt-4">
        <div className="flex flex-wrap items-center gap-3">
          <button
            onClick={() => handleRetrySameTopic()}
            className="px-4 py-2.5 rounded-xl bg-[#ff2a2a] hover:bg-[#ff3b3b] text-white text-xs sm:text-sm font-bold font-['Syne',sans-serif] uppercase tracking-wider flex items-center gap-2 shadow-[0_5px_20px_rgba(255,42,42,0.3)] transition-all cursor-pointer"
          >
            <RotateCcw className="w-4 h-4" />
            Retry Interview
          </button>

          <button
            onClick={() => handleRestartInterview()}
            className="px-4 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs sm:text-sm font-bold font-['Syne',sans-serif] uppercase tracking-wider flex items-center gap-2 transition-all cursor-pointer"
          >
            <PlusCircle className="w-4 h-4" />
            New Interview
          </button>

          <button
            onClick={() => setView('history')}
            className="px-4 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-white/80 hover:text-white border border-white/10 text-xs sm:text-sm font-['JetBrains_Mono',monospace] flex items-center gap-2 transition-all cursor-pointer"
          >
            <History className="w-4 h-4 text-[#ff5858]" />
            View Past Interviews
          </button>
        </div>

        <button
          onClick={handleExport}
          className="px-4 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-white border border-white/10 text-xs sm:text-sm font-['JetBrains_Mono',monospace] flex items-center gap-2 transition-all cursor-pointer"
        >
          <Download className="w-4 h-4" />
          Export Audit Report (.txt)
        </button>
      </div>
    </div>
  );
};
