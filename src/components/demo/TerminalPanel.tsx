
import { useState, useEffect } from "react";
import { ScrollArea } from "@/components/ui/scroll-area";

const TerminalPanel = () => {
  const [lines, setLines] = useState<string[]>([]);
  const [currentLine, setCurrentLine] = useState(0);

  const terminalSequence = [
    "$ npm create vite@latest task-manager --template react-ts",
    "✓ Project created successfully!",
    "",
    "$ cd task-manager",
    "$ npm install",
    "⠋ Installing dependencies...",
    "✓ Dependencies installed",
    "",
    "$ npm run dev",
    "",
    "  VITE v5.0.0  ready in 543 ms",
    "",
    "  ➜  Local:   http://localhost:3000/",
    "  ➜  Network: use --host to expose",
    "",
    "$ # Building TaskCard component...",
    "✓ Generated TaskCard.tsx",
    "✓ Generated TaskBoard.tsx", 
    "✓ Generated API integration",
    "✓ Added drag & drop functionality",
    "",
    "🚀 Development server ready!",
    "💡 Live preview updated",
    ""
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      if (currentLine < terminalSequence.length) {
        setLines(prev => [...prev, terminalSequence[currentLine]]);
        setCurrentLine(prev => prev + 1);
      }
    }, 800);

    return () => clearInterval(timer);
  }, [currentLine]);

  return (
    <div className="h-full bg-black text-green-400 font-mono text-sm">
      <div className="border-b border-gray-800 px-4 py-2 bg-gray-900">
        <div className="flex items-center space-x-2">
          <div className="flex space-x-1">
            <div className="w-3 h-3 bg-red-500 rounded-full"></div>
            <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
            <div className="w-3 h-3 bg-green-500 rounded-full"></div>
          </div>
          <span className="text-gray-400 text-xs">Terminal</span>
        </div>
      </div>
      
      <ScrollArea className="h-[calc(100%-60px)]">
        <div className="p-4 space-y-1">
          {lines.map((line, index) => (
            <div key={index} className="flex items-start">
              {line.startsWith('$') ? (
                <span className="text-blue-400">{line}</span>
              ) : line.startsWith('✓') ? (
                <span className="text-green-400">{line}</span>
              ) : line.startsWith('⠋') ? (
                <span className="text-yellow-400">{line}</span>
              ) : line.startsWith('🚀') || line.startsWith('💡') ? (
                <span className="text-purple-400">{line}</span>
              ) : line.startsWith('➜') ? (
                <span className="text-cyan-400">{line}</span>
              ) : (
                <span className="text-gray-300">{line}</span>
              )}
            </div>
          ))}
          {currentLine < terminalSequence.length && (
            <div className="flex items-center">
              <span className="animate-pulse">_</span>
            </div>
          )}
        </div>
      </ScrollArea>
    </div>
  );
};

export default TerminalPanel;
