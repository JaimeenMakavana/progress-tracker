"use client";
import React from "react";
import { DesktopNavigation } from "./DesktopNavigation";
import { MobileNavigation } from "./MobileNavigation";
import { useNavigation } from "../../hooks/useNavigation";

export default function Navigation() {
  const {
    isMobileMenuOpen,
    pathname,
    toggleMobileMenu,
    closeMobileMenu,
    triggerShortcutsHelp,
  } = useNavigation();

  return (
    <>
      <DesktopNavigation
        pathname={pathname}
        onShortcutsClick={triggerShortcutsHelp}
      />
      <MobileNavigation
        isMobileMenuOpen={isMobileMenuOpen}
        pathname={pathname}
        onToggleMobileMenu={toggleMobileMenu}
        onCloseMobileMenu={closeMobileMenu}
        onShortcutsClick={triggerShortcutsHelp}
      />
    </>
  );
}
