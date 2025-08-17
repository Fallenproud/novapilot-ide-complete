
export interface HMRUpdate {
  type: 'update' | 'add' | 'remove';
  moduleId: string;
  code?: string;
  dependencies?: string[];
  timestamp: number;
}

export interface HMRCallback {
  accept: (callback?: Function) => void;
  dispose: (callback: Function) => void;
  invalidate: () => void;
}

export class HotModuleReplacementEngine {
  private updateCallbacks: Map<string, Function[]> = new Map();
  private disposeCallbacks: Map<string, Function[]> = new Map();
  private moduleStates: Map<string, any> = new Map();
  private dependencyGraph: Map<string, Set<string>> = new Map();

  constructor() {
    this.setupHMRAPI();
  }

  private setupHMRAPI() {
    // Create global HMR API
    if (typeof window !== 'undefined') {
      (window as any).__HMR__ = {
        accept: (moduleId: string, callback?: Function) => {
          this.accept(moduleId, callback);
        },
        dispose: (moduleId: string, callback: Function) => {
          this.dispose(moduleId, callback);
        },
        invalidate: (moduleId: string) => {
          this.invalidate(moduleId);
        },
        updateModule: (update: HMRUpdate) => {
          this.updateModule(update);
        }
      };
    }
  }

  accept(moduleId: string, callback?: Function) {
    if (!this.updateCallbacks.has(moduleId)) {
      this.updateCallbacks.set(moduleId, []);
    }
    if (callback) {
      this.updateCallbacks.get(moduleId)!.push(callback);
    }
  }

  dispose(moduleId: string, callback: Function) {
    if (!this.disposeCallbacks.has(moduleId)) {
      this.disposeCallbacks.set(moduleId, []);
    }
    this.disposeCallbacks.get(moduleId)!.push(callback);
  }

  invalidate(moduleId: string) {
    // Mark module for re-compilation
    this.emitUpdate({
      type: 'update',
      moduleId,
      timestamp: Date.now()
    });
  }

  async updateModule(update: HMRUpdate) {
    const { moduleId, code, type } = update;

    try {
      // Run dispose callbacks
      const disposeCallbacks = this.disposeCallbacks.get(moduleId) || [];
      disposeCallbacks.forEach(callback => {
        try {
          callback();
        } catch (error) {
          console.warn(`HMR dispose callback error for ${moduleId}:`, error);
        }
      });

      if (type === 'update' && code) {
        // Update module code
        await this.replaceModule(moduleId, code);
        
        // Run update callbacks
        const updateCallbacks = this.updateCallbacks.get(moduleId) || [];
        updateCallbacks.forEach(callback => {
          try {
            callback();
          } catch (error) {
            console.warn(`HMR update callback error for ${moduleId}:`, error);
          }
        });

        // Update dependent modules
        await this.updateDependents(moduleId);
      }

      this.emitUpdate(update);
    } catch (error) {
      console.error(`HMR update failed for ${moduleId}:`, error);
      // Fall back to full reload
      this.emitFullReload();
    }
  }

  private async replaceModule(moduleId: string, code: string) {
    // Save current state
    const currentState = this.moduleStates.get(moduleId);
    
    // Execute new module code
    try {
      const moduleFunction = new Function('module', 'exports', 'require', '__HMR__', code);
      const newModule = { exports: {} };
      
      moduleFunction(
        newModule,
        newModule.exports,
        (id: string) => this.requireModule(id),
        (window as any).__HMR__
      );

      // If module has HMR accept, merge state
      if (currentState && newModule.exports) {
        this.mergeModuleState(newModule.exports, currentState);
      }

      this.moduleStates.set(moduleId, newModule.exports);
    } catch (error) {
      console.error(`Module replacement failed for ${moduleId}:`, error);
      throw error;
    }
  }

  private mergeModuleState(newExports: any, oldState: any) {
    // Preserve React component state and other stateful objects
    if (typeof newExports === 'function' && oldState) {
      // For React components, try to preserve state
      if (newExports.prototype && newExports.prototype.render) {
        // Class component
        Object.keys(oldState).forEach(key => {
          if (key.startsWith('_') || key === 'state') {
            newExports.prototype[key] = oldState[key];
          }
        });
      }
    }
  }

  private async updateDependents(moduleId: string) {
    const dependents = this.getDependents(moduleId);
    
    for (const dependent of dependents) {
      // Check if dependent accepts HMR updates
      if (this.updateCallbacks.has(dependent)) {
        await this.updateModule({
          type: 'update',
          moduleId: dependent,
          timestamp: Date.now()
        });
      }
    }
  }

  private getDependents(moduleId: string): string[] {
    const dependents: string[] = [];
    
    for (const [module, deps] of this.dependencyGraph.entries()) {
      if (deps.has(moduleId)) {
        dependents.push(module);
      }
    }
    
    return dependents;
  }

  private requireModule(id: string): any {
    return this.moduleStates.get(id) || {};
  }

  private emitUpdate(update: HMRUpdate) {
    window.dispatchEvent(new CustomEvent('hmr:update', { detail: update }));
  }

  private emitFullReload() {
    window.dispatchEvent(new CustomEvent('hmr:full-reload'));
  }

  updateDependencyGraph(moduleId: string, dependencies: string[]) {
    this.dependencyGraph.set(moduleId, new Set(dependencies));
  }

  dispose() {
    this.updateCallbacks.clear();
    this.disposeCallbacks.clear();
    this.moduleStates.clear();
    this.dependencyGraph.clear();
  }
}
