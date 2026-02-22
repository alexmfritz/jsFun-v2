import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { ProgressState } from '../types';
import { setServerReachable } from './uiSlice';

function hashCode(str: string): string {
  let hash = 5381;
  for (let i = 0; i < str.length; i++) {
    hash = ((hash << 5) + hash + str.charCodeAt(i)) | 0;
  }
  return String(hash);
}

export const fetchProgress = createAsyncThunk<
  Omit<ProgressState, 'loading' | 'error'>
>('progress/fetch', async (_, { dispatch }) => {
  try {
    const res = await fetch('/api/progress');
    if (!res.ok) throw new Error('Failed to load progress');
    dispatch(setServerReachable(true));
    return res.json();
  } catch (err) {
    dispatch(setServerReachable(false));
    throw err;
  }
});

export const saveSolution = createAsyncThunk<
  { exerciseId: number; code: string },
  { exerciseId: number; code: string }
>('progress/saveSolution', async ({ exerciseId, code }, { dispatch }) => {
  try {
    const res = await fetch('/api/progress/solution', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ exerciseId, code }),
    });
    if (!res.ok) throw new Error('Failed to save');
    dispatch(setServerReachable(true));
    return { exerciseId, code };
  } catch (err) {
    dispatch(setServerReachable(false));
    throw err;
  }
});

export const markComplete = createAsyncThunk<
  { exerciseId: number; attempts: number; completedAt: string },
  { exerciseId: number; attempts: number }
>('progress/markComplete', async ({ exerciseId, attempts }, { dispatch }) => {
  try {
    const completedAt = new Date().toISOString();
    const res = await fetch('/api/progress/complete', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ exerciseId, attempts, completedAt }),
    });
    if (!res.ok) throw new Error('Failed to save completion');
    dispatch(setServerReachable(true));
    return { exerciseId, attempts, completedAt };
  } catch (err) {
    dispatch(setServerReachable(false));
    throw err;
  }
});

export const resetExercise = createAsyncThunk<number, number>(
  'progress/resetExercise',
  async (exerciseId, { dispatch }) => {
    try {
      const res = await fetch('/api/progress/reset', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ exerciseId }),
      });
      if (!res.ok) throw new Error('Failed to reset exercise');
      dispatch(setServerReachable(true));
      return exerciseId;
    } catch (err) {
      dispatch(setServerReachable(false));
      throw err;
    }
  }
);

export const incrementAttempt = createAsyncThunk<number, number>(
  'progress/incrementAttempt',
  async (exerciseId, { dispatch }) => {
    try {
      const res = await fetch('/api/progress/attempt', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ exerciseId }),
      });
      if (!res.ok) throw new Error('Failed to record attempt');
      dispatch(setServerReachable(true));
      return exerciseId;
    } catch (err) {
      dispatch(setServerReachable(false));
      throw err;
    }
  }
);

const initialState: ProgressState = {
  studentName: '',
  completedExercises: {},
  savedSolutions: {},
  attempts: {},
  uniqueAttempts: {},
  failedCodeHashes: {},
  createdAt: '',
  lastUpdated: undefined,
  loading: false,
  error: null,
};

const progressSlice = createSlice({
  name: 'progress',
  initialState,
  reducers: {
    setStudentName(state, action: PayloadAction<string>) {
      state.studentName = action.payload;
    },
    recordFailedAttempt(
      state,
      action: PayloadAction<{ exerciseId: number; code: string }>
    ) {
      const id = String(action.payload.exerciseId);
      const hash = hashCode(action.payload.code.trim());
      if (!state.failedCodeHashes[id]) {
        state.failedCodeHashes[id] = [];
      }
      if (!state.failedCodeHashes[id].includes(hash)) {
        state.failedCodeHashes[id].push(hash);
        state.uniqueAttempts[id] = (state.uniqueAttempts[id] ?? 0) + 1;
      }
    },
    recordPassedAttempt(
      state,
      action: PayloadAction<{ exerciseId: number }>
    ) {
      const id = String(action.payload.exerciseId);
      state.uniqueAttempts[id] = (state.uniqueAttempts[id] ?? 0) + 1;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchProgress.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchProgress.fulfilled, (state, action) => {
        state.loading = false;
        Object.assign(state, action.payload);
      })
      .addCase(fetchProgress.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message ?? 'Failed to load progress';
      })
      .addCase(saveSolution.fulfilled, (state, action) => {
        const { exerciseId, code } = action.payload;
        state.savedSolutions[String(exerciseId)] = code;
        state.lastUpdated = new Date().toISOString();
      })
      .addCase(markComplete.fulfilled, (state, action) => {
        const { exerciseId, attempts, completedAt } = action.payload;
        state.completedExercises[String(exerciseId)] = { completedAt, attempts };
        state.lastUpdated = new Date().toISOString();
      })
      .addCase(incrementAttempt.fulfilled, (state, action) => {
        const id = String(action.payload);
        state.attempts[id] = (state.attempts[id] ?? 0) + 1;
      })
      .addCase(resetExercise.fulfilled, (state, action) => {
        const id = String(action.payload);
        delete state.completedExercises[id];
        delete state.savedSolutions[id];
        delete state.attempts[id];
        delete state.uniqueAttempts[id];
        delete state.failedCodeHashes[id];
        state.lastUpdated = new Date().toISOString();
      });
  },
});

export const { setStudentName, recordFailedAttempt, recordPassedAttempt } =
  progressSlice.actions;

export const selectIsComplete = (id: number) =>
  (state: { progress: ProgressState }) =>
    !!state.progress.completedExercises[String(id)];

export const selectAttempts = (id: number) =>
  (state: { progress: ProgressState }) =>
    state.progress.attempts[String(id)] ?? 0;

export const selectUniqueAttempts = (id: number) =>
  (state: { progress: ProgressState }) =>
    state.progress.uniqueAttempts[String(id)] ?? 0;

export const selectSavedSolution = (id: number) =>
  (state: { progress: ProgressState }) =>
    state.progress.savedSolutions[String(id)] ?? null;

export const selectCompletedCount = (state: { progress: ProgressState }) =>
  Object.keys(state.progress.completedExercises).length;

export const selectIsDuplicateCode =
  (id: number, code: string) =>
  (state: { progress: ProgressState }) => {
    const hashes = state.progress.failedCodeHashes[String(id)];
    if (!hashes || hashes.length === 0) return false;
    const hash = hashCode(code.trim());
    return hashes.includes(hash);
  };

export { hashCode };
export default progressSlice.reducer;



