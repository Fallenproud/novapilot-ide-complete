
import { create } from 'zustand';

export interface EditorTab {
  id: string;
  name: string;
  path: string;
  language: string;
  fileId: string; // Reference to the actual file in project store
  isDirty?: boolean;
}

interface EditorStore {
  tabs: EditorTab[];
  activeTabId: string | null;
  theme: 'light' | 'dark';
  fontSize: number;
  wordWrap: boolean;
  minimap: boolean;
  
  // Actions
  openTab: (tab: Omit<EditorTab, 'isDirty'>) => void;
  closeTab: (tabId: string) => void;
  setActiveTab: (tabId: string) => void;
  markTabDirty: (tabId: string, isDirty: boolean) => void;
  updateTabContent: (tabId: string, content: string) => void;
  
  // Settings
  setTheme: (theme: 'light' | 'dark') => void;
  setFontSize: (size: number) => void;
  setWordWrap: (enabled: boolean) => void;
  setMinimap: (enabled: boolean) => void;
}

export const useEditorStore = create<EditorStore>((set, get) => ({
  tabs: [],
  activeTabId: null,
  theme: 'dark',
  fontSize: 14,
  wordWrap: true,
  minimap: true,
  
  openTab: (newTab) => {
    const { tabs } = get();
    const existingTab = tabs.find(tab => tab.fileId === newTab.fileId);
    
    if (existingTab) {
      // Tab already exists, just activate it
      set({ activeTabId: existingTab.id });
    } else {
      // Create new tab
      const tabWithDefaults = {
        ...newTab,
        isDirty: false
      };
      set({ 
        tabs: [...tabs, tabWithDefaults],
        activeTabId: newTab.id
      });
    }
  },
  
  closeTab: (tabId) => {
    const { tabs, activeTabId } = get();
    const newTabs = tabs.filter(tab => tab.id !== tabId);
    
    let newActiveTabId = activeTabId;
    if (activeTabId === tabId) {
      // If closing active tab, switch to next or previous tab
      const closingIndex = tabs.findIndex(tab => tab.id === tabId);
      if (newTabs.length > 0) {
        const nextIndex = Math.min(closingIndex, newTabs.length - 1);
        newActiveTabId = newTabs[nextIndex]?.id || null;
      } else {
        newActiveTabId = null;
      }
    }
    
    set({ 
      tabs: newTabs,
      activeTabId: newActiveTabId
    });
  },
  
  setActiveTab: (tabId) => {
    set({ activeTabId: tabId });
  },
  
  markTabDirty: (tabId, isDirty) => {
    set(state => ({
      tabs: state.tabs.map(tab =>
        tab.id === tabId ? { ...tab, isDirty } : tab
      )
    }));
  },
  
  updateTabContent: (tabId, content) => {
    // This could be used for future content caching if needed
  },
  
  setTheme: (theme) => set({ theme }),
  setFontSize: (fontSize) => set({ fontSize }),
  setWordWrap: (wordWrap) => set({ wordWrap }),
  setMinimap: (minimap) => set({ minimap }),
}));
