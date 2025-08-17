
import { useEffect } from 'react';

interface UsePreviewKeyboardProps {
  onTogglePreview: () => void;
  onToggleFullscreen: () => void;
  onRefresh: () => void;
  onToggleViewMode: () => void;
}

export const usePreviewKeyboard = ({
  onTogglePreview,
  onToggleFullscreen,
  onRefresh,
  onToggleViewMode
}: UsePreviewKeyboardProps) => {
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      // Ctrl/Cmd + Shift + P: Toggle preview visibility
      if ((event.ctrlKey || event.metaKey) && event.shiftKey && event.key === 'P') {
        event.preventDefault();
        onTogglePreview();
      }
      
      // Ctrl/Cmd + Shift + F: Toggle fullscreen preview
      if ((event.ctrlKey || event.metaKey) && event.shiftKey && event.key === 'F') {
        event.preventDefault();
        onToggleFullscreen();
      }
      
      // Ctrl/Cmd + Shift + R: Refresh preview
      if ((event.ctrlKey || event.metaKey) && event.shiftKey && event.key === 'R') {
        event.preventDefault();
        onRefresh();
      }
      
      // Ctrl/Cmd + Shift + V: Toggle view mode
      if ((event.ctrlKey || event.metaKey) && event.shiftKey && event.key === 'V') {
        event.preventDefault();
        onToggleViewMode();
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [onTogglePreview, onToggleFullscreen, onRefresh, onToggleViewMode]);
};
