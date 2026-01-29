"use client";

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { User as UserIcon, ChevronDown, LogOut, LogIn, Brain } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useUser } from '../../context/UserContext'; // adjust path if needed

interface SpaceTechNavBarProps {
  className?: string;
}

const SpaceTechNavBar = ({ className }: SpaceTechNavBarProps) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const { user, loading, signInWithGoogle, signOut } = useUser();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleSignOut = async () => {
    await signOut();
    setIsDropdownOpen(false);
  };

  return (
    <motion.nav
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.8, ease: "easeOut" }}
      className={cn(
        "absolute inset-x-0 top-1/2 -translate-y-1/2 w-[80%] h-[90px] mx-auto transition-all duration-500 rounded-full",
        isScrolled
          ? "backdrop-blur-xl bg-slate-950/40 border border-cyan-500/20 shadow-lg shadow-cyan-500/10"
          : "bg-transparent",
        className
      )}
    >
      <div className="w-full h-full flex items-center justify-between px-6">
        {/* Logo */}
        <motion.div
          className="flex items-center"
          whileHover={{ scale: 1.05 }}
          transition={{ type: "spring", stiffness: 400, damping: 17 }}
        >
          <a href="/" className="flex items-center gap-3 group cursor-pointer">
            <Brain className="h-10 w-10 text-cyan-400 drop-shadow-lg" />
            <span className="text-2xl font-bold bg-gradient-to-r from-cyan-400 via-purple-400 to-orange-400 bg-clip-text text-transparent">
              Neura-Q
            </span>
          </a>
        </motion.div>

        {/* Auth Dropdown */}
        <div className="relative">
          <motion.button
            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
            className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-cyan-500/20 via-purple-500/20 to-orange-500/20 border border-cyan-400/30 rounded-full text-cyan-300 text-sm font-medium relative overflow-hidden group"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <motion.div
              className="absolute inset-0 bg-gradient-to-r from-cyan-500/30 via-purple-500/30 to-orange-500/30 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
              animate={{ x: ["-100%", "100%"] }}
              transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
            />

            {/* Avatar or Icon */}
            {user?.user_metadata?.avatar_url ? (
              <img
                src={user.user_metadata.avatar_url}
                alt="Avatar"
                className="w-6 h-6 rounded-full border border-cyan-400 relative z-10"
              />
            ) : (
              <UserIcon className="h-4 w-4 relative z-10" />
            )}

            {/* Name or "Account" */}
            <span className="relative z-10">
              {user?.user_metadata?.full_name?.split(" ")[0] || "Account"}
            </span>

            {/* Chevron */}
            <motion.div
              animate={{ rotate: isDropdownOpen ? 180 : 0 }}
              transition={{ duration: 0.2 }}
              className="relative z-10"
            >
              <ChevronDown className="h-4 w-4" />
            </motion.div>
          </motion.button>

          {/* Dropdown Menu */}
          {isDropdownOpen && (
            <motion.div
              initial={{ opacity: 0, y: -10, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -10, scale: 0.95 }}
              transition={{ duration: 0.2 }}
              className="absolute right-0 mt-2 w-64 bg-slate-950/90 backdrop-blur-xl border border-cyan-500/20 rounded-xl shadow-lg shadow-cyan-500/10 overflow-hidden z-50"
            >
              <div className="py-2">
                {loading ? (
                  <div className="px-4 py-3 text-center text-gray-400">Loading...</div>
                ) : user ? (
                  <motion.button
                    onClick={handleSignOut}
                    className="w-full px-4 py-3 text-left text-red-400 hover:bg-red-500/10 hover:text-red-300 transition-colors duration-200 flex items-center gap-3"
                    whileHover={{ x: 4 }}
                  >
                    <LogOut className="h-4 w-4" />
                    <span>Log Out</span>
                  </motion.button>
                ) : (
                  <motion.button
                    onClick={signInWithGoogle}
                    className="w-full px-4 py-3 text-left text-cyan-300 hover:bg-cyan-500/10 hover:text-cyan-200 transition-colors duration-200 flex items-center gap-3"
                    whileHover={{ x: 4 }}
                  >
                    <LogIn className="h-4 w-4" />
                    <span>Sign in with Google</span>
                  </motion.button>
                )}
              </div>
            </motion.div>
          )}
        </div>
      </div>
    </motion.nav>
  );
};

export default SpaceTechNavBar;
