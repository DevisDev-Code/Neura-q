import React from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

interface Props {
  synthesis: string | null;
  isProcessing: boolean;
}

export const SynthesisReport: React.FC<Props> = ({ synthesis, isProcessing }) => {
  return (
    <div className="min-h-screen bg-bg p-4 md:p-12 flex justify-center pb-24">
      <div className="w-full max-w-5xl bg-white text-black p-8 md:p-16 shadow-[0_0_100px_rgba(255,255,255,0.1)] relative min-h-[80vh]">
        
        {/* Letterhead */}
        <div className="flex flex-col md:flex-row justify-between items-start border-b-4 border-black pb-8 mb-12">
            <div>
                <h1 className="font-serif text-5xl font-black tracking-tighter">NEURA Q</h1>
                <p className="font-mono text-xs tracking-[0.3em] mt-2 uppercase font-bold">Adversarial Intelligence Unit</p>
            </div>
            <div className="text-left md:text-right font-mono text-[10px] text-gray-500 space-y-1 mt-4 md:mt-0 uppercase tracking-widest">
                <p>CONFIDENTIAL // EYES ONLY</p>
                <p>Ref: {Math.random().toString(36).substring(7).toUpperCase()}</p>
                <p>{new Date().toLocaleDateString()}</p>
            </div>
        </div>

        {isProcessing ? (
            <div className="flex flex-col items-center justify-center h-96 space-y-8">
                <div className="relative w-24 h-24">
                    <div className="absolute inset-0 border-t-4 border-black rounded-full animate-spin"></div>
                    <div className="absolute inset-4 border-t-4 border-gold rounded-full animate-spin reverse"></div>
                </div>
                <div className="text-center space-y-2">
                    <p className="font-serif text-2xl font-bold">Compiling Verdict</p>
                    <p className="font-mono text-xs uppercase tracking-widest text-gray-500">Synthesizing consensus & risk registries...</p>
                </div>
            </div>
        ) : (
            <div className="prose prose-lg max-w-none 
                prose-headings:font-serif prose-headings:font-bold prose-headings:text-black
                prose-h1:text-3xl prose-h1:uppercase prose-h1:tracking-tight prose-h1:border-b prose-h1:pb-2
                prose-h2:text-xl prose-h2:mt-12 prose-h2:mb-6 prose-h2:text-blue-900
                prose-p:font-sans prose-p:leading-relaxed prose-p:text-gray-800
                prose-li:font-sans prose-li:marker:text-gold
                prose-table:border-collapse prose-table:text-sm prose-table:w-full prose-table:my-8
                prose-th:bg-gray-100 prose-th:p-4 prose-th:text-left prose-th:font-mono prose-th:uppercase prose-th:text-xs prose-th:tracking-wider
                prose-td:border-b prose-td:border-gray-200 prose-td:p-4 prose-td:align-top
                prose-strong:font-bold prose-strong:text-black
            ">
                {synthesis ? (
                    <ReactMarkdown remarkPlugins={[remarkGfm]}>{synthesis}</ReactMarkdown>
                ) : (
                    <p>Error generating report.</p>
                )}
            </div>
        )}

        {/* Footer */}
        <div className="mt-20 pt-8 border-t border-gray-200 flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="flex gap-4">
                 <div className="h-12 w-12 border border-gray-300 rounded-full flex items-center justify-center font-serif font-bold text-gray-300">A</div>
                 <div className="h-12 w-12 border border-gray-300 rounded-full flex items-center justify-center font-serif font-bold text-gray-300">D</div>
                 <div className="h-12 w-12 border border-black bg-black text-white rounded-full flex items-center justify-center font-serif font-bold">Q</div>
            </div>
            <p className="font-mono text-[10px] text-gray-400 uppercase tracking-widest text-center md:text-right">
                Generated via Agentic Consensus Protocol<br/>
                Do not distribute without authorization.
            </p>
            <button 
                onClick={() => window.print()}
                className="font-mono text-xs font-bold uppercase border-2 border-black px-8 py-3 hover:bg-black hover:text-white transition-colors print:hidden"
            >
                Download PDF
            </button>
        </div>
      </div>
    </div>
  );
};