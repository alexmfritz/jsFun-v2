import { describe, it, expect } from 'vitest';
import { screen } from '@testing-library/react';
import TopicCards from '../../src/components/browse/TopicCards';
import { renderWithProviders, makeExercise } from '../helpers/renderWithProviders';

describe('TopicCards', () => {
  const categories = {
    'js-fundamentals': {
      label: 'JS Fundamentals',
      color: '#facc15',
    },
    'html-css': {
      label: 'HTML & CSS',
      color: '#22d3ee',
    },
  };

  const exercises = [
    makeExercise({ id: 1, category: ['js-fundamentals'] }),
    makeExercise({ id: 2, category: ['js-fundamentals'] }),
    makeExercise({ id: 3, category: ['html-css'] }),
  ];

  it('renders "Topics" heading', () => {
    renderWithProviders(<TopicCards />, {
      preloadedState: { exercises: { exercises, categories } },
    });
    expect(screen.getByText('Topics')).toBeTruthy();
  });

  it('renders a button for each category', () => {
    renderWithProviders(<TopicCards />, {
      preloadedState: { exercises: { exercises, categories } },
    });
    expect(screen.getByText('JS Fundamentals')).toBeTruthy();
    expect(screen.getByText('HTML & CSS')).toBeTruthy();
  });

  it('shows completion count per category', () => {
    renderWithProviders(<TopicCards />, {
      preloadedState: {
        exercises: { exercises, categories },
        progress: { completedExercises: { '1': true } },
      },
    });
    expect(screen.getByText('1/2')).toBeTruthy(); // JS Fundamentals: 1 of 2
    expect(screen.getByText('0/1')).toBeTruthy(); // HTML & CSS: 0 of 1
  });
});
