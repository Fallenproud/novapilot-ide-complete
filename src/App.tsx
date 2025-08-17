
import { BrowserRouter as Router, Route, Routes, useLocation } from "react-router-dom";
import { ThemeProvider } from "@/components/ui/theme-provider";
import { Toaster } from "@/components/ui/toaster";
import Index from "@/pages/Index";
import Projects from "@/pages/Projects";
import Playground from "@/pages/Playground";
import PlaygroundNew from "@/pages/PlaygroundNew";
import AdvancedIDE from "@/pages/AdvancedIDE";
import ProjectStatus from "@/pages/ProjectStatus";
import NotFound from "@/pages/NotFound";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import SettingsModal from "@/components/modals/SettingsModal";
import CommandPalette from "@/components/modals/CommandPalette";
import { useUIStore } from "@/stores/uiStore";

const AppContent = () => {
  const location = useLocation();
  const { isSettingsOpen, toggleSettings } = useUIStore();
  const isPlayground = location.pathname === '/playground' || location.pathname === '/playground-new' || location.pathname === '/ide';

  return (
    <div className={`${isPlayground ? 'h-screen' : 'min-h-screen'} bg-background font-sans antialiased flex flex-col`}>
      {!isPlayground && <Header />}
      <main className="flex-1">
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/projects" element={<Projects />} />
          <Route path="/playground" element={<Playground />} />
          <Route path="/playground-new" element={<PlaygroundNew />} />
          <Route path="/ide" element={<AdvancedIDE />} />
          <Route path="/status" element={<ProjectStatus />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>
      {!isPlayground && <Footer />}
      <Toaster />
      
      {/* Global Modals */}
      <SettingsModal 
        open={isSettingsOpen} 
        onOpenChange={toggleSettings} 
      />
      <CommandPalette />
    </div>
  );
};

function App() {
  return (
    <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
      <Router>
        <AppContent />
      </Router>
    </ThemeProvider>
  );
}

export default App;
