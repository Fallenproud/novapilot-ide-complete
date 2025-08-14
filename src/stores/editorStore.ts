
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface EditorTab {
  id: string;
  fileId: string;
  fileName: string;
  filePath: string;
  language: string;
  isDirty?: boolean;
  isActive: boolean;  // Made required instead of optional
}

interface EditorState {
  tabs: EditorTab[];
  activeTabId: string | null;
  theme: 'light' | 'dark';
  fontSize: number;
  wordWrap: boolean;
  minimap: boolean;
  
  // Actions
  openTab: (file: { id: string; name: string; path: string; language: string }) => void;
  closeTab: (tabId: string) => void;
  setActiveTab: (tabId: string) => void;
  markTabDirty: (tabId: string, isDirty: boolean) => void;
  closeAllTabs: () => void;
  closeOtherTabs: (keepTabId: string) => void;
  
  // Settings
  setTheme: (theme: 'light' | 'dark') => void;
  setFontSize: (size: number) => void;
  toggleWordWrap: () => void;
  toggleMinimap: () => void;
}

export const useEditorStore = create<EditorState>()(
  persist(
    (set, get) => ({
      tabs: [],
      activeTabId: null,
      theme: 'dark',
      fontSize: 14,
      wordWrap: true,
      minimap: false,

      openTab: (file) => {
        const existingTab = get().tabs.find(tab => tab.fileId === file.id);
        
        if (existingTab) {
          set({ activeTabId: existingTab.id });
          return;
        }

        const newTab: EditorTab = {
          id: crypto.randomUUID(),
          fileId: file.id,
          fileName: file.name,
          filePath: file.path,
          language: file.language,
          isDirty: false,
          isActive: true
        };

        set(state => ({
          tabs: [...state.tabs.map(tab => ({ ...tab, isActive: false })), newTab],
          activeTabId: newTab.id
        }));
      },

      closeTab: (tabId: string) => {
        const state = get();
        const tabIndex = state.tabs.findIndex(tab => tab.id === tabId);
        const newTabs = state.tabs.filter(tab => tab.id !== tabId);
        
        let newActiveTabId = state.activeTabId;
        if (state.activeTabId === tabId) {
          if (newTabs.length > 0) {
            const nextIndex = Math.min(tabIndex, newTabs.length - 1);
            newActiveTabId = newTabs[nextIndex]?.id || null;
          } else {
            newActiveTabId = null;
          }
        }

        set({
          tabs: newTabs.map(tab => ({
            ...tab,
            isActive: tab.id === newActiveTabId
          })),
          activeTabId: newActiveTabId
        });
      },

      setActiveTab: (tabId: string) => {
        set(state => ({
          tabs: state.tabs.map(tab => ({
            ...tab,
            isActive: tab.id === tabId
          })),
          activeTabId: tabId
        }));
      },

      markTabDirty: (tabId: string, isDirty: boolean) => {
        set(state => ({
          tabs: state.tabs.map(tab =>
            tab.id === tabId ? { ...tab, isDirty } : tab
          )
        }));
      },

      closeAllTabs: () => {
        set({ tabs: [], activeTabId: null });
      },

      closeOtherTabs: (keepTabId: string) => {
        set(state => ({
          tabs: state.tabs.filter(tab => tab.id === keepTabId),
          activeTabId: keepTabId
        }));
      },

      setTheme: (theme: 'light' | 'dark') => {
        set({ theme });
      },

      setFontSize: (fontSize: number) => {
        set({ fontSize: Math.max(8, Math.min(32, fontSize)) });
      },

      toggleWordWrap: () => {
        set(state => ({ wordWrap: !state.wordWrap }));
      },

      toggleMinimap: () => {
        set(state => ({ minimap: !state.minimap }));
      }
    }),
    {
      name: 'novapilot-editor'
    }
  )
);
