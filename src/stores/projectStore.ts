import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { createSampleProjects } from '@/utils/sampleProjects';

export interface ProjectFile {
  id: string;
  name: string;
  path: string;
  content: string;
  language: string;
  lastModified: Date;
  isGenerated?: boolean;
}

export interface Project {
  id: string;
  name: string;
  description: string;
  files: ProjectFile[];
  createdAt: Date;
  updatedAt: Date;
  isActive?: boolean;
  deploymentUrl?: string;
  status: 'draft' | 'building' | 'deployed' | 'error';
}

interface ProjectState {
  projects: Project[];
  activeProject: Project | null;
  activeFile: ProjectFile | null;
  
  // Computed property for all files across projects
  allFiles: ProjectFile[];
  
  // Actions
  createProject: (name: string, description: string) => void;
  addProject: (project: Project) => void;
  deleteProject: (id: string) => void;
  setActiveProject: (project: Project) => void;
  updateProject: (id: string, updates: Partial<Project>) => void;
  initializeSampleProjects: () => void;
  
  // File operations
  createFile: (projectId: string, file: Omit<ProjectFile, 'id' | 'lastModified'>) => void;
  updateFile: (projectId: string, fileId: string, content: string) => void;
  deleteFile: (projectId: string, fileId: string) => void;
  setActiveFile: (file: ProjectFile | null) => void;
}

export const useProjectStore = create<ProjectState>()(
  persist(
    (set, get) => ({
      projects: [],
      activeProject: null,
      activeFile: null,

      // Computed property that returns all files from the active project
      get allFiles() {
        const state = get();
        return state.activeProject?.files || [];
      },

      initializeSampleProjects: () => {
        const state = get();
        // Only initialize if no projects exist
        if (state.projects.length === 0) {
          const sampleProjects = createSampleProjects();
          
          set({
            projects: sampleProjects,
            activeProject: null,
            activeFile: null
          });
        }
      },

      createProject: (name: string, description: string) => {
        const newProject: Project = {
          id: crypto.randomUUID(),
          name,
          description,
          files: [],
          createdAt: new Date(),
          updatedAt: new Date(),
          status: 'draft'
        };
        
        set(state => ({
          projects: [...state.projects, newProject],
          activeProject: newProject
        }));
      },

      addProject: (project: Project) => {
        set(state => ({
          projects: [...state.projects, project],
          activeProject: project
        }));
      },

      deleteProject: (id: string) => {
        set(state => ({
          projects: state.projects.filter(p => p.id !== id),
          activeProject: state.activeProject?.id === id ? null : state.activeProject
        }));
      },

      setActiveProject: (project: Project) => {
        set({ 
          activeProject: project, 
          activeFile: null 
        });
      },

      updateProject: (id: string, updates: Partial<Project>) => {
        set(state => ({
          projects: state.projects.map(p => 
            p.id === id 
              ? { ...p, ...updates, updatedAt: new Date() }
              : p
          ),
          activeProject: state.activeProject?.id === id 
            ? { ...state.activeProject, ...updates, updatedAt: new Date() }
            : state.activeProject
        }));
      },

      createFile: (projectId: string, file: Omit<ProjectFile, 'id' | 'lastModified'>) => {
        const newFile: ProjectFile = {
          ...file,
          id: crypto.randomUUID(),
          lastModified: new Date()
        };

        set(state => ({
          projects: state.projects.map(p =>
            p.id === projectId
              ? { ...p, files: [...p.files, newFile], updatedAt: new Date() }
              : p
          ),
          activeProject: state.activeProject?.id === projectId
            ? { ...state.activeProject, files: [...state.activeProject.files, newFile], updatedAt: new Date() }
            : state.activeProject
        }));
      },

      updateFile: (projectId: string, fileId: string, content: string) => {
        set(state => ({
          projects: state.projects.map(p =>
            p.id === projectId
              ? {
                  ...p,
                  files: p.files.map(f =>
                    f.id === fileId
                      ? { ...f, content, lastModified: new Date() }
                      : f
                  ),
                  updatedAt: new Date()
                }
              : p
          ),
          activeProject: state.activeProject?.id === projectId
            ? {
                ...state.activeProject,
                files: state.activeProject.files.map(f =>
                  f.id === fileId
                    ? { ...f, content, lastModified: new Date() }
                    : f
                ),
                updatedAt: new Date()
              }
            : state.activeProject,
          activeFile: state.activeFile?.id === fileId
            ? { ...state.activeFile, content, lastModified: new Date() }
            : state.activeFile
        }));
      },

      deleteFile: (projectId: string, fileId: string) => {
        set(state => ({
          projects: state.projects.map(p =>
            p.id === projectId
              ? { 
                  ...p, 
                  files: p.files.filter(f => f.id !== fileId),
                  updatedAt: new Date()
                }
              : p
          ),
          activeProject: state.activeProject?.id === projectId
            ? {
                ...state.activeProject,
                files: state.activeProject.files.filter(f => f.id !== fileId),
                updatedAt: new Date()
              }
            : state.activeProject,
          activeFile: state.activeFile?.id === fileId ? null : state.activeFile
        }));
      },

      setActiveFile: (file: ProjectFile | null) => {
        set({ activeFile: file });
      }
    }),
    {
      name: 'novapilot-projects'
    }
  )
);
