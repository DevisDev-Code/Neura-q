"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence, useAnimationControls } from "framer-motion";
import { Brain, Cpu, Zap, X } from "lucide-react";

interface AIProcessingPopupProps {
  isOpen?: boolean;
  onClose?: () => void;
  title?: string;
  messages?: string[];
  variant?: "neural" | "quantum" | "cyber";
}

const variants = {
  neural: {
    bg: "bg-gradient-to-br from-purple-950 via-black to-purple-900",
    border: "border-purple-400",
    glowColor: "#a855f7",
    textPrimary: "text-purple-300",
    textSecondary: "text-purple-100",
    particleColor: "bg-purple-400",
    accentColor: "text-purple-400",
  },
  quantum: {
    bg: "bg-gradient-to-br from-orange-950 via-black to-red-900",
    border: "border-orange-400",
    glowColor: "#fb923c",
    textPrimary: "text-orange-300",
    textSecondary: "text-orange-100",
    particleColor: "bg-orange-400",
    accentColor: "text-orange-400",
  },
  cyber: {
    bg: "bg-gradient-to-br from-cyan-950 via-black to-cyan-900",
    border: "border-cyan-400",
    glowColor: "#22d3ee",
    textPrimary: "text-cyan-300",
    textSecondary: "text-cyan-100",
    particleColor: "bg-cyan-400",
    accentColor: "text-cyan-400",
  },
};

// Separate component for wave circles to properly use hooks
const WaveCircle: React.FC<{
  wave: { id: number; delay: number; duration: number };
  glowColor: string;
}> = ({ wave, glowColor }) => {
  const controls = useAnimationControls();

  useEffect(() => {
    const safeDuration =
      typeof wave.duration === "number" && !isNaN(wave.duration) ? wave.duration : 2;
    const safeDelay =
      typeof wave.delay === "number" && !isNaN(wave.delay) ? wave.delay : 0;

    // Set initial state explicitly
    controls.set({ r: 0, opacity: 0.8 });
    
    // Start animation
    controls.start({
      r: [0, 100, 200],
      opacity: [0.8, 0.4, 0],
      transition: {
        duration: safeDuration,
        delay: safeDelay,
        repeat: Infinity,
        ease: "easeOut",
      },
    });
  }, [wave.delay, wave.duration, controls]);

  return (
    <motion.circle
      cx={50}
      cy={50}
      fill="none"
      stroke={glowColor}
      strokeWidth={1}
      r={0}
      animate={controls}
    />
  );
};

const AIProcessingPopup: React.FC<AIProcessingPopupProps> = ({
  isOpen = true,
  onClose,
  title = "AI Neural Processing",
  messages = [
    "Initializing quantum neural networks...",
    "Processing synaptic pathways...",
    "Analyzing cognitive patterns...",
    "Optimizing thought matrices...",
    "Synthesizing neural responses...",
  ],
  variant = "neural",
}) => {
  const [currentMessageIndex, setCurrentMessageIndex] = useState(0);
  const [particles, setParticles] = useState<
    Array<{ id: number; x: number; y: number; size: number; duration: number; delay: number }>
  >([]);
  const [brainWaves, setBrainWaves] = useState<
    Array<{ id: number; delay: number; duration: number }>
  >([]);

  const variantStyles = variants[variant];

  // Initialize particles and brain waves on mount
  useEffect(() => {
    const newParticles = Array.from({ length: 20 }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: Math.random() * 3 + 1,
      duration: Math.random() * 3 + 2,
      delay: Math.random() * 2,
    }));
    setParticles(newParticles);

    const newBrainWaves = Array.from({ length: 5 }, (_, i) => ({
      id: i,
      delay: i * 0.5,
      duration: 2 + Math.random(),
    }));
    setBrainWaves(newBrainWaves);
  }, []);

  // Cycle messages
  useEffect(() => {
    if (!isOpen) return;

    const interval = setInterval(() => {
      setCurrentMessageIndex((prev) => (prev + 1) % messages.length);
    }, 2500);

    return () => clearInterval(interval);
  }, [isOpen, messages.length]);

  const getIcon = () => {
    switch (variant) {
      case "neural":
        return <Brain size={32} />;
      case "quantum":
        return <Cpu size={32} />;
      case "cyber":
        return <Zap size={32} />;
      default:
        return <Brain size={32} />;
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          {/* Backdrop */}
          <motion.div
            className="absolute inset-0 bg-black/80 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />

          {/* Modal */}
          <motion.div
            className={`relative w-full max-w-md rounded-2xl border-2 p-8 shadow-2xl ${variantStyles.bg} ${variantStyles.border}`}
            initial={{ scale: 0.8, opacity: 0, rotateX: -15 }}
            animate={{ scale: 1, opacity: 1, rotateX: 0 }}
            exit={{ scale: 0.8, opacity: 0, rotateX: 15 }}
            transition={{
              type: "spring",
              damping: 25,
              stiffness: 300,
            }}
            style={{
              boxShadow: `0 0 50px ${variantStyles.glowColor}40`,
            }}
          >
            {/* Close button */}
            {onClose && (
              <button
                onClick={onClose}
                className={`absolute right-4 top-4 rounded-full p-2 transition-colors hover:bg-white/10 ${variantStyles.textSecondary}`}
              >
                <X size={20} />
              </button>
            )}

            {/* Floating particles */}
            <div className="absolute inset-0 overflow-hidden rounded-2xl">
              {particles.map((particle) => (
                <motion.div
                  key={particle.id}
                  className={`absolute rounded-full ${variantStyles.particleColor} opacity-60`}
                  style={{
                    width: `${particle.size}px`,
                    height: `${particle.size}px`,
                    left: `${particle.x}%`,
                    top: `${particle.y}%`,
                  }}
                  animate={{
                    y: [-20, 20, -20],
                    x: [-10, 10, -10],
                    opacity: [0.3, 0.8, 0.3],
                  }}
                  transition={{
                    duration: particle.duration,
                    repeat: Infinity,
                    delay: particle.delay,
                    ease: "easeInOut",
                  }}
                />
              ))}
            </div>

            {/* Neural network pattern */}
            <div className="absolute inset-0 opacity-10 pointer-events-none">
              <svg className="h-full w-full">
                {brainWaves.map((wave) => (
                  <WaveCircle
                    key={wave.id}
                    wave={wave}
                    glowColor={variantStyles.glowColor}
                  />
                ))}
              </svg>
            </div>

            {/* Content */}
            <div className="relative z-10 text-center">
              {/* Icon */}
              <motion.div
                className={`mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full border-2 ${variantStyles.border} ${variantStyles.accentColor}`}
                animate={{
                  scale: [1, 1.1, 1],
                  boxShadow: [
                    `0 0 20px ${variantStyles.glowColor}40`,
                    `0 0 40px ${variantStyles.glowColor}80`,
                    `0 0 20px ${variantStyles.glowColor}40`,
                  ],
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
              >
                {getIcon()}
              </motion.div>

              {/* Title */}
              <motion.h2
                className={`mb-6 text-2xl font-bold ${variantStyles.textPrimary}`}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
              >
                {title}
              </motion.h2>

              {/* Message */}
              <motion.div
                className="mb-8 h-12 flex items-center justify-center"
                key={currentMessageIndex}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.3 }}
              >
                <p className={`text-sm ${variantStyles.textSecondary}`}>
                  {messages[currentMessageIndex]}
                </p>
              </motion.div>

              {/* Loading dots */}
              <div className="flex items-center justify-center space-x-2">
                {[...Array(3)].map((_, i) => (
                  <motion.div
                    key={i}
                    className={`h-3 w-3 rounded-full ${variantStyles.particleColor}`}
                    animate={{
                      scale: [1, 1.5, 1],
                      opacity: [0.5, 1, 0.5],
                    }}
                    transition={{
                      duration: 1.5,
                      repeat: Infinity,
                      delay: i * 0.2,
                      ease: "easeInOut",
                    }}
                  />
                ))}
              </div>

              {/* Progress bar */}
              <div className="mt-6">
                <div className="h-1 w-full rounded-full bg-gray-800 overflow-hidden">
                  <motion.div
                    className={`h-full ${variantStyles.particleColor}`}
                    style={{
                      boxShadow: `0 0 10px ${variantStyles.glowColor}`,
                    }}
                    animate={{
                      width: ["0%", "100%"],
                    }}
                    transition={{
                      duration: 8,
                      repeat: Infinity,
                      ease: "easeInOut",
                    }}
                  />
                </div>
              </div>
            </div>

            {/* Circuit pattern */}
            <div className="absolute inset-0 opacity-5 pointer-events-none">
              <div
                className="h-full w-full"
                style={{
                  backgroundImage: `
                    radial-gradient(circle at 25% 25%, ${variantStyles.glowColor} 1px, transparent 1px),
                    radial-gradient(circle at 75% 75%, ${variantStyles.glowColor} 1px, transparent 1px),
                    linear-gradient(to right, ${variantStyles.glowColor} 1px, transparent 1px),
                    linear-gradient(to bottom, ${variantStyles.glowColor} 1px, transparent 1px)
                  `,
                  backgroundSize: "30px 30px, 30px 30px, 60px 60px, 60px 60px",
                }}
              />
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default AIProcessingPopup;
