import { describe, it, expect } from 'vitest';
import exercisesReducer, { fetchExercises } from '../../src/features/exercisesSlice';
import { ExercisesState } from '../../src/types';

const initialState: ExercisesState = {
  exercises: [],
  categories: {},
  collections: [],
  loading: false,
  error: null,
};

describe('exercisesSlice', () => {
  it('fetchExercises.pending sets loading true and clears error', () => {
    const state = exercisesReducer(
      { ...initialState, error: 'previous error' },
      { type: fetchExercises.pending.type }
    );
    expect(state.loading).toBe(true);
    expect(state.error).toBeNull();
  });

  it('fetchExercises.fulfilled stores data and sets loading false', () => {
    const mockData = {
      exercises: [{ id: 1, title: 'Test', type: 'js', tier: 1, category: ['js-fundamentals'], tags: [], description: '', instructions: '', starterCode: '', solution: '', testRunner: '', resources: [] }],
      categories: { 'js-fundamentals': { label: 'JS Fundamentals' } },
      collections: [{ id: 'col1', name: 'Collection 1', description: 'test', exerciseIds: [1] }],
    };
    const state = exercisesReducer(
      { ...initialState, loading: true },
      { type: fetchExercises.fulfilled.type, payload: mockData }
    );
    expect(state.loading).toBe(false);
    expect(state.exercises).toHaveLength(1);
    expect(state.exercises[0].title).toBe('Test');
    expect(state.categories['js-fundamentals'].label).toBe('JS Fundamentals');
    expect(state.collections).toHaveLength(1);
  });

  it('fetchExercises.rejected sets error and loading false', () => {
    const state = exercisesReducer(
      { ...initialState, loading: true },
      { type: fetchExercises.rejected.type, error: { message: 'Server down' } }
    );
    expect(state.loading).toBe(false);
    expect(state.error).toBe('Server down');
  });

  it('fetchExercises.rejected uses fallback error message', () => {
    const state = exercisesReducer(
      initialState,
      { type: fetchExercises.rejected.type, error: {} }
    );
    expect(state.error).toBe('Unknown error');
  });
});
