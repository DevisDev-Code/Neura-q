import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Brain, Compass, Rocket, ChevronRight, Sparkles } from 'lucide-react'

const ChooseYourAI = () => {
  const navigate = useNavigate()
  const [hoveredCard, setHoveredCard] = useState<string | null>(null)

  const aiOptions = [
    {
      id: 'aeon',
      name: '🧭 Aeon',
      icon: Compass,
      color: 'cyan',
      bg: 'from-cyan-950/90 to-blue-950/90',
      border: 'border-cyan-400/30',
      text: 'text-cyan-300',
      description: 'Strategic thinking',
      details: 'Breaks your dilemma into components. Helps you see how the parts connect, what depends on what, and where the decision points really are.'
    },
    {
      id: 'nova',
      name: '🧠 Nova',
      icon: Brain,
      color: 'purple',
      bg: 'from-purple-950/90 to-indigo-950/90',
      border: 'border-purple-400/30',
      text: 'text-purple-300',
      description: 'Consequence mapping',
      details: 'You describe a decision — Nova shows what can happen next. It maps short-term and long-term effects, so you understand what you\'re really choosing.'
    },
    {
      id: 'tess',
      name: '🚀 Tess',
      icon: Rocket,
      color: 'orange',
      bg: 'from-orange-950/90 to-red-950/90',
      border: 'border-orange-400/30',
      text: 'text-orange-300',
      description: 'Scenario exploration',
      details: 'Helps you explore bold ideas, edge cases, and trade-offs. Tess doesn\'t validate or reject — it pressure-tests your thinking and reveals hidden angles.'
    }
  ]

  const handleAISelect = (aiId: string) => {
    navigate(`/dilemma/${aiId}`)
  }

  return (
    <div className="w-full min-h-screen bg-black relative overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-gradient-to-br from-gray-900 via-black to-gray-900" />
        <div className="absolute inset-0 opacity-20">
          <div className="absolute inset-0" style={{
            backgroundImage: 'linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)',
            backgroundSize: '100px 100px'
          }} />
        </div>
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl" />
      </div>

      {/* Content */}
      <div className="relative z-10 min-h-screen flex flex-col">
        {/* Main Content */}
        <div className="flex-1 flex items-center justify-center w-full px-6 py-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1 }}
            className="w-full"
          >
            {/* Header */}
            <div className="text-center mb-16">
              <motion.h1 
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 1.2, delay: 0.3 }}
                className="text-5xl md:text-7xl lg:text-8xl font-bold mb-6 bg-gradient-to-r from-cyan-400 via-purple-400 to-orange-400 bg-clip-text text-transparent"
              >
                Choose Your AI
              </motion.h1>
              
              <motion.p 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 1, delay: 0.6 }}
                className="text-xl text-gray-300 max-w-3xl mx-auto leading-relaxed"
              >
                Each AI agent approaches your dilemma from a different angle — so you see the full picture.
              </motion.p>
            </div>

            {/* AI Cards Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12 max-w-7xl mx-auto">
              {aiOptions.map((ai, index) => {
                const IconComponent = ai.icon
                return (
                  <motion.div
                    key={ai.id}
                    initial={{ opacity: 0, y: 50 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 1, delay: 0.2 * (index + 1) }}
                    className="group relative cursor-pointer"
                    onMouseEnter={() => setHoveredCard(ai.id)}
                    onMouseLeave={() => setHoveredCard(null)}
                    onClick={() => handleAISelect(ai.id)}
                  >
                    <div className={`relative overflow-hidden rounded-2xl bg-gradient-to-br ${ai.bg} backdrop-blur-sm border ${ai.border} p-8 hover:border-${ai.color}-400/60 transition-all duration-300 hover:shadow-2xl hover:shadow-${ai.color}-500/20 hover:scale-105`}>
                      <div className={`absolute inset-0 bg-gradient-to-br from-${ai.color}-400/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300`} />
                      
                      <div className="relative z-10 space-y-6">
                        <div className="flex justify-center">
                          <div className={`p-4 rounded-2xl bg-${ai.color}-900/50 border border-${ai.color}-400/30`}>
                            <IconComponent className={`w-8 h-8 text-${ai.color}-400`} />
                          </div>
                        </div>
                        
                        <div className="text-center">
                          <h3 className={`text-2xl font-bold ${ai.text} mb-2`}>{ai.name}</h3>
                          <p className={`text-${ai.color}-100/80 font-semibold mb-3`}>{ai.description}</p>
                          <p className={`text-${ai.color}-100/70 text-sm leading-relaxed`}>
                            {ai.details}
                          </p>
                        </div>

                        {/* Hover Effect */}
                        <motion.div
                          className="flex items-center justify-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                          initial={{ y: 10 }}
                          animate={{ y: hoveredCard === ai.id ? 0 : 10 }}
                        >
                          <span className={`text-sm font-medium ${ai.text}`}>Select {ai.name.split(' ')[1]}</span>
                          <ChevronRight className={`w-4 h-4 ${ai.text}`} />
                        </motion.div>
                      </div>
                    </div>
                  </motion.div>
                )
              })}
            </div>

            {/* Bottom Text */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, delay: 1 }}
              className="text-center max-w-4xl mx-auto"
            >
              <div className="flex items-center justify-center gap-2 mb-4">
                <Sparkles className="w-5 h-5 text-cyan-400 animate-pulse" />
                <span className="text-gray-400 text-sm">Neural interfaces ready</span>
                <Sparkles className="w-5 h-5 text-purple-400 animate-pulse" />
              </div>
              <p className="text-gray-500 text-sm max-w-2xl mx-auto">
                Not sure which one? Start with any — you can always try another approach.
              </p>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </div>
  )
}

export default ChooseYourAI