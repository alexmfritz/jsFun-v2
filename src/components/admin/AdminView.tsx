import { useAppDispatch, useAppSelector } from '../../features/store';
import { loginAdmin } from '../../features/adminSlice';
import LoginForm from './LoginForm';
import AddExerciseForm from './AddExerciseForm';

/**
 * Password-protected admin panel for adding exercises.
 */
export default function AdminView() {
  const dispatch = useAppDispatch();
  const { isAuthenticated, error } = useAppSelector((s) => s.admin);

  if (!isAuthenticated) {
    return <LoginForm error={error} onLogin={(pw) => dispatch(loginAdmin(pw))} />;
  }

  return <AddExerciseForm />;
}
