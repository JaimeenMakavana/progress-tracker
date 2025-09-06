"use client";
import React from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { LayoutDashboard, Receipt, Target, HelpCircle } from "lucide-react";
import { Button } from "../ui/button";
import { SyncButton } from "../sync";
import { Tooltip } from "./Tooltip";

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
    name: "Expenses",
    href: "/expenses",
    icon: <Receipt className="w-6 h-6" strokeWidth={1} />,
  },
];

interface DesktopNavigationProps {
  pathname: string;
  onShortcutsClick: () => void;
}

export const DesktopNavigation = ({
  pathname,
  onShortcutsClick,
}: DesktopNavigationProps) => {
  return (
    <nav className="hidden md:flex md:flex-col w-16 lg:w-20 h-full bg-[#2C3930] rounded-2xl shadow-2xl border border-[#2C3930]/30 relative overflow-hidden">
      {/* Background gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#2C3930] via-[#2C3930]/95 to-[#2C3930] rounded-2xl"></div>

      {/* Subtle pattern overlay */}
      <div className="absolute inset-0 opacity-5 bg-gradient-to-br from-white/10 to-transparent rounded-2xl"></div>

      {/* Navigation Items */}
      <div className="relative flex-1 flex flex-col items-center justify-center space-y-6 px-2 z-10">
        {navigationItems.map((item, index) => {
          const isActive = pathname === item.href;
          return (
            <Tooltip key={item.name} content={item.name}>
              <motion.div
                initial={{ opacity: 0, y: 30, scale: 0.8 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                transition={{
                  delay: index * 0.15,
                  duration: 0.5,
                  type: "spring",
                  stiffness: 200,
                  damping: 20,
                }}
                className="relative"
              >
                <Link
                  href={item.href}
                  className={`relative group flex items-center justify-center w-14 h-14 rounded-2xl transition-all duration-500 ease-out ${
                    isActive
                      ? "bg-gradient-to-br from-white/20 to-white/10 text-white shadow-2xl"
                      : "text-white/70 hover:text-white hover:bg-white/15 hover:shadow-xl"
                  }`}
                >
                  {/* Hover glow effect */}
                  <motion.div
                    className="absolute inset-0 rounded-2xl bg-white/10 opacity-0 group-hover:opacity-100"
                    transition={{ duration: 0.3 }}
                  />

                  {/* Icon container with enhanced animations */}
                  <motion.div
                    className="relative w-7 h-7 z-10 flex justify-center items-center"
                    whileHover={{
                      scale: 1.15,
                      rotate: isActive ? 0 : 5,
                    }}
                    whileTap={{ scale: 0.95 }}
                    transition={{
                      duration: 0.2,
                      type: "spring",
                      stiffness: 400,
                      damping: 25,
                    }}
                  >
                    {item.icon}
                  </motion.div>

                  {/* Active state indicator with enhanced animation */}
                  {isActive && (
                    <>
                      <motion.div
                        className="absolute -left-3 top-1/2 transform -translate-y-1/2 w-1.5 h-12 bg-gradient-to-b from-white via-white to-white/80 rounded-l-full shadow-lg"
                        initial={{ scaleY: 0, opacity: 0 }}
                        animate={{ scaleY: 1, opacity: 1 }}
                        transition={{
                          duration: 0.4,
                          ease: [0.4, 0, 0.2, 1],
                          delay: 0.1,
                        }}
                      />

                      {/* Pulsing glow for active state */}
                      <motion.div
                        className="absolute inset-0 rounded-2xl bg-white/10"
                        animate={{
                          scale: [1, 1.05, 1],
                          opacity: [0.3, 0.6, 0.3],
                        }}
                        transition={{
                          duration: 2,
                          repeat: Infinity,
                          ease: "easeInOut",
                        }}
                      />

                      {/* Corner accent */}
                      <motion.div
                        className="absolute top-1 right-1 w-2 h-2 bg-white/60 rounded-full"
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ delay: 0.2, duration: 0.3 }}
                      />
                    </>
                  )}

                  {/* Ripple effect on click */}
                  <motion.div
                    className="absolute inset-0 rounded-2xl bg-white/20"
                    initial={{ scale: 0, opacity: 0 }}
                    whileTap={{ scale: 1.2, opacity: 1 }}
                    transition={{ duration: 0.2 }}
                  />
                </Link>
              </motion.div>
            </Tooltip>
          );
        })}
      </div>

      {/* Bottom Buttons */}
      <div className="relative flex flex-col items-center space-y-6 p-6 border-t border-white/15 z-10">
        {/* Decorative line */}
        <div className="absolute top-0 left-1/2 transform -translate-x-1/2 w-8 h-px bg-gradient-to-r from-transparent via-white/30 to-transparent"></div>

        {/* Sync Button */}
        <Tooltip content="GitHub Sync">
          <motion.div
            className="relative w-12 h-12 rounded-2xl overflow-hidden shadow-xl"
            whileHover={{
              scale: 1.08,
              rotate: 2,
            }}
            whileTap={{ scale: 0.92 }}
            transition={{
              duration: 0.3,
              type: "spring",
              stiffness: 300,
              damping: 25,
            }}
          >
            {/* Glow effect */}
            <motion.div
              className="absolute inset-0 bg-white/20 rounded-2xl opacity-0"
              whileHover={{ opacity: 1 }}
              transition={{ duration: 0.3 }}
            />
            <SyncButton className="w-full h-full relative z-10" />
          </motion.div>
        </Tooltip>

        {/* Shortcuts Button */}
        <Tooltip content="Keyboard Shortcuts">
          <motion.div
            className="relative"
            whileHover={{
              scale: 1.08,
              rotate: -2,
            }}
            whileTap={{ scale: 0.92 }}
            transition={{
              duration: 0.3,
              type: "spring",
              stiffness: 300,
              damping: 25,
            }}
          >
            <Button
              variant="ghost"
              size="icon"
              className="relative w-12 h-12 text-white/70 hover:text-white hover:bg-gradient-to-br hover:from-white/20 hover:to-white/10 rounded-2xl transition-all duration-500 shadow-xl hover:shadow-2xl border border-white/10 hover:border-white/20"
              onClick={onShortcutsClick}
            >
              {/* Background glow */}
              <motion.div
                className="absolute inset-0 bg-white/10 rounded-2xl opacity-0"
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

              {/* Ripple effect */}
              <motion.div
                className="absolute inset-0 rounded-2xl bg-white/20"
                initial={{ scale: 0, opacity: 0 }}
                whileTap={{ scale: 1.3, opacity: 1 }}
                transition={{ duration: 0.2 }}
              />
            </Button>
          </motion.div>
        </Tooltip>
      </div>
    </nav>
  );
};
