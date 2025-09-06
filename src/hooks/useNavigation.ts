import { useState } from "react";
import { usePathname } from "next/navigation";

export const useNavigation = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const pathname = usePathname();

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
  };

  const triggerShortcutsHelp = () => {
    const event = new CustomEvent("shortcut:help");
    document.dispatchEvent(event);
  };

  return {
    isMobileMenuOpen,
    pathname,
    toggleMobileMenu,
    closeMobileMenu,
    triggerShortcutsHelp,
  };
};
