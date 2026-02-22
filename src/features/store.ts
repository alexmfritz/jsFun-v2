import { configureStore } from '@reduxjs/toolkit';
import { TypedUseSelectorHook, useDispatch, useSelector } from 'react-redux';
import exercisesReducer from './exercisesSlice';
import progressReducer from './progressSlice';
import uiReducer from './uiSlice';
import adminReducer from './adminSlice';

export const store = configureStore({
  reducer: {
    exercises: exercisesReducer,
    progress: progressReducer,
    ui: uiReducer,
    admin: adminReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

/** Typed hooks -- use these instead of plain useDispatch/useSelector */
export const useAppDispatch: () => AppDispatch = useDispatch;
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;