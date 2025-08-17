
import React, { createContext, useContext, useEffect, useRef } from 'react';
import { CodeIntelligenceEngine } from '@/services/lovable/codeIntelligence';
import { useProjectStore } from '@/stores/projectStore';

interface CodeIntelligenceContextType {
  engine: CodeIntelligenceEngine | null;
}

const CodeIntelligenceContext = createContext<CodeIntelligenceContextType>({
  engine: null
});

export const useCodeIntelligence = () => {
  return useContext(CodeIntelligenceContext);
};

interface CodeIntelligenceProviderProps {
  children: React.ReactNode;
}

const CodeIntelligenceProvider: React.FC<CodeIntelligenceProviderProps> = ({ children }) => {
  const engineRef = useRef<CodeIntelligenceEngine | null>(null);
  const { allFiles } = useProjectStore();

  useEffect(() => {
    // Initialize engine
    if (!engineRef.current) {
      engineRef.current = new CodeIntelligenceEngine();
    }

    // Update engine with all files
    allFiles.forEach(file => {
      if (engineRef.current && (file.language === 'typescript' || file.language === 'javascript' || 
          file.language === 'tsx' || file.language === 'jsx')) {
        engineRef.current.updateFile(file.path, file.content);
      }
    });

    return () => {
      if (engineRef.current) {
        engineRef.current.dispose();
        engineRef.current = null;
      }
    };
  }, [allFiles]);

  return (
    <CodeIntelligenceContext.Provider value={{ engine: engineRef.current }}>
      {children}
    </CodeIntelligenceContext.Provider>
  );
};

export default CodeIntelligenceProvider;
