import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { ExercisesState, ExercisesData } from '../types';
import { setServerReachable } from './uiSlice';

/** Fetch all exercise data from the server */
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

// This is the simplest slice because exercise data is read-only from the student's perspective. 
// The thunk fetches everything in one request and populates three arrays. 
// The setServerReachable dispatch is a cross-slice side effect -- if the API call fails (server is down, network issue), 
// the UI slice is notified so it can display an offline banner.

// Notice there are no synchronous reducers. 
// The exercises slice has no user-driven state mutations. 
// It loads once at startup and that is it.