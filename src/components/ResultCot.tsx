import { useLocation, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Brain, ArrowLeft, AlertCircle } from 'lucide-react'
import { useEffect, useState } from 'react'
import CoTGraph from './CoTGraph'

type Result = {
  steps: { id: string; thought: string; explanation: string }[];
  benefits: string[];
  consequences: string[];
  final_thought: string;
  alternative_paths: { id: string; description: string }[];
  recommended_path_id: string;
};

const ResultCot = () => {
  const navigate = useNavigate()
  const location = useLocation()
  const [resultData, setResultData] = useState<Result | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    try {
      // Access the data passed from navigation
      const data = location.state?.resultData
      console.log('ResultCot received data:', data)

      if (data) {
        // Check if the data has a nested 'result' property
        const actualResult = data.result || data;
        console.log('Actual result data:', actualResult);

        // Validate the data structure
        if (typeof actualResult === 'object' && actualResult !== null) {
          // Ensure all required arrays exist
          const validatedData: Result = {
            steps: Array.isArray(actualResult.steps) ? actualResult.steps : [],
            benefits: Array.isArray(actualResult.benefits) ? actualResult.benefits : [],
            consequences: Array.isArray(actualResult.consequences) ? actualResult.consequences : [],
            final_thought: actualResult.final_thought || 'No final thought provided',
            alternative_paths: Array.isArray(actualResult.alternative_paths) ? actualResult.alternative_paths : [],
            recommended_path_id: actualResult.recommended_path_id || ''
          };

          console.log('Validated data:', validatedData);
          setResultData(validatedData);
        } else {
          setError('Invalid data format received');
        }
      } else {
        console.warn('No result data found in location state')
        setError('No result data available');
      }
    } catch (err) {
      console.error('Error processing result data:', err);
      setError('Error processing result data');
    }

    setLoading(false)
  }, [location.state, navigate])

  const handleRetry = () => {
    navigate('/choose-ai')
  }

  return (
    <div className="w-full min-h-screen bg-black relative overflow-hidden">
      {/* Enhanced Background Effects */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-gradient-to-br from-gray-900 via-black to-gray-900" />
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0" style={{
            backgroundImage: 'linear-gradient(rgba(139,92,246,0.3) 1px, transparent 1px), linear-gradient(90deg, rgba(139,92,246,0.3) 1px, transparent 1px)',
            backgroundSize: '60px 60px'
          }} />
        </div>
        {/* Animated gradient orbs */}
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-purple-500/20 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-blue-500/15 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
        <div className="absolute top-3/4 left-1/2 w-64 h-64 bg-indigo-500/10 rounded-full blur-2xl animate-pulse" style={{ animationDelay: '2s' }} />
      </div>

      {/* Content */}
      <div className="relative z-10 min-h-screen flex flex-col">
        {/* Enhanced Header */}
        <div className="p-6">
          <button
            onClick={() => navigate('/choose-ai')}
            className="flex items-center gap-2 text-purple-300 hover:text-purple-200 transition-all duration-300 hover:translate-x-1"
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
            {/* Enhanced AI Header */}
            <div className="flex items-center justify-center gap-4 mb-8">
              <motion.div
                className="p-4 rounded-2xl bg-gradient-to-br from-purple-950/90 to-indigo-950/90 border border-purple-400/30 backdrop-blur-sm shadow-2xl"
                animate={{
                  boxShadow: [
                    '0 0 30px rgba(139, 92, 246, 0.3)',
                    '0 0 50px rgba(139, 92, 246, 0.5)',
                    '0 0 30px rgba(139, 92, 246, 0.3)'
                  ]
                }}
                transition={{ duration: 3, repeat: Infinity }}
              >
                <Brain className="w-8 h-8 text-purple-300" />
              </motion.div>
              <div>
                <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-300 to-blue-300 bg-clip-text text-transparent">
                  🧠 Nova Results
                </h1>
                <p className="text-purple-100/80 mt-2">Neural Analysis Complete</p>
              </div>
            </div>

            {/* Enhanced Visualization Container */}
            <div className="p-8 rounded-2xl bg-gradient-to-br from-purple-950/90 to-indigo-950/90 border border-purple-400/30 backdrop-blur-sm shadow-2xl">
              {loading ? (
                <div className="text-center">
                  <h2 className="text-2xl font-bold text-purple-300 mb-6">
                    Loading Neural Insights...
                  </h2>
                  <div className="flex items-center justify-center space-x-2">
                    {[...Array(3)].map((_, i) => (
                      <motion.div
                        key={i}
                        className="h-4 w-4 rounded-full bg-gradient-to-r from-purple-400 to-blue-400"
                        animate={{
                          scale: [1, 1.5, 1],
                          opacity: [0.5, 1, 0.5]
                        }}
                        transition={{
                          duration: 1.5,
                          repeat: Infinity,
                          delay: i * 0.2,
                          ease: "easeInOut"
                        }}
                      />
                    ))}
                  </div>
                </div>
              ) : error ? (
                <div className="text-center">
                  <div className="flex items-center justify-center mb-4">
                    <AlertCircle className="w-8 h-8 text-red-400 mr-2" />
                    <h2 className="text-2xl font-bold text-red-400">
                      Error Loading Results
                    </h2>
                  </div>
                  <p className="text-purple-100/80 text-lg mb-6">
                    {error}
                  </p>
                  <button
                    onClick={handleRetry}
                    className="px-6 py-3 bg-gradient-to-r from-purple-500 to-purple-600 rounded-xl text-white font-semibold hover:from-purple-400 hover:to-purple-500 transition-all duration-300 transform hover:scale-105"
                  >
                    Try Again
                  </button>
                </div>
              ) : resultData ? (
                <div>
                  <h2 className="text-2xl font-bold text-purple-300 mb-6 text-center">
                    Chain of Thought Analysis
                  </h2>
                  <div className="bg-black/30 rounded-xl p-4 min-h-[600px] border border-purple-400/20">
                    <CoTGraph result={resultData} />
                  </div>

                  {/* Enhanced Additional Information */}
                  <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
                    {/* Steps Summary */}
                    <motion.div
                      className="bg-black/20 rounded-xl p-4 border border-blue-400/20 backdrop-blur-sm"
                      whileHover={{ scale: 1.02, borderColor: 'rgba(59, 130, 246, 0.4)' }}
                      transition={{ duration: 0.2 }}
                    >
                      <h3 className="text-lg font-semibold text-blue-300 mb-3 flex items-center gap-2">
                        <span className="w-2 h-2 bg-blue-400 rounded-full"></span>
                        Analysis Steps ({resultData.steps.length})
                      </h3>
                      <div className="space-y-2 max-h-40 overflow-y-auto custom-scrollbar">
                        {resultData.steps.map((step, i) => (
                          <div key={i} className="text-sm text-purple-100/70 p-2 rounded bg-blue-900/20">
                            <span className="font-medium text-blue-300">Step {step.id}:</span> {step.thought}
                          </div>
                        ))}
                      </div>
                    </motion.div>

                    {/* Benefits */}
                    <motion.div
                      className="bg-black/20 rounded-xl p-4 border border-green-400/20 backdrop-blur-sm"
                      whileHover={{ scale: 1.02, borderColor: 'rgba(34, 197, 94, 0.4)' }}
                      transition={{ duration: 0.2 }}
                    >
                      <h3 className="text-lg font-semibold text-green-300 mb-3 flex items-center gap-2">
                        <span className="w-2 h-2 bg-green-400 rounded-full"></span>
                        Benefits ({resultData.benefits.length})
                      </h3>
                      <ul className="space-y-1 max-h-40 overflow-y-auto custom-scrollbar">
                        {resultData.benefits.map((benefit, i) => (
                          <li key={i} className="text-sm text-purple-100/70 p-2 rounded bg-green-900/20">
                            • {benefit}
                          </li>
                        ))}
                      </ul>
                    </motion.div>

                    {/* Consequences */}
                    <motion.div
                      className="bg-black/20 rounded-xl p-4 border border-red-400/20 backdrop-blur-sm"
                      whileHover={{ scale: 1.02, borderColor: 'rgba(239, 68, 68, 0.4)' }}
                      transition={{ duration: 0.2 }}
                    >
                      <h3 className="text-lg font-semibold text-red-300 mb-3 flex items-center gap-2">
                        <span className="w-2 h-2 bg-red-400 rounded-full"></span>
                        Consequences ({resultData.consequences.length})
                      </h3>
                      <ul className="space-y-1 max-h-40 overflow-y-auto custom-scrollbar">
                        {resultData.consequences.map((consequence, i) => (
                          <li key={i} className="text-sm text-purple-100/70 p-2 rounded bg-red-900/20">
                            • {consequence}
                          </li>
                        ))}
                      </ul>
                    </motion.div>
                  </div>

                  {/* Enhanced Alternative Paths */}
                  {resultData.alternative_paths.length > 0 && (
                    <motion.div
                      className="mt-6 bg-black/20 rounded-xl p-4 border border-orange-400/20 backdrop-blur-sm"
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.3 }}
                    >
                      <h3 className="text-lg font-semibold text-orange-300 mb-3 flex items-center gap-2">
                        <span className="w-2 h-2 bg-orange-400 rounded-full"></span>
                        Alternative Paths
                      </h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {resultData.alternative_paths.map((path, index) => (
                          <motion.div
                            key={path.id}
                            className={`p-3 rounded-lg transition-all duration-300 ${path.id === resultData.recommended_path_id
                                ? 'border-2 border-green-400 bg-gradient-to-br from-green-900/30 to-green-800/20'
                                : 'border border-purple-400/30 bg-gradient-to-br from-purple-900/20 to-indigo-900/20'
                              }`}
                            whileHover={{ scale: 1.05, y: -2 }}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.1 }}
                          >
                            <div className="flex items-center gap-2 mb-2">
                              <span className="text-sm font-medium text-orange-300">
                                Path {path.id}
                              </span>
                              {path.id === resultData.recommended_path_id && (
                                <span className="text-xs bg-gradient-to-r from-green-500 to-green-400 text-white px-2 py-1 rounded-full">
                                  ✓ Recommended
                                </span>
                              )}
                            </div>
                            <p className="text-sm text-purple-100/70 leading-relaxed">
                              {path.description}
                            </p>
                          </motion.div>
                        ))}
                      </div>
                    </motion.div>
                  )}
                </div>
              ) : (
                <div className="text-center">
                  <h2 className="text-2xl font-bold text-purple-300 mb-4">
                    No Result Data Available
                  </h2>
                  <p className="text-purple-100/80 text-lg mb-6">
                    It looks like there was an issue retrieving your analysis results.
                  </p>
                  <button
                    onClick={handleRetry}
                    className="px-6 py-3 bg-gradient-to-r from-purple-500 to-purple-600 rounded-xl text-white font-semibold hover:from-purple-400 hover:to-purple-500 transition-all duration-300 transform hover:scale-105"
                  >
                    Try Again
                  </button>
                </div>
              )}
            </div>
          </motion.div>
        </div>
      </div>


    </div>
  )
}

export default ResultCot