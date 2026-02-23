import { useEffect } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from './features/store';
import { fetchExercises } from './features/exercisesSlice';
import { fetchProgress } from './features/progressSlice';
import { useTutorial } from './hooks/useTutorial';
import Header from './components/shared/Header';
import Toast from './components/shared/Toast';
import HelpModal from './components/shared/HelpModal';
import Tutorial from './components/shared/Tutorial';
import ErrorBoundary from './components/shared/ErrorBoundary';
import BrowseView from './components/browse/BrowseView';
import ExerciseView from './components/exercise/ExerciseView';
import DashboardView from './components/dashboard/DashboardView';
import AdminView from './components/admin/AdminView';

export default function App() {
  const dispatch = useAppDispatch();
  const theme = useAppSelector((s) => s.ui.theme);
  const tutorial = useTutorial();

  // Apply theme class to <html>
  useEffect(() => {
    document.documentElement.classList.remove('dark', 'light', 'high-contrast');
    document.documentElement.classList.add(theme);
  }, [theme]);

  // Load data on mount
  useEffect(() => {
    void dispatch(fetchExercises());
    void dispatch(fetchProgress());
  }, [dispatch]);

  return (
    <div
      className="flex flex-col h-full transition-theme"
      style={{ backgroundColor: 'var(--bg-root)', color: 'var(--text-primary)' }}
    >
      <a href="#main-content" className="sr-only sr-only-focusable">
        Skip to main content
      </a>
      <Header />
      <main id="main-content" className="flex-1 overflow-hidden" data-tutorial="main">
        <Routes>
          <Route path="/" element={<Navigate to="/exercises" replace />} />
          <Route
            path="/exercises"
            element={
              <ErrorBoundary section="Browse">
                <BrowseView />
              </ErrorBoundary>
            }
          />
          <Route
            path="/exercises/:id"
            element={
              <ErrorBoundary section="Exercise">
                <ExerciseView />
              </ErrorBoundary>
            }
          />
          <Route
            path="/dashboard"
            element={
              <ErrorBoundary section="Dashboard">
                <DashboardView />
              </ErrorBoundary>
            }
          />
          <Route
            path="/admin"
            element={
              <ErrorBoundary section="Admin">
                <AdminView />
              </ErrorBoundary>
            }
          />
        </Routes>
      </main>
      <Toast />
      <HelpModal onRestartTutorial={tutorial.restart} />
      <Tutorial tutorial={tutorial} />
    </div>
  );
}
