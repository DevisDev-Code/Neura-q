import React from 'react';
import { IntakeData } from '../../types/consulting';

interface Props {
    data: IntakeData | null;
    result: string | null;
    isProcessing: boolean;
}

export const MarketResearchPhase: React.FC<Props> = ({ data, result, isProcessing }) => {
    return (
        <div className="min-h-screen flex flex-col items-center justify-center p-8 bg-[#050508] relative overflow-hidden">
            {isProcessing && (
                <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[#c9a84c]/5 to-transparent h-[20%] w-full pointer-events-none" style={{ animation: 'ceScan 2s linear infinite' }}></div>
            )}
            <div className="w-full max-w-2xl border border-[#1f1f3a] bg-[#0a0a12]/50 p-8 md:p-12 relative z-10">
                <div className="flex items-center gap-4 mb-8 border-b border-[#1f1f3a] pb-4">
                    <div className={`w-3 h-3 rounded-full ${isProcessing ? 'bg-[#c9a84c] animate-pulse' : 'bg-[#05d5fa]'}`}></div>
                    <span className="font-mono text-xs tracking-[0.2em] text-[#c9a84c] uppercase">
                        {isProcessing ? 'Deep Search Active' : 'Research Complete'}
                    </span>
                </div>
                <div className="space-y-4 font-mono text-xs md:text-sm leading-relaxed text-gray-400">
                    <p>
                        <span className="text-blue-400 mr-2">QUERYING GROUNDS:</span>
                        {data?.competitors} market position...
                    </p>
                    <p className={`${!result ? 'opacity-50' : 'opacity-100 transition-opacity duration-500'}`}>
                        <span className="text-blue-400 mr-2">ANALYZING:</span>
                        {data?.industry} trends...
                    </p>
                    {result && (
                        <div className="mt-8 pt-8 border-t border-dashed border-[#1f1f3a]">
                            <p className="text-white mb-4 uppercase tracking-widest text-[10px]">Findings Summary:</p>
                            <div className="prose prose-invert prose-sm max-w-none">
                                <p className="whitespace-pre-wrap">{result}</p>
                            </div>
                        </div>
                    )}
                </div>
            </div>
            <style>{`
        @keyframes ceScan {
          0% { transform: translateY(-100%); }
          100% { transform: translateY(500%); }
        }
      `}</style>
        </div>
    );
};
