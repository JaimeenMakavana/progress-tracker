"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { GLOBAL_SHORTCUTS } from "../../hooks/useKeyboardShortcuts";

interface FloatingKeyboardShortcutsProps {
  className?: string;
}

export function FloatingKeyboardShortcuts({
  className = "",
}: FloatingKeyboardShortcutsProps) {
  const [isVisible, setIsVisible] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);

  useEffect(() => {
    const handleHelp = () => setIsVisible(true);
    const handleEscape = () => setIsVisible(false);

    document.addEventListener("shortcut:help", handleHelp);
    document.addEventListener("shortcut:escape", handleEscape);

    return () => {
      document.removeEventListener("shortcut:help", handleHelp);
      document.removeEventListener("shortcut:escape", handleEscape);
    };
  }, []);

  const toggleExpanded = () => {
    setIsExpanded(!isExpanded);
  };

  return (
    <>
      {/* Floating Help Button */}
      <motion.button
        initial={{ opacity: 0, scale: 0 }}
        animate={{ opacity: 1, scale: 1 }}
        className={`fixed bottom-6 right-6 z-40 w-12 h-12 bg-black text-white rounded-full shadow-lg hover:shadow-xl transition-all duration-300 flex items-center justify-center group ${className}`}
        onClick={toggleExpanded}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
      >
        <svg
          className="w-6 h-6 group-hover:rotate-12 transition-transform duration-300"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
          />
        </svg>
      </motion.button>

      {/* Expanded Shortcuts Panel */}
      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.9 }}
            transition={{ duration: 0.2 }}
            className="fixed bottom-24 right-6 z-50 w-80 max-w-[calc(100vw-3rem)]"
          >
            <div className="bg-white rounded-lg shadow-2xl border border-gray-200 p-4">
              {/* Header */}
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-black">
                  Keyboard Shortcuts
                </h3>
                <button
                  onClick={() => setIsExpanded(false)}
                  className="text-gray-400 hover:text-black transition-colors p-1 hover:bg-gray-100 rounded"
                >
                  <svg
                    className="w-4 h-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </button>
              </div>

              {/* Shortcuts List */}
              <div className="space-y-2 max-h-64 overflow-y-auto">
                {GLOBAL_SHORTCUTS.map((shortcut, index) => (
                  <motion.div
                    key={shortcut.key}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className="flex items-center justify-between p-2 hover:bg-gray-50 rounded transition-colors"
                  >
                    <span className="text-sm text-gray-700">
                      {shortcut.description}
                    </span>
                    <kbd className="px-2 py-1 bg-gray-100 text-gray-800 rounded text-xs font-mono font-semibold">
                      {shortcut.key === " " ? "Space" : shortcut.key}
                    </kbd>
                  </motion.div>
                ))}
              </div>

              {/* Footer */}
              <div className="mt-4 pt-3 border-t border-gray-200">
                <div className="flex items-center justify-center gap-2 text-xs text-gray-500">
                  <span>Press</span>
                  <kbd className="px-1.5 py-0.5 bg-gray-100 rounded text-xs font-mono font-semibold">
                    ?
                  </kbd>
                  <span>to toggle this panel</span>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Full Screen Modal (when ? is pressed) */}
      <AnimatePresence>
        {isVisible && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
            onClick={() => setIsVisible(false)}
          >
            <motion.div
              className="bg-white rounded-lg p-6 w-full max-w-2xl max-h-[80vh] overflow-y-auto"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              onClick={(e) => e.stopPropagation()}
            >
              {/* Header */}
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h3 className="text-2xl font-bold text-black mb-2">
                    Keyboard Shortcuts
                  </h3>
                  <p className="text-sm text-gray-600">
                    Navigate efficiently without touching the mouse
                  </p>
                </div>
                <button
                  onClick={() => setIsVisible(false)}
                  className="text-gray-400 hover:text-black transition-colors p-2 hover:bg-gray-100 rounded-lg"
                >
                  <svg
                    className="w-6 h-6"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </button>
              </div>

              {/* Shortcuts Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                {GLOBAL_SHORTCUTS.map((shortcut, index) => (
                  <motion.div
                    key={shortcut.key}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-2 h-2 rounded-full bg-black"></div>
                      <span className="text-sm font-medium text-black">
                        {shortcut.description}
                      </span>
                    </div>
                    <kbd className="px-3 py-1.5 bg-black text-white rounded-md text-sm font-mono font-semibold shadow-sm">
                      {shortcut.key === " " ? "Space" : shortcut.key}
                    </kbd>
                  </motion.div>
                ))}
              </div>

              {/* Footer */}
              <div className="border-t border-gray-200 pt-4">
                <div className="flex items-center justify-center gap-2 text-sm text-gray-500">
                  <span>Press</span>
                  <kbd className="px-2 py-1 bg-gray-100 rounded text-xs font-mono font-semibold">
                    ?
                  </kbd>
                  <span>or</span>
                  <kbd className="px-2 py-1 bg-gray-100 rounded text-xs font-mono font-semibold">
                    Esc
                  </kbd>
                  <span>to close</span>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
