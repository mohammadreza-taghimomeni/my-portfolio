import { render, screen } from '@testing-library/react';
import Home from './page';
import { expect, test, vi } from 'vitest';

vi.mock('next/dynamic', () => ({
  default: () => () => <div data-testid="dynamic-component" />,
}));

vi.mock('@/components/home/Hero', () => ({
  default: () => <div data-testid="hero" />
}));

test('Home page renders', () => {
  render(<Home />);
  expect(screen.getByTestId('hero')).toBeDefined();
  expect(screen.getAllByTestId('dynamic-component').length).toBeGreaterThan(0);
});
