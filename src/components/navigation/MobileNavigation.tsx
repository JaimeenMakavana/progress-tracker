"use client";
import React from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import {
  LayoutDashboard,
  Receipt,
  Target,
  Menu,
  X,
  HelpCircle,
  CheckSquare,
} from "lucide-react";
import { Button } from "../ui/button";
import { SyncButton } from "../sync";

interface NavigationItem {
  name: string;
  href: string;
  icon: React.ReactNode;
}

const navigationItems: NavigationItem[] = [
  {
    name: "Trackers",
    href: "/tracker",
    icon: <Target className="w-7 h-7" strokeWidth={1.5} />,
  },
  {
    name: "Dashboard",
    href: "/",
    icon: <LayoutDashboard className="w-6 h-6" strokeWidth={1} />,
  },
  {
    name: "Todos",
    href: "/todo",
    icon: <CheckSquare className="w-6 h-6" strokeWidth={1} />,
  },
  {
    name: "Expenses",
    href: "/expenses",
    icon: <Receipt className="w-6 h-6" strokeWidth={1} />,
  },
];

interface MobileNavigationProps {
  isMobileMenuOpen: boolean;
  pathname: string;
  onToggleMobileMenu: () => void;
  onCloseMobileMenu: () => void;
  onShortcutsClick: () => void;
}

export const MobileNavigation = ({
  isMobileMenuOpen,
  pathname,
  onToggleMobileMenu,
  onCloseMobileMenu,
  onShortcutsClick,
}: MobileNavigationProps) => {
  return (
    <nav className="md:hidden w-full">
      {/* Mobile Header */}
      <div className="flex items-center justify-between px-6 py-3 bg-gradient-to-r from-white/95 via-white/90 to-white/95 backdrop-blur-xl border-b border-gray-200/50 shadow-sm">
        {/* Logo */}
        <Link href="/" className="flex items-center space-x-4 group">
          <motion.div
            className="relative w-12 h-12 bg-gradient-to-br from-[#2C3930] to-[#2C3930]/90 rounded-2xl flex items-center justify-center shadow-xl group-hover:shadow-2xl transition-all duration-500"
            whileHover={{
              scale: 1.08,
              rotate: 5,
            }}
            whileTap={{ scale: 0.95 }}
          >
            {/* Glow effect */}
            <motion.div
              className="absolute inset-0 bg-white/20 rounded-2xl opacity-0 group-hover:opacity-100"
              transition={{ duration: 0.3 }}
            />
            <motion.span
              className="relative text-white font-bold text-xl z-10"
              whileHover={{ scale: 1.1 }}
              transition={{ duration: 0.2 }}
            >
              P
            </motion.span>
          </motion.div>
          <motion.span
            className="text-2xl font-bold text-gray-900 group-hover:text-[#2C3930] transition-colors duration-500"
            whileHover={{ scale: 1.02 }}
            transition={{ duration: 0.2 }}
          >
            Progress OS
          </motion.span>
        </Link>

        {/* Hamburger Button */}
        <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
          <Button
            variant="ghost"
            size="icon"
            onClick={onToggleMobileMenu}
            aria-label="Toggle mobile menu"
            className="relative w-12 h-12 rounded-2xl hover:bg-gradient-to-br hover:from-gray-100 hover:to-gray-50 transition-all duration-500 shadow-lg hover:shadow-xl border border-gray-200/50 hover:border-gray-300/50"
          >
            {/* Background glow */}
            <motion.div
              className="absolute inset-0 bg-gray-100/50 rounded-2xl opacity-0"
              whileHover={{ opacity: 1 }}
              transition={{ duration: 0.3 }}
            />
            <motion.div
              className="relative w-6 h-6 z-10"
              animate={{ rotate: isMobileMenuOpen ? 90 : 0 }}
              transition={{
                duration: 0.4,
                ease: [0.4, 0, 0.2, 1],
                type: "spring",
                stiffness: 300,
                damping: 30,
              }}
            >
              {isMobileMenuOpen ? (
                <X className="w-full h-full text-gray-700" />
              ) : (
                <Menu className="w-full h-full text-gray-700" />
              )}
            </motion.div>
          </Button>
        </motion.div>
      </div>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              className="fixed inset-0 bg-black bg-opacity-50 z-40"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={onCloseMobileMenu}
            />

            {/* Mobile Menu */}
            <motion.div
              className="fixed top-0 right-0 h-full w-80 sm:w-96 max-w-[90vw] bg-gradient-to-br from-white/98 via-white/95 to-white/98 backdrop-blur-2xl shadow-2xl z-50 border-l border-gray-200/30 overflow-hidden"
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{
                type: "spring",
                damping: 30,
                stiffness: 300,
                mass: 0.8,
              }}
            >
              {/* Background pattern */}
              <div className="absolute inset-0 opacity-[0.02] bg-gradient-to-br from-gray-900/5 to-transparent"></div>

              {/* Mobile Menu Header */}
              <div className="relative flex items-center justify-between p-8 border-b border-gray-200/50 bg-gradient-to-r from-white/80 via-white/60 to-white/80 z-10">
                <motion.span
                  className="text-2xl font-bold text-gray-900"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.2, duration: 0.4 }}
                >
                  Navigation
                </motion.span>
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.3, duration: 0.3 }}
                >
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={onCloseMobileMenu}
                    aria-label="Close mobile menu"
                    className="relative w-12 h-12 rounded-2xl hover:bg-gradient-to-br hover:from-gray-100 hover:to-gray-50 transition-all duration-500 shadow-lg hover:shadow-xl border border-gray-200/50 hover:border-gray-300/50"
                  >
                    {/* Background glow */}
                    <motion.div
                      className="absolute inset-0 bg-gray-100/50 rounded-2xl opacity-0"
                      whileHover={{ opacity: 1 }}
                      transition={{ duration: 0.3 }}
                    />
                    <motion.div
                      className="relative w-6 h-6 z-10"
                      whileHover={{ rotate: 90 }}
                      transition={{ duration: 0.2 }}
                    >
                      <X className="w-full h-full text-gray-600" />
                    </motion.div>
                  </Button>
                </motion.div>
              </div>

              {/* Mobile Menu Items */}
              <div className="relative p-8 flex-1 z-10">
                <div className="space-y-4">
                  {navigationItems.map((item, index) => {
                    const isActive = pathname === item.href;
                    return (
                      <motion.div
                        key={item.name}
                        initial={{ opacity: 0, x: 30, scale: 0.9 }}
                        animate={{ opacity: 1, x: 0, scale: 1 }}
                        transition={{
                          delay: index * 0.15,
                          duration: 0.5,
                          type: "spring",
                          stiffness: 200,
                          damping: 25,
                        }}
                      >
                        <motion.div
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                          className="relative"
                        >
                          <Link
                            href={item.href}
                            onClick={onCloseMobileMenu}
                            className={`relative flex items-center space-x-5 px-6 py-5 rounded-2xl transition-all duration-500 group overflow-hidden ${
                              isActive
                                ? "bg-gradient-to-r from-[#2C3930] to-[#2C3930]/90 text-white shadow-2xl"
                                : "text-gray-700 hover:bg-gradient-to-r hover:from-gray-100 hover:to-gray-50 hover:text-gray-900 hover:shadow-xl"
                            }`}
                          >
                            {/* Background glow for active state */}
                            {isActive && (
                              <motion.div
                                className="absolute inset-0 bg-white/10 rounded-2xl"
                                animate={{
                                  scale: [1, 1.02, 1],
                                  opacity: [0.3, 0.6, 0.3],
                                }}
                                transition={{
                                  duration: 2,
                                  repeat: Infinity,
                                  ease: "easeInOut",
                                }}
                              />
                            )}

                            {/* Hover glow effect */}
                            <motion.div
                              className="absolute inset-0 bg-white/5 rounded-2xl opacity-0 group-hover:opacity-100"
                              transition={{ duration: 0.3 }}
                            />

                            {/* Icon with enhanced animations */}
                            <motion.div
                              className={`relative w-8 h-8 z-10 ${
                                isActive
                                  ? "text-white"
                                  : "text-gray-600 group-hover:text-gray-800"
                              }`}
                              whileHover={{
                                scale: 1.15,
                                rotate: isActive ? 0 : 5,
                              }}
                              transition={{
                                duration: 0.2,
                                type: "spring",
                                stiffness: 400,
                                damping: 25,
                              }}
                            >
                              {item.icon}
                            </motion.div>

                            {/* Text with enhanced styling */}
                            <motion.span
                              className="font-bold text-xl z-10"
                              whileHover={{ scale: 1.02 }}
                              transition={{ duration: 0.2 }}
                            >
                              {item.name}
                            </motion.span>

                            {/* Active state indicator */}
                            {isActive && (
                              <>
                                <motion.div
                                  className="ml-auto w-3 h-3 bg-white rounded-full shadow-lg z-10"
                                  initial={{ scale: 0, opacity: 0 }}
                                  animate={{ scale: 1, opacity: 1 }}
                                  transition={{
                                    duration: 0.4,
                                    type: "spring",
                                    stiffness: 300,
                                    damping: 25,
                                  }}
                                />

                                {/* Corner accent */}
                                <motion.div
                                  className="absolute top-2 right-2 w-2 h-2 bg-white/60 rounded-full"
                                  initial={{ scale: 0 }}
                                  animate={{ scale: 1 }}
                                  transition={{ delay: 0.2, duration: 0.3 }}
                                />
                              </>
                            )}

                            {/* Ripple effect */}
                            <motion.div
                              className="absolute inset-0 rounded-2xl bg-white/20"
                              initial={{ scale: 0, opacity: 0 }}
                              whileTap={{ scale: 1.2, opacity: 1 }}
                              transition={{ duration: 0.2 }}
                            />
                          </Link>
                        </motion.div>
                      </motion.div>
                    );
                  })}
                </div>
              </div>

              {/* Mobile Bottom Buttons */}
              <div className="relative p-8 border-t border-gray-200/50 bg-gradient-to-r from-gray-50/80 via-white/90 to-gray-50/80 z-10">
                {/* Decorative line */}
                <div className="absolute top-0 left-1/2 transform -translate-x-1/2 w-16 h-px bg-gradient-to-r from-transparent via-gray-300/50 to-transparent"></div>

                <div className="flex flex-col gap-6">
                  <motion.div
                    initial={{ opacity: 0, y: 30, scale: 0.9 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    transition={{
                      delay: 0.3,
                      duration: 0.5,
                      type: "spring",
                      stiffness: 200,
                      damping: 25,
                    }}
                  >
                    <motion.div
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <SyncButton className="w-full h-14 rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-500" />
                    </motion.div>
                  </motion.div>

                  <motion.div
                    initial={{ opacity: 0, y: 30, scale: 0.9 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    transition={{
                      delay: 0.4,
                      duration: 0.5,
                      type: "spring",
                      stiffness: 200,
                      damping: 25,
                    }}
                  >
                    <motion.div
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <Button
                        variant="outline"
                        className="relative w-full h-14 flex items-center justify-center space-x-4 text-lg font-bold rounded-2xl border-2 border-gray-300/50 hover:border-gray-400/50 hover:bg-gradient-to-r hover:from-gray-100 hover:to-gray-50 transition-all duration-500 shadow-xl hover:shadow-2xl overflow-hidden"
                        onClick={() => {
                          onShortcutsClick();
                          onCloseMobileMenu();
                        }}
                      >
                        {/* Background glow */}
                        <motion.div
                          className="absolute inset-0 bg-white/20 rounded-2xl opacity-0"
                          whileHover={{ opacity: 1 }}
                          transition={{ duration: 0.3 }}
                        />

                        {/* Icon with enhanced animation */}
                        <motion.div
                          className="relative w-6 h-6 z-10"
                          whileHover={{
                            rotate: 10,
                            scale: 1.1,
                          }}
                          transition={{
                            duration: 0.2,
                            type: "spring",
                            stiffness: 400,
                            damping: 25,
                          }}
                        >
                          <HelpCircle className="w-full h-full" />
                        </motion.div>

                        {/* Text */}
                        <span className="font-bold z-10">
                          Keyboard Shortcuts
                        </span>

                        {/* Ripple effect */}
                        <motion.div
                          className="absolute inset-0 rounded-2xl bg-white/30"
                          initial={{ scale: 0, opacity: 0 }}
                          whileTap={{ scale: 1.2, opacity: 1 }}
                          transition={{ duration: 0.2 }}
                        />
                      </Button>
                    </motion.div>
                  </motion.div>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </nav>
  );
};
