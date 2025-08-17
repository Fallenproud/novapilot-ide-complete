
import React from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { MessageSquare, FileText, Terminal } from "lucide-react";
import PromptInput from "./PromptInput";
import ChatMessages from "./ChatMessages";
import FileExplorerEnhanced from "./FileExplorerEnhanced";

const PlaygroundSidebar: React.FC = () => {
  return (
    <div className="h-full flex flex-col bg-[#161B22] border-r border-[#21262D]">
      {/* AI Input Section - Compact */}
      <div className="flex-shrink-0 border-b border-[#21262D] p-4">
        <PromptInput />
      </div>

      {/* Chat Messages - Expandable */}
      <div className="flex-1 flex flex-col min-h-0">
        <div className="p-3 bg-[#21262D] border-b border-[#30363D] flex-shrink-0">
          <div className="flex items-center space-x-2">
            <MessageSquare className="h-4 w-4 text-[#1F6FEB]" />
            <h3 className="text-sm font-medium text-[#F0F6FC]">AI Chat</h3>
          </div>
        </div>
        <div className="flex-1 overflow-hidden">
          <ChatMessages />
        </div>
      </div>

      {/* Bottom Panels - Fixed Height */}
      <div className="h-64 border-t border-[#21262D] flex-shrink-0">
        <Tabs defaultValue="files" className="h-full flex flex-col">
          <TabsList className="w-full bg-[#21262D] border-b border-[#30363D] rounded-none flex-shrink-0">
            <TabsTrigger value="files" className="flex-1 data-[state=active]:bg-[#0D1117]">
              <FileText className="mr-2 h-4 w-4" />
              <span className="hidden sm:inline">Files</span>
            </TabsTrigger>
            <TabsTrigger value="terminal" className="flex-1 data-[state=active]:bg-[#0D1117]">
              <Terminal className="mr-2 h-4 w-4" />
              <span className="hidden sm:inline">Terminal</span>
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="files" className="flex-1 m-0 overflow-hidden">
            <FileExplorerEnhanced />
          </TabsContent>
          
          <TabsContent value="terminal" className="flex-1 m-0 p-4 overflow-hidden">
            <div className="h-full bg-black rounded font-mono text-sm text-green-400 p-3 overflow-auto">
              <div className="text-[#8B949E] mb-2">NovaPilot Terminal v1.0.0</div>
              <div className="text-green-400">$ Ready for commands...</div>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default PlaygroundSidebar;
