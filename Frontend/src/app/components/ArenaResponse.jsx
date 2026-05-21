import React, { useEffect } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import hljs from 'highlight.js';
import 'highlight.js/styles/atom-one-dark.css';

export default function ArenaResponse({ solution1, solution2, judge }) {
  useEffect(() => {
    hljs.highlightAll();
  }, [solution1, solution2]);

  // Determine relative status for the combatants
  const score1 = judge?.solution_1_score || 0;
  const score2 = judge?.solution_2_score || 0;

  const isWinner1 = score1 > score2;
  const isWinner2 = score2 > score1;
  const isTie = score1 === score2 && score1 > 0;

  const renderMarkdown = (content) => (
    <ReactMarkdown 
      remarkPlugins={[remarkGfm]}
      components={{
        h1: ({node, ...props}) => <h1 className="text-xl font-bold mt-6 mb-4 text-zinc-100 border-b border-white/5 pb-2" {...props} />,
        h2: ({node, ...props}) => <h2 className="text-lg font-bold mt-5 mb-3 text-zinc-200" {...props} />,
        h3: ({node, ...props}) => <h3 className="text-base font-bold mt-4 mb-2 text-zinc-300" {...props} />,
        p: ({node, ...props}) => <p className="mb-4 leading-relaxed text-zinc-300 text-[15px]" {...props} />,
        ul: ({node, ...props}) => <ul className="list-disc pl-6 mb-4 text-zinc-300 space-y-1.5 text-[15px]" {...props} />,
        ol: ({node, ...props}) => <ol className="list-decimal pl-6 mb-4 text-zinc-300 space-y-1.5 text-[15px]" {...props} />,
        a: ({node, ...props}) => <a className="text-cyan-400 hover:text-cyan-300 underline transition-colors" {...props} />,
        code: ({node, inline, className, children, ...props}) => {
          return !inline ? (
            <div className="code-block-wrapper shadow-xl">
              <div className="code-block-header">
                <span className="code-dot bg-rose-500/80"></span>
                <span className="code-dot bg-amber-500/80"></span>
                <span className="code-dot bg-emerald-500/80"></span>
                <span className="text-[11px] font-mono text-zinc-500 ml-2 tracking-wider uppercase">Code Output</span>
              </div>
              <pre className="code-block-pre">
                <code className={className} {...props}>
                  {children}
                </code>
              </pre>
            </div>
          ) : (
            <code className="bg-white/10 text-zinc-200 px-1.5 py-0.5 rounded text-xs font-mono border border-white/5" {...props}>
              {children}
            </code>
          );
        }
      }}
    >
      {content}
    </ReactMarkdown>
  );

  return (
    <div className="flex flex-col gap-10 my-8 w-full animate-slide-up">
      {/* Visual Arena Divider / VS Header */}
      <div className="flex items-center justify-center gap-4 my-2">
        <div className="h-[1px] flex-1 bg-gradient-to-r from-transparent to-cyan-500/40"></div>
        <div className="vs-badge shadow-lg shadow-rose-500/10">VS BATTLE</div>
        <div className="h-[1px] flex-1 bg-gradient-to-l from-transparent to-fuchsia-500/40"></div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 relative">
        {/* Solution 1 — Neon Cyan Cyber Card */}
        <div className={`glass-ai1 rounded-2xl p-8 relative overflow-hidden transition-all duration-300 hover:scale-[1.01] hover:shadow-[0_0_50px_rgba(0,212,255,0.25)] flex flex-col ${isWinner1 ? 'border-2 border-cyan-400' : ''}`}>
          {/* Top accent badge */}
          <div className="absolute top-0 right-0 overflow-hidden rounded-bl-xl">
            <div className={`text-[10px] uppercase font-bold tracking-widest px-4 py-1.5 ${isWinner1 ? 'bg-cyan-500 text-black' : 'bg-cyan-950 text-cyan-400 border-l border-b border-cyan-500/30'}`}>
              {isWinner1 ? '🏆 Winner' : isTie ? '🤝 Draw' : 'COMPETITOR A'}
            </div>
          </div>

          <h3 className="text-sm font-semibold tracking-widest uppercase text-cyan-400 mb-6 flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-cyan-400 animate-pulse shadow-[0_0_10px_#00d4ff]"></span> 
            CYAN PROTOCOL — SOLUTION 1
          </h3>

          <div className="flex-1 text-zinc-300">
            {renderMarkdown(solution1)}
          </div>
        </div>

        {/* Solution 2 — Neon Purple Cyber Card */}
        <div className={`glass-ai2 rounded-2xl p-8 relative overflow-hidden transition-all duration-300 hover:scale-[1.01] hover:shadow-[0_0_50px_rgba(168,85,247,0.25)] flex flex-col ${isWinner2 ? 'border-2 border-fuchsia-500' : ''}`}>
          {/* Top accent badge */}
          <div className="absolute top-0 right-0 overflow-hidden rounded-bl-xl">
            <div className={`text-[10px] uppercase font-bold tracking-widest px-4 py-1.5 ${isWinner2 ? 'bg-fuchsia-500 text-white' : 'bg-fuchsia-950 text-fuchsia-400 border-l border-b border-fuchsia-500/30'}`}>
              {isWinner2 ? '🏆 Winner' : isTie ? '🤝 Draw' : 'COMPETITOR B'}
            </div>
          </div>

          <h3 className="text-sm font-semibold tracking-widest uppercase text-fuchsia-400 mb-6 flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-fuchsia-400 animate-pulse shadow-[0_0_10px_#a855f7]"></span> 
            VIOLET SYSTEM — SOLUTION 2
          </h3>

          <div className="flex-1 text-zinc-300">
            {renderMarkdown(solution2)}
          </div>
        </div>
      </div>

      {/* Judge Panel — Gold Holographic Style */}
      {judge && (
        <div className="glass-judge rounded-2xl p-8 mt-2 relative overflow-hidden transition-all duration-500 hover:shadow-[0_0_60px_rgba(245,158,11,0.2)]">
          <div className="absolute top-0 left-0 w-full h-[3px] bg-gradient-to-r from-transparent via-amber-400 to-transparent"></div>
          
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 border-b border-amber-500/10 pb-6 mb-8">
            <div className="flex items-center gap-3">
              <span className="text-2xl">⚖️</span>
              <div>
                <h3 className="text-lg font-bold tracking-wide text-amber-300 uppercase">
                  Arena Verdict &amp; Performance Review
                </h3>
                <p className="text-xs text-amber-500/80 tracking-wider uppercase font-medium">
                  Algorithmic Evaluation Engine
                </p>
              </div>
            </div>
            
            {/* Visual breakdown badge */}
            <div className="px-4 py-2 rounded-xl bg-amber-500/10 border border-amber-500/20 text-xs text-amber-300 font-bold uppercase tracking-wider">
              {isTie ? 'COMPETITORS ARE TIED' : `COMPETITOR ${isWinner1 ? 'A' : 'B'} DOMINATES`}
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
            {/* Solution 1 Review */}
            <div className="space-y-4">
              <div className="flex flex-col gap-2">
                <div className="flex justify-between items-end">
                  <span className="font-semibold text-sm tracking-wider uppercase text-cyan-300">COMPETITOR A PERFORMANCE</span>
                  <span className="text-2xl font-black text-cyan-400 font-mono tracking-tighter bg-cyan-950/50 border border-cyan-500/20 px-3 py-0.5 rounded-lg">
                    {score1}<span className="text-xs text-zinc-500 font-normal">/10</span>
                  </span>
                </div>
                {/* Micro scoring progress bar */}
                <div className="h-2 w-full bg-cyan-950/40 rounded-full overflow-hidden border border-cyan-500/10">
                  <div 
                    className="score-bar-fill bg-gradient-to-r from-cyan-500 to-teal-400"
                    style={{ '--fill-width': `${score1 * 10}%` }}
                  ></div>
                </div>
              </div>
              <p className="text-zinc-300 text-[14px] leading-relaxed bg-zinc-950/40 border border-white/5 rounded-xl p-4 italic">
                "{judge.solution_1_reasoning}"
              </p>
            </div>

            {/* Solution 2 Review */}
            <div className="space-y-4">
              <div className="flex flex-col gap-2">
                <div className="flex justify-between items-end">
                  <span className="font-semibold text-sm tracking-wider uppercase text-fuchsia-300">COMPETITOR B PERFORMANCE</span>
                  <span className="text-2xl font-black text-fuchsia-400 font-mono tracking-tighter bg-fuchsia-950/50 border border-fuchsia-500/20 px-3 py-0.5 rounded-lg">
                    {score2}<span className="text-xs text-zinc-500 font-normal">/10</span>
                  </span>
                </div>
                {/* Micro scoring progress bar */}
                <div className="h-2 w-full bg-fuchsia-950/40 rounded-full overflow-hidden border border-fuchsia-500/10">
                  <div 
                    className="score-bar-fill bg-gradient-to-r from-fuchsia-500 to-indigo-400"
                    style={{ '--fill-width': `${score2 * 10}%` }}
                  ></div>
                </div>
              </div>
              <p className="text-zinc-300 text-[14px] leading-relaxed bg-zinc-950/40 border border-white/5 rounded-xl p-4 italic">
                "{judge.solution_2_reasoning}"
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}