
export interface PackageInfo {
  name: string;
  version: string;
  description: string;
  exports: Record<string, any>;
  dependencies?: string[];
}

export class VirtualPackageRegistry {
  private packages: Map<string, PackageInfo> = new Map();
  private loadedModules: Map<string, any> = new Map();

  constructor() {
    this.initializeBuiltinPackages();
  }

  private initializeBuiltinPackages() {
    // React (already loaded via CDN)
    this.registerPackage({
      name: 'react',
      version: '18.0.0',
      description: 'React library for building user interfaces',
      exports: {
        default: (window as any).React,
        createElement: (window as any).React?.createElement,
        useState: (window as any).React?.useState,
        useEffect: (window as any).React?.useEffect,
        useContext: (window as any).React?.useContext,
        useRef: (window as any).React?.useRef,
        useMemo: (window as any).React?.useMemo,
        useCallback: (window as any).React?.useCallback
      }
    });

    // React DOM
    this.registerPackage({
      name: 'react-dom',
      version: '18.0.0',
      description: 'React DOM rendering',
      exports: {
        default: (window as any).ReactDOM,
        render: (window as any).ReactDOM?.render,
        createRoot: (window as any).ReactDOM?.createRoot
      }
    });

    // Lodash (lightweight implementation)
    this.registerPackage({
      name: 'lodash',
      version: '4.17.21',
      description: 'Utility library',
      exports: {
        default: this.createLodashSubset(),
        map: (arr: any[], fn: (value: any, index: number, array: any[]) => any) => arr.map(fn),
        filter: (arr: any[], fn: (value: any, index: number, array: any[]) => boolean) => arr.filter(fn),
        find: (arr: any[], fn: (value: any, index: number, array: any[]) => boolean) => arr.find(fn),
        isEmpty: (value: any) => {
          if (value == null) return true;
          if (Array.isArray(value) || typeof value === 'string') return value.length === 0;
          if (typeof value === 'object') return Object.keys(value).length === 0;
          return false;
        },
        cloneDeep: (obj: any) => JSON.parse(JSON.stringify(obj))
      }
    });

    // Axios (fetch wrapper)
    this.registerPackage({
      name: 'axios',
      version: '1.0.0',
      description: 'HTTP client',
      exports: {
        default: this.createAxiosWrapper(),
        get: (url: string, config?: any) => this.createAxiosWrapper().get(url, config),
        post: (url: string, data?: any, config?: any) => this.createAxiosWrapper().post(url, data, config)
      }
    });
  }

  private createLodashSubset() {
    return {
      map: (arr: any[], fn: (value: any, index: number, array: any[]) => any) => arr.map(fn),
      filter: (arr: any[], fn: (value: any, index: number, array: any[]) => boolean) => arr.filter(fn),
      find: (arr: any[], fn: (value: any, index: number, array: any[]) => boolean) => arr.find(fn),
      isEmpty: (value: any) => {
        if (value == null) return true;
        if (Array.isArray(value) || typeof value === 'string') return value.length === 0;
        if (typeof value === 'object') return Object.keys(value).length === 0;
        return false;
      },
      cloneDeep: (obj: any) => JSON.parse(JSON.stringify(obj)),
      debounce: (func: Function, wait: number) => {
        let timeout: NodeJS.Timeout;
        return (...args: any[]) => {
          clearTimeout(timeout);
          timeout = setTimeout(() => func.apply(null, args), wait);
        };
      },
      throttle: (func: Function, limit: number) => {
        let inThrottle: boolean;
        return (...args: any[]) => {
          if (!inThrottle) {
            func.apply(null, args);
            inThrottle = true;
            setTimeout(() => inThrottle = false, limit);
          }
        };
      }
    };
  }

  private createAxiosWrapper() {
    const axiosInstance = {
      get: async (url: string, config: any = {}) => {
        const response = await fetch(url, {
          method: 'GET',
          headers: config.headers || {}
        });
        return {
          data: await response.json(),
          status: response.status,
          statusText: response.statusText,
          headers: response.headers
        };
      },
      post: async (url: string, data: any, config: any = {}) => {
        const response = await fetch(url, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            ...config.headers
          },
          body: JSON.stringify(data)
        });
        return {
          data: await response.json(),
          status: response.status,
          statusText: response.statusText,
          headers: response.headers
        };
      },
      put: async (url: string, data: any, config: any = {}) => {
        const response = await fetch(url, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            ...config.headers
          },
          body: JSON.stringify(data)
        });
        return {
          data: await response.json(),
          status: response.status,
          statusText: response.statusText,
          headers: response.headers
        };
      },
      delete: async (url: string, config: any = {}) => {
        const response = await fetch(url, {
          method: 'DELETE',
          headers: config.headers || {}
        });
        return {
          data: await response.json(),
          status: response.status,
          statusText: response.statusText,
          headers: response.headers
        };
      }
    };

    return axiosInstance;
  }

  registerPackage(packageInfo: PackageInfo) {
    this.packages.set(packageInfo.name, packageInfo);
  }

  async resolvePackage(name: string, version?: string): Promise<any> {
    const cacheKey = `${name}@${version || 'latest'}`;
    
    if (this.loadedModules.has(cacheKey)) {
      return this.loadedModules.get(cacheKey);
    }

    const packageInfo = this.packages.get(name);
    if (packageInfo) {
      this.loadedModules.set(cacheKey, packageInfo.exports);
      return packageInfo.exports;
    }

    // Try to load from CDN
    try {
      const cdnUrl = this.getCDNUrl(name, version);
      if (cdnUrl) {
        const module = await this.loadFromCDN(cdnUrl);
        this.loadedModules.set(cacheKey, module);
        return module;
      }
    } catch (error) {
      console.warn(`Failed to load package ${name} from CDN:`, error);
    }

    throw new Error(`Package not found: ${name}`);
  }

  private getCDNUrl(name: string, version?: string): string | null {
    const commonPackages: Record<string, string> = {
      'date-fns': 'https://cdn.skypack.dev/date-fns',
      'uuid': 'https://cdn.skypack.dev/uuid',
      'classnames': 'https://cdn.skypack.dev/classnames',
      'moment': 'https://cdn.skypack.dev/moment'
    };

    if (commonPackages[name]) {
      return version ? `${commonPackages[name]}@${version}` : commonPackages[name];
    }

    return null;
  }

  private async loadFromCDN(url: string): Promise<any> {
    return new Promise((resolve, reject) => {
      const script = document.createElement('script');
      script.type = 'module';
      script.src = url;
      script.onload = () => {
        // Try to access the module from global scope
        const moduleName = url.split('/').pop()?.split('@')[0];
        const globalModule = (window as any)[moduleName];
        if (globalModule) {
          resolve(globalModule);
        } else {
          reject(new Error(`Module ${moduleName} not found in global scope`));
        }
      };
      script.onerror = () => reject(new Error(`Failed to load ${url}`));
      document.head.appendChild(script);
    });
  }

  getAvailablePackages(): PackageInfo[] {
    return Array.from(this.packages.values());
  }

  isPackageAvailable(name: string): boolean {
    return this.packages.has(name);
  }

  dispose() {
    this.packages.clear();
    this.loadedModules.clear();
  }
}
