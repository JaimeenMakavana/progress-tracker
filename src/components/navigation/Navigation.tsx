"use client";
import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  LayoutDashboard,
  Receipt,
  Target,
  Menu,
  X,
  HelpCircle,
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
    name: "Expenses",
    href: "/expenses",
    icon: <Receipt className="w-6 h-6" strokeWidth={1} />,
  },
];

// Tooltip component for desktop navigation
const Tooltip = ({
  children,
  content,
}: {
  children: React.ReactNode;
  content: string;
}) => {
  const [isVisible, setIsVisible] = useState(false);

  return (
    <div
      className="relative"
      onMouseEnter={() => setIsVisible(true)}
      onMouseLeave={() => setIsVisible(false)}
    >
      {children}
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -10 }}
          className="absolute left-full ml-3 top-1/2 transform -translate-y-1/2 z-[100] pointer-events-none"
        >
          <div className="bg-black text-white text-sm font-medium px-3 py-2 rounded-lg shadow-lg whitespace-nowrap">
            {content}
            <div className="absolute right-full top-1/2 transform -translate-y-1/2 w-0 h-0 border-t-4 border-b-4 border-r-4 border-transparent border-r-black"></div>
          </div>
        </motion.div>
      )}
    </div>
  );
};

export default function Navigation() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const pathname = usePathname();

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
  };

  return (
    <>
      {/* Desktop Navigation */}
      <nav className="hidden md:flex md:flex-col w-16 lg:w-20 h-full bg-[#2C3930] rounded-lg">
        {/* Navigation Items */}
        <div className="flex-1 flex flex-col items-center justify-center space-y-6">
          {navigationItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Tooltip key={item.name} content={item.name}>
                <Link
                  href={item.href}
                  className={`relative text-white rounded-xl transition-all duration-300`}
                >
                  <div className="w-6 h-6">{item.icon}</div>
                  {isActive && (
                    <div className="absolute -left-2 top-1/2 transform -translate-y-1/2 w-1 h-8 bg-white rounded-l-full"></div>
                  )}
                </Link>
              </Tooltip>
            );
          })}
        </div>

        {/* Bottom Buttons */}
        <div className="flex flex-col items-center space-y-3 lg:space-y-4 p-3 lg:p-4">
          {/* Sync Button */}
          <Tooltip content="GitHub Sync">
            <div className="w-8 h-8 lg:w-10 lg:h-10 rounded-xl overflow-hidden">
              <SyncButton className="w-full h-full" />
            </div>
          </Tooltip>

          {/* Shortcuts Button */}
          <Tooltip content="Keyboard Shortcuts">
            <Button
              variant="ghost"
              size="icon"
              className="w-8 h-8 lg:w-10 lg:h-10 text-white hover:bg-white/20 rounded-xl"
              onClick={() => {
                const event = new CustomEvent("shortcut:help");
                document.dispatchEvent(event);
              }}
            >
              <HelpCircle className="w-4 h-4 lg:w-5 lg:h-5" />
            </Button>
          </Tooltip>
        </div>
      </nav>

      {/* Mobile Navigation */}
      <nav className="md:hidden w-full">
        {/* Mobile Header */}
        <div className="flex items-center justify-between px-2 sm:px-4 py-2 sm:py-4">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-[#2C3930] rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">P</span>
            </div>
            <span className="text-xl font-bold text-black">Progress OS</span>
          </Link>

          {/* Hamburger Button */}
          <Button
            variant="ghost"
            size="icon"
            onClick={toggleMobileMenu}
            aria-label="Toggle mobile menu"
          >
            <motion.div
              animate={{ rotate: isMobileMenuOpen ? 90 : 0 }}
              transition={{ duration: 0.2 }}
            >
              {isMobileMenuOpen ? (
                <X className="w-6 h-6 text-gray-700" />
              ) : (
                <Menu className="w-6 h-6 text-gray-700" />
              )}
            </motion.div>
          </Button>
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
                onClick={closeMobileMenu}
              />

              {/* Mobile Menu */}
              <motion.div
                className="fixed top-0 right-0 h-full w-80 sm:w-96 max-w-[90vw] bg-white shadow-xl z-50"
                initial={{ x: "100%" }}
                animate={{ x: 0 }}
                exit={{ x: "100%" }}
                transition={{ type: "spring", damping: 25, stiffness: 200 }}
              >
                {/* Mobile Menu Header */}
                <div className="flex items-center justify-between p-4 border-b border-gray-200">
                  <span className="text-lg font-semibold text-black">Menu</span>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={closeMobileMenu}
                    aria-label="Close mobile menu"
                  >
                    <X className="w-5 h-5 text-gray-500" />
                  </Button>
                </div>

                {/* Mobile Menu Items */}
                <div className="p-4 flex-1">
                  <div className="space-y-2">
                    {navigationItems.map((item, index) => {
                      const isActive = pathname === item.href;
                      return (
                        <motion.div
                          key={item.name}
                          initial={{ opacity: 0, x: 20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: index * 0.1 }}
                        >
                          <Link
                            href={item.href}
                            onClick={closeMobileMenu}
                            className={`flex items-center space-x-3 px-4 py-3 rounded-lg transition-all duration-200 ${
                              isActive
                                ? "bg-[#2C3930] text-white"
                                : "text-gray-700 hover:bg-gray-100 hover:text-black"
                            }`}
                          >
                            {item.icon}
                            <span className="font-medium">{item.name}</span>
                          </Link>
                        </motion.div>
                      );
                    })}
                  </div>
                </div>

                {/* Mobile Bottom Buttons */}
                <div className="p-3 sm:p-4 border-t border-gray-200">
                  <div className="flex flex-col sm:flex-row gap-3">
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.3 }}
                      className="flex-1"
                    >
                      <SyncButton className="w-full h-10 sm:h-12" />
                    </motion.div>
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.4 }}
                      className="flex-1"
                    >
                      <Button
                        variant="outline"
                        className="w-full h-10 sm:h-12 flex items-center justify-center space-x-2 sm:space-x-3 text-sm sm:text-base"
                        onClick={() => {
                          const event = new CustomEvent("shortcut:help");
                          document.dispatchEvent(event);
                          closeMobileMenu();
                        }}
                      >
                        <HelpCircle className="w-4 h-4 sm:w-5 sm:h-5" />
                        <span className="font-medium hidden sm:inline">
                          Keyboard Shortcuts
                        </span>
                        <span className="font-medium sm:hidden">Shortcuts</span>
                      </Button>
                    </motion.div>
                  </div>
                </div>
              </motion.div>
            </>
          )}
        </AnimatePresence>
      </nav>
    </>
  );
}
