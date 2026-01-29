import { useLocation, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Compass, ArrowLeft } from 'lucide-react'
import { useEffect, useState } from 'react'
import AeonTreeVisualization from './AeonTreeVisualization'

interface TreeNode {
  id: string
  label: string
  explanation?: string
  summary?: string
  future_scenario?: string
  children?: TreeNode[]
  _children?: TreeNode[]
  x?: number
  y?: number
  x0?: number
  y0?: number
}

const ResultTot = () => {
  const navigate = useNavigate()
  const location = useLocation()
  const [resultData, setResultData] = useState<TreeNode | null>(null)

  useEffect(() => {
    // Access the data passed from navigation
    const data = location.state?.resultData
    console.log('ResultTot received data:', data)
    
    if (data) {
      // Check if the data has a nested 'result' property
      const actualResult = data.result || data;
      console.log('Actual result data:', actualResult);
      setResultData(actualResult)
    } else {
      console.warn('No result data found in location state')
    }
  }, [location.state, navigate])

  return (
    <div className="w-full min-h-screen bg-black relative overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-gradient-to-br from-gray-900 via-black to-gray-900" />
        <div className="absolute inset-0 opacity-20">
          <div
            className="absolute inset-0"
            style={{
              backgroundImage:
                'linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)',
              backgroundSize: '100px 100px'
            }}
          />
        </div>
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl" />
      </div>

      {/* Content */}
      <div className="relative z-10 min-h-screen flex flex-col">
        {/* Header */}
        <div className="p-6">
          <button
            onClick={() => navigate('/choose-ai')}
            className="flex items-center gap-2 text-cyan-300 hover:text-cyan-200 transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            Back to AI Selection
          </button>
        </div>

        {/* Main Content */}
        <div className="flex-1 flex flex-col items-center justify-start w-full px-6 py-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1 }}
            className="w-full"
          >
            {/* AI Header */}
            <div className="flex items-center justify-center gap-4 mb-8">
              <div className="p-4 rounded-2xl bg-gradient-to-br from-cyan-950/90 to-blue-950/90 border border-cyan-400/30">
                <Compass className="w-8 h-8 text-cyan-300" />
              </div>
              <div>
                <h1 className="text-4xl font-bold text-cyan-300">🧭 Aeon Results</h1>
                <p className="text-cyan-100/80 mt-2">Strategic Analysis Complete</p>
              </div>
            </div>

            {/* Display main dilemma information */}
            {resultData && (
              <div className="mb-8 px-6 text-center">
                <h2 className="text-2xl font-semibold text-cyan-200 mb-2">{resultData.label}</h2>
                {resultData.summary && (
                  <p className="text-cyan-100/90 italic mb-2 max-w-4xl mx-auto">{resultData.summary}</p>
                )}
                {resultData.explanation && (
                  <p className="text-cyan-100/70 max-w-5xl mx-auto">{resultData.explanation}</p>
                )}
              </div>
            )}

            {/* Visualization Container */}
            <div className="p-8 rounded-2xl bg-gradient-to-br from-cyan-950/90 to-blue-950/90 border border-cyan-400/30 backdrop-blur-sm">
              {resultData ? (
                <div>
                  <h2 className="text-2xl font-bold text-cyan-300 mb-6 text-center">
                    Strategic Decision Tree
                  </h2>
                  <div className="bg-black/30 rounded-xl p-4 min-h-[600px]">
                    <AeonTreeVisualization data={resultData} />
                  </div>
                </div>
              ) : (
                <div className="text-center">
                  <h2 className="text-2xl font-bold text-cyan-300 mb-4">
                    Loading Strategic Insights...
                  </h2>
                  <div className="flex items-center justify-center space-x-2">
                    {[...Array(3)].map((_, i) => (
                      <motion.div
                        key={i}
                        className="h-3 w-3 rounded-full bg-cyan-400"
                        animate={{
                          scale: [1, 1.5, 1],
                          opacity: [0.5, 1, 0.5]
                        }}
                        transition={{
                          duration: 1.5,
                          repeat: Infinity,
                          delay: i * 0.2,
                          ease: 'easeInOut'
                        }}
                      />
                    ))}
                  </div>
                  <p className="text-cyan-100/70 mt-4">
                    {location.state ? 'Processing data...' : 'No data received from previous page'}
                  </p>
                </div>
              )}
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  )
}

export default ResultTot