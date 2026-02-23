import { useState } from 'react';
import { useAppDispatch } from '../../features/store';
import { addExercise, logout } from '../../features/adminSlice';
import { fetchExercises } from '../../features/exercisesSlice';
import { ExerciseType, Tier } from '../../types';

interface ExerciseFormData {
  title: string;
  type: ExerciseType;
  tier: Tier;
  category: string;
  tags: string;
  description: string;
  instructions: string;
  starterCode: string;
  solution: string;
  testRunner: string;
  hint: string;
  solutionGate: string;
}

const defaultForm: ExerciseFormData = {
  title: '',
  type: 'js',
  tier: 1,
  category: '',
  tags: '',
  description: '',
  instructions: '',
  starterCode: '',
  solution: '',
  testRunner: '',
  hint: '',
  solutionGate: '3',
};

/**
 * Form for adding new exercises. Requires admin re-authentication on submit.
 */
export default function AddExerciseForm() {
  const dispatch = useAppDispatch();
  const [form, setForm] = useState<ExerciseFormData>(defaultForm);
  const [status, setStatus] = useState<'idle' | 'saving' | 'success' | 'error'>('idle');
  const [statusMessage, setStatusMessage] = useState('');
  const [adminPassword, setAdminPassword] = useState('');

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!adminPassword) {
      setStatusMessage('Re-enter admin password to save.');
      setStatus('error');
      return;
    }

    setStatus('saving');

    const payload = {
      title: form.title,
      type: form.type,
      tier: Number(form.tier) as Tier,
      category: form.category.split(',').map((s) => s.trim()).filter(Boolean),
      tags: form.tags.split(',').map((s) => s.trim()).filter(Boolean),
      description: form.description,
      instructions: form.instructions,
      starterCode: form.starterCode,
      solution: form.solution,
      testRunner: form.testRunner,
      hint: form.hint,
      resources: [],
      solutionGate: Number(form.solutionGate) || 3,
      adminPassword,
    };

    try {
      await dispatch(addExercise(payload)).unwrap();
      await dispatch(fetchExercises());
      setStatus('success');
      setStatusMessage('Exercise added successfully!');
      setForm(defaultForm);
      setAdminPassword('');
    } catch (err) {
      setStatus('error');
      setStatusMessage(err instanceof Error ? err.message : 'Failed to add exercise');
    }
  };

  const inputStyle = {
    backgroundColor: 'var(--bg-raised)',
    border: '1px solid var(--border)',
    color: 'var(--text-primary)',
    borderRadius: '6px',
    padding: '6px 10px',
    fontSize: '13px',
    fontFamily: 'Source Code Pro, monospace',
    outline: 'none',
    width: '100%',
  };

  const labelStyle = {
    color: 'var(--text-secondary)',
    fontSize: '12px',
    fontFamily: 'Lexend, sans-serif',
    display: 'block' as const,
    marginBottom: '4px',
  };

  const handleLogout = () => dispatch(logout());

  return (
    <div
      className="h-full overflow-y-auto"
      style={{ backgroundColor: 'var(--bg-root)' }}
    >
      <div className="max-w-2xl mx-auto px-6 py-8">
        <div className="flex items-center justify-between mb-6">
          <h1 className="font-heading font-bold text-xl" style={{ color: 'var(--text-primary)' }}>
            Add Exercise
          </h1>
          <button
            onClick={handleLogout}
            className="text-xs px-3 py-1.5 rounded"
            style={{
              color: 'var(--text-muted)',
              border: '1px solid var(--border)',
              cursor: 'pointer',
              backgroundColor: 'transparent',
            }}
          >
            Logout
          </button>
        </div>

        <form
          onSubmit={handleSubmit}
          className="flex flex-col gap-4 rounded-xl p-6"
          style={{ backgroundColor: 'var(--bg-surface)', border: '1px solid var(--border)' }}
        >
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label style={labelStyle}>Title *</label>
              <input name="title" value={form.title} onChange={handleChange} required style={inputStyle} />
            </div>
            <div>
              <label style={labelStyle}>Type *</label>
              <select name="type" value={form.type} onChange={handleChange} style={inputStyle}>
                <option value="js">JavaScript</option>
                <option value="html">HTML</option>
                <option value="css">CSS</option>
                <option value="html-css">HTML+CSS</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label style={labelStyle}>Tier *</label>
              <select name="tier" value={form.tier} onChange={handleChange} style={inputStyle}>
                <option value={1}>I — Spark</option>
                <option value={2}>II — Foundations</option>
                <option value={3}>III — Builder</option>
                <option value={4}>IV — Architect</option>
                <option value={5}>V — Mastercraft</option>
              </select>
            </div>
            <div>
              <label style={labelStyle}>Category (comma-separated)</label>
              <input
                name="category"
                value={form.category}
                onChange={handleChange}
                placeholder="js-fundamentals, variables"
                style={inputStyle}
              />
            </div>
          </div>

          <div>
            <label style={labelStyle}>Tags (comma-separated)</label>
            <input
              name="tags"
              value={form.tags}
              onChange={handleChange}
              placeholder="strings, functions, beginner"
              style={inputStyle}
            />
          </div>

          <div>
            <label style={labelStyle}>Description (one-liner) *</label>
            <input name="description" value={form.description} onChange={handleChange} required style={inputStyle} />
          </div>

          <div>
            <label style={labelStyle}>Instructions *</label>
            <textarea
              name="instructions"
              value={form.instructions}
              onChange={handleChange}
              required
              rows={5}
              style={{ ...inputStyle, resize: 'vertical' }}
            />
          </div>

          <div>
            <label style={labelStyle}>Starter Code</label>
            <textarea
              name="starterCode"
              value={form.starterCode}
              onChange={handleChange}
              rows={4}
              style={{ ...inputStyle, resize: 'vertical' }}
            />
          </div>

          <div>
            <label style={labelStyle}>Solution *</label>
            <textarea
              name="solution"
              value={form.solution}
              onChange={handleChange}
              required
              rows={4}
              style={{ ...inputStyle, resize: 'vertical' }}
            />
          </div>

          <div>
            <label style={labelStyle}>Test Runner (JS exercises — function string)</label>
            <textarea
              name="testRunner"
              value={form.testRunner}
              onChange={handleChange}
              rows={3}
              placeholder="(code) => { ... return [{pass, description, got}] }"
              style={{ ...inputStyle, resize: 'vertical' }}
            />
          </div>

          <div>
            <label style={labelStyle}>Hint *</label>
            <textarea
              name="hint"
              value={form.hint}
              onChange={handleChange}
              required
              rows={2}
              style={{ ...inputStyle, resize: 'vertical' }}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label style={labelStyle}>Solution Gate (attempts before unlock)</label>
              <input
                name="solutionGate"
                type="number"
                value={form.solutionGate}
                onChange={handleChange}
                min={1}
                max={20}
                style={inputStyle}
              />
            </div>
            <div>
              <label style={labelStyle}>Confirm Admin Password *</label>
              <input
                type="password"
                value={adminPassword}
                onChange={(e) => setAdminPassword(e.target.value)}
                required
                style={inputStyle}
              />
            </div>
          </div>

          {status !== 'idle' && (
            <div
              className="text-sm px-3 py-2 rounded"
              style={{
                color: status === 'success' ? 'var(--success)' : status === 'error' ? 'var(--error)' : 'var(--text-muted)',
                backgroundColor:
                  status === 'success'
                    ? 'rgba(52,211,153,0.1)'
                    : status === 'error'
                    ? 'rgba(248,113,113,0.1)'
                    : 'transparent',
                border: `1px solid ${status === 'success' ? 'rgba(52,211,153,0.3)' : status === 'error' ? 'rgba(248,113,113,0.3)' : 'transparent'}`,
              }}
            >
              {status === 'saving' ? 'Saving…' : statusMessage}
            </div>
          )}

          <button
            type="submit"
            disabled={status === 'saving'}
            className="w-full py-2.5 rounded font-heading font-medium text-sm"
            style={{
              backgroundColor: status === 'saving' ? 'var(--bg-raised)' : 'var(--accent)',
              color: status === 'saving' ? 'var(--text-muted)' : '#fff',
              border: 'none',
              cursor: status === 'saving' ? 'not-allowed' : 'pointer',
            }}
          >
            {status === 'saving' ? 'Adding…' : 'Add Exercise'}
          </button>
        </form>
      </div>
    </div>
  );
}
