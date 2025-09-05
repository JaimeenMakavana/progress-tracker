import { useEffect, useCallback } from "react";

export interface KeyboardShortcut {
  key: string;
  ctrlKey?: boolean;
  shiftKey?: boolean;
  altKey?: boolean;
  metaKey?: boolean;
  action: () => void;
  description: string;
}

export function useKeyboardShortcuts(shortcuts: KeyboardShortcut[]) {
  const handleKeyDown = useCallback(
    (event: KeyboardEvent) => {
      const matchingShortcut = shortcuts.find((shortcut) => {
        return (
          shortcut.key.toLowerCase() === event.key.toLowerCase() &&
          !!shortcut.ctrlKey === event.ctrlKey &&
          !!shortcut.shiftKey === event.shiftKey &&
          !!shortcut.altKey === event.altKey &&
          !!shortcut.metaKey === event.metaKey
        );
      });

      if (matchingShortcut) {
        // Don't trigger if user is typing in an input
        const target = event.target as HTMLElement;
        if (
          target.tagName === "INPUT" ||
          target.tagName === "TEXTAREA" ||
          target.contentEditable === "true"
        ) {
          return;
        }

        event.preventDefault();
        matchingShortcut.action();
      }
    },
    [shortcuts]
  );

  useEffect(() => {
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [handleKeyDown]);
}

// Global keyboard shortcuts for the app
export const GLOBAL_SHORTCUTS: KeyboardShortcut[] = [
  {
    key: "n",
    action: () => {
      // Trigger new tracker creation
      const event = new CustomEvent("shortcut:new-tracker");
      document.dispatchEvent(event);
    },
    description: "Create new tracker",
  },
  {
    key: "t",
    action: () => {
      // Trigger new task creation
      const event = new CustomEvent("shortcut:new-task");
      document.dispatchEvent(event);
    },
    description: "Create new task",
  },
  {
    key: "f",
    action: () => {
      // Focus search
      const searchInput = document.querySelector(
        'input[type="search"], input[placeholder*="search" i]'
      ) as HTMLInputElement;
      if (searchInput) {
        searchInput.focus();
      }
    },
    description: "Focus search",
  },
  {
    key: "d",
    action: () => {
      // Start Deep Work on selected task
      const event = new CustomEvent("shortcut:deep-work");
      document.dispatchEvent(event);
    },
    description: "Start Deep Work timer",
  },
  {
    key: " ",
    action: () => {
      // Toggle selected task completion
      const event = new CustomEvent("shortcut:toggle-task");
      document.dispatchEvent(event);
    },
    description: "Toggle task completion",
  },
  {
    key: "Escape",
    action: () => {
      // Close modals/cancel actions
      const event = new CustomEvent("shortcut:escape");
      document.dispatchEvent(event);
    },
    description: "Close modal/cancel",
  },
  {
    key: "?",
    action: () => {
      // Show keyboard shortcuts help
      const event = new CustomEvent("shortcut:help");
      document.dispatchEvent(event);
    },
    description: "Show keyboard shortcuts",
  },
];

// Hook for managing focus
export function useFocusManagement() {
  const trapFocus = useCallback((container: HTMLElement) => {
    const focusableElements = container.querySelectorAll(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    ) as NodeListOf<HTMLElement>;

    const firstElement = focusableElements[0];
    const lastElement = focusableElements[focusableElements.length - 1];

    const handleTabKey = (e: KeyboardEvent) => {
      if (e.key === "Tab") {
        if (e.shiftKey) {
          if (document.activeElement === firstElement) {
            lastElement.focus();
            e.preventDefault();
          }
        } else {
          if (document.activeElement === lastElement) {
            firstElement.focus();
            e.preventDefault();
          }
        }
      }
    };

    container.addEventListener("keydown", handleTabKey);
    firstElement?.focus();

    return () => {
      container.removeEventListener("keydown", handleTabKey);
    };
  }, []);

  const restoreFocus = useCallback((element: HTMLElement) => {
    element.focus();
  }, []);

  return { trapFocus, restoreFocus };
}
