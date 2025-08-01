
import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { MessageSquare, Eye, Folder, Terminal, Play, Settings } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
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
          <motion.div 
            className="mb-12 text-center"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <Badge variant="secondary" className="mb-4">
              Interactive Demo
            </Badge>
            <h2 className="mb-4 text-3xl font-bold tracking-tight sm:text-4xl">
              Development Environment
            </h2>
            <p className="mx-auto max-w-2xl text-lg text-muted-foreground">
              Experience the NovaPilot interface with live chat simulation, code generation, and real-time preview.
            </p>
          </motion.div>

          {/* Mode Switcher */}
          <motion.div 
            className="mb-8 flex justify-center"
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.4 }}
          >
            <div className="inline-flex items-center rounded-lg border bg-muted p-1">
              <Button
                variant={activeMode === 'chat' ? 'default' : 'ghost'}
                size="sm"
                onClick={() => setActiveMode('chat')}
                className="rounded-md px-4 transition-all duration-200"
              >
                <MessageSquare className="mr-2 h-4 w-4" />
                Chat/Advisory Mode
              </Button>
              <Button
                variant={activeMode === 'build' ? 'default' : 'ghost'}
                size="sm"
                onClick={() => setActiveMode('build')}
                className="rounded-md px-4 transition-all duration-200"
              >
                <Play className="mr-2 h-4 w-4" />
                Build Mode
              </Button>
            </div>
          </motion.div>

          {/* Main Interface */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <Card className="overflow-hidden border-0 shadow-2xl hover:shadow-3xl transition-shadow duration-300">
              <div className="grid h-[700px] lg:grid-cols-2">
                {/* Left Panel */}
                <div className="border-r bg-muted/20">
                  <Tabs defaultValue="chat" className="h-full">
                    <TabsList className="w-full rounded-none border-b bg-background">
                      <TabsTrigger value="chat" className="flex-1 transition-all duration-200">
                        <MessageSquare className="mr-2 h-4 w-4" />
                        Chat
                      </TabsTrigger>
                      <TabsTrigger value="files" className="flex-1 transition-all duration-200">
                        <Folder className="mr-2 h-4 w-4" />
                        Files
                      </TabsTrigger>
                      <TabsTrigger value="terminal" className="flex-1 transition-all duration-200">
                        <Terminal className="mr-2 h-4 w-4" />
                        Terminal
                      </TabsTrigger>
                    </TabsList>
                    
                    <AnimatePresence mode="wait">
                      <TabsContent value="chat" className="h-[calc(100%-60px)] m-0">
                        <motion.div
                          key="chat"
                          initial={{ opacity: 0, x: -10 }}
                          animate={{ opacity: 1, x: 0 }}
                          exit={{ opacity: 0, x: 10 }}
                          transition={{ duration: 0.2 }}
                        >
                          <ChatPanel mode={activeMode} />
                        </motion.div>
                      </TabsContent>
                      
                      <TabsContent value="files" className="h-[calc(100%-60px)] m-0">
                        <motion.div
                          key="files"
                          initial={{ opacity: 0, x: -10 }}
                          animate={{ opacity: 1, x: 0 }}
                          exit={{ opacity: 0, x: 10 }}
                          transition={{ duration: 0.2 }}
                        >
                          <FileExplorer />
                        </motion.div>
                      </TabsContent>
                      
                      <TabsContent value="terminal" className="h-[calc(100%-60px)] m-0">
                        <motion.div
                          key="terminal"
                          initial={{ opacity: 0, x: -10 }}
                          animate={{ opacity: 1, x: 0 }}
                          exit={{ opacity: 0, x: 10 }}
                          transition={{ duration: 0.2 }}
                        >
                          <TerminalPanel />
                        </motion.div>
                      </TabsContent>
                    </AnimatePresence>
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
                      <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                    </div>
                    <div className="flex items-center space-x-2">
                      <Button variant="ghost" size="sm" className="hover:scale-105 transition-transform duration-200">
                        <Settings className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                  <AnimatePresence mode="wait">
                    <motion.div
                      key={activeMode}
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 1.05 }}
                      transition={{ duration: 0.3 }}
                    >
                      <PreviewWindow mode={activeMode} />
                    </motion.div>
                  </AnimatePresence>
                </div>
              </div>
            </Card>
          </motion.div>

          <motion.div 
            className="mt-8 text-center"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            <p className="text-sm text-muted-foreground">
              This is a simulated environment showcasing NovaPilot's interface and capabilities.
              <br />
              Switch between modes to see different interaction patterns.
            </p>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default DevelopmentEnvironment;
