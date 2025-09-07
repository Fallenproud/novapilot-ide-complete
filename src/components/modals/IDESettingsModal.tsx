import React from 'react';
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
  Laptop
} from 'lucide-react';
import { useEditorStore } from '@/stores/editorStore';
import { useTheme } from 'next-themes';

interface IDESettingsModalProps {
  children: React.ReactNode;
}

const IDESettingsModal: React.FC<IDESettingsModalProps> = ({ children }) => {
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

  return (
    <Dialog>
      <DialogTrigger asChild>
        {children}
      </DialogTrigger>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Settings className="h-5 w-5" />
            IDE Settings
          </DialogTitle>
          <DialogDescription>
            Configure your development environment preferences
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-6">
          {/* Appearance Settings */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Palette className="h-4 w-4" />
                Appearance
              </CardTitle>
              <CardDescription>
                Customize the look and feel of the IDE
              </CardDescription>
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
            </CardContent>
          </Card>

          {/* Editor Settings */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Code2 className="h-4 w-4" />
                Editor
              </CardTitle>
              <CardDescription>
                Configure code editor behavior and appearance
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
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
            </CardContent>
          </Card>

          {/* Keyboard Shortcuts */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Keyboard className="h-4 w-4" />
                Keyboard Shortcuts
              </CardTitle>
              <CardDescription>
                Useful keyboard shortcuts for faster development
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2 text-sm">
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
                <div className="flex justify-between">
                  <span>Fullscreen:</span>
                  <code className="bg-muted px-2 py-1 rounded">Ctrl/Cmd + Shift + F</code>
                </div>
                <div className="flex justify-between">
                  <span>Save File:</span>
                  <code className="bg-muted px-2 py-1 rounded">Ctrl/Cmd + S</code>
                </div>
                <div className="flex justify-between">
                  <span>Send Prompt:</span>
                  <code className="bg-muted px-2 py-1 rounded">Ctrl/Cmd + Enter</code>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default IDESettingsModal;