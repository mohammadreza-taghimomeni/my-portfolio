import { render, screen } from '@testing-library/react';
import RootLayout from './layout';
import { expect, test, vi, beforeEach, afterEach } from 'vitest';

let consoleSpy: ReturnType<typeof vi.spyOn>;

beforeEach(() => {
  // Suppress React's "<html> cannot be a child of <div>" warning
  // which occurs because render() wraps RootLayout's <html> output in a container div.
  consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
});

afterEach(() => {
  consoleSpy?.mockRestore();
});

vi.mock('next/font/google', () => ({
  Geist: () => ({ variable: '--font-geist-sans' }),
  Geist_Mono: () => ({ variable: '--font-geist-mono' }),
}));

vi.mock('@/components/layout/theme-provider', () => ({
  ThemeProvider: ({ children }: any) => <div data-testid="theme-provider">{children}</div>
}));

vi.mock('@/components/layout/framer-motion-provider', () => ({
  FramerMotionProvider: ({ children }: any) => <div data-testid="framer-provider">{children}</div>
}));

vi.mock('@/components/layout/Header', () => ({
  default: () => <div data-testid="header" />
}));

vi.mock('@/components/layout/Footer', () => ({
  default: () => <div data-testid="footer" />
}));

test('RootLayout renders correctly', () => {
  render(
    <RootLayout>
      <div data-testid="children">Content</div>
    </RootLayout>
  );

  expect(screen.getByTestId('header')).toBeDefined();
  expect(screen.getByTestId('footer')).toBeDefined();
  expect(screen.getByTestId('children')).toBeDefined();
});
