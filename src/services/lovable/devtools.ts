
export interface ConsoleMessage {
  id: string;
  level: 'log' | 'warn' | 'error' | 'info' | 'debug';
  args: any[];
  timestamp: number;
  source?: string;
}

export interface PerformanceMetric {
  name: string;
  value: number;
  unit: string;
  timestamp: number;
}

export class LovableDevTools {
  private consoleMessages: ConsoleMessage[] = [];
  private performanceMetrics: PerformanceMetric[] = [];
  private isCapturing = false;
  private originalConsole: Partial<Console>;

  constructor() {
    this.originalConsole = {
      log: console.log.bind(console),
      warn: console.warn.bind(console),
      error: console.error.bind(console),
      info: console.info.bind(console),
      debug: console.debug.bind(console)
    };
    this.setupConsoleCapture();
    this.setupPerformanceMonitoring();
  }

  private setupConsoleCapture() {
    const levels: Array<keyof Console> = ['log', 'warn', 'error', 'info', 'debug'];
    
    levels.forEach(level => {
      const original = this.originalConsole[level] as Function;
      (console as any)[level] = (...args: any[]) => {
        // Call original console method
        if (original) {
          original(...args);
        }
        
        if (this.isCapturing) {
          this.captureConsoleMessage(level as ConsoleMessage['level'], args);
        }
      };
    });
  }

  private captureConsoleMessage(level: ConsoleMessage['level'], args: any[]) {
    const message: ConsoleMessage = {
      id: crypto.randomUUID(),
      level,
      args: this.serializeArgs(args),
      timestamp: Date.now(),
      source: this.getCallSource()
    };

    this.consoleMessages.push(message);
    
    // Limit console history
    if (this.consoleMessages.length > 1000) {
      this.consoleMessages = this.consoleMessages.slice(-800);
    }

    // Emit console event
    window.dispatchEvent(new CustomEvent('devtools:console', { detail: message }));
  }

  private serializeArgs(args: any[]): any[] {
    return args.map(arg => {
      try {
        if (typeof arg === 'object' && arg !== null) {
          return JSON.parse(JSON.stringify(arg));
        }
        return arg;
      } catch {
        return String(arg);
      }
    });
  }

  private getCallSource(): string {
    try {
      const stack = new Error().stack;
      if (stack) {
        const lines = stack.split('\n');
        // Find the first line that's not console/devtools related
        for (let i = 3; i < lines.length; i++) {
          const line = lines[i];
          if (!line.includes('devtools.ts') && !line.includes('console')) {
            return line.trim();
          }
        }
      }
    } catch {
      // Ignore errors
    }
    return 'unknown';
  }

  private setupPerformanceMonitoring() {
    // Monitor render performance
    if (typeof window !== 'undefined' && 'performance' in window) {
      setInterval(() => {
        if (this.isCapturing) {
          this.capturePerformanceMetrics();
        }
      }, 1000);
    }
  }

  private capturePerformanceMetrics() {
    try {
      const navigation = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming;
      
      if (navigation) {
        this.addMetric('DOM Content Loaded', navigation.domContentLoadedEventEnd - navigation.domContentLoadedEventStart, 'ms');
        this.addMetric('Load Complete', navigation.loadEventEnd - navigation.loadEventStart, 'ms');
      }

      // Memory usage (if available)
      const memory = (performance as any).memory;
      if (memory) {
        this.addMetric('Used Heap Size', memory.usedJSHeapSize / 1024 / 1024, 'MB');
        this.addMetric('Total Heap Size', memory.totalJSHeapSize / 1024 / 1024, 'MB');
      }

      // FPS estimation
      this.measureFPS();
    } catch (error) {
      console.warn('Performance monitoring error:', error);
    }
  }

  private measureFPS() {
    let frames = 0;
    let lastTime = performance.now();

    const countFrames = () => {
      frames++;
      requestAnimationFrame(countFrames);
    };

    requestAnimationFrame(countFrames);

    setTimeout(() => {
      const currentTime = performance.now();
      const fps = Math.round((frames * 1000) / (currentTime - lastTime));
      this.addMetric('FPS', fps, 'fps');
    }, 1000);
  }

  private addMetric(name: string, value: number, unit: string) {
    const metric: PerformanceMetric = {
      name,
      value,
      unit,
      timestamp: Date.now()
    };

    this.performanceMetrics.push(metric);
    
    // Limit metrics history
    if (this.performanceMetrics.length > 100) {
      this.performanceMetrics = this.performanceMetrics.slice(-80);
    }

    window.dispatchEvent(new CustomEvent('devtools:performance', { detail: metric }));
  }

  startCapture() {
    this.isCapturing = true;
    this.consoleMessages = [];
    this.performanceMetrics = [];
  }

  stopCapture() {
    this.isCapturing = false;
  }

  getConsoleMessages(): ConsoleMessage[] {
    return [...this.consoleMessages];
  }

  getPerformanceMetrics(): PerformanceMetric[] {
    return [...this.performanceMetrics];
  }

  clearConsole() {
    this.consoleMessages = [];
    window.dispatchEvent(new CustomEvent('devtools:console-cleared'));
  }

  exportLogs(): string {
    const data = {
      console: this.consoleMessages,
      performance: this.performanceMetrics,
      timestamp: new Date().toISOString()
    };
    
    return JSON.stringify(data, null, 2);
  }

  dispose() {
    this.stopCapture();
    
    // Restore original console
    Object.keys(this.originalConsole).forEach(key => {
      if (this.originalConsole[key as keyof Console]) {
        (console as any)[key] = this.originalConsole[key as keyof Console];
      }
    });
  }
}
