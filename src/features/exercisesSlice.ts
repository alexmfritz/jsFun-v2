import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { ExercisesState, ExercisesData } from '../types';
import { setServerReachable } from './uiSlice';

export const fetchExercises = createAsyncThunk<ExercisesData>(
  'exercises/fetchAll',
  async (_, { dispatch }) => {
    try {
      const res = await fetch('/api/exercises');
      if (!res.ok) throw new Error('Failed to load exercises');
      dispatch(setServerReachable(true));
      return res.json() as Promise<ExercisesData>;
    } catch (err) {
      dispatch(setServerReachable(false));
      throw err;
    }
  }
);

const initialState: ExercisesState = {
  exercises: [],
  categories: {},
  collections: [],
  loading: false,
  error: null,
};

const exercisesSlice = createSlice({
  name: 'exercises',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchExercises.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchExercises.fulfilled, (state, action: PayloadAction<ExercisesData>) => {
        state.loading = false;
        state.exercises = action.payload.exercises;
        state.categories = action.payload.categories;
        state.collections = action.payload.collections;
      })
      .addCase(fetchExercises.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message ?? 'Unknown error';
      });
  },
});

export default exercisesSlice.reducer;
