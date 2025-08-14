
import { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Switch } from '@/components/ui/switch';
import { Slider } from '@/components/ui/slider';
import { useUIStore } from '@/stores/uiStore';
import { useEditorStore } from '@/stores/editorStore';
import {
  Settings,
  Palette,
  Code,
  Layout,
  Save,
  RotateCcw
} from 'lucide-react';

interface SettingsModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const SettingsModal = ({ open, onOpenChange }: SettingsModalProps) => {
  const {
    isDarkMode,
    toggleDarkMode,
    layout,
    setLayout,
    showMinimap,
    toggleMinimap,
    showLineNumbers,
    toggleLineNumbers,
    resetLayout
  } = useUIStore();

  const {
    fontSize,
    setFontSize,
    wordWrap,
    toggleWordWrap,
    theme,
    setTheme
  } = useEditorStore();

  const [tempFontSize, setTempFontSize] = useState([fontSize]);

  const handleSave = () => {
    setFontSize(tempFontSize[0]);
    onOpenChange(false);
  };

  const handleReset = () => {
    resetLayout();
    setFontSize(14);
    setTempFontSize([14]);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Settings className="h-5 w-5" />
            Settings
          </DialogTitle>
          <DialogDescription>
            Customize your NovaPilot IDE experience
          </DialogDescription>
        </DialogHeader>

        <Tabs defaultValue="appearance" className="w-full">
          <TabsList className="grid grid-cols-3 w-full">
            <TabsTrigger value="appearance" className="flex items-center gap-2">
              <Palette className="h-4 w-4" />
              Appearance
            </TabsTrigger>
            <TabsTrigger value="editor" className="flex items-center gap-2">
              <Code className="h-4 w-4" />
              Editor
            </TabsTrigger>
            <TabsTrigger value="layout" className="flex items-center gap-2">
              <Layout className="h-4 w-4" />
              Layout
            </TabsTrigger>
          </TabsList>

          <TabsContent value="appearance" className="space-y-6">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <Label>Dark Mode</Label>
                  <p className="text-sm text-muted-foreground">
                    Toggle between light and dark themes
                  </p>
                </div>
                <Switch
                  checked={isDarkMode}
                  onCheckedChange={toggleDarkMode}
                />
              </div>

              <div className="space-y-2">
                <Label>Editor Theme</Label>
                <div className="flex gap-2">
                  <Button
                    variant={theme === 'dark' ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setTheme('dark')}
                  >
                    Dark
                  </Button>
                  <Button
                    variant={theme === 'light' ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setTheme('light')}
                  >
                    Light
                  </Button>
                </div>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="editor" className="space-y-6">
            <div className="space-y-4">
              <div className="space-y-2">
                <Label>Font Size: {tempFontSize[0]}px</Label>
                <Slider
                  value={tempFontSize}
                  onValueChange={setTempFontSize}
                  max={32}
                  min={8}
                  step={1}
                  className="w-full"
                />
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <Label>Word Wrap</Label>
                  <p className="text-sm text-muted-foreground">
                    Wrap long lines in the editor
                  </p>
                </div>
                <Switch
                  checked={wordWrap}
                  onCheckedChange={toggleWordWrap}
                />
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <Label>Line Numbers</Label>
                  <p className="text-sm text-muted-foreground">
                    Show line numbers in the editor
                  </p>
                </div>
                <Switch
                  checked={showLineNumbers}
                  onCheckedChange={toggleLineNumbers}
                />
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <Label>Minimap</Label>
                  <p className="text-sm text-muted-foreground">
                    Show code minimap in the editor
                  </p>
                </div>
                <Switch
                  checked={showMinimap}
                  onCheckedChange={toggleMinimap}
                />
              </div>
            </div>
          </TabsContent>

          <TabsContent value="layout" className="space-y-6">
            <div className="space-y-4">
              <div className="space-y-2">
                <Label>Layout Mode</Label>
                <div className="flex gap-2">
                  <Button
                    variant={layout === 'split' ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setLayout('split')}
                  >
                    Split View
                  </Button>
                  <Button
                    variant={layout === 'editor-only' ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setLayout('editor-only')}
                  >
                    Editor Only
                  </Button>
                  <Button
                    variant={layout === 'preview-only' ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setLayout('preview-only')}
                  >
                    Preview Only
                  </Button>
                </div>
              </div>
            </div>
          </TabsContent>
        </Tabs>

        <div className="flex justify-between pt-4">
          <Button variant="outline" onClick={handleReset}>
            <RotateCcw className="mr-2 h-4 w-4" />
            Reset to Defaults
          </Button>
          <div className="flex gap-2">
            <Button variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button onClick={handleSave}>
              <Save className="mr-2 h-4 w-4" />
              Save Changes
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default SettingsModal;
