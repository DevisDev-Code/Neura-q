import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Brain, ChevronRight, Loader2, PieChart, Sparkles, TrendingUp, AlertTriangle, ShieldCheck, Download, BarChart3 } from 'lucide-react'

// --- Types ---
type Phase = 'intake' | 'decomposition' | 'research' | 'matrix' | 'synthesis' | 'deliverable'

interface IntakeData {
    problem: string
    industry: string
    geography: string
    horizon: string
    position: string
    constraints: string
    competitors: string
    advantage: string
    successMetrics: string
}

// --- Questions ---
const QUESTIONS = [
    { id: 'problem', label: "What's the core business problem?", placeholder: "e.g., Market Entry, Pricing, M&A Strategy..." },
    { id: 'industry', label: "What industry are you in?", placeholder: "e.g., Automotive, Fintech, FMCG..." },
    { id: 'geography', label: "What is the target geography?", placeholder: "e.g., India, US, Global..." },
    { id: 'horizon', label: "What is the time horizon?", placeholder: "e.g., 6 months, 1 year, 5 years..." },
    { id: 'position', label: "What is your current market position?", placeholder: "e.g., Market Leader, Challenger, New Entrant..." },
    { id: 'constraints', label: "What are the key constraints?", placeholder: "e.g., Budget, Regulatory, Talent..." },
    { id: 'competitors', label: "Who are your key competitors?", placeholder: "List 3-5 major competitors..." },
    { id: 'advantage', label: "What is your unique competitive advantage?", placeholder: "e.g., Proprietary Tech, Brand Loyalty, Cost..." },
    { id: 'successMetrics', label: "How will you measure success?", placeholder: "e.g., $10M Revenue, 15% Market Share..." },
]

// --- Mock Data Generators ---
const generateTasks = (industry: string) => [
    `Analyze ${industry} Market Size (TAM/SAM/SOM)`,
    `Competitor Deep Dive & Benchmarking`,
    `Regulatory Landscape Assessment`,
    `Customer Segmentation & Persona Building`,
    `Value Chain Analysis`,
    `Financial Modeling & Sensitivity Analysis`,
    `Risk Assessment Matrix`,
    `Strategic Roadmap Development`
]

const ConsultingEngine = () => {
    const [phase, setPhase] = useState<Phase>('intake')
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0)
    const [formData, setFormData] = useState<Record<string, string>>({})

    // Simulation States
    // ... (previous imports)

    const [reportData, setReportData] = useState<any>(null)
    const [processingLog, setProcessingLog] = useState<string[]>([])
    const [tasks, setTasks] = useState<string[]>([])
    const [activeResearch, setActiveResearch] = useState<string | null>(null)

    // --- Handlers ---
    const handleNextQuestion = () => {
        if (currentQuestionIndex < QUESTIONS.length - 1) {
            setCurrentQuestionIndex(prev => prev + 1)
        } else {
            startSimulation()
        }
    }

    const handleInput = (value: string) => {
        const field = QUESTIONS[currentQuestionIndex].id
        setFormData(prev => ({ ...prev, [field]: value }))
    }

    // --- Simulation Logic ---
    const startSimulation = async () => {
        setPhase('decomposition')

        // Phase 2: Decomposition
        addLog("Initializing Neural Strategy Co-Pilot...")
        await delay(1000)
        addLog(`Analyzing ${formData.industry} context...`)
        await delay(1200)
        addLog("Decomposing problem statement into execution streams...")
        await delay(1500)

        const generatedTasks = generateTasks(formData.industry || 'Industry')
        setTasks(generatedTasks)
        await delay(1000)

        // Phase 3: Research
        setPhase('research')
        for (const task of generatedTasks) {
            setActiveResearch(task)
            addLog(`[AGENT-1] Researching: ${task}`)
            await delay(800 + Math.random() * 1000)
        }
        setActiveResearch(null)

        // Phase 4: Matrix Generation
        setPhase('matrix')
        addLog("Synthesizing data points...")
        await delay(1000)
        addLog("Generating Porter's 5 Forces Model...")
        await delay(1000)

        // Start Gemini Generation in background while matrix animation plays
        const geminiPromise = generateGeminiReport()

        addLog("Calculating SWOT vectors...")
        await delay(1000)

        // Phase 5: Synthesis
        setPhase('synthesis')
        addLog("Drafting strategic narrative...")

        try {
            const result = await geminiPromise
            setReportData(result)
            addLog("Strategic analysis generated successfully.")
        } catch (error) {
            console.error("Gemini Generation Error:", error)
            addLog("Error generating report. Using fallback data.")
            // Fallback mock data
            setReportData({
                tam: "$4.2B",
                growth_trend: "High growth potential detected.",
                risks: ["Regulatory uncertainty", "Market saturation", "Tech disruption"],
                strategy_title: "Aggressive Digital Entry",
                strategy_desc: "Leverage proprietary tech to disrupt incumbents.",
                executive_summary: "Based on the analysis, we recommend a phased approach. The market shows strong indicators for disruption."
            })
        }

        await delay(1500)
        addLog("Finalizing executive summary...")
        await delay(1000)

        // Phase 6: Deliverable
        setPhase('deliverable')
    }

    const generateGeminiReport = async () => {
        const apiKey = import.meta.env.VITE_GEMINI_API_KEY
        if (!apiKey) throw new Error("No Gemini API Key found")

        const prompt = `
        Act as a high-end strategic consultant (MBB level). Analyze the following business scenario:
        Problem: ${formData.problem}
        Industry: ${formData.industry}
        Geography: ${formData.geography}
        Constraints: ${formData.constraints}
        Competitors: ${formData.competitors}
        Advantage: ${formData.advantage}
        Success Metrics: ${formData.successMetrics}

        Return a VALID JSON object with the following fields (do not include markdown formatting):
        {
            "tam": "Estimated Market Size (e.g. $5.5B)",
            "growth_trend": "One sentence about market trajectory",
            "risks": ["Risk 1", "Risk 2", "Risk 3"],
            "strategy_title": "Short punchy strategy name",
            "strategy_desc": "One sentence description of the core strategy",
            "executive_summary": "Two paragraphs summarizing the strategic recommendation."
        }
        `

        const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                contents: [{ parts: [{ text: prompt }] }]
            })
        })

        if (!response.ok) throw new Error(`Gemini API Error: ${response.status}`)

        const data = await response.json()
        const text = data.candidates[0].content.parts[0].text
        // Clean markdown code blocks if present
        const jsonStr = text.replace(/```json/g, '').replace(/```/g, '').trim()
        return JSON.parse(jsonStr)
    }

    const addLog = (msg: string) => setProcessingLog(prev => [...prev.slice(-4), msg])
    const delay = (ms: number) => new Promise(res => setTimeout(res, ms))

    return (
        <div className="min-h-screen bg-black text-white pt-24 px-6 font-sans selection:bg-cyan-500/30">

            {/* --- Header / Progress --- */}
            <div className="max-w-4xl mx-auto mb-12">
                <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent mb-4">
                    Neura-Q Consulting Engine
                </h1>
                <div className="flex items-center gap-4 text-sm text-gray-400">
                    {(['intake', 'decomposition', 'research', 'matrix', 'synthesis', 'deliverable'] as Phase[]).map((p, i) => (
                        <div key={p} className={`flex items-center gap-2 ${phase === p ? 'text-cyan-400 font-bold' : (['intake', 'decomposition', 'research', 'matrix', 'synthesis', 'deliverable'].indexOf(phase) > i ? 'text-green-400' : 'opacity-30')}`}>
                            <div className={`w-3 h-3 rounded-full ${phase === p ? 'bg-cyan-500 animate-pulse' : 'bg-current'}`} />
                            <span className="hidden md:inline capitalize">{p}</span>
                        </div>
                    ))}
                </div>
            </div>

            {/* --- Main Content Area --- */}
            <div className="max-w-4xl mx-auto min-h-[60vh] flex flex-col">
                <AnimatePresence mode="wait">

                    {/* PHASE 1: INTAKE */}
                    {phase === 'intake' && (
                        <motion.div
                            key="intake"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, x: -20 }}
                            className="bg-gray-900/50 border border-gray-800 rounded-2xl p-8 backdrop-blur-sm"
                        >
                            <div className="mb-6 flex justify-between items-center text-sm text-gray-500">
                                <span>Question {currentQuestionIndex + 1} of {QUESTIONS.length}</span>
                                <span>{(currentQuestionIndex / QUESTIONS.length * 100).toFixed(0)}% Complete</span>
                            </div>

                            <h2 className="text-2xl font-light mb-6">
                                {QUESTIONS[currentQuestionIndex].label}
                            </h2>

                            <div className="relative mb-8">
                                <input
                                    autoFocus
                                    type="text"
                                    value={formData[QUESTIONS[currentQuestionIndex].id as keyof IntakeData] || ''}
                                    onChange={(e) => handleInput(e.target.value)}
                                    onKeyDown={(e) => e.key === 'Enter' && handleNextQuestion()}
                                    placeholder={QUESTIONS[currentQuestionIndex].placeholder}
                                    className="w-full bg-transparent border-b-2 border-gray-700 text-3xl py-4 focus:outline-none focus:border-cyan-500 transition-colors placeholder:text-gray-700 font-light"
                                />
                            </div>

                            <div className="flex justify-end">
                                <button
                                    onClick={handleNextQuestion}
                                    disabled={!formData[QUESTIONS[currentQuestionIndex].id as keyof IntakeData]}
                                    className="bg-cyan-600 hover:bg-cyan-500 text-white px-8 py-3 rounded-full flex items-center gap-2 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    {currentQuestionIndex === QUESTIONS.length - 1 ? 'Initialize Engine' : 'Next'}
                                    <ChevronRight size={20} />
                                </button>
                            </div>
                        </motion.div>
                    )}

                    {/* PHASE 2-5: SIMULATION PROCESSING */}
                    {(phase === 'decomposition' || phase === 'research' || phase === 'matrix' || phase === 'synthesis') && (
                        <motion.div
                            key="processing"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="flex-1 flex flex-col"
                        >
                            {/* Terminal Log */}
                            <div className="font-mono text-sm bg-black/80 border border-gray-800 rounded-xl p-4 mb-6 h-48 overflow-hidden flex flex-col-reverse shadow-[0_0_30px_rgba(34,211,238,0.1)]">
                                {processingLog.map((log, i) => (
                                    <motion.div key={i} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} className="text-cyan-400/80 mb-1">
                                        <span className="text-green-500 mr-2">➜</span> {log}
                                    </motion.div>
                                ))}
                            </div>

                            {/* Dynamic Visualization Area */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 flex-1">
                                {/* Task Queue Block */}
                                <div className="bg-gray-900/40 border border-gray-800 rounded-xl p-6">
                                    <h3 className="text-gray-400 text-xs uppercase tracking-wider mb-4 flex items-center gap-2">
                                        <Brain size={14} /> Execution Strategy
                                    </h3>
                                    <div className="space-y-3">
                                        {tasks.map((task, i) => (
                                            <motion.div
                                                initial={{ opacity: 0, y: 10 }}
                                                animate={{ opacity: 1, y: 0 }}
                                                transition={{ delay: i * 0.1 }}
                                                key={i}
                                                className={`flex items-center gap-3 p-3 rounded-lg border ${activeResearch === task ? 'bg-cyan-900/20 border-cyan-500/50' : 'bg-gray-800/20 border-gray-800'}`}
                                            >
                                                <div className={`w-2 h-2 rounded-full ${activeResearch === task ? 'bg-cyan-400 animate-ping' : 'bg-gray-600'}`} />
                                                <span className={`text-sm ${activeResearch === task ? 'text-cyan-100' : 'text-gray-400'}`}>{task}</span>
                                            </motion.div>
                                        ))}
                                    </div>
                                </div>

                                {/* Live Metrics Block */}
                                <div className="bg-gray-900/40 border border-gray-800 rounded-xl p-6 flex flex-col items-center justify-center relative overflow-hidden">
                                    {phase === 'research' && (
                                        <div className="text-center">
                                            <Loader2 className="w-12 h-12 text-cyan-400 animate-spin mx-auto mb-4" />
                                            <h3 className="text-xl font-medium">Scanning Global Data Sources</h3>
                                            <p className="text-sm text-gray-400 mt-2">Connecting to Knowledge Graph...</p>
                                        </div>
                                    )}
                                    {phase === 'matrix' && (
                                        <div className="w-full h-full flex items-center justify-center">
                                            <div className="relative w-48 h-48 border-2 border-cyan-500/30 rounded-full animate-[spin_8s_linear_infinite]">
                                                <div className="absolute inset-2 border-2 border-purple-500/30 rounded-full animate-[spin_6s_linear_infinite_reverse]" />
                                                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-center">
                                                    <PieChart className="w-8 h-8 text-cyan-400 mx-auto mb-2" />
                                                    <div className="text-xs text-cyan-300">Generating<br />Matrices</div>
                                                </div>
                                            </div>
                                        </div>
                                    )}
                                    {phase === 'synthesis' && (
                                        <div className="text-center space-y-4">
                                            <Sparkles className="w-16 h-16 text-purple-400 mx-auto animate-pulse" />
                                            <div className="text-2xl font-light">Synthesizing Insights</div>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </motion.div>
                    )}

                    {/* PHASE 6: DELIVERABLE */}
                    {phase === 'deliverable' && reportData && (
                        <motion.div
                            key="deliverable"
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className="bg-gray-900 border border-gray-800 rounded-2xl p-8 shadow-2xl"
                        >
                            <div className="flex justify-between items-start mb-8 border-b border-gray-800 pb-6">
                                <div>
                                    <div className="text-cyan-400 text-sm font-bold uppercase tracking-widest mb-2">Strategic Analysis Report</div>
                                    <h2 className="text-3xl font-bold bg-gradient-to-r from-white to-gray-400 bg-clip-text text-transparent">
                                        {formData.problem} Strategy
                                    </h2>
                                    <p className="text-gray-400 mt-2">Generated for: {formData.industry} | {formData.geography}</p>
                                </div>
                                <button className="bg-white text-black px-6 py-2 rounded-lg font-bold flex items-center gap-2 hover:bg-gray-200 transition-colors">
                                    <Download size={18} /> Export PDF
                                </button>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
                                <div className="p-6 bg-gray-800/30 rounded-xl border border-gray-700">
                                    <div className="flex items-center gap-3 mb-4 text-cyan-400">
                                        <TrendingUp /> <span className="font-bold">Market Opportunity</span>
                                    </div>
                                    <div className="text-3xl font-bold mb-2">{reportData.tam} <span className="text-sm text-gray-500 font-normal">TAM</span></div>
                                    <div className="w-full bg-gray-700 h-2 rounded-full mt-2">
                                        <div className="bg-cyan-500 h-2 rounded-full w-[70%]" />
                                    </div>
                                    <p className="text-sm text-gray-400 mt-4">{reportData.growth_trend}</p>
                                </div>

                                <div className="p-6 bg-gray-800/30 rounded-xl border border-gray-700">
                                    <div className="flex items-center gap-3 mb-4 text-purple-400">
                                        <AlertTriangle /> <span className="font-bold">Key Risks</span>
                                    </div>
                                    <ul className="space-y-2 text-sm text-gray-300">
                                        {reportData.risks.map((risk: string, i: number) => (
                                            <li key={i}>• {risk}</li>
                                        ))}
                                    </ul>
                                </div>

                                <div className="p-6 bg-gray-800/30 rounded-xl border border-gray-700">
                                    <div className="flex items-center gap-3 mb-4 text-green-400">
                                        <ShieldCheck /> <span className="font-bold">Rec. Strategy</span>
                                    </div>
                                    <div className="text-xl font-medium mb-2 capitalize">{reportData.strategy_title}</div>
                                    <p className="text-sm text-gray-400">{reportData.strategy_desc}</p>
                                </div>
                            </div>

                            <div className="bg-gray-800/30 rounded-xl border border-gray-700 p-8">
                                <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
                                    <BarChart3 className="text-cyan-400" /> Executive Summary
                                </h3>
                                <div className="space-y-4 text-gray-300 leading-relaxed whitespace-pre-line">
                                    {reportData.executive_summary}
                                </div>
                            </div>

                            <div className="flex justify-center mt-12">
                                <button onClick={() => window.location.reload()} className="text-gray-500 hover:text-white transition-colors">Start New Session</button>
                            </div>
                        </motion.div>
                    )}

                </AnimatePresence>
            </div>
        </div>
    )
}

export default ConsultingEngine
