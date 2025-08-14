
import { useEffect, useRef } from "react";
import Editor from "@monaco-editor/react";
import { useEditorStore } from "@/stores/editorStore";
import { useProjectStore } from "@/stores/projectStore";
import { useUIStore } from "@/stores/uiStore";

const MonacoEditor = () => {
  const editorRef = useRef<any>(null);
  const { activeTabId, tabs, markTabDirty, theme, fontSize, wordWrap, minimap } = useEditorStore();
  const { updateFile, activeProject } = useProjectStore();
  const { isDarkMode } = useUIStore();

  const activeTab = tabs.find(tab => tab.id === activeTabId);

  const handleEditorDidMount = (editor: any) => {
    editorRef.current = editor;
    
    // Configure editor theme
    editor.updateOptions({
      theme: isDarkMode ? 'vs-dark' : 'vs-light',
      fontSize,
      wordWrap: wordWrap ? 'on' : 'off',
      minimap: { enabled: minimap },
      automaticLayout: true,
      scrollBeyondLastLine: false,
      renderWhitespace: 'selection',
      lineNumbers: 'on',
      folding: true,
      bracketMatching: 'always',
      autoIndent: 'full',
      formatOnPaste: true,
      formatOnType: true,
    });
  };

  const handleChange = (value: string | undefined) => {
    if (!activeTab || !activeProject || value === undefined) return;
    
    // Mark tab as dirty
    markTabDirty(activeTab.id, true);
    
    // Update file content in project store
    updateFile(activeProject.id, activeTab.fileId, value);
  };

  useEffect(() => {
    if (editorRef.current) {
      editorRef.current.updateOptions({
        theme: isDarkMode ? 'vs-dark' : 'vs-light',
        fontSize,
        wordWrap: wordWrap ? 'on' : 'off',
        minimap: { enabled: minimap },
      });
    }
  }, [isDarkMode, fontSize, wordWrap, minimap]);

  if (!activeTab) {
    return (
      <div className="flex-1 flex items-center justify-center bg-[#0D1117] text-[#8B949E]">
        <div className="text-center">
          <div className="text-4xl mb-4">📝</div>
          <h3 className="text-lg font-medium mb-2">No file selected</h3>
          <p className="text-sm">Select a file from the explorer to start editing</p>
        </div>
      </div>
    );
  }

  // Get file content from project
  const file = activeProject?.files.find(f => f.id === activeTab.fileId);
  const content = file?.content || '';

  return (
    <div className="flex-1 relative">
      <Editor
        height="100%"
        language={activeTab.language}
        value={content}
        onChange={handleChange}
        onMount={handleEditorDidMount}
        theme={isDarkMode ? 'vs-dark' : 'vs-light'}
        options={{
          fontSize,
          wordWrap: wordWrap ? 'on' : 'off',
          minimap: { enabled: minimap },
          automaticLayout: true,
          scrollBeyondLastLine: false,
          renderWhitespace: 'selection',
          lineNumbers: 'on',
          folding: true,
          bracketMatching: 'always',
          autoIndent: 'full',
          formatOnPaste: true,
          formatOnType: true,
        }}
      />
    </div>
  );
};

export default MonacoEditor;
