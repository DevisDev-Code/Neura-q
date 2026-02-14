import React, { useState } from 'react';
import { IntakeData } from '../../types/consulting';

const questions = [
    { id: 'context', title: '01 SITUATION', desc: 'Define the entity.' },
    { id: 'problem', title: '02 COMPLICATION', desc: 'The critical failure point.' },
    { id: 'constraints', title: '03 THE ARENA', desc: 'Market & Resource Audit.' },
    { id: 'calibration', title: '04 PARAMETERS', desc: 'Set engine aggression.' },
];

export const IntakeForm = ({ onComplete }: { onComplete: (data: IntakeData) => void }) => {
    const [step, setStep] = useState(0);
    const [formData, setFormData] = useState<Partial<IntakeData>>({
        urgency: 50,
        clarity: 3,
        adviceType: [],
    });

    const handleChange = (field: keyof IntakeData, value: any) => {
        setFormData((prev) => ({ ...prev, [field]: value }));
    };

    const nextStep = () => {
        if (step < 3) setStep(step + 1);
        else onComplete(formData as IntakeData);
    };

    return (
        <div className="min-h-screen flex flex-col items-center justify-center p-6 md:p-20 bg-[#050508] relative">
            {/* Subtle Grid Background */}
            <div className="absolute inset-0 opacity-10 pointer-events-none"
                style={{
                    backgroundSize: '50px 50px',
                    backgroundImage: 'linear-gradient(to right, rgba(59, 130, 246, 0.15) 1px, transparent 1px), linear-gradient(to bottom, rgba(59, 130, 246, 0.15) 1px, transparent 1px)',
                    maskImage: 'linear-gradient(to bottom, black 20%, transparent 90%)',
                }}
            ></div>

            <div className="w-full max-w-3xl z-10">
                {/* Progress */}
                <div className="flex justify-between mb-12 border-b border-[#1f1f3a] pb-4">
                    {questions.map((q, idx) => (
                        <div
                            key={q.id}
                            className={`flex flex-col gap-1 ${idx === step ? 'opacity-100' : 'opacity-30 transition-opacity'}`}
                        >
                            <span
                                className={`font-mono text-[10px] tracking-widest ${idx === step ? 'text-[#00f0ff]' : 'text-[#64748b]'}`}
                            >
                                {q.title}
                            </span>
                            <span className="text-xs text-[#64748b] hidden md:block">{q.desc}</span>
                        </div>
                    ))}
                </div>

                {/* Step 1: Context */}
                {step === 0 && (
                    <div className="space-y-8">
                        <h2 className="font-sans font-bold text-4xl mb-6 text-white">Situation Analysis</h2>
                        <div className="space-y-6">
                            <InputGroup label="A1. Entity Definition" desc="Explain the business model to a skeptical investor.">
                                <input
                                    type="text"
                                    className="w-full bg-[#0a0a12] border border-[#1f1f3a] p-4 focus:border-[#3b82f6] outline-none text-white transition-colors"
                                    onChange={(e) => handleChange('companyOneLiner', e.target.value)}
                                    value={formData.companyOneLiner || ''}
                                />
                            </InputGroup>
                            <div className="grid grid-cols-2 gap-6">
                                <InputGroup label="A2. Sector" desc="Specific industry vertical.">
                                    <input
                                        type="text"
                                        className="w-full bg-[#0a0a12] border border-[#1f1f3a] p-4 focus:border-[#3b82f6] outline-none text-white transition-colors"
                                        onChange={(e) => handleChange('industry', e.target.value)}
                                        value={formData.industry || ''}
                                    />
                                </InputGroup>
                                <InputGroup label="A3. Scale" desc="Revenue, headcount, burn rate.">
                                    <input
                                        type="text"
                                        className="w-full bg-[#0a0a12] border border-[#1f1f3a] p-4 focus:border-[#3b82f6] outline-none text-white transition-colors"
                                        onChange={(e) => handleChange('size', e.target.value)}
                                        value={formData.size || ''}
                                    />
                                </InputGroup>
                            </div>
                            <InputGroup label="A4. Target Profile" desc="Who buys this? Be specific (ICP).">
                                <textarea
                                    className="w-full bg-[#0a0a12] border border-[#1f1f3a] p-4 focus:border-[#3b82f6] outline-none h-24 text-white transition-colors"
                                    onChange={(e) => handleChange('idealCustomer', e.target.value)}
                                    value={formData.idealCustomer || ''}
                                />
                            </InputGroup>
                        </div>
                    </div>
                )}

                {/* Step 2: Problem */}
                {step === 1 && (
                    <div className="space-y-8">
                        <h2 className="font-sans font-bold text-4xl mb-6 text-white">The Complication</h2>
                        <div className="space-y-6">
                            <InputGroup label="B1. Critical Failure Point" desc="Why are we here? What is broken?">
                                <input
                                    type="text"
                                    className="w-full bg-[#0a0a12] border border-[#1f1f3a] p-4 focus:border-[#3b82f6] outline-none text-white transition-colors"
                                    onChange={(e) => handleChange('coreProblem', e.target.value)}
                                    value={formData.coreProblem || ''}
                                />
                            </InputGroup>
                            <InputGroup label="B2. Previous Failures" desc="What have you tried? Why did it fail?">
                                <textarea
                                    className="w-full bg-[#0a0a12] border border-[#1f1f3a] p-4 focus:border-[#3b82f6] outline-none h-24 text-white transition-colors"
                                    onChange={(e) => handleChange('attempts', e.target.value)}
                                    value={formData.attempts || ''}
                                />
                            </InputGroup>
                            <InputGroup label="B3. Strategic Objective" desc="Define victory. (e.g. $10M ARR, Acquisition).">
                                <input
                                    type="text"
                                    className="w-full bg-[#0a0a12] border border-[#1f1f3a] p-4 focus:border-[#3b82f6] outline-none text-white transition-colors"
                                    onChange={(e) => handleChange('successVision', e.target.value)}
                                    value={formData.successVision || ''}
                                />
                            </InputGroup>
                        </div>
                    </div>
                )}

                {/* Step 3: Constraints */}
                {step === 2 && (
                    <div className="space-y-8">
                        <h2 className="font-sans font-bold text-4xl mb-6 text-white">The Arena</h2>
                        <div className="space-y-6">
                            <InputGroup label="C1. War Chest" desc="Available capital and runway.">
                                <input
                                    type="text"
                                    className="w-full bg-[#0a0a12] border border-[#1f1f3a] p-4 focus:border-[#3b82f6] outline-none text-white transition-colors"
                                    onChange={(e) => handleChange('budget', e.target.value)}
                                    value={formData.budget || ''}
                                />
                            </InputGroup>
                            <InputGroup label="C2. Non-Negotiables" desc="Hard constraints (Legal, Geo, Ethical).">
                                <input
                                    type="text"
                                    className="w-full bg-[#0a0a12] border border-[#1f1f3a] p-4 focus:border-[#3b82f6] outline-none text-white transition-colors"
                                    onChange={(e) => handleChange('constraints', e.target.value)}
                                    value={formData.constraints || ''}
                                />
                            </InputGroup>
                            <InputGroup label="C3. Adversaries" desc="Direct competitors.">
                                <input
                                    type="text"
                                    className="w-full bg-[#0a0a12] border border-[#1f1f3a] p-4 focus:border-[#3b82f6] outline-none text-white transition-colors"
                                    onChange={(e) => handleChange('competitors', e.target.value)}
                                    value={formData.competitors || ''}
                                />
                            </InputGroup>
                        </div>
                    </div>
                )}

                {/* Step 4: Calibration */}
                {step === 3 && (
                    <div className="space-y-8">
                        <h2 className="font-sans font-bold text-4xl mb-6 text-white">Parameters</h2>
                        <div className="space-y-6">
                            <div className="space-y-2">
                                <label className="font-mono text-xs text-[#00f0ff] uppercase tracking-widest">
                                    D1. Current Clarity (1-5)
                                </label>
                                <input
                                    type="range"
                                    min="1"
                                    max="5"
                                    className="w-full accent-[#3b82f6] bg-[#0a0a12]"
                                    value={formData.clarity}
                                    onChange={(e) => handleChange('clarity', parseInt(e.target.value))}
                                />
                                <div className="flex justify-between text-xs text-[#64748b] font-mono">
                                    <span>Fog of War</span>
                                    <span>Crystal Clear</span>
                                </div>
                            </div>
                            <InputGroup label="D2. Engine Mode" desc="Select analysis intensity.">
                                <select
                                    className="w-full bg-[#0a0a12] border border-[#1f1f3a] p-4 focus:border-[#3b82f6] outline-none text-white transition-colors"
                                    onChange={(e) => handleChange('adviceType', [e.target.value])}
                                >
                                    <option>Standard Stress Test</option>
                                    <option>Maximum Hostility (Short-Seller View)</option>
                                    <option>Growth at All Costs</option>
                                    <option>Turnaround / Survival</option>
                                </select>
                            </InputGroup>
                        </div>
                    </div>
                )}

                <div className="mt-12 flex justify-end">
                    <button
                        onClick={nextStep}
                        className="bg-[#3b82f6]/20 hover:bg-[#3b82f6] border border-[#3b82f6] text-white px-8 py-3 font-mono text-xs font-bold tracking-[0.15em] uppercase transition-all shadow-[0_0_15px_rgba(59,130,246,0.2)] hover:shadow-[0_0_25px_rgba(59,130,246,0.6)]"
                    >
                        {step === 3 ? 'Activate Engine' : 'Next Phase →'}
                    </button>
                </div>
            </div>
        </div>
    );
};

const InputGroup = ({
    label,
    desc,
    children,
}: {
    label: string;
    desc: string;
    children?: React.ReactNode;
}) => (
    <div className="space-y-2">
        <div className="flex justify-between items-baseline">
            <label className="font-mono text-xs text-[#00f0ff] uppercase tracking-widest">{label}</label>
            <span className="text-[10px] text-[#64748b] font-mono">{desc}</span>
        </div>
        {children}
    </div>
);
