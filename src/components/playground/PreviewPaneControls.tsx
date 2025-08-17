
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { 
  Eye, 
  EyeOff, 
  Code2, 
  Monitor, 
  Smartphone, 
  Tablet, 
  Layout, 
  PanelRight,
  PanelBottom,
  Maximize2,
  Settings
} from "lucide-react";
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Toggle } from "@/components/ui/toggle";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";

type ViewMode = 'preview' | 'code' | 'split';
type PreviewSize = 'mobile' | 'tablet' | 'desktop' | 'fullscreen';
type LayoutMode = 'right' | 'bottom' | 'floating';

interface PreviewPaneControlsProps {
  viewMode: ViewMode;
  previewSize: PreviewSize;
  layoutMode: LayoutMode;
  isVisible: boolean;
  onViewModeChange: (mode: ViewMode) => void;
  onPreviewSizeChange: (size: PreviewSize) => void;
  onLayoutModeChange: (mode: LayoutMode) => void;
  onVisibilityToggle: () => void;
}

const PreviewPaneControls = ({
  viewMode,
  previewSize,
  layoutMode,
  isVisible,
  onViewModeChange,
  onPreviewSizeChange,
  onLayoutModeChange,
  onVisibilityToggle,
}: PreviewPaneControlsProps) => {
  return (
    <div className="flex items-center justify-between px-4 py-2 border-b border-[#21262D] bg-[#161B22]">
      {/* Left side - View mode toggles */}
      <div className="flex items-center space-x-2">
        <div className="flex items-center space-x-1">
          <span className="text-xs text-[#8B949E] font-medium">VIEW:</span>
          <ToggleGroup 
            type="single" 
            value={viewMode} 
            onValueChange={(value) => value && onViewModeChange(value as ViewMode)}
            className="bg-[#21262D] rounded-md p-1"
          >
            <ToggleGroupItem 
              value="preview" 
              size="sm"
              className="data-[state=on]:bg-[#1F6FEB] data-[state=on]:text-white"
            >
              <Eye className="h-3 w-3" />
            </ToggleGroupItem>
            <ToggleGroupItem 
              value="code" 
              size="sm"
              className="data-[state=on]:bg-[#1F6FEB] data-[state=on]:text-white"
            >
              <Code2 className="h-3 w-3" />
            </ToggleGroupItem>
            <ToggleGroupItem 
              value="split" 
              size="sm"
              className="data-[state=on]:bg-[#1F6FEB] data-[state=on]:text-white"
            >
              <Layout className="h-3 w-3" />
            </ToggleGroupItem>
          </ToggleGroup>
        </div>

        {/* Preview size controls - only show when preview is visible */}
        {(viewMode === 'preview' || viewMode === 'split') && (
          <div className="flex items-center space-x-1 ml-4">
            <span className="text-xs text-[#8B949E] font-medium">SIZE:</span>
            <ToggleGroup 
              type="single" 
              value={previewSize} 
              onValueChange={(value) => value && onPreviewSizeChange(value as PreviewSize)}
              className="bg-[#21262D] rounded-md p-1"
            >
              <ToggleGroupItem 
                value="mobile" 
                size="sm"
                className="data-[state=on]:bg-[#1F6FEB] data-[state=on]:text-white"
              >
                <Smartphone className="h-3 w-3" />
              </ToggleGroupItem>
              <ToggleGroupItem 
                value="tablet" 
                size="sm"
                className="data-[state=on]:bg-[#1F6FEB] data-[state=on]:text-white"
              >
                <Tablet className="h-3 w-3" />
              </ToggleGroupItem>
              <ToggleGroupItem 
                value="desktop" 
                size="sm"
                className="data-[state=on]:bg-[#1F6FEB] data-[state=on]:text-white"
              >
                <Monitor className="h-3 w-3" />
              </ToggleGroupItem>
              <ToggleGroupItem 
                value="fullscreen" 
                size="sm"
                className="data-[state=on]:bg-[#1F6FEB] data-[state=on]:text-white"
              >
                <Maximize2 className="h-3 w-3" />
              </ToggleGroupItem>
            </ToggleGroup>
          </div>
        )}
      </div>

      {/* Right side - Layout options and settings */}
      <div className="flex items-center space-x-2">
        {/* Layout mode selector */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="sm" className="h-7 px-2">
              {layoutMode === 'right' && <PanelRight className="h-3 w-3 mr-1" />}
              {layoutMode === 'bottom' && <PanelBottom className="h-3 w-3 mr-1" />}
              {layoutMode === 'floating' && <Maximize2 className="h-3 w-3 mr-1" />}
              <span className="text-xs">Layout</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="bg-[#21262D] border-[#30363D]">
            <DropdownMenuItem 
              onClick={() => onLayoutModeChange('right')}
              className="text-[#F0F6FC] hover:bg-[#30363D]"
            >
              <PanelRight className="h-4 w-4 mr-2" />
              Right Panel
            </DropdownMenuItem>
            <DropdownMenuItem 
              onClick={() => onLayoutModeChange('bottom')}
              className="text-[#F0F6FC] hover:bg-[#30363D]"
            >
              <PanelBottom className="h-4 w-4 mr-2" />
              Bottom Panel
            </DropdownMenuItem>
            <DropdownMenuItem 
              onClick={() => onLayoutModeChange('floating')}
              className="text-[#F0F6FC] hover:bg-[#30363D]"
            >
              <Maximize2 className="h-4 w-4 mr-2" />
              Floating Window
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        {/* Visibility toggle */}
        <Toggle 
          pressed={isVisible} 
          onPressedChange={onVisibilityToggle}
          size="sm"
          className="data-[state=on]:bg-[#1F6FEB] data-[state=on]:text-white"
        >
          {isVisible ? <Eye className="h-3 w-3" /> : <EyeOff className="h-3 w-3" />}
        </Toggle>

        {/* Settings */}
        <Button variant="ghost" size="sm" className="h-7 w-7 p-0">
          <Settings className="h-3 w-3" />
        </Button>
      </div>
    </div>
  );
};

export default PreviewPaneControls;
