import React from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, Shield, Lock, Sparkles, LogIn } from 'lucide-react'

interface SignInPromptModalProps {
  isOpen: boolean
  onClose: () => void
  onSignIn: () => void
}

const SignInPromptModal: React.FC<SignInPromptModalProps> = ({ isOpen, onClose, onSignIn }) => {
  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
        >
          {/* Backdrop with blur */}
          <motion.div
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />

          {/* Modal */}
          <motion.div
            className="relative w-full max-w-md rounded-2xl border-2 border-cyan-400/30 bg-gradient-to-br from-cyan-950/95 to-blue-950/95 backdrop-blur-md shadow-2xl"
            initial={{ scale: 0.8, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.8, opacity: 0, y: 20 }}
            transition={{
              type: "spring",
              damping: 25,
              stiffness: 300,
              duration: 0.4
            }}
            style={{
              boxShadow: '0 0 50px rgba(34, 211, 238, 0.3), 0 20px 40px rgba(0, 0, 0, 0.4)',
            }}
          >
            {/* Close button */}
            <button
              onClick={onClose}
              className="absolute right-4 top-4 rounded-full p-2 text-cyan-300 transition-all duration-200 hover:bg-cyan-400/10 hover:text-cyan-200 hover:scale-110"
            >
              <X size={20} />
            </button>

            {/* Floating particles animation */}
            <div className="absolute inset-0 overflow-hidden rounded-2xl pointer-events-none">
              {[...Array(8)].map((_, i) => (
                <motion.div
                  key={i}
                  className="absolute w-1 h-1 bg-cyan-400 rounded-full opacity-60"
                  style={{
                    left: `${Math.random() * 100}%`,
                    top: `${Math.random() * 100}%`,
                  }}
                  animate={{
                    y: [-20, 20, -20],
                    x: [-10, 10, -10],
                    opacity: [0.3, 0.8, 0.3],
                  }}
                  transition={{
                    duration: 3 + Math.random() * 2,
                    repeat: Infinity,
                    delay: Math.random() * 2,
                    ease: "easeInOut",
                  }}
                />
              ))}
            </div>

            {/* Content */}
            <div className="relative z-10 p-8 text-center">
              {/* Icon with glow effect */}
              <motion.div
                className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full border-2 border-cyan-400/50 bg-gradient-to-br from-cyan-900/50 to-blue-900/50"
                animate={{
                  boxShadow: [
                    '0 0 20px rgba(34, 211, 238, 0.4)',
                    '0 0 40px rgba(34, 211, 238, 0.6)',
                    '0 0 20px rgba(34, 211, 238, 0.4)',
                  ],
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
              >
                <Shield className="w-8 h-8 text-cyan-300" />
              </motion.div>

              {/* Title */}
              <motion.h2
                className="mb-4 text-2xl font-bold bg-gradient-to-r from-cyan-300 to-blue-300 bg-clip-text text-transparent"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
              >
                Secure Your Journey
              </motion.h2>

              {/* Tagline */}
              <motion.p
                className="mb-6 text-cyan-100/80 leading-relaxed"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
              >
                Your decisions are private. Sign in to begin safely and securely.
              </motion.p>

              {/* Features list */}
              <motion.div
                className="mb-8 space-y-3"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
              >
                <div className="flex items-center gap-3 text-sm text-cyan-100/70">
                  <Lock className="w-4 h-4 text-cyan-400" />
                  <span>End-to-end encrypted decision history</span>
                </div>
                <div className="flex items-center gap-3 text-sm text-cyan-100/70">
                  <Sparkles className="w-4 h-4 text-cyan-400" />
                  <span>Personalized AI insights & recommendations</span>
                </div>
                <div className="flex items-center gap-3 text-sm text-cyan-100/70">
                  <Shield className="w-4 h-4 text-cyan-400" />
                  <span>Your data stays private, always</span>
                </div>
              </motion.div>

              {/* Buttons */}
              <motion.div
                className="space-y-3"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
              >
                {/* Primary Sign In Button */}
                <motion.button
                  onClick={onSignIn}
                  className="w-full py-3 px-6 bg-gradient-to-r from-cyan-500 to-blue-500 rounded-xl text-white font-semibold hover:from-cyan-400 hover:to-blue-400 transition-all duration-300 shadow-lg flex items-center justify-center gap-3"
                  whileHover={{ scale: 1.02, y: -1 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <LogIn className="w-5 h-5" />
                  Sign In to Get Started
                </motion.button>

                {/* Secondary Maybe Later Button */}
                <motion.button
                  onClick={onClose}
                  className="w-full py-2 px-6 text-cyan-300/70 hover:text-cyan-300 transition-colors duration-300 text-sm"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  Maybe later
                </motion.button>
              </motion.div>

              {/* Trust indicator */}
              <motion.div
                className="mt-6 pt-4 border-t border-cyan-400/20"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.6 }}
              >
                <p className="text-xs text-cyan-100/50">
                  🔒 Powered by Google OAuth • No spam, ever
                </p>
              </motion.div>
            </div>

            {/* Subtle circuit pattern overlay */}
            <div className="absolute inset-0 opacity-5 pointer-events-none rounded-2xl">
              <div
                className="h-full w-full"
                style={{
                  backgroundImage: `
                    radial-gradient(circle at 25% 25%, #22d3ee 1px, transparent 1px),
                    radial-gradient(circle at 75% 75%, #22d3ee 1px, transparent 1px),
                    linear-gradient(to right, #22d3ee 1px, transparent 1px),
                    linear-gradient(to bottom, #22d3ee 1px, transparent 1px)
                  `,
                  backgroundSize: "30px 30px, 30px 30px, 60px 60px, 60px 60px",
                }}
              />
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

export default SignInPromptModal