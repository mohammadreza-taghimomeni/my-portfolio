import { render, screen } from '@testing-library/react';
import Stats from './Stats';
import { expect, test, vi, beforeEach } from 'vitest';

vi.mock('@/data/home.json', () => ({
  default: {
    stats: [
      { label: "Years Experience", value: "8+" },
      { label: "Projects Delivered", value: "40+" }
    ]
  }
}));

// Shared mock so we can toggle useInView per test.
// vi.hoisted() ensures the variable is initialized before vi.mock factories run.
const mockUseInView = vi.hoisted(() => vi.fn());

vi.mock('framer-motion', async () => {
  const actual = await vi.importActual('framer-motion');
  return {
    ...actual,
    useInView: mockUseInView,
  };
});

beforeEach(() => {
  mockUseInView.mockReset();

  // Default: reduced motion NOT preferred
  Object.defineProperty(window, 'matchMedia', {
    writable: true,
    value: vi.fn().mockImplementation((query: string) => ({
      matches: false,
      media: query,
      onchange: null,
      addListener: vi.fn(),
      removeListener: vi.fn(),
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
      dispatchEvent: vi.fn(),
    })),
  });
});

test('Stats renders final values immediately when not in view (SSR behavior)', () => {
  mockUseInView.mockReturnValue(false);

  render(<Stats />);

  expect(screen.getByText('Years Experience')).toBeDefined();
  expect(screen.getByText('Projects Delivered')).toBeDefined();

  // SSR-friendly: final values are rendered immediately, never 0
  expect(screen.getByText('8+')).toBeDefined();
  expect(screen.getByText('40+')).toBeDefined();
  expect(screen.queryByText('0+')).toBeNull();
});

test('Stats schedules count-up animation when entering viewport', () => {
  mockUseInView.mockReturnValue(true);

  let rafCalled = false;
  vi.spyOn(window, 'requestAnimationFrame').mockImplementation((_cb) => {
    rafCalled = true;
    return 1;
  });

  render(<Stats />);

  // The animation effect should have scheduled a RAF callback
  expect(rafCalled).toBe(true);

  // Still never shows zero (initial SSR value persists until RAF fires)
  expect(screen.queryByText('0+')).toBeNull();
});

test('Stats respects reduced-motion preference and shows final values', () => {
  mockUseInView.mockReturnValue(true);

  // Override matchMedia to signal reduced motion
  Object.defineProperty(window, 'matchMedia', {
    writable: true,
    value: vi.fn().mockImplementation((query: string) => ({
      matches: true, // reduced motion preferred
      media: query,
      onchange: null,
      addListener: vi.fn(),
      removeListener: vi.fn(),
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
      dispatchEvent: vi.fn(),
    })),
  });

  render(<Stats />);

  // Final values are displayed without animation (effect skips due to
  // reduced motion, so displayValue stays at finalValue)
  expect(screen.getByText('8+')).toBeDefined();
  expect(screen.getByText('40+')).toBeDefined();
  expect(screen.queryByText('0+')).toBeNull();
});
