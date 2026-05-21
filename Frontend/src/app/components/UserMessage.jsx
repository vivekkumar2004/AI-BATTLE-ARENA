import React from 'react';

export default function UserMessage({ message }) {
  return (
    <div className="flex justify-end my-8 animate-slide-up">
      <div className="glass max-w-[80%] rounded-2xl p-6 shadow-2xl relative overflow-hidden border border-white/10">
        <div className="absolute top-0 left-0 h-[2px] w-full bg-gradient-to-r from-cyan-400 to-fuchsia-500 opacity-80"></div>
        <div className="flex items-center gap-2 mb-3 text-xs tracking-wider uppercase text-zinc-400 font-bold">
          <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse"></span>
          Prompt Submitted
        </div>
        <div className="text-zinc-100 text-[16px] md:text-lg leading-relaxed font-medium">
          {message}
        </div>
      </div>
    </div>
  );
}