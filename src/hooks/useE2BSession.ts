import { useState, useEffect, useCallback } from 'react';
import { e2bService, E2BSession, FileChange } from '@/services/e2bService';

export interface E2BSessionState {
  session: E2BSession | null;
  isConnected: boolean;
  isExecuting: boolean;
  logs: string[];
  output: string;
  error: string | null;
}

export const useE2BSession = (projectId: string) => {
  const [state, setState] = useState<E2BSessionState>({
    session: null,
    isConnected: false,
    isExecuting: false,
    logs: [],
    output: '',
    error: null
  });

  // Create session
  const createSession = useCallback(async (template: string = 'node') => {
    try {
      setState(prev => ({ ...prev, error: null }));
      const session = await e2bService.createSession(projectId, template);
      
      setState(prev => ({
        ...prev,
        session,
        isConnected: true
      }));

      // Setup event listeners
      e2bService.onSessionEvent(session.id, 'code_output', (data) => {
        setState(prev => ({
          ...prev,
          output: prev.output + data.output,
          logs: [...prev.logs, `[OUTPUT] ${data.output}`]
        }));
      });

      e2bService.onSessionEvent(session.id, 'code_error', (data) => {
        setState(prev => ({
          ...prev,
          error: data.error,
          logs: [...prev.logs, `[ERROR] ${data.error}`]
        }));
      });

      e2bService.onSessionEvent(session.id, 'execution_started', () => {
        setState(prev => ({
          ...prev,
          isExecuting: true,
          logs: [...prev.logs, '[SYSTEM] Code execution started']
        }));
      });

      e2bService.onSessionEvent(session.id, 'execution_finished', () => {
        setState(prev => ({
          ...prev,
          isExecuting: false,
          logs: [...prev.logs, '[SYSTEM] Code execution finished']
        }));
      });

      e2bService.onSessionEvent(session.id, 'file_updated', (data) => {
        setState(prev => ({
          ...prev,
          logs: [...prev.logs, `[FILE] Updated ${data.path}`]
        }));
      });

      e2bService.onSessionEvent(session.id, 'package_installed', (data) => {
        setState(prev => ({
          ...prev,
          logs: [...prev.logs, `[PACKAGE] Installed ${data.package}`]
        }));
      });

      e2bService.onSessionEvent(session.id, 'session_closed', () => {
        setState(prev => ({
          ...prev,
          isConnected: false,
          session: null
        }));
      });

      e2bService.onSessionEvent(session.id, 'session_error', (data) => {
        setState(prev => ({
          ...prev,
          error: `Session error: ${data.error}`,
          isConnected: false
        }));
      });

      return session;
    } catch (error) {
      setState(prev => ({
        ...prev,
        error: error instanceof Error ? error.message : 'Failed to create session'
      }));
      throw error;
    }
  }, [projectId]);

  // Execute code
  const executeCode = useCallback(async (code: string, language: string = 'javascript') => {
    if (!state.session) {
      throw new Error('No active session');
    }

    setState(prev => ({ ...prev, isExecuting: true, error: null }));
    
    try {
      await e2bService.executeCode(state.session.id, code, language);
    } catch (error) {
      setState(prev => ({
        ...prev,
        error: error instanceof Error ? error.message : 'Execution failed',
        isExecuting: false
      }));
    }
  }, [state.session]);

  // Update files
  const updateFiles = useCallback(async (changes: FileChange[]) => {
    if (!state.session) {
      throw new Error('No active session');
    }

    try {
      await e2bService.updateFiles(state.session.id, changes);
    } catch (error) {
      setState(prev => ({
        ...prev,
        error: error instanceof Error ? error.message : 'File update failed'
      }));
    }
  }, [state.session]);

  // Install packages
  const installPackages = useCallback(async (packages: string[]) => {
    if (!state.session) {
      throw new Error('No active session');
    }

    try {
      await e2bService.installPackages(state.session.id, packages);
    } catch (error) {
      setState(prev => ({
        ...prev,
        error: error instanceof Error ? error.message : 'Package installation failed'
      }));
    }
  }, [state.session]);

  // Close session
  const closeSession = useCallback(async () => {
    if (state.session) {
      await e2bService.closeSession(state.session.id);
      setState({
        session: null,
        isConnected: false,
        isExecuting: false,
        logs: [],
        output: '',
        error: null
      });
    }
  }, [state.session]);

  // Clear logs and output
  const clearOutput = useCallback(() => {
    setState(prev => ({
      ...prev,
      logs: [],
      output: '',
      error: null
    }));
  }, []);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (state.session) {
        e2bService.closeSession(state.session.id);
      }
    };
  }, [state.session]);

  return {
    ...state,
    createSession,
    executeCode,
    updateFiles,
    installPackages,
    closeSession,
    clearOutput
  };
};