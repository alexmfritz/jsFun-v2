import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { UiState, Theme, Toast, Tier, StatusSort } from '../types';

const THEME_CYCLE: Record<Theme, Theme> = {
  dark: 'light',
  light: 'high-contrast',
  'high-contrast': 'dark',
};

const VALID_THEMES = new Set<Theme>(['dark', 'light', 'high-contrast']);

const getInitialTheme = (): Theme => {
  try {
    const stored = localStorage.getItem('theme') as Theme | null;
    return stored && VALID_THEMES.has(stored) ? stored : 'dark';
  } catch {
    return 'dark';
  }
};

const initialState: UiState = {
  theme: getInitialTheme(),
  browseFilter: {
    search: '',
    tags: [],
    tier: null,
    collectionId: null,
    categoryPath: [],
  },
  activeView: 'browse',
  toast: null,
  saveStatus: 'idle',
  showHelpModal: false,
  statusSort: 'default',
  serverReachable: true,
};

const uiSlice = createSlice({
  name: 'ui',
  initialState,
  reducers: {
    toggleTheme(state) {
      state.theme = THEME_CYCLE[state.theme] ?? 'dark';
      try {
        localStorage.setItem('theme', state.theme);
      } catch {
        // ignore -- localStorage may not be available
      }
    },
    setTheme(state, action: PayloadAction<Theme>) {
      state.theme = action.payload;
      try {
        localStorage.setItem('theme', action.payload);
      } catch {
        // ignore
      }
    },
    showToast(state, action: PayloadAction<Toast>) {
      state.toast = action.payload;
    },
    dismissToast(state) {
      state.toast = null;
    },
    setSearch(state, action: PayloadAction<string>) {
      state.browseFilter.search = action.payload;
    },
    toggleTag(state, action: PayloadAction<string>) {
      const tag = action.payload;
      const idx = state.browseFilter.tags.indexOf(tag);
      if (idx === -1) {
        state.browseFilter.tags.push(tag);
      } else {
        state.browseFilter.tags.splice(idx, 1);
      }
    },
    setTierFilter(state, action: PayloadAction<Tier | null>) {
      state.browseFilter.tier = action.payload;
    },
    setCollectionFilter(state, action: PayloadAction<string | null>) {
      state.browseFilter.collectionId = action.payload;
    },
    setCategoryPath(state, action: PayloadAction<string[]>) {
      state.browseFilter.categoryPath = action.payload;
    },
    clearFilters(state) {
      state.browseFilter = {
        search: '',
        tags: [],
        tier: null,
        collectionId: null,
        categoryPath: [],
      };
      state.statusSort = 'default';
    },
    setActiveView(state, action: PayloadAction<UiState['activeView']>) {
      state.activeView = action.payload;
    },
    setSaveStatus(state, action: PayloadAction<UiState['saveStatus']>) {
      state.saveStatus = action.payload;
    },
    setShowHelpModal(state, action: PayloadAction<boolean>) {
      state.showHelpModal = action.payload;
    },
    setStatusSort(state, action: PayloadAction<StatusSort>) {
      state.statusSort = action.payload;
    },
    setServerReachable(state, action: PayloadAction<boolean>) {
      state.serverReachable = action.payload;
    },
  },
});

export const {
  toggleTheme,
  setTheme,
  showToast,
  dismissToast,
  setSearch,
  toggleTag,
  setTierFilter,
  setCollectionFilter,
  setCategoryPath,
  clearFilters,
  setActiveView,
  setSaveStatus,
  setShowHelpModal,
  setStatusSort,
  setServerReachable,
} = uiSlice.actions;

export default uiSlice.reducer;