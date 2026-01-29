import { useState } from 'react'
import { BrowserRouter as Router, Routes, Route, useNavigate, useLocation } from 'react-router-dom'
import { ThemeProvider } from 'next-themes'
import { UserProvider, useUser } from './context/UserContext'
import { Brain, LogIn, LogOut, Menu, X } from 'lucide-react'
import { Link } from 'react-router-dom'
import LandingPage from './components/LandingPage'
import ChooseYourAI from './components/ui/choose-your-ai'
import DilemmaForm from './components/DilemmaForm'
import ResultTot from './components/ResultTot'
import ResultGot from './components/ResultGot'
import ResultCot from './components/ResultCot'
import { Toaster } from 'sonner'
import ConsultingEngine from './components/ConsultingEngine'
import PrivacyPolicy from './pages/PrivacyPolicy'
import TermsOfService from './pages/TermsOfService'
import './App.css'

function App() {
  return (
    <ThemeProvider attribute="class" defaultTheme="dark" enableSystem>
      <UserProvider>
        <Router>
          <AppContent />
        </Router>
      </UserProvider>
    </ThemeProvider>
  )
}

function AppContent() {
  const { user, loading, signInWithGoogle, signOut } = useUser()
  const navigate = useNavigate()
  const location = useLocation()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  const scrollToSection = (sectionId: string) => {
    // If we're already on the landing page, just scroll
    if (location.pathname === '/') {
      const element = document.getElementById(sectionId)
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' })
      }
    } else {
      // If we're on a different page, navigate to home first, then scroll
      navigate('/')
      // Use setTimeout to ensure the page has loaded before scrolling
      setTimeout(() => {
        const element = document.getElementById(sectionId)
        if (element) {
          element.scrollIntoView({ behavior: 'smooth' })
        }
      }, 100)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center text-white">
        <p>Loading user session...</p>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background text-foreground">
      <header className="fixed top-0 left-0 w-full h-[80px] bg-black/80 backdrop-blur-sm border-b border-white/10 z-50 neural-bg relative overflow-hidden">
        {/* Electronic Wave Animation Background */}
        <div className="absolute inset-0 overflow-hidden">
          {/* Animated Circuit Lines */}
          <div className="absolute inset-0 opacity-20">
            <svg className="w-full h-full" viewBox="0 0 1200 80" preserveAspectRatio="none">
              {/* Horizontal flowing lines */}
              <path
                d="M0,40 Q300,20 600,40 T1200,40"
                stroke="url(#waveGradient1)"
                strokeWidth="1"
                fill="none"
                className="animate-pulse"
              >
                <animate
                  attributeName="d"
                  values="M0,40 Q300,20 600,40 T1200,40;M0,40 Q300,60 600,40 T1200,40;M0,40 Q300,20 600,40 T1200,40"
                  dur="4s"
                  repeatCount="indefinite"
                />
              </path>
              <path
                d="M0,20 Q400,40 800,20 T1200,20"
                stroke="url(#waveGradient2)"
                strokeWidth="1"
                fill="none"
                className="animate-pulse"
                style={{ animationDelay: '1s' }}
              >
                <animate
                  attributeName="d"
                  values="M0,20 Q400,40 800,20 T1200,20;M0,20 Q400,0 800,20 T1200,20;M0,20 Q400,40 800,20 T1200,20"
                  dur="3s"
                  repeatCount="indefinite"
                />
              </path>
              <path
                d="M0,60 Q200,40 400,60 T1200,60"
                stroke="url(#waveGradient3)"
                strokeWidth="1"
                fill="none"
                className="animate-pulse"
                style={{ animationDelay: '2s' }}
              >
                <animate
                  attributeName="d"
                  values="M0,60 Q200,40 400,60 T1200,60;M0,60 Q200,80 400,60 T1200,60;M0,60 Q200,40 400,60 T1200,60"
                  dur="5s"
                  repeatCount="indefinite"
                />
              </path>

              {/* Gradient definitions */}
              <defs>
                <linearGradient id="waveGradient1" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="#22d3ee" stopOpacity="0">
                    <animate attributeName="stop-opacity" values="0;0.8;0" dur="3s" repeatCount="indefinite" />
                  </stop>
                  <stop offset="50%" stopColor="#22d3ee" stopOpacity="0.8">
                    <animate attributeName="stop-opacity" values="0.8;0.3;0.8" dur="3s" repeatCount="indefinite" />
                  </stop>
                  <stop offset="100%" stopColor="#a855f7" stopOpacity="0">
                    <animate attributeName="stop-opacity" values="0;0.6;0" dur="3s" repeatCount="indefinite" />
                  </stop>
                </linearGradient>
                <linearGradient id="waveGradient2" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="#a855f7" stopOpacity="0">
                    <animate attributeName="stop-opacity" values="0;0.6;0" dur="4s" repeatCount="indefinite" />
                  </stop>
                  <stop offset="50%" stopColor="#f59e0b" stopOpacity="0.6">
                    <animate attributeName="stop-opacity" values="0.6;0.2;0.6" dur="4s" repeatCount="indefinite" />
                  </stop>
                  <stop offset="100%" stopColor="#22d3ee" stopOpacity="0">
                    <animate attributeName="stop-opacity" values="0;0.8;0" dur="4s" repeatCount="indefinite" />
                  </stop>
                </linearGradient>
                <linearGradient id="waveGradient3" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="#f59e0b" stopOpacity="0">
                    <animate attributeName="stop-opacity" values="0;0.7;0" dur="5s" repeatCount="indefinite" />
                  </stop>
                  <stop offset="50%" stopColor="#22d3ee" stopOpacity="0.7">
                    <animate attributeName="stop-opacity" values="0.7;0.2;0.7" dur="5s" repeatCount="indefinite" />
                  </stop>
                  <stop offset="100%" stopColor="#a855f7" stopOpacity="0">
                    <animate attributeName="stop-opacity" values="0;0.5;0" dur="5s" repeatCount="indefinite" />
                  </stop>
                </linearGradient>
              </defs>
            </svg>
          </div>

          {/* Floating Data Particles */}
          <div className="absolute inset-0">
            {[...Array(12)].map((_, i) => (
              <div
                key={i}
                className="absolute w-1 h-1 bg-cyan-400 rounded-full opacity-60"
                style={{
                  left: `${Math.random() * 100}%`,
                  top: `${Math.random() * 100}%`,
                  animation: `float ${3 + Math.random() * 4}s ease-in-out infinite`,
                  animationDelay: `${Math.random() * 2}s`
                }}
              />
            ))}
          </div>

          {/* Scanning Line Effect */}
          <div className="absolute inset-0">
            <div
              className="absolute h-full w-1 bg-gradient-to-b from-transparent via-cyan-400 to-transparent opacity-30"
              style={{
                animation: 'scan 6s linear infinite',
                left: '0%'
              }}
            />
          </div>
        </div>

        <div className="h-full max-w-7xl mx-auto flex items-center justify-between px-6 relative z-10">
          {/* Left Side - Neura-Q Logo */}
          <Link
            to="/"
            className="flex items-center gap-2 hover:opacity-80 transition-opacity duration-300"
          >
            <Brain className="h-8 w-8 text-cyan-400 animate-pulse" />
            <span className="text-2xl font-bold bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent">
              Neura-Q
            </span>
          </Link>

          {/* Center - Navigation Links */}
          <nav className="hidden md:flex items-center gap-8">
            <Link
              to="/"
              className="text-cyan-300 hover:text-cyan-200 transition-all duration-300 font-medium relative group"
            >
              Home
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-cyan-400 to-purple-400 group-hover:w-full transition-all duration-300"></span>
            </Link>
            <button
              onClick={(e) => {
                e.preventDefault()
                scrollToSection('why-Neura-Q')
              }}
              className="text-cyan-300 hover:text-cyan-200 transition-all duration-300 font-medium relative group cursor-pointer"
            >
              Why Neura-Q
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-cyan-400 to-purple-400 group-hover:w-full transition-all duration-300"></span>
            </button>
            <button
              onClick={(e) => {
                e.preventDefault()
                scrollToSection('how-it-works')
              }}
              className="text-cyan-300 hover:text-cyan-200 transition-all duration-300 font-medium relative group cursor-pointer"
            >
              How It Works
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-cyan-400 to-purple-400 group-hover:w-full transition-all duration-300"></span>
            </button>
            {/* Data Analysis - Only show for authenticated users */}
          </nav>

          {/* Right Side - Account Button & Mobile Menu Button */}
          <div className="flex items-center gap-4">
            {/* Account Button */}
            <button
              onClick={user ? signOut : signInWithGoogle}
              className="flex items-center gap-2 px-4 py-2 rounded-lg bg-gradient-to-r from-cyan-500/20 to-purple-500/20 border border-cyan-400/30 text-cyan-300 hover:from-cyan-500/30 hover:to-purple-500/30 hover:border-cyan-400/50 transition-all duration-300 hover:scale-105"
            >
              {user ? (
                <>
                  <LogOut className="w-4 h-4" />
                  <span className="text-sm font-medium">Sign Out</span>
                </>
              ) : (
                <>
                  <LogIn className="w-4 h-4" />
                  <span className="text-sm font-medium">Sign In</span>
                </>
              )}
            </button>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden flex items-center p-2 text-cyan-300 hover:text-cyan-200 transition-colors duration-300"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation Menu - NOW FUNCTIONAL */}
        <div className={`md:hidden absolute top-full left-0 w-full bg-black/90 backdrop-blur-sm border-b border-white/10 transition-all duration-300 ${mobileMenuOpen ? 'block' : 'hidden'
          }`}>
          <div className="flex flex-col p-4 space-y-4">
            <Link
              to="/"
              className="text-cyan-300 hover:text-cyan-200 transition-colors duration-300 font-medium"
              onClick={() => setMobileMenuOpen(false)}
            >
              Home
            </Link>
            <button
              onClick={(e) => {
                e.preventDefault()
                scrollToSection('why-Neura-Q')
                setMobileMenuOpen(false)
              }}
              className="text-cyan-300 hover:text-cyan-200 transition-colors duration-300 font-medium cursor-pointer text-left"
            >
              Why Neura-Q
            </button>
            <button
              onClick={(e) => {
                e.preventDefault()
                scrollToSection('how-it-works')
                setMobileMenuOpen(false)
              }}
              className="text-cyan-300 hover:text-cyan-200 transition-colors duration-300 font-medium cursor-pointer text-left"
            >
              How It Works
            </button>
            {/* Mobile Data Analysis - Only show for authenticated users */}
          </div>
        </div>
      </header>

      <main className="pt-[25px]">
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/choose-ai" element={<ChooseYourAI />} />
          <Route path="/dilemma/:aiType" element={<DilemmaForm />} />
          <Route path="/result-tot" element={<ResultTot />} />
          <Route path="/result-got" element={<ResultGot />} />
          <Route path="/result-cot" element={<ResultCot />} />
          <Route path="/consulting-engine" element={<ConsultingEngine />} />
          <Route path="/privacy" element={<PrivacyPolicy />} />
          <Route path="/terms" element={<TermsOfService />} />
        </Routes>
        <Toaster position="top-right" theme="dark" />
      </main>
    </div>
  )
}

export default App
