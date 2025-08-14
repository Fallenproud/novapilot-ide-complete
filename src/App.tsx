import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { ThemeProvider } from "@/components/ui/theme-provider";
import { Toaster } from "@/components/ui/toaster";
import Index from "@/pages/Index";
import Projects from "@/pages/Projects";
import Playground from "@/pages/Playground";
import ProjectStatus from "@/pages/ProjectStatus";
import NotFound from "@/pages/NotFound";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import SettingsModal from "@/components/modals/SettingsModal";
import CommandPalette from "@/components/modals/CommandPalette";
import { useUIStore } from "@/stores/uiStore";

function App() {
  const { isSettingsOpen, toggleSettings } = useUIStore();

  return (
    <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
      <Router>
        <div className="min-h-screen bg-background font-sans antialiased">
          <Header />
          <main>
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/projects" element={<Projects />} />
              <Route path="/playground" element={<Playground />} />
              <Route path="/status" element={<ProjectStatus />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </main>
          <Footer />
          <Toaster />
          
          {/* Global Modals */}
          <SettingsModal 
            open={isSettingsOpen} 
            onOpenChange={toggleSettings} 
          />
          <CommandPalette />
        </div>
      </Router>
    </ThemeProvider>
  );
}

export default App;
