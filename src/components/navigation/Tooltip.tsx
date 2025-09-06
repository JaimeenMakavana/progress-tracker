"use client";
import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface TooltipProps {
  children: React.ReactNode;
  content: string;
}

export const Tooltip = ({ children, content }: TooltipProps) => {
  const [isVisible, setIsVisible] = useState(false);

  return (
    <div
      className="relative"
      onMouseEnter={() => setIsVisible(true)}
      onMouseLeave={() => setIsVisible(false)}
    >
      {children}
      <AnimatePresence>
        {isVisible && (
          <motion.div
            initial={{ opacity: 0, x: -12, scale: 0.8, y: -5 }}
            animate={{ opacity: 1, x: 0, scale: 1, y: 0 }}
            exit={{ opacity: 0, x: -12, scale: 0.8, y: -5 }}
            transition={{
              duration: 0.2,
              ease: [0.4, 0, 0.2, 1],
              type: "spring",
              stiffness: 300,
              damping: 30,
            }}
            className="absolute left-full ml-5 top-1/2 transform -translate-y-1/2 z-[100] pointer-events-none"
          >
            <div className="relative">
              {/* Glow effect */}
              <div className="absolute inset-0 bg-white/20 rounded-2xl blur-sm scale-110"></div>

              {/* Main tooltip */}
              <div className="relative bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white text-sm font-semibold px-5 py-3 rounded-2xl shadow-2xl whitespace-nowrap backdrop-blur-md border border-gray-600/30">
                {content}

                {/* Animated border */}
                <motion.div
                  className="absolute inset-0 rounded-2xl border border-white/20"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.1, duration: 0.3 }}
                />
              </div>

              {/* Arrow with gradient */}
              <div className="absolute right-full top-1/2 transform -translate-y-1/2">
                <div className="w-0 h-0 border-t-[8px] border-b-[8px] border-r-[8px] border-transparent border-r-gray-900"></div>
                <div className="absolute top-1/2 left-0 transform -translate-y-1/2 w-0 h-0 border-t-[7px] border-b-[7px] border-r-[7px] border-transparent border-r-gray-800"></div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
