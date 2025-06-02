import { create } from 'zustand';
import api from '../api/api';

const useGitStore = create((set, get) => ({
  gitStatus: null,
  repos: [],
  loading: false,
  error: null,
  accessToken: null,

  setLoading: (loading) => set({ loading }),

  setError: (error) => set({ error }),

  clearError: () => set({ error: null }),

  setStatus: (status) => set({ gitStatus: status }),

  setAccessToken: (token) => set({ accessToken: token }),
  clearError: () => set({ error: null }),

  initRepo: async (projectPath) => {
    try {
      set({ loading: true });
      await api.post('/api/git/init', { projectPath });
      set({ loading: false });
      await get().getStatus(projectPath);
      return true;
    } catch (err) {
      set({ 
        error: err.response?.data?.error || err.message,
        loading: false 
      });
      return false;
    }
  },

  cloneRepo: async (repoUrl, projectPath) => {
    try {
      set({ loading: true });
      await api.post('/api/git/clone', { repoUrl, projectPath });
      set({ loading: false });
      await get().getStatus(projectPath);
      return true;
    } catch (err) {
      set({ 
        error: err.response?.data?.error || err.message,
        loading: false 
      });
      return false;
    }
  },

  commitChanges: async (projectPath, message, files) => {
    try {
      set({ loading: true });
      await api.post('/api/git/commit', { projectPath, message, files });
      set({ loading: false });
      await get().getStatus(projectPath);
      return true;
    } catch (err) {
      set({ 
        error: err.response?.data?.error || err.message,
        loading: false 
      });
      return false;
    }
  },

  pushChanges: async (projectPath, remote = 'origin', branch = 'main') => {
    try {
      set({ loading: true });
      await api.post('/api/git/push', { projectPath, remote, branch });
      set({ loading: false });
      await get().getStatus(projectPath);
      return true;
    } catch (err) {
      set({ 
        error: err.response?.data?.error || err.message,
        loading: false 
      });
      return false;
    }
  },

  pullChanges: async (projectPath, remote = 'origin', branch = 'main') => {
    try {
      set({ loading: true });
      await api.post('/api/git/pull', { projectPath, remote, branch });
      set({ loading: false });
      await get().getStatus(projectPath);
      return true;
    } catch (err) {
      set({ 
        error: err.response?.data?.error || err.message,
        loading: false 
      });
      return false;
    }
  },

  getStatus: async (projectPath) => {
    try {
      set({ loading: true });
      const response = await api.get('/api/git/status', { params: { projectPath } });
      set({ 
        gitStatus: response.data,
        loading: false 
      });
      return response.data;
    } catch (err) {
      set({ 
        error: err.response?.data?.error || err.message,
        loading: false 
      });
      return null;
    }
  },

  createGitHubRepo: async (name, isPrivate = false) => {
    try {
      const { accessToken } = get();
      if (!accessToken) throw new Error('No GitHub access token');
      
      set({ loading: true });
      const response = await api.post('/api/github/create-repo', { 
        name, 
        isPrivate, 
        accessToken 
      });
      set({ loading: false });
      return response.data;
    } catch (err) {
      set({ 
        error: err.response?.data?.error || err.message,
        loading: false 
      });
      return null;
    }
  },

  fetchUserRepos: async () => {
    try {
      const { accessToken } = get();
      if (!accessToken) throw new Error('No GitHub access token');
      
      set({ loading: true });
      const response = await api.get('/api/github/repos', { 
        params: { accessToken } 
      });
      set({ 
        repos: response.data,
        loading: false 
      });
      return response.data;
    } catch (err) {
      set({ 
        error: err.response?.data?.error || err.message,
        loading: false 
      });
      return [];
    }
  }
}));

export default useGitStore;