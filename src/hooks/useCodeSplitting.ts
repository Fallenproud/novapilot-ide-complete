import { lazy, Suspense } from 'react';
import { ComponentType, ReactNode } from 'react';
import LoadingSpinner from '@/components/common/LoadingSpinner';

// Code splitting utility hook
export const useCodeSplitting = () => {
  
  // Lazy load component with error boundary
  const lazyLoad = <T extends ComponentType<any>>(
    factory: () => Promise<{ default: T }>,
    fallback?: ReactNode
  ) => {
    const LazyComponent = lazy(factory);
    
    return (props: any) => (
      <Suspense fallback={fallback || <LoadingSpinner />}>
        <LazyComponent {...props} />
      </Suspense>
    );
  };

  // Preload a component
  const preload = (factory: () => Promise<any>) => {
    // Start loading the component but don't wait for it
    factory().catch(console.error);
  };

  // Batch preload multiple components
  const preloadBatch = (factories: Array<() => Promise<any>>) => {
    factories.forEach(factory => preload(factory));
  };

  return {
    lazyLoad,
    preload,
    preloadBatch,
  };
};

// Component factory functions for lazy loading
export const componentFactories = {
  // IDE Components
  AdvancedIDE: () => import('@/pages/AdvancedIDE'),
  MonacoEditor: () => import('@/components/playground/MonacoEditor'),
  
  // Analytics
  Analytics: () => import('@/pages/Analytics'),
  
  // Documentation
  Documentation: () => import('@/pages/Documentation'),
  
  // Project Components
  Projects: () => import('@/pages/Projects'),
  
  // Advanced Features
  AdvancedSearch: () => import('@/components/features/AdvancedSearch'),
  PerformanceMonitor: () => import('@/components/common/PerformanceMonitor'),
  NotificationCenter: () => import('@/components/features/NotificationCenter'),
  
  // Modals
  SettingsModal: () => import('@/components/modals/SettingsModal'),
  CommandPalette: () => import('@/components/modals/CommandPalette'),
  IDESettingsModal: () => import('@/components/modals/IDESettingsModal'),
};

// Route-based preloading strategy
export const useRoutePreloading = () => {
  const preloadForRoute = (route: string) => {
    const { preloadBatch } = useCodeSplitting();
    
    switch (route) {
      case '/ide':
        preloadBatch([
          componentFactories.AdvancedIDE,
          componentFactories.MonacoEditor,
          componentFactories.AdvancedSearch,
        ]);
        break;
      
      case '/projects':
        preloadBatch([
          componentFactories.Projects,
          componentFactories.AdvancedIDE,
        ]);
        break;
      
      case '/analytics':
        preloadBatch([
          componentFactories.Analytics,
        ]);
        break;
      
      case '/docs':
        preloadBatch([
          componentFactories.Documentation,
        ]);
        break;
      
      default:
        // Preload common components
        preloadBatch([
          componentFactories.CommandPalette,
          componentFactories.SettingsModal,
        ]);
    }
  };

  return { preloadForRoute };
};

// Performance monitoring for code splitting
export const useChunkLoadingMonitor = () => {
  const trackChunkLoad = (chunkName: string, startTime: number) => {
    const loadTime = performance.now() - startTime;
    
    // Log performance metric
    console.debug(`Chunk '${chunkName}' loaded in ${loadTime.toFixed(2)}ms`);
    
    // Report to analytics if available
    if (typeof window !== 'undefined' && 'gtag' in window) {
      (window as any).gtag('event', 'chunk_load_time', {
        event_category: 'Performance',
        event_label: chunkName,
        value: Math.round(loadTime),
      });
    }
  };

  return { trackChunkLoad };
};