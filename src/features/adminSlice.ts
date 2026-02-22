import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { AdminState, Exercise } from '../types';

export const loginAdmin = createAsyncThunk<void, string>(
  'admin/login',
  async (password) => {
    const res = await fetch('/api/admin/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ password }),
    });
    if (!res.ok) {
      const body = (await res.json()) as { error?: string };
      throw new Error(body.error ?? 'Invalid password');
    }
  }
);

export const addExercise = createAsyncThunk<
  Exercise,
  Partial<Exercise> & { adminPassword: string }
>('admin/addExercise', async (payload) => {
  const res = await fetch('/api/admin/exercises', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });
  if (!res.ok) {
    const body = (await res.json()) as { error?: string };
    throw new Error(body.error ?? 'Failed to add exercise');
  }
  return res.json() as Promise<Exercise>;
});

const initialState: AdminState = {
  isAuthenticated: false,
  error: null,
};

const adminSlice = createSlice({
  name: 'admin',
  initialState,
  reducers: {
    logout(state) {
      state.isAuthenticated = false;
    },
    clearError(state) {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(loginAdmin.fulfilled, (state) => {
        state.isAuthenticated = true;
        state.error = null;
      })
      .addCase(loginAdmin.rejected, (state, action) => {
        state.isAuthenticated = false;
        state.error = action.error.message ?? 'Login failed';
      });
  },
});

export const { logout, clearError } = adminSlice.actions;
export default adminSlice.reducer;