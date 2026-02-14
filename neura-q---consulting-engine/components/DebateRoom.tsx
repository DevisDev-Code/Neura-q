import React, { useEffect, useRef } from 'react';
import { DebateMessage, AgentRole } from '../types';
import ReactMarkdown from 'react-markdown';

interface Props {
  messages: DebateMessage[];
  currentRound: number;
  isProcessing: boolean;
  processingAgent?: AgentRole;
}

export const DebateRoom: React.FC<Props> = ({ messages, currentRound, isProcessing, processingAgent }) => {
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  return (
    <div className="h-screen flex flex-col pt-12 pb-16 bg-bg overflow-hidden relative">
      {/* Background Grid */}
      <div className="absolute inset-0 tech-grid opacity-10 pointer-events-none z-0"></div>

      {/* Header */}
      <div className="flex-none px-6 md:px-12 mb-6 flex justify-between items-end border-b border-border pb-4 bg-bg/90 backdrop-blur z-20">
        <div>
            <h2 className="font-sans font-bold text-3xl text-white">Strategic War Room</h2>
            <div className="flex gap-4 font-mono text-[10px] text-muted tracking-widest uppercase mt-2">
                <span className="text-secondary">Architect: Active</span>
                <span className="text-red">Destroyer: Active</span>
                <span className="text-primary">Arbiter: Overseeing</span>
            </div>
        </div>
        <div className="flex flex-col items-end">
             <div className="font-mono text-xs text-accent tracking-widest uppercase mb-1">
                Round {currentRound}
             </div>
             {isProcessing && (
                <span className="animate-pulse text-[10px] font-mono text-white bg-surface border border-secondary px-2 py-1 rounded shadow-[0_0_10px_rgba(59,130,246,0.3)]">
                    {processingAgent?.toUpperCase()} IS THINKING...
                </span>
             )}
        </div>
      </div>

      {/* 3-Column Grid Layout */}
      <div className="flex-1 overflow-y-auto px-4 md:px-8 pb-12 scroll-smooth z-10" ref={scrollRef}>
        <div className="flex flex-col gap-6 max-w-7xl mx-auto">
            
            {messages.map((msg, i) => (
                <MessageCard key={i} msg={msg} />
            ))}

            {isProcessing && (
                <div className="h-20 flex items-center justify-center opacity-50">
                    <div className="w-2 h-2 bg-secondary rounded-full animate-bounce mr-1"></div>
                    <div className="w-2 h-2 bg-secondary rounded-full animate-bounce delay-75 mr-1"></div>
                    <div className="w-2 h-2 bg-secondary rounded-full animate-bounce delay-150"></div>
                </div>
            )}
        </div>
      </div>
    </div>
  );
};

const MessageCard: React.FC<{ msg: DebateMessage }> = ({ msg }) => {
    const isArchitect = msg.agent === 'architect';
    const isDestroyer = msg.agent === 'destroyer';
    const isArbiter = msg.agent === 'arbiter';

    let alignClass = "self-start";
    let borderClass = "border-l-2 border-secondary";
    let bgClass = "bg-surface";
    let title = "THE ARCHITECT";
    let titleColor = "text-secondary";

    if (isDestroyer) {
        alignClass = "self-end";
        borderClass = "border-r-2 border-red";
        bgClass = "bg-[#1a0f0f]";
        title = "THE DESTROYER";
        titleColor = "text-red";
    } else if (isArbiter) {
        alignClass = "self-center w-full max-w-3xl";
        borderClass = "border-t-2 border-primary";
        bgClass = "bg-[#100f1a]";
        title = "THE ARBITER";
        titleColor = "text-primary";
    }

    const isSpecial = msg.type !== 'normal' && msg.type !== undefined;

    return (
        <div className={`flex flex-col ${alignClass} w-full md:w-[85%] ${isArbiter ? 'md:w-full my-8' : 'my-2'} animate-in fade-in slide-in-from-bottom-2 duration-500`}>
            
            {/* Arbiter Special Badge */}
            {isSpecial && (
                <div className="self-center mb-2 bg-primary text-white font-mono text-[10px] font-bold px-3 py-1 uppercase tracking-widest rounded-sm shadow-[0_0_15px_rgba(109,40,217,0.5)]">
                    {msg.type?.replace('_', ' ')}
                </div>
            )}

            <div className={`relative p-6 ${bgClass} ${borderClass} shadow-2xl backdrop-blur-sm bg-opacity-90`}>
                <div className="flex justify-between items-baseline mb-4 border-b border-white/5 pb-2">
                    <span className={`font-mono text-[10px] tracking-[0.2em] uppercase font-bold ${titleColor}`}>
                        {title}
                    </span>
                    <span className="font-mono text-[10px] text-muted">ROUND {msg.round}</span>
                </div>
                
                <div className="prose prose-invert prose-sm max-w-none prose-p:leading-relaxed prose-headings:font-mono prose-headings:text-xs prose-headings:uppercase prose-headings:tracking-widest prose-headings:text-gray-400">
                    <ReactMarkdown>{msg.text}</ReactMarkdown>
                </div>
            </div>
        </div>
    );
}