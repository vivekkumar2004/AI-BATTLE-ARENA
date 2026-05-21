import React, { useState, useRef, useEffect } from 'react';
import UserMessage from './UserMessage';
import ArenaResponse from './ArenaResponse';
import axios from "axios";

const SUGGESTED_PROMPTS = [
  {
    title: "🚀 O(1) Fibonacci",
    prompt: "Write a function to find the N-th Fibonacci number in O(1) space and O(N) time."
  },
  {
    title: "⚡ Deep Merge Object",
    prompt: "Create a highly optimized JavaScript function to deep merge two nested objects without causing stack overflows."
  },
  {
    title: "🛡️ SQL Injection Guard",
    prompt: "Show me a secure way to execute parameterized database queries in Node.js, and explain why simple string concatenation fails."
  }
];

const LOADING_STATUSES = [
  "Initializing battle arena containers...",
  "Deploying competitor neural networks...",
  "Cyan Protocol is analyzing structural complexity...",
  "Violet System is compiling code variants...",
  "Arbitration Subsystem is initializing Judge scorecards...",
  "Synthesizing comparative performance metrics..."
];

export default function ChatInterface() {
  const [messages, setMessages] = useState([]);
  const [inputValue, setInputValue] = useState('');
  const [loading, setLoading] = useState(false);
  const [loaderStatus, setLoaderStatus] = useState('');
  const endOfMessagesRef = useRef(null);

  const scrollToBottom = () => {
    endOfMessagesRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, loading]);

  // Rotate loading statuses during active search
  useEffect(() => {
    let interval;
    if (loading) {
      setLoaderStatus(LOADING_STATUSES[0]);
      let index = 0;
      interval = setInterval(() => {
        index = (index + 1) % LOADING_STATUSES.length;
        setLoaderStatus(LOADING_STATUSES[index]);
      }, 2500);
    }
    return () => clearInterval(interval);
  }, [loading]);

  const triggerBattle = async (promptText) => {
    if (loading || !promptText.trim()) return;

    setLoading(true);
    try {
      const response = await axios.post("http://localhost:3000/invoke", {
        input: promptText
      });

      const data = response.data;
      
      const newMessage = {
        id: Date.now(),
        problem: promptText,
        ...data.result
      };

      setMessages((prev) => [...prev, newMessage]);
    } catch (error) {
      console.error("Error invoking arena backend:", error);
      // Fallback message so user doesn't get stuck in error
      setMessages((prev) => [
        ...prev,
        {
          id: Date.now(),
          problem: promptText,
          solution_1: "### Cyan Protocol System Alert\nCould not connect to the Backend server. Please verify the LangGraph agent is running locally on `http://localhost:3000`.",
          solution_2: "### Violet System Connection Timeout\nThe server did not reply in time. Please check backend console logs for graph evaluation errors.",
          judge: {
            solution_1_score: 0,
            solution_2_score: 0,
            solution_1_reasoning: "Arena environment disconnected.",
            solution_2_reasoning: "Arena environment disconnected."
          }
        }
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleSend = (e) => {
    e.preventDefault();
    if (!inputValue.trim()) return;
    const text = inputValue;
    setInputValue('');
    triggerBattle(text);
  };

  return (
    <div className="relative flex flex-col h-screen bg-[#04040c] text-white overflow-hidden font-sans select-none">
      
      {/* Dynamic Background Orbs */}
      <div className="bg-orb bg-orb-1"></div>
      <div className="bg-orb bg-orb-2"></div>
      <div className="bg-orb bg-orb-3"></div>

      {/* Premium Header */}
      <header className="py-4 px-8 border-b border-white/5 bg-black/40 backdrop-blur-xl sticky top-0 z-20 flex justify-between items-center">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-cyan-400 to-fuchsia-500 flex items-center justify-center font-black text-xs text-black shadow-[0_0_20px_rgba(0,212,255,0.4)]">
            ⚔️
          </div>
          <div>
            <h1 className="text-md font-bold tracking-widest text-white uppercase flex items-center gap-2">
              AI Battle Arena
            </h1>
            <p className="text-[10px] text-zinc-500 uppercase tracking-widest font-semibold">
              Cybernetic Code Arbitration
            </p>
          </div>
        </div>

        {/* Global Connection Badge */}
        <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
          <span className="text-[9px] uppercase tracking-widest font-black text-emerald-400">Node Grid Online</span>
        </div>
      </header>

      {/* Main Stream */}
      <main className="flex-1 overflow-y-auto px-4 md:px-8 py-8 w-full max-w-5xl mx-auto flex flex-col relative z-10">
        {messages.length === 0 && !loading ? (
          <div className="flex-1 flex flex-col items-center justify-center text-center max-w-2xl mx-auto animate-fade-in">
            {/* Hologram Circle */}
            <div className="relative w-36 h-36 mb-8 flex items-center justify-center">
              <div className="absolute inset-0 rounded-full border border-dashed border-cyan-500/30 animate-[spin_40s_linear_infinite]"></div>
              <div className="absolute inset-2 rounded-full border border-dashed border-fuchsia-500/30 animate-[spin_20s_linear_infinite_reverse]"></div>
              <div className="absolute inset-4 rounded-full bg-gradient-to-tr from-cyan-500/10 to-fuchsia-500/10 backdrop-blur-md flex items-center justify-center border border-white/10">
                <span className="text-5xl animate-[pulseGlow_3s_ease-in-out_infinite]">⚔️</span>
              </div>
            </div>

            <h2 className="text-3xl md:text-4xl font-extrabold tracking-tight text-white mb-3">
              Witness the <span className="text-gradient-brand">Algorithmic Clash</span>
            </h2>
            <p className="text-zinc-400 text-sm md:text-base leading-relaxed mb-10 max-w-lg">
              Submit a target program spec or challenge. Watch independent agent cores race to synthesize answers under strict code peer evaluation.
            </p>

            {/* Prompt presets */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 w-full">
              {SUGGESTED_PROMPTS.map((item, idx) => (
                <button
                  key={idx}
                  onClick={() => triggerBattle(item.prompt)}
                  className="glass hover:bg-white/5 border border-white/10 hover:border-white/20 p-5 rounded-2xl text-left transition-all duration-300 group cursor-pointer hover:-translate-y-1"
                >
                  <h4 className="text-sm font-bold text-zinc-200 group-hover:text-white mb-2 flex items-center justify-between">
                    {item.title}
                    <span className="opacity-0 group-hover:opacity-100 transition-opacity text-cyan-400">➔</span>
                  </h4>
                  <p className="text-xs text-zinc-400 line-clamp-3 leading-relaxed">
                    {item.prompt}
                  </p>
                </button>
              ))}
            </div>
          </div>
        ) : (
          <div className="flex-grow">
            {messages.map((msg) => (
              <div key={msg.id} className="mb-14">
                <UserMessage message={msg.problem} />
                <ArenaResponse
                  solution1={msg.solution_1}
                  solution2={msg.solution_2}
                  judge={msg.judge}
                />
              </div>
            ))}
          </div>
        )}

        {/* Cyber Loading State */}
        {loading && (
          <div className="my-8 animate-slide-up bg-zinc-950/40 border border-white/5 rounded-3xl p-10 flex flex-col items-center justify-center backdrop-blur-xl relative overflow-hidden shadow-2xl">
            {/* Top scanning line effect */}
            <div className="absolute left-0 top-0 w-full h-[2px] bg-gradient-to-r from-transparent via-cyan-400 to-transparent animate-[pulseGlow_1.5s_infinite]"></div>
            
            <div className="flex gap-4 items-center mb-6">
              <span className="w-3.5 h-3.5 rounded-full bg-cyan-400 animate-ping"></span>
              <span className="w-3.5 h-3.5 rounded-full bg-fuchsia-500 animate-ping" style={{ animationDelay: '0.4s' }}></span>
              <span className="w-3.5 h-3.5 rounded-full bg-amber-400 animate-ping" style={{ animationDelay: '0.8s' }}></span>
            </div>

            <div className="shimmer-text font-mono text-xs md:text-sm tracking-widest uppercase text-center font-bold px-4">
              {loaderStatus}
            </div>
            
            {/* Technical stats container mockup */}
            <div className="mt-8 flex gap-8 text-[9px] uppercase tracking-widest text-zinc-500 font-bold border-t border-white/5 pt-6 w-full max-w-md justify-between">
              <div>Telemetry: ACTIVE</div>
              <div>Loss Rate: 0.00%</div>
              <div>Compute: DELEGATED</div>
            </div>
          </div>
        )}

        <div ref={endOfMessagesRef} />
      </main>

      {/* Floating Glass Search Footer */}
      <div className="p-6 bg-black/60 backdrop-blur-xl border-t border-white/5 sticky bottom-0 z-20">
        <div className="max-w-4xl mx-auto">
          <form onSubmit={handleSend} className="relative flex items-center">
            <div className="absolute left-6 text-zinc-500 select-none">⚡</div>
            <input
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              disabled={loading}
              placeholder="Deploy a coding challenge specification..."
              className="w-full bg-[#0a0a14]/60 text-zinc-100 border border-white/5 hover:border-white/10 focus:border-cyan-500/50 rounded-full py-4 pl-14 pr-16 focus:ring-0 focus:outline-none placeholder-zinc-500 transition-all text-sm md:text-[15px] font-medium tracking-wide shadow-2xl backdrop-blur-md"
            />
            <button
              type="submit"
              className="absolute right-2.5 bg-gradient-to-r from-cyan-500 to-fuchsia-500 hover:scale-105 active:scale-95 text-white p-3 rounded-full transition-all flex items-center justify-center shadow-lg disabled:opacity-30 disabled:pointer-events-none disabled:scale-100"
              disabled={!inputValue.trim() || loading}
            >
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4 text-black font-black">
                <path d="M3.478 2.404a.75.75 0 00-.926.941l2.432 7.905H13.5a.75.75 0 010 1.5H4.984l-2.432 7.905a.75.75 0 00.926.94 60.519 60.519 0 0018.445-8.986.75.75 0 000-1.218A60.517 60.517 0 003.478 2.404z" />
              </svg>
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}