import { describe, it, expect } from 'vitest';
import { screen } from '@testing-library/react';
import AddExerciseForm from '../../src/components/admin/AddExerciseForm';
import { renderWithProviders } from '../helpers/renderWithProviders';

describe('AddExerciseForm', () => {
  it('renders "Add Exercise" heading', () => {
    renderWithProviders(<AddExerciseForm />);
    expect(screen.getByRole('heading', { name: 'Add Exercise' })).toBeTruthy();
  });

  it('renders Logout button', () => {
    renderWithProviders(<AddExerciseForm />);
    expect(screen.getByRole('button', { name: 'Logout' })).toBeTruthy();
  });

  it('renders required form field labels', () => {
    renderWithProviders(<AddExerciseForm />);
    expect(screen.getByText('Title *')).toBeTruthy();
    expect(screen.getByText('Type *')).toBeTruthy();
    expect(screen.getByText('Tier *')).toBeTruthy();
    expect(screen.getByText(/description.*\*/i)).toBeTruthy();
    expect(screen.getByText('Instructions *')).toBeTruthy();
    expect(screen.getByText('Solution *')).toBeTruthy();
  });

  it('renders submit button', () => {
    renderWithProviders(<AddExerciseForm />);
    expect(screen.getByRole('button', { name: /add exercise/i })).toBeTruthy();
  });

  it('renders category and tags fields', () => {
    renderWithProviders(<AddExerciseForm />);
    expect(screen.getByText(/category/i)).toBeTruthy();
    expect(screen.getByText(/tags/i)).toBeTruthy();
  });

  it('renders hint and solution gate fields', () => {
    renderWithProviders(<AddExerciseForm />);
    expect(screen.getByText('Hint *')).toBeTruthy();
    expect(screen.getByText(/solution gate/i)).toBeTruthy();
  });

  it('renders type select with options', () => {
    renderWithProviders(<AddExerciseForm />);
    expect(screen.getByText('JavaScript')).toBeTruthy();
    expect(screen.getByText('HTML')).toBeTruthy();
    expect(screen.getByText('CSS')).toBeTruthy();
  });
});
