
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface UIState {
  // Panel sizes (for resizable layouts)
  sidebarWidth: number;
  editorHeight: number;
  previewWidth: number;
  terminalHeight: number;
  
  // Modal states
  isCommandPaletteOpen: boolean;
  isSettingsOpen: boolean;
  isAboutOpen: boolean;
  
  // Layout preferences
  layout: 'split' | 'editor-only' | 'preview-only';
  showMinimap: boolean;
  showLineNumbers: boolean;
  
  // Theme management
  isDarkMode: boolean;
  
  // Actions
  setSidebarWidth: (width: number) => void;
  setEditorHeight: (height: number) => void;
  setPreviewWidth: (width: number) => void;
  setTerminalHeight: (height: number) => void;
  
  toggleCommandPalette: () => void;
  toggleSettings: () => void;
  toggleAbout: () => void;
  
  setLayout: (layout: 'split' | 'editor-only' | 'preview-only') => void;
  toggleMinimap: () => void;
  toggleLineNumbers: () => void;
  
  setDarkMode: (isDark: boolean) => void;
  toggleDarkMode: () => void;
  
  resetLayout: () => void;
}

export const useUIStore = create<UIState>()(
  persist(
    (set) => ({
      // Default panel sizes
      sidebarWidth: 300,
      editorHeight: 400,
      previewWidth: 500,
      terminalHeight: 200,
      
      // Modal states
      isCommandPaletteOpen: false,
      isSettingsOpen: false,
      isAboutOpen: false,
      
      // Layout preferences
      layout: 'split',
      showMinimap: false,
      showLineNumbers: true,
      
      // Theme management
      isDarkMode: true,

      setSidebarWidth: (width) => {
        set({ sidebarWidth: Math.max(200, Math.min(600, width)) });
      },

      setEditorHeight: (height) => {
        set({ editorHeight: Math.max(200, Math.min(800, height)) });
      },

      setPreviewWidth: (width) => {
        set({ previewWidth: Math.max(300, Math.min(1000, width)) });
      },

      setTerminalHeight: (height) => {
        set({ terminalHeight: Math.max(100, Math.min(400, height)) });
      },

      toggleCommandPalette: () => {
        set(state => ({ isCommandPaletteOpen: !state.isCommandPaletteOpen }));
      },

      toggleSettings: () => {
        set(state => ({ isSettingsOpen: !state.isSettingsOpen }));
      },

      toggleAbout: () => {
        set(state => ({ isAboutOpen: !state.isAboutOpen }));
      },

      setLayout: (layout) => {
        set({ layout });
      },

      toggleMinimap: () => {
        set(state => ({ showMinimap: !state.showMinimap }));
      },

      toggleLineNumbers: () => {
        set(state => ({ showLineNumbers: !state.showLineNumbers }));
      },

      setDarkMode: (isDark) => {
        set({ isDarkMode: isDark });
      },

      toggleDarkMode: () => {
        set(state => ({ isDarkMode: !state.isDarkMode }));
      },

      resetLayout: () => {
        set({
          sidebarWidth: 300,
          editorHeight: 400,
          previewWidth: 500,
          terminalHeight: 200,
          layout: 'split'
        });
      }
    }),
    {
      name: 'novapilot-ui'
    }
  )
);
