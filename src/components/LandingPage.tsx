import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { Brain, Compass, Rocket, ChevronRight, Linkedin, Mail, PlayCircle, Map, Lightbulb, Target, Zap } from 'lucide-react'
import { motion } from 'framer-motion'
import { useUser } from '../context/UserContext'
import QuantumLandingPage from './ui/quantum-landing-page'
import SignInPromptModal from './SignInPromptModal'

const LandingPage = () => {
  const { user, signInWithGoogle } = useUser()
  const [showSignInModal, setShowSignInModal] = useState(false)

  // Fixed modal logic - prevents rendering conflicts
  useEffect(() => {
    const timer = setTimeout(() => {
      const hasBeenDismissed = localStorage.getItem('neuraq-signin-modal-dismissed')

      if (!user && !hasBeenDismissed) {
        setShowSignInModal(true)
      } else {
        setShowSignInModal(false) // Explicitly set to false for signed-in users
      }
    }, 1500)

    return () => clearTimeout(timer)
  }, [user])

  const handleCloseModal = () => {
    setShowSignInModal(false)
    localStorage.setItem('neuraq-signin-modal-dismissed', 'true')
  }

  const handleSignInFromModal = async () => {
    setShowSignInModal(false)
    await signInWithGoogle()
  }



  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Sign-in Prompt Modal - Only render when needed */}
      {!user && (
        <SignInPromptModal
          isOpen={showSignInModal}
          onClose={handleCloseModal}
          onSignIn={handleSignInFromModal}
        />
      )}

      {/* Hero Section with Quantum Landing Page */}
      <section className="relative w-full min-h-screen flex items-start justify-center overflow-hidden">
        <div className="absolute inset-0">
          <QuantumLandingPage />
        </div>
      </section>

      {/* Consulting Engine CTA - At the Top */}
      <section className="w-full py-16 relative bg-background">
        <div className="px-6">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 1 }}
            className="rounded-3xl bg-gradient-to-br from-gray-900 to-black border border-gray-800 p-12 relative overflow-hidden text-center max-w-5xl mx-auto"
          >
            <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20"></div>
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-cyan-500 to-transparent"></div>

            <div className="relative z-10 space-y-8">
              <div className="inline-block p-3 rounded-2xl bg-cyan-900/30 border border-cyan-500/30 mb-4">
                <Brain className="w-10 h-10 text-cyan-400 animate-pulse" />
              </div>

              <h2 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-white via-cyan-100 to-gray-400 bg-clip-text text-transparent">
                🔥 Try Our New Consulting Engine
              </h2>

              <p className="text-xl text-gray-400 max-w-2xl mx-auto leading-relaxed">
                The War Room is live. Three elite AI agents—The Architect, The Destroyer, and The Arbiter—will
                ruthlessly stress-test your business strategy with real market intelligence.
              </p>

              <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
                <Link
                  to="/consulting-engine"
                  className="inline-flex items-center gap-3 px-8 py-4 bg-cyan-600 hover:bg-cyan-500 rounded-xl text-white font-bold text-lg transition-all hover:scale-105 hover:shadow-[0_0_30px_rgba(34,211,238,0.3)]"
                >
                  Launch Consulting Engine
                  <ChevronRight className="w-5 h-5" />
                </Link>
              </div>

              <div className="pt-8 flex items-center justify-center gap-8 text-sm text-gray-500 font-mono">
                <span className="flex items-center gap-2"><div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div> Live System</span>
                <span className="flex items-center gap-2"><div className="w-2 h-2 bg-cyan-500 rounded-full"></div> 100% Autonomous</span>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* What is Neura-Q Section */}
      <section id="what-is-Neura-Q" className="w-full py-16 relative bg-background">
        <div className="px-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 1 }}
              className="relative"
            >
              <div className="relative w-full h-96 rounded-2xl bg-gradient-to-br from-cyan-900/20 to-purple-900/20 backdrop-blur-sm border border-border flex items-center justify-center">
                <div className="relative">
                  <Brain className="w-32 h-32 text-cyan-400 animate-pulse" />
                  <div className="absolute inset-0 rounded-full bg-cyan-400/20 blur-xl animate-pulse" />

                  <div className="absolute top-1/2 left-1/2 w-48 h-48 -translate-x-1/2 -translate-y-1/2">
                    <div className="absolute top-0 left-1/2 w-3 h-3 bg-purple-400 rounded-full -translate-x-1/2 animate-spin" style={{ animationDuration: '8s' }} />
                    <div className="absolute bottom-0 left-1/2 w-2 h-2 bg-orange-400 rounded-full -translate-x-1/2 animate-spin" style={{ animationDuration: '6s' }} />
                    <div className="absolute left-0 top-1/2 w-2 h-2 bg-cyan-400 rounded-full -translate-y-1/2 animate-spin" style={{ animationDuration: '10s' }} />
                    <div className="absolute right-0 top-1/2 w-3 h-3 bg-green-400 rounded-full -translate-y-1/2 animate-spin" style={{ animationDuration: '7s' }} />
                  </div>
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 1 }}
              className="space-y-8"
            >
              <h2 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent flex items-center gap-3">
                <Lightbulb className="w-12 h-12 text-cyan-400" />
                What is Neura-Q?
              </h2>
              <div className="w-24 h-1 bg-gradient-to-r from-cyan-400 to-purple-400 rounded" />
              <div className="space-y-6 text-lg text-muted-foreground leading-relaxed">
                <p>
                  Neura-Q is an AI-powered decision system that helps you make smarter choices in career, life, and startups.
                  It breaks down your problem, maps out possible paths, and gives you clear, structured guidance—so you can
                  move forward with clarity and confidence.
                </p>
                <p>Whether you're:</p>
                <ul className="list-disc list-inside space-y-2 ml-4">
                  <li>Choosing between job offers</li>
                  <li>Stuck on a personal dilemma</li>
                  <li>Planning a product pivot</li>
                </ul>
                <p>Neura-Q doesn't just answer. It thinks with you.</p>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Why Neura-Q Section */}
      <section id="why-Neura-Q" className="w-full py-24 relative bg-background">
        <div className="px-6">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 1 }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-cyan-400 via-purple-400 to-orange-400 bg-clip-text text-transparent flex items-center justify-center gap-3">
              <Rocket className="w-12 h-12 text-orange-400" />
              Why Neura-Q?
            </h2>
            <p className="text-xl text-muted-foreground max-w-4xl mx-auto mb-8">
              Most decisions aren't binary. They're layered, emotional, strategic. Neura-Q uses AI models trained to think like
              world-class strategists. Each one breaks down your challenge in a different way—so you see the full picture before you act.
            </p>
            <div className="mb-32">
              <p className="text-xl text-muted-foreground max-w-4xl mx-auto">
                Bring your dilemma. Neura-Q shows you paths, trade-offs, and blind spots you might miss alone.
              </p>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 1 }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-cyan-400 via-purple-400 to-orange-400 bg-clip-text text-transparent flex items-center justify-center gap-3">
              <Brain className="w-12 h-12 text-purple-400" />
              Meet the Minds
            </h2>
            <p className="text-xl text-muted-foreground max-w-4xl mx-auto">
              Three specialized AIs. Three mental models. One decision clarity engine.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
            {/* Aeon Card */}
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, delay: 0.1 }}
              className="group relative"
            >
              <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-cyan-950/50 to-blue-950/50 backdrop-blur-sm border border-cyan-400/30 p-8 hover:border-cyan-400/60 transition-all duration-300 hover:shadow-2xl hover:shadow-cyan-500/20">
                <div className="absolute inset-0 bg-gradient-to-br from-cyan-400/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                <div className="relative z-10 space-y-6">
                  <div className="flex justify-center">
                    <div className="p-4 rounded-2xl bg-cyan-900/50 border border-cyan-400/30">
                      <Compass className="w-8 h-8 text-cyan-400" />
                    </div>
                  </div>

                  <div className="text-center">
                    <h3 className="text-2xl font-bold text-cyan-300 mb-2 flex items-center justify-center gap-2">
                      <Compass className="w-6 h-6" />
                      Aeon
                    </h3>
                    <p className="text-cyan-100/80 font-semibold mb-3">Strategic Thinking (Career)</p>
                    <p className="text-cyan-100/70 text-sm leading-relaxed">
                      Breaks complex decisions into key components and visualizes how they connect. Built to show you where your real leverage lies.
                    </p>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Nova Card */}
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, delay: 0.2 }}
              className="group relative"
            >
              <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-purple-950/50 to-indigo-950/50 backdrop-blur-sm border border-purple-400/30 p-8 hover:border-purple-400/60 transition-all duration-300 hover:shadow-2xl hover:shadow-purple-500/20">
                <div className="absolute inset-0 bg-gradient-to-br from-purple-400/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                <div className="relative z-10 space-y-6">
                  <div className="flex justify-center">
                    <div className="p-4 rounded-2xl bg-purple-900/50 border border-purple-400/30">
                      <Brain className="w-8 h-8 text-purple-400" />
                    </div>
                  </div>

                  <div className="text-center">
                    <h3 className="text-2xl font-bold text-purple-300 mb-2 flex items-center justify-center gap-2">
                      <Brain className="w-6 h-6" />
                      Nova
                    </h3>
                    <p className="text-purple-100/80 font-semibold mb-3">Consequence Mapping (Life)</p>
                    <p className="text-purple-100/70 text-sm leading-relaxed">
                      Traces the ripple effects of your decisions — both near and distant — through a lens of introspection, honesty, and thoughtful insight.
                    </p>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Tess Card */}
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, delay: 0.3 }}
              className="group relative"
            >
              <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-orange-950/50 to-red-950/50 backdrop-blur-sm border border-orange-400/30 p-8 hover:border-orange-400/60 transition-all duration-300 hover:shadow-2xl hover:shadow-orange-500/20">
                <div className="absolute inset-0 bg-gradient-to-br from-orange-400/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                <div className="relative z-10 space-y-6">
                  <div className="flex justify-center">
                    <div className="p-4 rounded-2xl bg-orange-900/50 border border-orange-400/30">
                      <Rocket className="w-8 h-8 text-orange-400" />
                    </div>
                  </div>

                  <div className="text-center">
                    <h3 className="text-2xl font-bold text-orange-300 mb-2 flex items-center justify-center gap-2">
                      <Rocket className="w-6 h-6" />
                      Tess
                    </h3>
                    <p className="text-orange-100/80 font-semibold mb-3">Scenario Exploration (Startups)</p>
                    <p className="text-orange-100/70 text-sm leading-relaxed">
                      Pushes boundaries, challenges assumptions, and surfaces edge cases. Perfect for founders, creatives, and product thinkers.
                    </p>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section id="how-it-works" className="w-full py-16 relative bg-background">
        <div className="px-6">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.4 }}
            className="text-center space-y-6"
          >
            <h2 className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-cyan-400 via-purple-400 to-orange-400 bg-clip-text text-transparent flex items-center justify-center gap-3">
              <Map className="w-12 h-12 text-purple-400" />
              How It Works
            </h2>
            <div className="space-y-8 text-lg text-muted-foreground max-w-4xl mx-auto leading-relaxed">
              <div className="space-y-2">
                <div className="flex items-center justify-center gap-2 mb-2">
                  <Target className="w-5 h-5 text-cyan-400" />
                  <strong className="text-cyan-400 text-xl">1. Input Your Dilemma</strong>
                </div>
                <p className="text-base">Career, life, or startup—just type it in.</p>
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-center gap-2 mb-2">
                  <Map className="w-5 h-5 text-purple-400" />
                  <strong className="text-purple-400 text-xl">2. See the Map</strong>
                </div>
                <p className="text-base">Neura-Q generates a visual breakdown: paths, outcomes, hidden logic.</p>
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-center gap-2 mb-2">
                  <Zap className="w-5 h-5 text-orange-400" />
                  <strong className="text-orange-400 text-xl">3. Pick Your Move</strong>
                </div>
                <p className="text-base">Get clarity, choose with confidence, and move forward strategically.</p>
              </div>
            </div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, delay: 0.6 }}
              className="pt-6"
            >
              <a
                href="https://youtu.be/YVdABaTFi84?si=11LLRKYz-l7wEIbc"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-red-600 via-red-500 to-pink-500 rounded-xl text-lg font-semibold hover:from-red-500 hover:via-red-400 hover:to-pink-400 transition-all duration-300 shadow-2xl hover:shadow-red-500/25 hover:scale-105 text-white group"
              >
                <PlayCircle className="w-6 h-6 group-hover:scale-110 transition-transform duration-300" />
                Watch Demo - See Neura-Q in Action
              </a>
              <p className="text-sm text-muted-foreground mt-3 opacity-70">
                3-minute walkthrough of how our AI agents work
              </p>
            </motion.div>
          </motion.div>
        </div>
      </section>



      {/* CTA Section */}
      <section className="w-full py-24 relative bg-background">
        <div className="px-6">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.4 }}
            className="text-center space-y-8"
          >
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Ready to transform your decision-making?
            </p>
            <Link
              to="/choose-ai"
              className="inline-flex items-center gap-3 px-12 py-4 bg-gradient-to-r from-cyan-500 via-purple-500 to-orange-500 rounded-xl text-lg font-semibold hover:from-cyan-400 hover:via-purple-400 hover:to-orange-400 transition-all duration-300 shadow-2xl hover:shadow-purple-500/25 hover:scale-105 text-white"
            >
              Ready to think better?
              <ChevronRight className="w-5 h-5" />
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer id="contact" className="w-full py-16 border-t border-border bg-background/50 backdrop-blur-sm">
        <div className="px-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-8">
            <div className="flex items-center gap-2">
              <Brain className="h-8 w-8 text-cyan-400" />
              <span className="text-2xl font-bold bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent">
                Neura-Q
              </span>
            </div>

            <div className="flex items-center gap-6">
              <a
                href="https://www.linkedin.com/in/devansh-khanna-618606178/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-muted-foreground hover:text-cyan-400 transition-colors duration-300"
              >
                <Linkedin className="w-5 h-5" />
              </a>
              <a
                href="https://www.linkedin.com/in/ramneek-kour-b5b123320/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-muted-foreground hover:text-cyan-400 transition-colors duration-300"
              >
                <Linkedin className="w-5 h-5" />
              </a>
              <a
                href="mailto:devansh.khanna88@gmail.com"
                className="text-muted-foreground hover:text-cyan-400 transition-colors duration-300"
              >
                <Mail className="w-5 h-5" />
              </a>
            </div>
          </div>

          <div className="mt-8 pt-8 border-t border-border text-center text-muted-foreground text-sm max-w-4xl mx-auto">
            <div className="space-y-4">
              <div className="flex justify-center items-center gap-6">
                <Link
                  to="/privacy"
                  className="text-muted-foreground hover:text-cyan-400 transition-colors duration-300 text-sm"
                >
                  Privacy Policy
                </Link>
                <span className="text-muted-foreground">•</span>
                <Link
                  to="/terms"
                  className="text-muted-foreground hover:text-cyan-400 transition-colors duration-300 text-sm"
                >
                  Terms of Service
                </Link>
              </div>
              <p>© 2024 Neura-Q. Neural interfaces powered by quantum consciousness algorithms.</p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}

export default LandingPage
