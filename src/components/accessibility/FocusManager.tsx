import React, { useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';

interface FocusManagerProps {
  children: React.ReactNode;
  enabled?: boolean;
  className?: string;
}

interface FocusableElement extends HTMLElement {
  tabIndex: number;
}

const FOCUSABLE_SELECTORS = [
  'button:not([disabled])',
  'input:not([disabled])',
  'select:not([disabled])',
  'textarea:not([disabled])',
  'a[href]',
  '[tabindex]:not([tabindex="-1"])',
  '[contenteditable="true"]',
];

// Focus outline overlay component
const FocusOutline = ({ target }: { target: Element | null }) => {
  if (!target) return null;

  const rect = target.getBoundingClientRect();
  
  return createPortal(
    <div
      className="fixed pointer-events-none z-[9999] border-2 border-blue-500 bg-blue-500/10 rounded-md transition-all duration-150"
      style={{
        left: rect.left - 2,
        top: rect.top - 2,
        width: rect.width + 4,
        height: rect.height + 4,
      }}
    />,
    document.body
  );
};

// Skip link component
const SkipLink = () => (
  <a
    href="#main-content"
    className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-[10000] focus:bg-primary focus:text-primary-foreground focus:px-4 focus:py-2 focus:rounded-md focus:shadow-lg"
  >
    Skip to main content
  </a>
);

// Live region for announcements
const LiveRegion = () => {
  const [announcement, setAnnouncement] = useState('');
  
  useEffect(() => {
    const handleAnnouncement = (event: CustomEvent) => {
      setAnnouncement(event.detail.message);
      // Clear after announcement
      setTimeout(() => setAnnouncement(''), 1000);
    };

    window.addEventListener('announce' as any, handleAnnouncement);
    return () => window.removeEventListener('announce' as any, handleAnnouncement);
  }, []);

  return (
    <div
      aria-live="polite"
      aria-atomic="true"
      className="sr-only"
    >
      {announcement}
    </div>
  );
};

// Keyboard navigation hints
const KeyboardHints = ({ visible }: { visible: boolean }) => {
  if (!visible) return null;

  const hints = [
    { key: 'Tab', action: 'Navigate forward' },
    { key: 'Shift + Tab', action: 'Navigate backward' },
    { key: 'Enter', action: 'Activate' },
    { key: 'Space', action: 'Toggle/Select' },
    { key: 'Escape', action: 'Cancel/Close' },
    { key: 'Arrow Keys', action: 'Navigate lists' },
    { key: 'Ctrl/Cmd + K', action: 'Command palette' },
    { key: '?', action: 'Show shortcuts' },
  ];

  return createPortal(
    <div className="fixed bottom-4 right-4 z-[9999] bg-card border border-border rounded-lg shadow-lg p-4 max-w-sm">
      <h3 className="font-semibold text-sm mb-3">Keyboard Navigation</h3>
      <div className="space-y-2 text-xs">
        {hints.map((hint, index) => (
          <div key={index} className="flex justify-between">
            <kbd className="bg-muted px-2 py-1 rounded text-muted-foreground font-mono">
              {hint.key}
            </kbd>
            <span className="text-muted-foreground ml-3">{hint.action}</span>
          </div>
        ))}
      </div>
    </div>,
    document.body
  );
};

export const FocusManager: React.FC<FocusManagerProps> = ({ 
  children, 
  enabled = true,
  className = ""
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [focusedElement, setFocusedElement] = useState<Element | null>(null);
  const [showKeyboardHints, setShowKeyboardHints] = useState(false);
  const [focusVisible, setFocusVisible] = useState(false);
  const [isKeyboardUser, setIsKeyboardUser] = useState(false);

  // Detect keyboard usage
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Tab') {
        setIsKeyboardUser(true);
        setFocusVisible(true);
      }
      if (e.key === '?' && (e.ctrlKey || e.metaKey)) {
        e.preventDefault();
        setShowKeyboardHints(!showKeyboardHints);
      }
    };

    const handleMouseDown = () => {
      setFocusVisible(false);
    };

    document.addEventListener('keydown', handleKeyDown);
    document.addEventListener('mousedown', handleMouseDown);

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.removeEventListener('mousedown', handleMouseDown);
    };
  }, [showKeyboardHints]);

  // Focus tracking
  useEffect(() => {
    if (!enabled) return;

    const handleFocus = (e: FocusEvent) => {
      if (isKeyboardUser && focusVisible) {
        setFocusedElement(e.target as Element);
      }
    };

    const handleBlur = () => {
      setFocusedElement(null);
    };

    document.addEventListener('focusin', handleFocus);
    document.addEventListener('focusout', handleBlur);

    return () => {
      document.removeEventListener('focusin', handleFocus);
      document.removeEventListener('focusout', handleBlur);
    };
  }, [enabled, isKeyboardUser, focusVisible]);

  // Focus management utilities
  const getFocusableElements = (container: Element = document.body): FocusableElement[] => {
    return Array.from(
      container.querySelectorAll(FOCUSABLE_SELECTORS.join(', '))
    ).filter(element => {
      const el = element as HTMLElement;
      return el.offsetParent !== null && !('disabled' in el && (el as any).disabled) && el.tabIndex !== -1;
    }) as FocusableElement[];
  };

  const focusFirst = () => {
    if (containerRef.current) {
      const focusable = getFocusableElements(containerRef.current);
      focusable[0]?.focus();
    }
  };

  const focusLast = () => {
    if (containerRef.current) {
      const focusable = getFocusableElements(containerRef.current);
      focusable[focusable.length - 1]?.focus();
    }
  };

  // Trap focus within container
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Tab' && containerRef.current) {
      const focusable = getFocusableElements(containerRef.current);
      const currentIndex = focusable.indexOf(document.activeElement as FocusableElement);
      
      if (e.shiftKey) {
        // Shift + Tab (backward)
        if (currentIndex === 0) {
          e.preventDefault();
          focusable[focusable.length - 1]?.focus();
        }
      } else {
        // Tab (forward)
        if (currentIndex === focusable.length - 1) {
          e.preventDefault();
          focusable[0]?.focus();
        }
      }
    }
  };

  return (
    <>
      <SkipLink />
      <div
        ref={containerRef}
        className={className}
        onKeyDown={handleKeyDown}
        role="application"
        aria-label="IDE Application"
      >
        {children}
      </div>
      {focusVisible && <FocusOutline target={focusedElement} />}
      <KeyboardHints visible={showKeyboardHints} />
      <LiveRegion />
    </>
  );
};

// Utility functions for accessibility announcements
export const announce = (message: string, priority: 'polite' | 'assertive' = 'polite') => {
  const event = new CustomEvent('announce', {
    detail: { message, priority }
  });
  window.dispatchEvent(event);
};

// Hook for managing focus
export const useFocus = () => {
  const focusElement = (selector: string) => {
    const element = document.querySelector(selector) as HTMLElement;
    element?.focus();
  };

  const focusFirstInContainer = (container: Element) => {
    const focusable = container.querySelectorAll(FOCUSABLE_SELECTORS.join(', '));
    (focusable[0] as HTMLElement)?.focus();
  };

  const restoreFocus = (previousElement: Element | null) => {
    (previousElement as HTMLElement)?.focus();
  };

  return {
    focusElement,
    focusFirstInContainer,
    restoreFocus,
    announce,
  };
};