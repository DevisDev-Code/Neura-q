import { useState, useRef } from 'react'
import { IntakeForm } from './consulting-engine/IntakeForm'
import { DebateRoom } from './consulting-engine/DebateRoom'
import { SynthesisReport } from './consulting-engine/SynthesisReport'
import { MarketResearchPhase } from './consulting-engine/MarketResearchPhase'
import { WelcomeScreen } from './consulting-engine/WelcomeScreen'
import { performMarketResearch, generateDebateTurn, generateSynthesis } from '../services/consultingGeminiService'
import { DebateMessage, IntakeData, Phase, AgentRole } from '../types/consulting'

export default function ConsultingEngine() {
    const [phase, setPhase] = useState<Phase>('welcome')
    const [intakeData, setIntakeData] = useState<IntakeData | null>(null)
    const [researchData, setResearchData] = useState<string | null>(null)

    const [debateMessages, setDebateMessages] = useState<DebateMessage[]>([])
    const [synthesis, setSynthesis] = useState<string | null>(null)

    // Processing states
    const [isProcessing, setIsProcessing] = useState(false)
    const [processingAgent, setProcessingAgent] = useState<AgentRole | undefined>(undefined)
    const [currentRound, setCurrentRound] = useState(1)

    // Refs for loop state management
    const debateStateRef = useRef<{
        round: number
        history: DebateMessage[]
        lastArbiterCommand: string
        active: boolean
    }>({
        round: 1,
        history: [],
        lastArbiterCommand: 'normal',
        active: false,
    })

    // Workflow Controllers
    const handleStart = () => setPhase('intake')

    const handleIntakeComplete = (data: IntakeData) => {
        setIntakeData(data)
        setPhase('research')
        runResearch(data)
    }

    const runResearch = async (data: IntakeData) => {
        setIsProcessing(true)
        try {
            const result = await performMarketResearch(data)
            setResearchData(result)
            setIsProcessing(false)
            setTimeout(() => {
                setPhase('debate')
                startDebateLoop(data, result)
            }, 4000)
        } catch (error) {
            console.error('Research failed', error)
            setResearchData('Research unavailable.')
            setIsProcessing(false)
            setTimeout(() => {
                setPhase('debate')
                startDebateLoop(data, 'Research unavailable.')
            }, 3000)
        }
    }

    // --- THE WAR ROOM LOOP ---
    const startDebateLoop = async (data: IntakeData, research: string) => {
        debateStateRef.current = { round: 1, history: [], lastArbiterCommand: 'normal', active: true }
        setCurrentRound(1)
        await executeTurn('architect', data, research)
    }

    const executeTurn = async (agent: AgentRole, data: IntakeData, research: string) => {
        if (!debateStateRef.current.active) return

        setProcessingAgent(agent)
        setIsProcessing(true)

        const { round, history, lastArbiterCommand } = debateStateRef.current

        // AI Call
        const result = await generateDebateTurn(agent, data, research, history, round, lastArbiterCommand)

        const newMessage: DebateMessage = {
            agent,
            text: result.text,
            round,
            timestamp: Date.now(),
            type: agent === 'arbiter' && result.command !== 'normal' ? (result.command as any) : 'normal',
        }

        // Update State
        const newHistory = [...history, newMessage]
        debateStateRef.current.history = newHistory
        setDebateMessages(newHistory)
        setIsProcessing(false)
        setProcessingAgent(undefined)

        // Determine Next Step
        // INCREASED DELAY to 3000ms to avoid Quota RPM limits when using a single key
        await new Promise((r) => setTimeout(r, 3000))

        if (agent === 'architect') {
            await executeTurn('destroyer', data, research)
        } else if (agent === 'destroyer') {
            await executeTurn('arbiter', data, research)
        } else if (agent === 'arbiter') {
            // Logic gate based on Arbiter's command
            const command = result.command
            debateStateRef.current.lastArbiterCommand = command || 'normal'

            if (command === 'consensus') {
                // END DEBATE
                debateStateRef.current.active = false
                setPhase('synthesis')
                runSynthesis(data, research, newHistory)
            } else if (command === 'veto') {
                // REPEAT ROUND (Do not increment round number)
                await executeTurn('architect', data, research)
            } else {
                // CONTINUE / MECE CHECK
                const nextRound = round + 1
                debateStateRef.current.round = nextRound
                setCurrentRound(nextRound)

                // Safety Break: Max 5 rounds to prevent quota limits (Light Mode)
                if (nextRound > 5) {
                    debateStateRef.current.active = false
                    setPhase('synthesis')
                    runSynthesis(data, research, newHistory)
                } else {
                    await executeTurn('architect', data, research)
                }
            }
        }
    }

    const runSynthesis = async (data: IntakeData, research: string, history: DebateMessage[]) => {
        setIsProcessing(true)
        const finalReport = await generateSynthesis(data, research, history)
        setSynthesis(finalReport)
        setIsProcessing(false)
    }

    return (
        <div className="min-h-screen font-sans text-[#e8e4dc] bg-[#050508] selection:bg-blue-500 selection:text-white">
            {phase === 'welcome' && <WelcomeScreen onStart={handleStart} />}

            {phase === 'intake' && <IntakeForm onComplete={handleIntakeComplete} />}

            {phase === 'research' && (
                <MarketResearchPhase data={intakeData} result={researchData} isProcessing={isProcessing} />
            )}

            {phase === 'debate' && (
                <DebateRoom
                    messages={debateMessages}
                    currentRound={currentRound}
                    isProcessing={isProcessing}
                    processingAgent={processingAgent}
                />
            )}

            {phase === 'synthesis' && <SynthesisReport synthesis={synthesis} isProcessing={isProcessing} />}

            {/* Persistent Footer/Status */}
            <div className="fixed bottom-0 left-0 w-full border-t border-[#1f1f3a] bg-[#050508]/90 backdrop-blur-sm py-2 px-6 flex justify-between items-center text-[10px] font-mono tracking-widest text-[#64748b] z-50">
                <div>NEURA-Q · ENGINE V2.0</div>
                <div className="flex gap-4">
                    <span className={phase === 'intake' ? 'text-blue-500' : ''}>01 SITUATION</span>
                    <span className={phase === 'research' ? 'text-blue-500' : ''}>02 INTEL</span>
                    <span className={phase === 'debate' ? 'text-blue-500' : ''}>03 WAR ROOM</span>
                    <span className={phase === 'synthesis' ? 'text-blue-500' : ''}>04 VERDICT</span>
                </div>
                <div>SECURE CONNECTION</div>
            </div>
        </div>
    )
}
