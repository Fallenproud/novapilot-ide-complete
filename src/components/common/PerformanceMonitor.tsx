import { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Zap, Clock, Database, Wifi } from 'lucide-react';

interface PerformanceMetrics {
  fps: number;
  memoryUsage: number;
  loadTime: number;
  bundleSize: number;
  networkRequests: number;
  coreWebVitals: {
    lcp: number; // Largest Contentful Paint
    fid: number; // First Input Delay
    cls: number; // Cumulative Layout Shift
  };
}

const PerformanceMonitor = () => {
  const [metrics, setMetrics] = useState<PerformanceMetrics>({
    fps: 60,
    memoryUsage: 0,
    loadTime: 0,
    bundleSize: 0,
    networkRequests: 0,
    coreWebVitals: {
      lcp: 0,
      fid: 0,
      cls: 0
    }
  });

  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Show performance monitor in development or when performance issues detected
    const shouldShow = process.env.NODE_ENV === 'development' || 
                      performance.now() > 3000; // Show if page took > 3s to load
    setIsVisible(shouldShow);

    if (!shouldShow) return;

    // FPS monitoring
    let frameCount = 0;
    let lastTime = performance.now();
    let fps = 60;

    const measureFPS = () => {
      frameCount++;
      const currentTime = performance.now();
      
      if (currentTime >= lastTime + 1000) {
        fps = Math.round((frameCount * 1000) / (currentTime - lastTime));
        frameCount = 0;
        lastTime = currentTime;
        
        setMetrics(prev => ({ ...prev, fps }));
      }
      
      requestAnimationFrame(measureFPS);
    };

    requestAnimationFrame(measureFPS);

    // Memory monitoring
    const monitorMemory = () => {
      if ('memory' in performance) {
        const memory = (performance as any).memory;
        const usedJSHeapSize = memory.usedJSHeapSize / 1048576; // Convert to MB
        setMetrics(prev => ({ ...prev, memoryUsage: usedJSHeapSize }));
      }
    };

    // Load time calculation
    const navigation = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming;
    if (navigation) {
      const loadTime = navigation.loadEventEnd - navigation.fetchStart;
      setMetrics(prev => ({ ...prev, loadTime }));
    }

    // Core Web Vitals monitoring
    const observeWebVitals = () => {
      // LCP Observer
      new PerformanceObserver((entryList) => {
        const entries = entryList.getEntries();
        const lastEntry = entries[entries.length - 1];
        setMetrics(prev => ({
          ...prev,
          coreWebVitals: { ...prev.coreWebVitals, lcp: lastEntry.startTime }
        }));
      }).observe({ entryTypes: ['largest-contentful-paint'] });

      // FID Observer
      new PerformanceObserver((entryList) => {
        entryList.getEntries().forEach((entry) => {
          const fidEntry = entry as any; // Cast for processingStart property
          setMetrics(prev => ({
            ...prev,
            coreWebVitals: { ...prev.coreWebVitals, fid: fidEntry.processingStart - fidEntry.startTime }
          }));
        });
      }).observe({ entryTypes: ['first-input'] });

      // CLS Observer
      new PerformanceObserver((entryList) => {
        let cls = 0;
        entryList.getEntries().forEach((entry: any) => {
          if (!entry.hadRecentInput) {
            cls += entry.value;
          }
        });
        setMetrics(prev => ({
          ...prev,
          coreWebVitals: { ...prev.coreWebVitals, cls }
        }));
      }).observe({ entryTypes: ['layout-shift'] });
    };

    // Network monitoring
    const networkEntries = performance.getEntriesByType('resource');
    setMetrics(prev => ({ ...prev, networkRequests: networkEntries.length }));

    // Bundle size estimation (rough calculation)
    const bundleSize = networkEntries
      .filter(entry => entry.name.includes('.js') || entry.name.includes('.css'))
      .reduce((total, entry) => {
        const resourceEntry = entry as any; // Cast for transferSize property
        return total + (resourceEntry.transferSize || 0);
      }, 0) / 1024; // KB

    setMetrics(prev => ({ ...prev, bundleSize }));

    monitorMemory();
    observeWebVitals();

    const memoryInterval = setInterval(monitorMemory, 1000);
    
    return () => {
      clearInterval(memoryInterval);
    };
  }, []);

  if (!isVisible) return null;

  const getPerformanceGrade = (metric: string, value: number): 'good' | 'needs-improvement' | 'poor' => {
    const thresholds = {
      fps: { good: 55, poor: 30 },
      memory: { good: 50, poor: 100 },
      loadTime: { good: 2500, poor: 4000 },
      lcp: { good: 2500, poor: 4000 },
      fid: { good: 100, poor: 300 },
      cls: { good: 0.1, poor: 0.25 }
    };

    const threshold = thresholds[metric as keyof typeof thresholds];
    if (!threshold) return 'good';

    if (metric === 'fps') {
      return value >= threshold.good ? 'good' : value >= threshold.poor ? 'needs-improvement' : 'poor';
    } else {
      return value <= threshold.good ? 'good' : value <= threshold.poor ? 'needs-improvement' : 'poor';
    }
  };

  const getGradeColor = (grade: string) => {
    switch (grade) {
      case 'good': return 'bg-green-500';
      case 'needs-improvement': return 'bg-yellow-500';
      case 'poor': return 'bg-red-500';
      default: return 'bg-gray-500';
    }
  };

  return (
    <Card className="fixed bottom-4 right-4 w-80 z-50 bg-background/95 backdrop-blur-sm border shadow-lg">
      <CardHeader className="pb-3">
        <CardTitle className="text-sm flex items-center gap-2">
          <Zap className="h-4 w-4" />
          Performance Monitor
        </CardTitle>
        <CardDescription className="text-xs">
          Real-time performance metrics
        </CardDescription>
      </CardHeader>
      
      <CardContent className="pt-0 space-y-3">
        {/* FPS */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Clock className="h-3 w-3" />
            <span className="text-xs">FPS</span>
          </div>
          <div className="flex items-center gap-2">
            <Badge variant="outline" className={`text-xs ${getGradeColor(getPerformanceGrade('fps', metrics.fps))}`}>
              {metrics.fps}
            </Badge>
          </div>
        </div>

        {/* Memory Usage */}
        <div className="space-y-1">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Database className="h-3 w-3" />
              <span className="text-xs">Memory</span>
            </div>
            <span className="text-xs">{metrics.memoryUsage.toFixed(1)} MB</span>
          </div>
          <Progress 
            value={Math.min((metrics.memoryUsage / 100) * 100, 100)} 
            className="h-1"
          />
        </div>

        {/* Network */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Wifi className="h-3 w-3" />
            <span className="text-xs">Requests</span>
          </div>
          <Badge variant="outline" className="text-xs">
            {metrics.networkRequests}
          </Badge>
        </div>

        {/* Core Web Vitals */}
        <div className="space-y-2 pt-2 border-t">
          <div className="text-xs font-medium">Core Web Vitals</div>
          <div className="grid grid-cols-3 gap-2 text-xs">
            <div className="text-center">
              <div className="text-muted-foreground">LCP</div>
              <Badge 
                variant="outline" 
                className={`text-xs ${getGradeColor(getPerformanceGrade('lcp', metrics.coreWebVitals.lcp))}`}
              >
                {(metrics.coreWebVitals.lcp / 1000).toFixed(1)}s
              </Badge>
            </div>
            <div className="text-center">
              <div className="text-muted-foreground">FID</div>
              <Badge 
                variant="outline" 
                className={`text-xs ${getGradeColor(getPerformanceGrade('fid', metrics.coreWebVitals.fid))}`}
              >
                {metrics.coreWebVitals.fid.toFixed(0)}ms
              </Badge>
            </div>
            <div className="text-center">
              <div className="text-muted-foreground">CLS</div>
              <Badge 
                variant="outline" 
                className={`text-xs ${getGradeColor(getPerformanceGrade('cls', metrics.coreWebVitals.cls))}`}
              >
                {metrics.coreWebVitals.cls.toFixed(3)}
              </Badge>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default PerformanceMonitor;