import { useState } from 'react';
import { useAppDispatch } from '../../features/store';
import { clearError } from '../../features/adminSlice';

interface LoginFormProps {
  error: string | null;
  onLogin: (pw: string) => void;
}

/**
 * Password form for admin authentication.
 */
export default function LoginForm({ error, onLogin }: LoginFormProps) {
  const dispatch = useAppDispatch();
  const [password, setPassword] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (password.trim()) onLogin(password);
  };

  return (
    <div className="flex items-center justify-center h-full" style={{ backgroundColor: 'var(--bg-root)' }}>
      <div
        className="w-full max-w-sm rounded-xl p-8 flex flex-col gap-4"
        style={{ backgroundColor: 'var(--bg-surface)', border: '1px solid var(--border)' }}
      >
        <h1
          className="font-heading font-bold text-xl text-center"
          style={{ color: 'var(--text-primary)' }}
        >
          Admin Login
        </h1>
        <p className="text-xs text-center" style={{ color: 'var(--text-muted)' }}>
          Enter the admin password to manage exercises.
        </p>

        <form onSubmit={handleSubmit} className="flex flex-col gap-3">
          <input
            type="password"
            value={password}
            onChange={(e) => {
              setPassword(e.target.value);
              dispatch(clearError());
            }}
            placeholder="Admin password"
            className="w-full px-3 py-2 rounded text-sm font-code"
            style={{
              backgroundColor: 'var(--bg-raised)',
              border: `1px solid ${error ? 'var(--error)' : 'var(--border)'}`,
              color: 'var(--text-primary)',
              outline: 'none',
            }}
            autoFocus
          />
          {error && (
            <p className="text-xs" style={{ color: 'var(--error)' }}>
              {error}
            </p>
          )}
          <button
            type="submit"
            className="w-full py-2 rounded text-sm font-medium font-heading"
            style={{
              backgroundColor: 'var(--accent)',
              color: '#fff',
              border: 'none',
              cursor: 'pointer',
            }}
          >
            Login
          </button>
        </form>
      </div>
    </div>
  );
}
