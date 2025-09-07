import React, { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Slider } from '@/components/ui/slider';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { 
  Settings, 
  Palette, 
  Code2, 
  Keyboard, 
  Monitor, 
  Save,
  RotateCcw,
  Moon,
  Sun,
  Laptop,
  Shield,
  Zap,
  Terminal
} from 'lucide-react';
import { useEditorStore } from '@/stores/editorStore';
import { useTheme } from 'next-themes';
import { toast } from 'sonner';

interface IDESettingsModalProps {
  children?: React.ReactNode;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
}

const IDESettingsModal: React.FC<IDESettingsModalProps> = ({ 
  children, 
  open, 
  onOpenChange 
}) => {
  const { 
    theme: editorTheme, 
    fontSize, 
    wordWrap, 
    minimap,
    setTheme: setEditorTheme,
    setFontSize,
    setWordWrap,
    setMinimap
  } = useEditorStore();
  
  const { theme, setTheme } = useTheme();
  
  const [advancedSettings, setAdvancedSettings] = useState({
    autoSave: true,
    tabSize: 2,
    lineNumbers: true,
    bracketMatching: true,
    autoCloseBrackets: true,
    emmetEnabled: true,
    gitIntegration: true,
    aiAssistant: true,
    securityScan: true,
    performanceMode: false
  });

  const handleSaveSettings = () => {
    localStorage.setItem('ide-advanced-settings', JSON.stringify(advancedSettings));
    toast.success('Settings saved successfully');
    onOpenChange?.(false);
  };

  const resetSettings = () => {
    setAdvancedSettings({
      autoSave: true,
      tabSize: 2,
      lineNumbers: true,
      bracketMatching: true,
      autoCloseBrackets: true,
      emmetEnabled: true,
      gitIntegration: true,
      aiAssistant: true,
      securityScan: true,
      performanceMode: false
    });
    toast.info('Settings reset to defaults');
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      {children && (
        <DialogTrigger asChild>
          {children}
        </DialogTrigger>
      )}
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Settings className="h-5 w-5" />
            IDE Settings
            <Badge variant="secondary" className="ml-2">Enterprise</Badge>
          </DialogTitle>
          <DialogDescription>
            Configure your advanced development environment preferences
          </DialogDescription>
        </DialogHeader>
        
        <Tabs defaultValue="appearance" className="w-full">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="appearance">Appearance</TabsTrigger>
            <TabsTrigger value="editor">Editor</TabsTrigger>
            <TabsTrigger value="security">Security</TabsTrigger>
            <TabsTrigger value="performance">Performance</TabsTrigger>
            <TabsTrigger value="shortcuts">Shortcuts</TabsTrigger>
          </TabsList>

          <TabsContent value="appearance" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Palette className="h-4 w-4" />
                  Appearance Settings
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <Label htmlFor="app-theme">Application Theme</Label>
                  <Select value={theme} onValueChange={setTheme}>
                    <SelectTrigger className="w-32">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="light">
                        <div className="flex items-center gap-2">
                          <Sun className="h-4 w-4" />
                          Light
                        </div>
                      </SelectItem>
                      <SelectItem value="dark">
                        <div className="flex items-center gap-2">
                          <Moon className="h-4 w-4" />
                          Dark
                        </div>
                      </SelectItem>
                      <SelectItem value="system">
                        <div className="flex items-center gap-2">
                          <Laptop className="h-4 w-4" />
                          System
                        </div>
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="flex items-center justify-between">
                  <Label htmlFor="editor-theme">Editor Theme</Label>
                  <Select value={editorTheme} onValueChange={setEditorTheme}>
                    <SelectTrigger className="w-40">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="vs-dark">VS Code Dark</SelectItem>
                      <SelectItem value="light">VS Code Light</SelectItem>
                      <SelectItem value="hc-black">High Contrast Dark</SelectItem>
                      <SelectItem value="hc-light">High Contrast Light</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="editor" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Code2 className="h-4 w-4" />
                  Editor Configuration
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label>Font Size: {fontSize}px</Label>
                  <Slider
                    value={[fontSize]}
                    onValueChange={([value]) => setFontSize(value)}
                    max={24}
                    min={10}
                    step={1}
                    className="w-full"
                  />
                </div>

                <div className="space-y-2">
                  <Label>Tab Size: {advancedSettings.tabSize} spaces</Label>
                  <Slider
                    value={[advancedSettings.tabSize]}
                    onValueChange={([value]) => setAdvancedSettings(prev => ({ ...prev, tabSize: value }))}
                    max={8}
                    min={2}
                    step={2}
                    className="w-full"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="word-wrap">Word Wrap</Label>
                    <Switch
                      id="word-wrap"
                      checked={wordWrap}
                      onCheckedChange={setWordWrap}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <Label htmlFor="minimap">Show Minimap</Label>
                    <Switch
                      id="minimap"
                      checked={minimap}
                      onCheckedChange={setMinimap}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <Label htmlFor="line-numbers">Line Numbers</Label>
                    <Switch
                      id="line-numbers"
                      checked={advancedSettings.lineNumbers}
                      onCheckedChange={(checked) => setAdvancedSettings(prev => ({ ...prev, lineNumbers: checked }))}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <Label htmlFor="auto-save">Auto Save</Label>
                    <Switch
                      id="auto-save"
                      checked={advancedSettings.autoSave}
                      onCheckedChange={(checked) => setAdvancedSettings(prev => ({ ...prev, autoSave: checked }))}
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="security" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Shield className="h-4 w-4" />
                  Security & Compliance
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="security-scan">Real-time Security Scanning</Label>
                    <p className="text-sm text-muted-foreground">Automatically scan code for vulnerabilities</p>
                  </div>
                  <Switch
                    id="security-scan"
                    checked={advancedSettings.securityScan}
                    onCheckedChange={(checked) => setAdvancedSettings(prev => ({ ...prev, securityScan: checked }))}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="git-integration">Git Integration</Label>
                    <p className="text-sm text-muted-foreground">Enable Git operations and version control</p>
                  </div>
                  <Switch
                    id="git-integration"
                    checked={advancedSettings.gitIntegration}
                    onCheckedChange={(checked) => setAdvancedSettings(prev => ({ ...prev, gitIntegration: checked }))}
                  />
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="performance" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Zap className="h-4 w-4" />
                  Performance Optimization
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="performance-mode">High Performance Mode</Label>
                    <p className="text-sm text-muted-foreground">Optimize for speed over battery life</p>
                  </div>
                  <Switch
                    id="performance-mode"
                    checked={advancedSettings.performanceMode}
                    onCheckedChange={(checked) => setAdvancedSettings(prev => ({ ...prev, performanceMode: checked }))}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="ai-assistant">AI Code Assistant</Label>
                    <p className="text-sm text-muted-foreground">Enable intelligent code suggestions</p>
                  </div>
                  <Switch
                    id="ai-assistant"
                    checked={advancedSettings.aiAssistant}
                    onCheckedChange={(checked) => setAdvancedSettings(prev => ({ ...prev, aiAssistant: checked }))}
                  />
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="shortcuts" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Keyboard className="h-4 w-4" />
                  Keyboard Shortcuts
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span>Toggle Left Panel:</span>
                      <code className="bg-muted px-2 py-1 rounded">Ctrl/Cmd + 1</code>
                    </div>
                    <div className="flex justify-between">
                      <span>Toggle Right Panel:</span>
                      <code className="bg-muted px-2 py-1 rounded">Ctrl/Cmd + 2</code>
                    </div>
                    <div className="flex justify-between">
                      <span>Toggle Terminal:</span>
                      <code className="bg-muted px-2 py-1 rounded">Ctrl/Cmd + 3</code>
                    </div>
                    <div className="flex justify-between">
                      <span>Toggle Editor:</span>
                      <code className="bg-muted px-2 py-1 rounded">Ctrl/Cmd + 0</code>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span>Save File:</span>
                      <code className="bg-muted px-2 py-1 rounded">Ctrl/Cmd + S</code>
                    </div>
                    <div className="flex justify-between">
                      <span>Send Prompt:</span>
                      <code className="bg-muted px-2 py-1 rounded">Ctrl/Cmd + Enter</code>
                    </div>
                    <div className="flex justify-between">
                      <span>Command Palette:</span>
                      <code className="bg-muted px-2 py-1 rounded">Ctrl/Cmd + K</code>
                    </div>
                    <div className="flex justify-between">
                      <span>Fullscreen:</span>
                      <code className="bg-muted px-2 py-1 rounded">Ctrl/Cmd + Shift + F</code>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        <Separator />

        <div className="flex justify-between">
          <Button variant="outline" onClick={resetSettings}>
            <RotateCcw className="mr-2 h-4 w-4" />
            Reset to Defaults
          </Button>
          <div className="space-x-2">
            <Button variant="outline" onClick={() => onOpenChange?.(false)}>
              Cancel
            </Button>
            <Button onClick={handleSaveSettings}>
              <Save className="mr-2 h-4 w-4" />
              Save Settings
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default IDESettingsModal;