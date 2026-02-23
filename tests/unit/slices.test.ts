import { describe, it, expect } from 'vitest';
import uiReducer, {
  toggleTheme,
  setSearch,
  toggleTag,
  setTierFilter,
  setCollectionFilter,
  clearFilters,
  showToast,
  dismissToast,
  setStatusSort,
  setServerReachable,
} from '../../src/features/uiSlice';
import { UiState } from '../../src/types';

describe('uiSlice', () => {
  const initial: UiState = {
    theme: 'dark',
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

  it('toggles theme dark → light', () => {
    const state = uiReducer(initial, toggleTheme());
    expect(state.theme).toBe('light');
  });

  it('toggles theme light → high-contrast', () => {
    const lightState = { ...initial, theme: 'light' as const };
    const state = uiReducer(lightState, toggleTheme());
    expect(state.theme).toBe('high-contrast');
  });

  it('toggles theme high-contrast → dark', () => {
    const hcState = { ...initial, theme: 'high-contrast' as const };
    const state = uiReducer(hcState, toggleTheme());
    expect(state.theme).toBe('dark');
  });

  it('full theme cycle: dark → light → high-contrast → dark', () => {
    let state = uiReducer(initial, toggleTheme());
    expect(state.theme).toBe('light');
    state = uiReducer(state, toggleTheme());
    expect(state.theme).toBe('high-contrast');
    state = uiReducer(state, toggleTheme());
    expect(state.theme).toBe('dark');
  });

  it('sets search filter', () => {
    const state = uiReducer(initial, setSearch('arrays'));
    expect(state.browseFilter.search).toBe('arrays');
  });

  it('toggles a tag on', () => {
    const state = uiReducer(initial, toggleTag('functions'));
    expect(state.browseFilter.tags).toContain('functions');
  });

  it('toggles a tag off when already present', () => {
    const withTag = uiReducer(initial, toggleTag('functions'));
    const without = uiReducer(withTag, toggleTag('functions'));
    expect(without.browseFilter.tags).not.toContain('functions');
  });

  it('sets tier filter', () => {
    const state = uiReducer(initial, setTierFilter(3));
    expect(state.browseFilter.tier).toBe(3);
  });

  it('clears tier filter with null', () => {
    const withTier = uiReducer(initial, setTierFilter(3));
    const cleared = uiReducer(withTier, setTierFilter(null));
    expect(cleared.browseFilter.tier).toBeNull();
  });

  it('sets collection filter', () => {
    const state = uiReducer(initial, setCollectionFilter('array-bootcamp'));
    expect(state.browseFilter.collectionId).toBe('array-bootcamp');
  });

  it('clearFilters resets everything', () => {
    let state = uiReducer(initial, setSearch('test'));
    state = uiReducer(state, toggleTag('functions'));
    state = uiReducer(state, setTierFilter(2));
    state = uiReducer(state, setCollectionFilter('array-bootcamp'));
    state = uiReducer(state, clearFilters());
    expect(state.browseFilter.search).toBe('');
    expect(state.browseFilter.tags).toHaveLength(0);
    expect(state.browseFilter.tier).toBeNull();
    expect(state.browseFilter.collectionId).toBeNull();
  });

  // Toast tests
  it('showToast sets toast', () => {
    const state = uiReducer(initial, showToast({ message: 'Error occurred', type: 'error' }));
    expect(state.toast).toEqual({ message: 'Error occurred', type: 'error' });
  });

  it('dismissToast clears toast', () => {
    const withToast = uiReducer(initial, showToast({ message: 'test', type: 'success' }));
    const state = uiReducer(withToast, dismissToast());
    expect(state.toast).toBeNull();
  });

  it('showToast replaces existing toast', () => {
    let state = uiReducer(initial, showToast({ message: 'first', type: 'error' }));
    state = uiReducer(state, showToast({ message: 'second', type: 'warning' }));
    expect(state.toast).toEqual({ message: 'second', type: 'warning' });
  });

  // StatusSort tests
  it('setStatusSort changes statusSort', () => {
    const state = uiReducer(initial, setStatusSort('in-progress-first'));
    expect(state.statusSort).toBe('in-progress-first');
  });

  it('clearFilters resets statusSort to default', () => {
    let state = uiReducer(initial, setStatusSort('completed-first'));
    state = uiReducer(state, clearFilters());
    expect(state.statusSort).toBe('default');
  });

  // ServerReachable tests
  it('setServerReachable sets to false', () => {
    const state = uiReducer(initial, setServerReachable(false));
    expect(state.serverReachable).toBe(false);
  });

  it('setServerReachable sets to true', () => {
    const offlineState = { ...initial, serverReachable: false };
    const state = uiReducer(offlineState, setServerReachable(true));
    expect(state.serverReachable).toBe(true);
  });
});
