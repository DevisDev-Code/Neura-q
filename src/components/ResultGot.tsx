import { useLocation, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Rocket, ArrowLeft, Target, TrendingUp, BarChart3, AlertCircle, Eye, CheckCircle, XCircle, Zap, Shield } from 'lucide-react'
import { useEffect, useState } from 'react'
import TessGraphVisualization from './TessGraphVisualization'

interface Node {
  id: string
  label: string
  score: number
  color: string
  reasoning?: string
}

interface Edge {
  source: string
  target: string
  label?: string
}

interface ResultData {
  result: {
    nodes: Node[]
    edges: Edge[]
    recommendedPath: string[]
    successAlignment?: string
    pathSummary?: string
    realitySnapshot?: string
    pros?: string[]
    cons?: string[]
    strategicImplication?: string
    riskAssessment?: string
  }
  meta?: {
    successMetrics?: string
    totalNodes?: number
    totalEdges?: number
    highScoreNodes?: number
    recommendedPathLength?: number
  }
}

const ResultGot = () => {
  const location = useLocation()
  const navigate = useNavigate()
  const [resultData, setResultData] = useState<ResultData | null>(null)
  const [selectedNode, setSelectedNode] = useState<Node | null>(null)
  const [showRecommendedOnly, setShowRecommendedOnly] = useState(false)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    try {
      // Access the data passed from navigation
      const data = location.state?.resultData
      console.log('ResultGot received data:', data)
      
      if (data) {
        // Check if the data has a nested 'result' property
        const actualResult = data.result || data
        console.log('Actual result data:', actualResult)
        
        // Validate the data structure
        if (typeof actualResult === 'object' && actualResult !== null) {
          // Ensure all required arrays exist - updated to use edges instead of links
          const validatedData: ResultData = {
            result: {
              nodes: Array.isArray(actualResult.nodes) ? actualResult.nodes : [],
              edges: Array.isArray(actualResult.edges) ? actualResult.edges : [],
              recommendedPath: Array.isArray(actualResult.recommendedPath) ? actualResult.recommendedPath : [],
              successAlignment: actualResult.successAlignment || 'No success alignment provided',
              pathSummary: actualResult.pathSummary || 'No path summary provided',
              realitySnapshot: actualResult.realitySnapshot || '',
              pros: Array.isArray(actualResult.pros) ? actualResult.pros : [],
              cons: Array.isArray(actualResult.cons) ? actualResult.cons : [],
              strategicImplication: actualResult.strategicImplication || '',
              riskAssessment: actualResult.riskAssessment || ''
            },
            meta: {
              successMetrics: location.state?.inputData?.successMetrics || data.meta?.successMetrics || 'No success metrics provided',
              totalNodes: data.meta?.totalNodes || actualResult.nodes?.length || 0,
              totalEdges: data.meta?.totalEdges || actualResult.edges?.length || 0,
              highScoreNodes: data.meta?.highScoreNodes || actualResult.nodes?.filter((n: Node) => n.score >= 0.8).length || 0,
              recommendedPathLength: data.meta?.recommendedPathLength || actualResult.recommendedPath?.length || 0
            }
          }
          
          console.log('Validated data:', validatedData)
          setResultData(validatedData)
        } else {
          setError('Invalid data format received')
        }
      } else {
        console.warn('No result data found in location state')
        setError('No result data available')
      }
    } catch (err) {
      console.error('Error processing result data:', err)
      setError('Error processing result data')
    }
    
    setLoading(false)
  }, [location.state])

  const handleNodeSelect = (node: Node) => {
    setSelectedNode(node)
  }

  const handleRetry = () => {
    navigate('/choose-ai')
  }

  const getScoreColor = (score: number) => {
    if (score >= 0.8) return 'text-green-400'
    if (score >= 0.6) return 'text-yellow-400'
    return 'text-red-400'
  }

  const getScoreEmoji = (score: number) => {
    if (score >= 0.8) return '🟢'
    if (score >= 0.6) return '🟡'
    return '🔴'
  }

  return (
    <div className="w-full min-h-screen bg-black relative overflow-hidden">
      {/* Enhanced Background Effects */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-gradient-to-br from-gray-900 via-black to-gray-900" />
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0" style={{
            backgroundImage: 'linear-gradient(rgba(251,146,60,0.3) 1px, transparent 1px), linear-gradient(90deg, rgba(251,146,60,0.3) 1px, transparent 1px)',
            backgroundSize: '60px 60px'
          }} />
        </div>
        {/* Animated gradient orbs */}
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-orange-500/20 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-red-500/15 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
        <div className="absolute top-3/4 left-1/2 w-64 h-64 bg-yellow-500/10 rounded-full blur-2xl animate-pulse" style={{ animationDelay: '2s' }} />
      </div>

      {/* Content */}
      <div className="relative z-10 min-h-screen flex flex-col">
        {/* Enhanced Header */}
        <div className="p-6">
          <button
            onClick={() => navigate('/choose-ai')}
            className="flex items-center gap-2 text-orange-300 hover:text-orange-200 transition-all duration-300 hover:translate-x-1"
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
                className="p-4 rounded-2xl bg-gradient-to-br from-orange-950/90 to-red-950/90 border border-orange-400/30 backdrop-blur-sm shadow-2xl"
                animate={{ 
                  boxShadow: [
                    '0 0 30px rgba(251, 146, 60, 0.3)',
                    '0 0 50px rgba(251, 146, 60, 0.5)',
                    '0 0 30px rgba(251, 146, 60, 0.3)'
                  ]
                }}
                transition={{ duration: 3, repeat: Infinity }}
              >
                <Rocket className="w-8 h-8 text-orange-300" />
              </motion.div>
              <div>
                <h1 className="text-4xl font-bold bg-gradient-to-r from-orange-300 to-red-300 bg-clip-text text-transparent">
                  🚀 Tess Results
                </h1>
                <p className="text-orange-100/80 mt-2">Success-Driven Analysis Complete</p>
              </div>
            </div>

            {loading ? (
              <div className="text-center">
                <h2 className="text-2xl font-bold text-orange-300 mb-6">
                  Loading Success Insights...
                </h2>
                <div className="flex items-center justify-center space-x-2">
                  {[...Array(3)].map((_, i) => (
                    <motion.div
                      key={i}
                      className="h-4 w-4 rounded-full bg-gradient-to-r from-orange-400 to-red-400"
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
                <p className="text-orange-100/80 text-lg mb-6">
                  {error}
                </p>
                <button
                  onClick={handleRetry}
                  className="px-6 py-3 bg-gradient-to-r from-orange-500 to-orange-600 rounded-xl text-white font-semibold hover:from-orange-400 hover:to-orange-500 transition-all duration-300 transform hover:scale-105"
                >
                  Try Again
                </button>
              </div>
            ) : resultData ? (
              <div className="space-y-8">
                {/* Success Metrics */}
                {resultData.meta?.successMetrics && (
                  <div className="bg-gradient-to-br from-orange-950/90 to-red-950/90 border border-orange-400/30 rounded-xl p-6 backdrop-blur-sm">
                    <div className="flex items-center justify-center gap-2 mb-3">
                      <Target className="w-6 h-6 text-orange-300" />
                      <h3 className="text-lg font-semibold text-orange-300">Your Success Metrics</h3>
                    </div>
                    <p className="text-orange-100/80 italic leading-relaxed text-center">
                      "{resultData.meta.successMetrics}"
                    </p>
                  </div>
                )}

                {/* Stats Cards - Updated with totalEdges */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
                  <motion.div 
                    className="bg-gradient-to-br from-orange-950/90 to-red-950/90 border border-green-400/30 rounded-lg p-4 backdrop-blur-sm"
                    whileHover={{ scale: 1.02, borderColor: 'rgba(34, 197, 94, 0.4)' }}
                    transition={{ duration: 0.2 }}
                  >
                    <div className="flex items-center justify-center gap-2 mb-2">
                      <TrendingUp className="w-5 h-5 text-green-400" />
                      <span className="text-2xl font-bold text-green-400">{resultData.meta?.highScoreNodes || 0}</span>
                    </div>
                    <p className="text-sm text-orange-100/70 text-center">High Score Options</p>
                  </motion.div>
                  
                  <motion.div 
                    className="bg-gradient-to-br from-orange-950/90 to-red-950/90 border border-orange-400/30 rounded-lg p-4 backdrop-blur-sm"
                    whileHover={{ scale: 1.02, borderColor: 'rgba(251, 146, 60, 0.4)' }}
                    transition={{ duration: 0.2 }}
                  >
                    <div className="flex items-center justify-center gap-2 mb-2">
                      <Target className="w-5 h-5 text-orange-400" />
                      <span className="text-2xl font-bold text-orange-400">{resultData.meta?.recommendedPathLength || 0}</span>
                    </div>
                    <p className="text-sm text-orange-100/70 text-center">Recommended Steps</p>
                  </motion.div>
                  
                  <motion.div 
                    className="bg-gradient-to-br from-orange-950/90 to-red-950/90 border border-red-400/30 rounded-lg p-4 backdrop-blur-sm"
                    whileHover={{ scale: 1.02, borderColor: 'rgba(239, 68, 68, 0.4)' }}
                    transition={{ duration: 0.2 }}
                  >
                    <div className="flex items-center justify-center gap-2 mb-2">
                      <BarChart3 className="w-5 h-5 text-red-400" />
                      <span className="text-2xl font-bold text-red-400">{resultData.meta?.totalNodes || 0}</span>
                    </div>
                    <p className="text-sm text-orange-100/70 text-center">Total Options</p>
                  </motion.div>

                  <motion.div 
                    className="bg-gradient-to-br from-orange-950/90 to-red-950/90 border border-purple-400/30 rounded-lg p-4 backdrop-blur-sm"
                    whileHover={{ scale: 1.02, borderColor: 'rgba(168, 85, 247, 0.4)' }}
                    transition={{ duration: 0.2 }}
                  >
                    <div className="flex items-center justify-center gap-2 mb-2">
                      <Zap className="w-5 h-5 text-purple-400" />
                      <span className="text-2xl font-bold text-purple-400">{resultData.meta?.totalEdges || 0}</span>
                    </div>
                    <p className="text-sm text-orange-100/70 text-center">Total Connections</p>
                  </motion.div>
                </div>

                {/* Controls */}
                <div className="flex justify-center gap-4 mb-8">
                  <button
                    onClick={() => setShowRecommendedOnly(!showRecommendedOnly)}
                    className={`px-6 py-3 rounded-lg font-medium transition-all transform hover:scale-105 ${
                      showRecommendedOnly 
                        ? 'bg-orange-600 text-white shadow-lg' 
                        : 'bg-orange-950/50 text-orange-300 border-2 border-orange-400/30 hover:border-orange-400/60'
                    }`}
                  >
                    {showRecommendedOnly ? '🎯 Optimal Path View' : '📊 Show All Options'}
                  </button>
                </div>

                {/* Main Content Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 min-w-0">
                  
                  {/* Graph Visualization */}
                  <div className="lg:col-span-3 min-w-0">
                    <div className="bg-gradient-to-br from-orange-950/90 to-red-950/90 border border-orange-400/30 rounded-xl p-6 backdrop-blur-sm w-full overflow-hidden">
                      <h2 className="text-xl font-semibold text-orange-300 mb-4">Interactive Decision Graph</h2>
                      <TessGraphVisualization 
                        data={resultData}
                        onNodeSelect={handleNodeSelect}
                        selectedNode={selectedNode}
                        showRecommendedOnly={showRecommendedOnly}
                      />
                    </div>
                  </div>

                  {/* Node Details Panel */}
                  <div className="lg:col-span-1 min-w-0">
                    <div className="bg-gradient-to-br from-orange-950/90 to-red-950/90 border border-orange-400/30 rounded-xl p-6 backdrop-blur-sm sticky top-8">
                      <h3 className="text-lg font-semibold text-orange-300 mb-4 flex items-center gap-2">
                        📋 Node Details
                      </h3>
                      
                      {selectedNode ? (
                        <div className="space-y-4">
                          {/* Node Header with proper layout - emoji left, label center, percentage right */}
                          <div className="flex items-center gap-3 p-3 bg-black/20 rounded-lg border border-orange-400/20">
                            {/* Left side - Score emoji */}
                            <div className="flex items-center justify-center">
                              <span className="text-lg">{getScoreEmoji(selectedNode.score)}</span>
                            </div>
                            
                            {/* Center - Node ID */}
                            <div className="flex-1 flex items-center justify-center">
                              <div className="w-8 h-8 bg-orange-600 text-white rounded-full flex items-center justify-center font-bold text-sm">
                                {selectedNode.id}
                              </div>
                            </div>
                            
                            {/* Right side - Percentage score */}
                            <div className="flex items-center justify-center">
                              <span className={`font-bold ${getScoreColor(selectedNode.score)}`}>
                                {Math.round(selectedNode.score * 100)}%
                              </span>
                            </div>
                          </div>

                          {/* Node Label - Centered */}
                          <div>
                            <h4 className="font-semibold text-orange-300 mb-2 text-center">Option</h4>
                            <p className="text-sm text-orange-100/80 leading-relaxed text-center">
                              {selectedNode.label}
                            </p>
                          </div>

                          {/* Node Reasoning */}
                          {selectedNode.reasoning && (
                            <div>
                              <h4 className="font-semibold text-orange-300 mb-2">Analysis</h4>
                              <p className="text-sm text-orange-100/80 leading-relaxed">
                                {selectedNode.reasoning}
                              </p>
                            </div>
                          )}

                          {/* Recommended Badge */}
                          {resultData.result.recommendedPath.includes(selectedNode.id) && (
                            <div className="bg-gradient-to-r from-green-950/50 to-green-800/30 border border-green-400/30 rounded-lg p-3">
                              <div className="flex items-center gap-2 text-green-300">
                                <span className="text-lg">⭐</span>
                                <span className="font-medium">Recommended Path</span>
                              </div>
                              <p className="text-xs text-green-200/80 mt-1">
                                This option is part of your optimal success strategy
                              </p>
                            </div>
                          )}

                          {/* Score Breakdown */}
                          <div>
                            <h4 className="font-semibold text-orange-300 mb-2">Score Breakdown</h4>
                            <div className="w-full bg-black/30 rounded-full h-2 mb-2">
                              <div 
                                className={`h-2 rounded-full ${
                                  selectedNode.score >= 0.8 ? 'bg-green-500' :
                                  selectedNode.score >= 0.6 ? 'bg-yellow-500' : 'bg-red-500'
                                }`}
                                style={{ width: `${selectedNode.score * 100}%` }}
                              ></div>
                            </div>
                            <p className="text-xs text-orange-100/60">
                              Success alignment: {Math.round(selectedNode.score * 100)}%
                            </p>
                          </div>
                        </div>
                      ) : (
                        <div className="text-center py-12">
                          <div className="text-6xl mb-4">🎯</div>
                          <p className="text-orange-100/70 mb-2">Click on any node in the graph</p>
                          <p className="text-sm text-orange-100/50">to view detailed analysis</p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* NEW: Reality Snapshot Section */}
                {resultData.result.realitySnapshot && (
                  <div className="bg-gradient-to-r from-red-950/50 to-orange-950/50 border border-red-400/30 rounded-xl p-6 backdrop-blur-sm">
                    <h3 className="text-xl font-bold text-red-300 mb-4 flex items-center gap-2">
                      <Eye className="w-6 h-6" />
                      🔍 Reality Snapshot
                    </h3>
                    <p className="text-red-100/80 leading-relaxed">
                      {resultData.result.realitySnapshot}
                    </p>
                  </div>
                )}

                {/* NEW: Pros and Cons Section */}
                {(resultData.result.pros && resultData.result.pros.length > 0) || 
                 (resultData.result.cons && resultData.result.cons.length > 0) && (
                  <div className="grid md:grid-cols-2 gap-6">
                    {/* Pros */}
                    {resultData.result.pros && resultData.result.pros.length > 0 && (
                      <div className="bg-gradient-to-br from-green-950/50 to-emerald-950/50 border border-green-400/30 rounded-xl p-6 backdrop-blur-sm">
                        <h3 className="text-xl font-bold text-green-300 mb-4 flex items-center gap-2">
                          <CheckCircle className="w-6 h-6" />
                          ✅ Advantages
                        </h3>
                        <ul className="space-y-3">
                          {resultData.result.pros.map((pro, index) => (
                            <li key={index} className="flex items-start gap-3">
                              <span className="text-green-400 mt-1">•</span>
                              <span className="text-green-100/80 leading-relaxed">{pro}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}

                    {/* Cons */}
                    {resultData.result.cons && resultData.result.cons.length > 0 && (
                      <div className="bg-gradient-to-br from-red-950/50 to-rose-950/50 border border-red-400/30 rounded-xl p-6 backdrop-blur-sm">
                        <h3 className="text-xl font-bold text-red-300 mb-4 flex items-center gap-2">
                          <XCircle className="w-6 h-6" />
                          ❌ Disadvantages
                        </h3>
                        <ul className="space-y-3">
                          {resultData.result.cons.map((con, index) => (
                            <li key={index} className="flex items-start gap-3">
                              <span className="text-red-400 mt-1">•</span>
                              <span className="text-red-100/80 leading-relaxed">{con}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                )}

                {/* NEW: Strategic Implication and Risk Assessment */}
                {(resultData.result.strategicImplication || resultData.result.riskAssessment) && (
                  <div className="grid md:grid-cols-2 gap-6">
                    {/* Strategic Implication */}
                    {resultData.result.strategicImplication && (
                      <div className="bg-gradient-to-br from-purple-950/50 to-indigo-950/50 border border-purple-400/30 rounded-xl p-6 backdrop-blur-sm">
                        <h3 className="text-xl font-bold text-purple-300 mb-4 flex items-center gap-2">
                          <Zap className="w-6 h-6" />
                          ⚡ Strategic Implication
                        </h3>
                        <p className="text-purple-100/80 leading-relaxed">
                          {resultData.result.strategicImplication}
                        </p>
                      </div>
                    )}

                    {/* Risk Assessment */}
                    {resultData.result.riskAssessment && (
                      <div className="bg-gradient-to-br from-yellow-950/50 to-amber-950/50 border border-yellow-400/30 rounded-xl p-6 backdrop-blur-sm">
                        <h3 className="text-xl font-bold text-yellow-300 mb-4 flex items-center gap-2">
                          <Shield className="w-6 h-6" />
                          ⚠️ Risk Assessment
                        </h3>
                        <p className="text-yellow-100/80 leading-relaxed">
                          {resultData.result.riskAssessment}
                        </p>
                      </div>
                    )}
                  </div>
                )}

                {/* Strategy Summary - Updated positioning */}
                {(resultData.result.successAlignment || resultData.result.pathSummary) && (
                  <div className="bg-gradient-to-r from-orange-950/50 to-red-950/50 border border-orange-400/30 rounded-xl p-6 backdrop-blur-sm">
                    <h3 className="text-xl font-bold text-orange-300 mb-4 flex items-center gap-2">
                      🎯 Your Success Strategy
                    </h3>
                    <div className="grid md:grid-cols-2 gap-6">
                      {resultData.result.successAlignment && (
                        <div>
                          <h4 className="font-semibold text-orange-200 mb-3 flex items-center gap-2">
                            🎪 Strategic Alignment
                          </h4>
                          <p className="text-orange-100/80 leading-relaxed">
                            {resultData.result.successAlignment}
                          </p>
                        </div>
                      )}
                      {resultData.result.pathSummary && (
                        <div>
                          <h4 className="font-semibold text-orange-200 mb-3 flex items-center gap-2">
                            📈 Path Summary
                          </h4>
                          <p className="text-orange-100/80 leading-relaxed">
                            {resultData.result.pathSummary}
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="text-center">
                <h2 className="text-2xl font-bold text-orange-300 mb-4">
                  No Result Data Available
                </h2>
                <p className="text-orange-100/80 text-lg mb-6">
                  It looks like there was an issue retrieving your analysis results.
                </p>
                <button
                  onClick={handleRetry}
                  className="px-6 py-3 bg-gradient-to-r from-orange-500 to-orange-600 rounded-xl text-white font-semibold hover:from-orange-400 hover:to-orange-500 transition-all duration-300 transform hover:scale-105"
                >
                  Try Again
                </button>
              </div>
            )}
          </motion.div>
        </div>
      </div>
    </div>
  )
}

export default ResultGot