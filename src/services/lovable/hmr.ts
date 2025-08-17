
export interface HMRUpdate {
  type: 'update' | 'invalidate' | 'error';
  moduleId: string;
  code?: string;
  timestamp: number;
  error?: string;
}

export interface HMRAcceptCallback {
  (dependencies: string[]): void;
}

export interface HMRDisposeCallback {
  (): void;
}

export class HotModuleReplacementEngine {
  private moduleRegistry: Map<string, any> = new Map();
  private dependencyGraph: Map<string, Set<string>> = new Map();
  private acceptCallbacks: Map<string, HMRAcceptCallback[]> = new Map();
  private disposeCallbacks: Map<string, HMRDisposeCallback[]> = new Map();
  private isEnabled: boolean = true;

  constructor() {
    this.setupGlobalHMRAPI();
  }

  private setupGlobalHMRAPI() {
    // Setup HMR API on window for access from executed code
    (window as any).__HMR__ = {
      accept: (moduleId: string, callback?: HMRAcceptCallback) => this.accept(moduleId, callback),
      dispose: (moduleId: string, callback: HMRDisposeCallback) => this.dispose(moduleId, callback),
      invalidate: (moduleId: string) => this.invalidate(moduleId),
      isEnabled: () => this.isEnabled
    };
  }

  accept(moduleId: string, callback?: HMRAcceptCallback) {
    if (!this.acceptCallbacks.has(moduleId)) {
      this.acceptCallbacks.set(moduleId, []);
    }
    
    if (callback) {
      this.acceptCallbacks.get(moduleId)!.push(callback);
    }
    
    console.log(`[HMR] Module ${moduleId} accepted updates`);
  }

  dispose(moduleId: string, callback: HMRDisposeCallback) {
    if (!this.disposeCallbacks.has(moduleId)) {
      this.disposeCallbacks.set(moduleId, []);
    }
    
    this.disposeCallbacks.get(moduleId)!.push(callback);
    console.log(`[HMR] Dispose callback registered for ${moduleId}`);
  }

  invalidate(moduleId: string) {
    console.log(`[HMR] Module ${moduleId} invalidated`);
    this.cleanupModule(moduleId);
    
    // Emit invalidation event
    window.dispatchEvent(new CustomEvent('hmr:invalidate', {
      detail: { moduleId }
    }));
  }

  async updateModule(update: HMRUpdate): Promise<boolean> {
    if (!this.isEnabled) {
      console.warn('[HMR] Updates disabled');
      return false;
    }

    const { moduleId, code, type } = update;
    
    console.log(`[HMR] Updating module: ${moduleId}`);

    try {
      // Run dispose callbacks before update
      await this.runDisposeCallbacks(moduleId);
      
      if (type === 'update' && code) {
        // Update module registry
        this.moduleRegistry.set(moduleId, {
          code,
          timestamp: update.timestamp,
          exports: null // Will be populated when executed
        });

        // Run accept callbacks
        await this.runAcceptCallbacks(moduleId);
        
        // Emit update event
        window.dispatchEvent(new CustomEvent('hmr:update', {
          detail: { moduleId, code, timestamp: update.timestamp }
        }));
        
        console.log(`[HMR] Module ${moduleId} updated successfully`);
        return true;
      } else if (type === 'invalidate') {
        this.invalidate(moduleId);
        return true;
      } else if (type === 'error') {
        console.error(`[HMR] Update error for ${moduleId}:`, update.error);
        
        // Emit error event
        window.dispatchEvent(new CustomEvent('hmr:error', {
          detail: { moduleId, error: update.error }
        }));
        
        return false;
      }
      
      return false;
    } catch (error) {
      console.error(`[HMR] Failed to update module ${moduleId}:`, error);
      return false;
    }
  }

  private async runDisposeCallbacks(moduleId: string) {
    const callbacks = this.disposeCallbacks.get(moduleId) || [];
    
    for (const callback of callbacks) {
      try {
        await callback();
      } catch (error) {
        console.error(`[HMR] Dispose callback error for ${moduleId}:`, error);
      }
    }
    
    // Clear callbacks after running
    this.disposeCallbacks.delete(moduleId);
  }

  private async runAcceptCallbacks(moduleId: string) {
    const callbacks = this.acceptCallbacks.get(moduleId) || [];
    const dependencies = Array.from(this.dependencyGraph.get(moduleId) || []);
    
    for (const callback of callbacks) {
      try {
        await callback(dependencies);
      } catch (error) {
        console.error(`[HMR] Accept callback error for ${moduleId}:`, error);
      }
    }
  }

  private cleanupModule(moduleId: string) {
    // Remove from registry
    this.moduleRegistry.delete(moduleId);
    
    // Clear callbacks
    this.acceptCallbacks.delete(moduleId);
    this.disposeCallbacks.delete(moduleId);
    
    // Remove from dependency graph
    this.dependencyGraph.delete(moduleId);
    
    // Remove as dependency from other modules
    for (const [otherId, deps] of this.dependencyGraph.entries()) {
      deps.delete(moduleId);
    }
  }

  updateDependencyGraph(moduleId: string, dependencies: string[]) {
    this.dependencyGraph.set(moduleId, new Set(dependencies));
  }

  getDependents(moduleId: string): string[] {
    const dependents: string[] = [];
    
    for (const [otherId, deps] of this.dependencyGraph.entries()) {
      if (deps.has(moduleId)) {
        dependents.push(otherId);
      }
    }
    
    return dependents;
  }

  getModule(moduleId: string): any {
    return this.moduleRegistry.get(moduleId);
  }

  hasModule(moduleId: string): boolean {
    return this.moduleRegistry.has(moduleId);
  }

  enable() {
    this.isEnabled = true;
    console.log('[HMR] Hot Module Replacement enabled');
  }

  disable() {
    this.isEnabled = false;
    console.log('[HMR] Hot Module Replacement disabled');
  }

  dispose() {
    // Cleanup all modules
    for (const moduleId of this.moduleRegistry.keys()) {
      this.cleanupModule(moduleId);
    }
    
    // Remove global API
    delete (window as any).__HMR__;
    
    console.log('[HMR] Hot Module Replacement disposed');
  }
}
