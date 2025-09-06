"use client";
import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { LayoutDashboard, Receipt, Target } from "lucide-react";

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
      <nav className="hidden lg:flex lg:flex-col w-16 bg-black h-full rounded-lg">
        {/* Navigation Items */}
        <div className="flex-1 flex flex-col items-center justify-center space-y-4">
          {navigationItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Tooltip key={item.name} content={item.name}>
                <Link
                  href={item.href}
                  className={`rounded-lg transition-all duration-200 `}
                >
                  <div
                    className={`w-6 h-6 ${
                      isActive
                        ? "text-white font-bold"
                        : "text-gray-400 hover:text-white"
                    }`}
                  >
                    {item.icon}
                  </div>
                </Link>
              </Tooltip>
            );
          })}
        </div>
      </nav>

      {/* Mobile Navigation */}
      <nav className="lg:hidden w-full">
        {/* Mobile Header */}
        <div className="flex items-center justify-between px-4 py-4">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">P</span>
            </div>
            <span className="text-xl font-bold text-black">Progress OS</span>
          </Link>

          {/* Hamburger Button */}
          <button
            onClick={toggleMobileMenu}
            className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
            aria-label="Toggle mobile menu"
          >
            <motion.svg
              className="w-6 h-6 text-gray-700"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              animate={{ rotate: isMobileMenuOpen ? 90 : 0 }}
              transition={{ duration: 0.2 }}
            >
              {isMobileMenuOpen ? (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              ) : (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 6h16M4 12h16M4 18h16"
                />
              )}
            </motion.svg>
          </button>
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
                className="fixed top-0 right-0 h-full w-80 max-w-[85vw] bg-white shadow-xl z-50"
                initial={{ x: "100%" }}
                animate={{ x: 0 }}
                exit={{ x: "100%" }}
                transition={{ type: "spring", damping: 25, stiffness: 200 }}
              >
                {/* Mobile Menu Header */}
                <div className="flex items-center justify-between p-4 border-b border-gray-200">
                  <span className="text-lg font-semibold text-black">Menu</span>
                  <button
                    onClick={closeMobileMenu}
                    className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
                    aria-label="Close mobile menu"
                  >
                    <svg
                      className="w-5 h-5 text-gray-500"
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

                {/* Mobile Menu Items */}
                <div className="p-4">
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
                                ? "bg-primary text-white"
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
              </motion.div>
            </>
          )}
        </AnimatePresence>
      </nav>
    </>
  );
}
