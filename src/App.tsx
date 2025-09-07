
import { BrowserRouter as Router, Route, Routes, useLocation, Navigate } from "react-router-dom";
import { ThemeProvider } from "@/components/ui/theme-provider";
import { Toaster } from "@/components/ui/sonner";
import { ProtectedRoute } from "@/components/common/ProtectedRoute";
import ErrorBoundary from "@/components/common/ErrorBoundary";
import PerformanceMonitor from "@/components/common/PerformanceMonitor";
import Index from "@/pages/Index";
import Dashboard from "@/pages/Dashboard";
import Projects from "@/pages/Projects";
import AdvancedIDE from "@/pages/AdvancedIDE";
import Analytics from "@/pages/Analytics";
import Documentation from "@/pages/Documentation";
import Login from "@/pages/auth/Login";
import Register from "@/pages/auth/Register";
import ProjectStatus from "@/pages/ProjectStatus";
import NotFound from "@/pages/NotFound";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import SettingsModal from "@/components/modals/SettingsModal";
import CommandPalette from "@/components/modals/CommandPalette";
import { useUIStore } from "@/stores/uiStore";
import IDESettingsModal from "@/components/modals/IDESettingsModal";
import { FocusManager } from "@/components/accessibility/FocusManager";

const AppContent = () => {
  const location = useLocation();
  const { isSettingsOpen, toggleSettings, isIDESettingsOpen, toggleIDESettings } = useUIStore();
  const isIDERoute = location.pathname.includes('ide') || location.pathname.includes('playground');
  const isAuthRoute = location.pathname.startsWith('/auth');

  return (
    <ErrorBoundary>
      <FocusManager>
        <div 
          id="main-content"
          className={`${isIDERoute ? 'h-screen' : 'min-h-screen'} bg-background font-sans antialiased flex flex-col`}
        >
          {!isIDERoute && !isAuthRoute && <Header />}
          <main className="flex-1" role="main">
            <Routes>
              {/* Public Routes */}
              <Route path="/" element={<Index />} />
              <Route path="/auth/login" element={<Login />} />
              <Route path="/auth/register" element={<Register />} />
              <Route path="/docs" element={<Documentation />} />
              
              {/* Protected Routes */}
              <Route path="/dashboard" element={
                <ProtectedRoute>
                  <Dashboard />
                </ProtectedRoute>
              } />
              <Route path="/projects" element={
                <ProtectedRoute>
                  <Projects />
                </ProtectedRoute>
              } />
              <Route path="/ide" element={
                <ProtectedRoute>
                  <AdvancedIDE />
                </ProtectedRoute>
              } />
              <Route path="/analytics" element={
                <ProtectedRoute>
                  <Analytics />
                </ProtectedRoute>
              } />
              <Route path="/status" element={
                <ProtectedRoute>
                  <ProjectStatus />
                </ProtectedRoute>
              } />
              
              {/* Redirect legacy routes */}
              <Route path="/playground" element={<Navigate to="/ide" replace />} />
              <Route path="/playground-new" element={<Navigate to="/ide" replace />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </main>
          {!isIDERoute && !isAuthRoute && <Footer />}
          <Toaster />
          
          {/* Global Modals & Components */}
          <SettingsModal 
            open={isSettingsOpen} 
            onOpenChange={toggleSettings} 
          />
          <IDESettingsModal 
            open={isIDESettingsOpen} 
            onOpenChange={toggleIDESettings} 
          />
          <CommandPalette />
          <PerformanceMonitor />
        </div>
      </FocusManager>
    </ErrorBoundary>
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
