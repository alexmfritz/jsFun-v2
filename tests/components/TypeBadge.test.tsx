import { describe, it, expect } from 'vitest';
import { screen } from '@testing-library/react';
import TypeBadge from '../../src/components/shared/TypeBadge';
import { renderWithProviders } from '../helpers/renderWithProviders';

describe('TypeBadge', () => {
  it('renders JS label for js type', () => {
    renderWithProviders(<TypeBadge type="js" />);
    expect(screen.getByText('JS')).toBeTruthy();
  });

  it('renders HTML label for html type', () => {
    renderWithProviders(<TypeBadge type="html" />);
    expect(screen.getByText('HTML')).toBeTruthy();
  });

  it('renders CSS label for css type', () => {
    renderWithProviders(<TypeBadge type="css" />);
    expect(screen.getByText('CSS')).toBeTruthy();
  });

  it('renders HTML+CSS label for html-css type', () => {
    renderWithProviders(<TypeBadge type="html-css" />);
    expect(screen.getByText('HTML+CSS')).toBeTruthy();
  });
});
