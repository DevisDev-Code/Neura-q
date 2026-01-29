import { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import { Brain, Compass, Rocket, Send, Sparkles, Mic } from 'lucide-react'
import { supabase } from '../lib/supabase'
import AIProcessingPopup from './AIProcessingPopup'
import { toast } from 'sonner'
import { useSpeechRecognition, SpeechField } from '../hooks/useSpeechRecognition'


// API endpoints handled via Env Vars + Config
// API endpoints handled via Env Vars + Config
const API_ENDPOINTS = {
  aeon: import.meta.env.VITE_AEON_API_URL,
  tess: import.meta.env.VITE_TESS_API_URL,
  nova: import.meta.env.VITE_NOVA_API_URL
}

// Validation schema
const formSchema = z.object({
  context: z.string().min(10, 'Context must be at least 10 characters'),
  problem: z.string().min(10, 'Problem must be at least 10 characters'),
  approach: z.string().optional(),
  mindset: z.string().optional(),
  successMetrics: z.string().optional()
})
type FormData = z.infer<typeof formSchema>

// AI configuration
const aiConfig = {
  aeon: {
    name: '🧭 Aeon',
    icon: Compass,
    color: 'cyan',
    bg: 'from-cyan-950/90 to-blue-950/90',
    border: 'border-cyan-400/30',
    text: 'text-cyan-300',
    approaches: ['🎯 Strategic', '🔍 Realist', '⚡ Hustler'],
    variant: 'cyber' as const,
    resultPath: '/result-tot'
  },
  tess: {
    name: '🚀 Tess',
    icon: Rocket,
    color: 'orange',
    bg: 'from-orange-950/90 to-red-950/90',
    border: 'border-orange-400/30',
    text: 'text-orange-300',
    approaches: [],
    variant: 'quantum' as const,
    resultPath: '/result-got'
  },
  nova: {
    name: '🧠 Nova',
    icon: Brain,
    color: 'purple',
    bg: 'from-purple-950/90 to-indigo-950/90',
    border: 'border-purple-400/30',
    text: 'text-purple-300',
    approaches: [],
    variant: 'neural' as const,
    resultPath: '/result-cot'
  }
}

const processingMessages = {
  aeon: [
    'Initializing strategic neural networks...',
    'Processing future pathways...',
    'Analyzing strategic patterns...',
    'Optimizing decision matrices...',
    'Synthesizing strategic responses...'
  ],
  tess: [
    'Calibrating validation processors...',
    'Entangling logic states...',
    'Computing feasibility matrices...',
    'Optimizing validation algorithms...',
    'Finalizing structured analysis...'
  ],
  nova: [
    'Initializing quantum neural networks...',
    'Processing synaptic pathways...',
    'Analyzing cognitive patterns...',
    'Optimizing thought matrices...',
    'Synthesizing neural responses...'
  ]
}

const DilemmaForm = () => {
  const { aiType } = useParams<{ aiType: string }>()
  const navigate = useNavigate()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [showProcessingPopup, setShowProcessingPopup] = useState(false)

  // Custom Hooks


  // Local state for immediate input feedback
  const [contextVal, setContextVal] = useState('')
  const [problemVal, setProblemVal] = useState('')
  const [mindsetVal, setMindsetVal] = useState('')
  const [successVal, setSuccessVal] = useState('')
  const [isLoaded, setIsLoaded] = useState(false)

  // Speech Hook Callback
  const handleTranscript = (field: SpeechField, final: string, _interim: string) => {
    if (final) {
      if (field === 'context') setContextVal(prev => (prev + ' ' + final).trim())
      if (field === 'problem') setProblemVal(prev => (prev + ' ' + final).trim())
      if (field === 'mindset') setMindsetVal(prev => (prev + ' ' + final).trim())
      if (field === 'successMetrics') setSuccessVal(prev => (prev + ' ' + final).trim())
    }
  }

  const { isSupported: speechSupported, activeField: activeSpeechField, startListening, stopListening } = useSpeechRecognition({
    onTranscript: handleTranscript
  })

  const ai = aiConfig[aiType as keyof typeof aiConfig]
  const IconComponent = ai?.icon || Brain

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors }
  } = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      context: '',
      problem: '',
      approach: '',
      mindset: '',
      successMetrics: ''
    }
  })

  // Load from LocalStorage
  useEffect(() => {
    setIsLoaded(false) // Reset on aiType change
    const saved = localStorage.getItem(`dilemma_draft_${aiType}`)
    if (saved) {
      try {
        const parsed = JSON.parse(saved)
        setContextVal(parsed.context || '')
        setProblemVal(parsed.problem || '')
        setMindsetVal(parsed.mindset || '')
        setSuccessVal(parsed.successMetrics || '')
        setValue('context', parsed.context || '')
        setValue('problem', parsed.problem || '')
      } catch (e) {
        console.error("Failed to parse draft", e)
      }
    }
    setIsLoaded(true)
  }, [aiType, setValue])

  // Save to LocalStorage
  useEffect(() => {
    if (!isLoaded) return
    const draft = { context: contextVal, problem: problemVal, mindset: mindsetVal, successMetrics: successVal }
    localStorage.setItem(`dilemma_draft_${aiType}`, JSON.stringify(draft))
  }, [contextVal, problemVal, mindsetVal, successVal, aiType, isLoaded])

  // Sync React Hook Form
  useEffect(() => {
    setValue('context', contextVal, { shouldValidate: !!contextVal })
    setValue('problem', problemVal, { shouldValidate: !!problemVal })
    setValue('mindset', mindsetVal)
    setValue('successMetrics', successVal)
  }, [contextVal, problemVal, mindsetVal, successVal, setValue])



  const toggleMic = (field: SpeechField) => {
    if (!speechSupported) {
      toast.error('Speech recognition not supported in this browser.')
      return
    }
    if (activeSpeechField === field) {
      stopListening()
    } else {
      startListening(field)
    }
  }

  const onSubmit = async (data: FormData) => {
    setIsSubmitting(true)
    setShowProcessingPopup(true)

    try {
      await supabase.auth.refreshSession()
      const { data: sessionData, error: sessionError } = await supabase.auth.getSession()

      if (sessionError || !sessionData.session) {
        throw new Error('Authentication required: Please sign in.')
      }

      const token = sessionData.session.access_token
      const endpoint = API_ENDPOINTS[aiType as keyof typeof API_ENDPOINTS]

      const payload = {
        problem: data.problem,
        context: data.context,
        persona: aiType === 'nova' ? data.mindset : aiType === 'tess' ? data.successMetrics : data.approach
      }

      console.log('Sending payload:', payload)

      const response = await fetch(endpoint, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(payload)
      })

      if (!response.ok) {
        throw new Error(`API call failed: ${response.status}`)
      }

      const result = await response.json()

      // Clear draft on success
      localStorage.removeItem(`dilemma_draft_${aiType}`)

      navigate(ai.resultPath, {
        state: {
          resultData: result,
          inputData: data,
          aiType
        }
      })
    } catch (error) {
      console.error('Submission error:', error)
      toast.error(error instanceof Error ? error.message : 'An unexpected error occurred.')
      setIsSubmitting(false)
      setShowProcessingPopup(false)
    }
  }

  if (!ai) return <div className="text-white">AI not found</div>

  return (
    <div className="w-full min-h-screen bg-black relative overflow-hidden">
      {/* Optimized Background - using will-change for performance */}
      <div className="absolute inset-0 z-0 opacity-30 pointer-events-none">
        <div className={`absolute top-1/4 left-1/4 w-96 h-96 bg-${ai.color}-500/20 rounded-full blur-[100px] will-change-transform`} />
        <div className={`absolute bottom-1/4 right-1/4 w-96 h-96 bg-${ai.color}-500/20 rounded-full blur-[100px] will-change-transform`} />
      </div>

      <div className="relative z-10 min-h-screen flex flex-col py-24 px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full max-w-4xl mx-auto"
        >
          <div className="text-center mb-12">
            <div className="flex items-center justify-center gap-4 mb-6">
              <div className={`p-4 rounded-2xl bg-gradient-to-br ${ai.bg} border ${ai.border}`}>
                <IconComponent className={`w-8 h-8 ${ai.text}`} />
              </div>
              <div>
                <h1 className={`text-4xl font-bold ${ai.text}`}>{ai.name}</h1>
                <div className="flex items-center gap-2 mt-2">
                  <Sparkles className={`w-4 h-4 ${ai.text} animate-pulse`} />
                  <span className="text-gray-400 text-sm">Neural interface active</span>
                </div>
              </div>
            </div>
            <p className="text-xl text-gray-300">Share your dilemma and let {ai.name.split(' ')[1]} guide your path forward</p>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className={`p-8 rounded-2xl bg-gradient-to-br ${ai.bg} border ${ai.border} backdrop-blur-sm space-y-6`}>

            {/* Context Field */}
            <div className="space-y-2">
              <label className={`block text-sm font-medium ${ai.text}`}>Context</label>
              <div className="relative">
                <textarea
                  value={contextVal}
                  onChange={(e) => setContextVal(e.target.value)}
                  placeholder="Provide background information..."
                  className="w-full p-4 bg-black/30 border border-white/20 rounded-xl text-white min-h-[120px]"
                />
                <div className="absolute top-2 right-2 flex gap-2">
                  <button type="button" onClick={() => toggleMic('context')} className={`p-2 rounded-lg transition-colors ${activeSpeechField === 'context' ? 'bg-red-500 text-white animate-pulse' : 'bg-gray-700 hover:bg-gray-600 text-gray-300'}`}>
                    <Mic className="w-4 h-4" />
                  </button>
                </div>
              </div>
              {errors.context && <p className="text-red-400 text-sm">{errors.context.message}</p>}
            </div>

            {/* Problem Field */}
            <div className="space-y-2">
              <label className={`block text-sm font-medium ${ai.text}`}>Problem</label>
              <div className="relative">
                <textarea
                  value={problemVal}
                  onChange={(e) => setProblemVal(e.target.value)}
                  placeholder="Describe your dilemma..."
                  className="w-full p-4 bg-black/30 border border-white/20 rounded-xl text-white min-h-[120px]"
                />
                <div className="absolute top-2 right-2 flex gap-2">
                  <button type="button" onClick={() => toggleMic('problem')} className={`p-2 rounded-lg transition-colors ${activeSpeechField === 'problem' ? 'bg-red-500 text-white animate-pulse' : 'bg-gray-700 hover:bg-gray-600 text-gray-300'}`}>
                    <Mic className="w-4 h-4" />
                  </button>
                </div>
              </div>
              {errors.problem && <p className="text-red-400 text-sm">{errors.problem.message}</p>}
            </div>

            {/* Conditional Fields based on AI Type */}
            {ai.approaches.length > 0 && (
              <div className="space-y-2">
                <label className={`block text-sm font-medium ${ai.text}`}>Approach</label>
                <select {...register('approach')} className="w-full p-4 bg-black/30 border border-white/20 rounded-xl text-white">
                  <option value="">Select an approach...</option>
                  {ai.approaches.map(a => <option key={a} value={a} className="bg-black">{a}</option>)}
                </select>
              </div>
            )}

            {aiType === 'nova' && (
              <div className="space-y-2">
                <label className={`block text-sm font-medium ${ai.text}`}>Mindset</label>
                <div className="relative">
                  <textarea value={mindsetVal} onChange={(e) => setMindsetVal(e.target.value)} placeholder="E.g., Growth, cautious..." className="w-full p-4 bg-black/30 border border-white/20 rounded-xl text-white" />
                  <div className="absolute top-2 right-2 flex gap-2">
                    <button type="button" onClick={() => toggleMic('mindset')} className={`p-2 rounded-lg transition-colors ${activeSpeechField === 'mindset' ? 'bg-red-500 text-white animate-pulse' : 'bg-gray-700 hover:bg-gray-600 text-gray-300'}`}>
                      <Mic className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            )}

            {aiType === 'tess' && (
              <div className="space-y-2">
                <label className={`block text-sm font-medium ${ai.text}`}>Success Metrics</label>
                <div className="relative">
                  <textarea value={successVal} onChange={(e) => setSuccessVal(e.target.value)} placeholder="Define success..." className="w-full p-4 bg-black/30 border border-white/20 rounded-xl text-white" />
                  <div className="absolute top-2 right-2 flex gap-2">
                    <button type="button" onClick={() => toggleMic('successMetrics')} className={`p-2 rounded-lg transition-colors ${activeSpeechField === 'successMetrics' ? 'bg-red-500 text-white animate-pulse' : 'bg-gray-700 hover:bg-gray-600 text-gray-300'}`}>
                      <Mic className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            )}

            <button disabled={isSubmitting} type="submit" className="w-full py-4 bg-white text-black font-bold rounded-xl hover:bg-gray-200 transition-colors flex items-center justify-center gap-2">
              {isSubmitting ? 'Processing...' : <><Send className="w-5 h-5" /> Initialize Neural Processing</>}
            </button>

          </form>
        </motion.div>
      </div>

      <AIProcessingPopup
        isOpen={showProcessingPopup}
        messages={processingMessages[aiType as keyof typeof processingMessages] || []}
        onClose={() => setShowProcessingPopup(false)}
        title="Processing Data"
      />
    </div>
  )
}

export default DilemmaForm
