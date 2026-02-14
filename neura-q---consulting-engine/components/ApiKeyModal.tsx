import React, { useState } from 'react';

interface Props {
  onSubmit: (key: string) => void;
}

export const ApiKeyModal: React.FC<Props> = ({ onSubmit }) => {
  const [input, setInput] = useState('');

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/90 backdrop-blur-md">
      <div className="bg-surface border border-gold w-full max-w-md p-8 rounded shadow-[0_0_50px_rgba(201,168,76,0.1)]">
        <h2 className="font-serif text-3xl text-white mb-2">Initialize Engine</h2>
        <p className="font-mono text-xs text-gold tracking-widest uppercase mb-6">Security Clearance Required</p>
        
        <p className="text-sm text-gray-400 mb-6 leading-relaxed">
          Neura Q requires a high-reasoning link to the Gemini 3 Pro model. 
          Please enter your valid Google GenAI API Key below.
        </p>

        <input
          type="password"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="AIzaSy..."
          className="w-full bg-bg border border-border p-3 text-white font-mono text-sm focus:border-gold focus:outline-none transition-colors mb-6"
        />

        <div className="flex justify-between items-center">
            <a href="https://aistudio.google.com/app/apikey" target="_blank" rel="noreferrer" className="text-xs text-muted hover:text-white underline decoration-1 underline-offset-4">
                Get API Key →
            </a>
            <button
            onClick={() => onSubmit(input)}
            disabled={!input}
            className="bg-gold hover:bg-white text-black font-mono text-xs font-bold tracking-widest px-6 py-3 uppercase transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
            Connect Interface
            </button>
        </div>
      </div>
    </div>
  );
};