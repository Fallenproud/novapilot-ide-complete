
import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { MessageSquare, Eye, FileTree, Terminal, Play, Settings } from "lucide-react";
import ChatPanel from "./ChatPanel";
import PreviewWindow from "./PreviewWindow";
import FileExplorer from "./FileExplorer";
import TerminalPanel from "./TerminalPanel";

const DevelopmentEnvironment = () => {
  const [activeMode, setActiveMode] = useState<'chat' | 'build'>('build');

  return (
    <section id="demo" className="py-24">
      <div className="container">
        <div className="mx-auto max-w-6xl">
          <div className="mb-12 text-center">
            <Badge variant="secondary" className="mb-4">
              Interactive Demo
            </Badge>
            <h2 className="mb-4 text-3xl font-bold tracking-tight sm:text-4xl">
              Development Environment
            </h2>
            <p className="mx-auto max-w-2xl text-lg text-muted-foreground">
              Experience the NovaPilot interface with live chat simulation, code generation, and real-time preview.
            </p>
          </div>

          {/* Mode Switcher */}
          <div className="mb-8 flex justify-center">
            <div className="inline-flex items-center rounded-lg border bg-muted p-1">
              <Button
                variant={activeMode === 'chat' ? 'default' : 'ghost'}
                size="sm"
                onClick={() => setActiveMode('chat')}
                className="rounded-md px-4"
              >
                <MessageSquare className="mr-2 h-4 w-4" />
                Chat/Advisory Mode
              </Button>
              <Button
                variant={activeMode === 'build' ? 'default' : 'ghost'}
                size="sm"
                onClick={() => setActiveMode('build')}
                className="rounded-md px-4"
              >
                <Play className="mr-2 h-4 w-4" />
                Build Mode
              </Button>
            </div>
          </div>

          {/* Main Interface */}
          <Card className="overflow-hidden border-0 shadow-2xl">
            <div className="grid h-[700px] lg:grid-cols-2">
              {/* Left Panel */}
              <div className="border-r bg-muted/20">
                <Tabs defaultValue="chat" className="h-full">
                  <TabsList className="w-full rounded-none border-b bg-background">
                    <TabsTrigger value="chat" className="flex-1">
                      <MessageSquare className="mr-2 h-4 w-4" />
                      Chat
                    </TabsTrigger>
                    <TabsTrigger value="files" className="flex-1">
                      <FileTree className="mr-2 h-4 w-4" />
                      Files
                    </TabsTrigger>
                    <TabsTrigger value="terminal" className="flex-1">
                      <Terminal className="mr-2 h-4 w-4" />
                      Terminal
                    </TabsTrigger>
                  </TabsList>
                  
                  <TabsContent value="chat" className="h-[calc(100%-60px)] m-0">
                    <ChatPanel mode={activeMode} />
                  </TabsContent>
                  
                  <TabsContent value="files" className="h-[calc(100%-60px)] m-0">
                    <FileExplorer />
                  </TabsContent>
                  
                  <TabsContent value="terminal" className="h-[calc(100%-60px)] m-0">
                    <TerminalPanel />
                  </TabsContent>
                </Tabs>
              </div>

              {/* Right Panel - Preview */}
              <div className="bg-background">
                <div className="flex items-center justify-between border-b px-4 py-2">
                  <div className="flex items-center space-x-2">
                    <Eye className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm font-medium">Live Preview</span>
                    <Badge variant="secondary" className="text-xs">
                      localhost:3000
                    </Badge>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Button variant="ghost" size="sm">
                      <Settings className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
                <PreviewWindow mode={activeMode} />
              </div>
            </div>
          </Card>

          <div className="mt-8 text-center">
            <p className="text-sm text-muted-foreground">
              This is a simulated environment showcasing NovaPilot's interface and capabilities.
              <br />
              Switch between modes to see different interaction patterns.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default DevelopmentEnvironment;
