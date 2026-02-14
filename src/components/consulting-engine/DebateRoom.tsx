import React, { useEffect, useRef } from 'react';
import { DebateMessage, AgentRole } from '../../types/consulting';
import ReactMarkdown from 'react-markdown';

interface Props {
    messages: DebateMessage[];
    currentRound: number;
    isProcessing: boolean;
    processingAgent?: AgentRole;
    countdown?: number;
}

export const DebateRoom: React.FC<Props> = ({ messages, currentRound, isProcessing, processingAgent, countdown = 0 }) => {
    const scrollRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
        }
    }, [messages, countdown]);

    return (
        <div className="h-screen flex flex-col pt-12 pb-16 bg-[#050508] overflow-hidden relative">
            <div className="absolute inset-0 opacity-10 pointer-events-none z-0" style={{ backgroundSize: '50px 50px', backgroundImage: 'linear-gradient(to right, rgba(59,130,246,0.15) 1px, transparent 1px), linear-gradient(to bottom, rgba(59,130,246,0.15) 1px, transparent 1px)', maskImage: 'linear-gradient(to bottom, black 20%, transparent 90%)' }}></div>

            <div className="flex-none px-6 md:px-12 mb-6 flex justify-between items-end border-b border-[#1f1f3a] pb-4 bg-[#050508]/90 backdrop-blur z-20">
                <div>
                    <h2 className="font-sans font-bold text-3xl text-white">Strategic War Room</h2>
                    <div className="flex gap-4 font-mono text-[10px] text-[#64748b] tracking-widest uppercase mt-2">
                        <span className="text-[#3b82f6]">Architect: Active</span>
                        <span className="text-[#ff2a6d]">Destroyer: Active</span>
                        <span className="text-[#6d28d9]">Arbiter: Overseeing</span>
                    </div>
                </div>
                <div className="flex flex-col items-end">
                    <div className="font-mono text-xs text-[#00f0ff] tracking-widest uppercase mb-1">Round {currentRound}</div>
                    {isProcessing && (
                        <span className="animate-pulse text-[10px] font-mono text-white bg-[#0a0a12] border border-[#3b82f6] px-2 py-1 rounded shadow-[0_0_10px_rgba(59,130,246,0.3)]">
                            {processingAgent?.toUpperCase()} IS THINKING...
                        </span>
                    )}
                </div>
            </div>

            <div className="flex-1 overflow-y-auto px-4 md:px-8 pb-12 scroll-smooth z-10" ref={scrollRef}>
                <div className="flex flex-col gap-6 max-w-7xl mx-auto">
                    {messages.map((msg, i) => (
                        <MessageCard key={i} msg={msg} />
                    ))}
                    {isProcessing && (
                        <div className="h-20 flex items-center justify-center opacity-50">
                            <div className="w-2 h-2 bg-[#3b82f6] rounded-full animate-bounce mr-1"></div>
                            <div className="w-2 h-2 bg-[#3b82f6] rounded-full animate-bounce mr-1" style={{ animationDelay: '75ms' }}></div>
                            <div className="w-2 h-2 bg-[#3b82f6] rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                        </div>
                    )}

                    {/* ── COUNTDOWN TIMER ── */}
                    {countdown > 0 && !isProcessing && (
                        <div className="self-center my-6 flex flex-col items-center gap-3 animate-pulse">
                            <div className="relative w-20 h-20 flex items-center justify-center">
                                {/* Rotating ring */}
                                <svg className="absolute inset-0 w-full h-full animate-spin" style={{ animationDuration: '4s' }} viewBox="0 0 80 80">
                                    <circle cx="40" cy="40" r="36" fill="none" stroke="#1f1f3a" strokeWidth="2" />
                                    <circle
                                        cx="40" cy="40" r="36" fill="none" stroke="#3b82f6" strokeWidth="2"
                                        strokeDasharray="226" strokeDashoffset="170"
                                        strokeLinecap="round"
                                    />
                                </svg>
                                <span className="font-mono text-2xl font-bold text-[#00f0ff]">{countdown}</span>
                            </div>
                            <div className="font-mono text-[10px] text-[#64748b] tracking-[0.2em] uppercase text-center">
                                Rate Limit Cooldown
                            </div>
                            <div className="font-mono text-[10px] text-[#3b82f6]/60 tracking-widest text-center max-w-xs">
                                Spacing calls to stay within API limits. Next agent will engage shortly.
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

const MessageCard: React.FC<{ msg: DebateMessage }> = ({ msg }) => {
    const isDestroyer = msg.agent === 'destroyer';
    const isArbiter = msg.agent === 'arbiter';

    let alignClass = 'self-start';
    let borderClass = 'border-l-2 border-[#3b82f6]';
    let bgClass = 'bg-[#0a0a12]';
    let title = 'THE ARCHITECT';
    let titleColor = 'text-[#3b82f6]';

    if (isDestroyer) {
        alignClass = 'self-end';
        borderClass = 'border-r-2 border-[#ff2a6d]';
        bgClass = 'bg-[#1a0f0f]';
        title = 'THE DESTROYER';
        titleColor = 'text-[#ff2a6d]';
    } else if (isArbiter) {
        alignClass = 'self-center w-full max-w-3xl';
        borderClass = 'border-t-2 border-[#6d28d9]';
        bgClass = 'bg-[#100f1a]';
        title = 'THE ARBITER';
        titleColor = 'text-[#6d28d9]';
    }

    const isSpecial = msg.type !== 'normal' && msg.type !== undefined;

    return (
        <div className={`flex flex-col ${alignClass} w-full md:w-[85%] ${isArbiter ? 'md:w-full my-8' : 'my-2'}`}>
            {isSpecial && (
                <div className="self-center mb-2 bg-[#6d28d9] text-white font-mono text-[10px] font-bold px-3 py-1 uppercase tracking-widest rounded-sm shadow-[0_0_15px_rgba(109,40,217,0.5)]">
                    {msg.type?.replace('_', ' ')}
                </div>
            )}
            <div className={`relative p-6 ${bgClass} ${borderClass} shadow-2xl backdrop-blur-sm bg-opacity-90`}>
                <div className="flex justify-between items-baseline mb-4 border-b border-white/5 pb-2">
                    <span className={`font-mono text-[10px] tracking-[0.2em] uppercase font-bold ${titleColor}`}>{title}</span>
                    <span className="font-mono text-[10px] text-[#64748b]">ROUND {msg.round}</span>
                </div>
                <div className="prose prose-invert prose-sm max-w-none prose-p:leading-relaxed prose-headings:font-mono prose-headings:text-xs prose-headings:uppercase prose-headings:tracking-widest prose-headings:text-gray-400">
                    <ReactMarkdown>{msg.text}</ReactMarkdown>
                </div>
            </div>
        </div>
    );
};
