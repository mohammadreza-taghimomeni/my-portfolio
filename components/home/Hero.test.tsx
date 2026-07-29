import { render, screen } from '@testing-library/react';
import Hero from './Hero';
import { expect, test, vi } from 'vitest';

// Mock the data
vi.mock('@/data/home.json', () => ({
  default: {
    hero: {
      badge: "Open to Relocate",
      headline: "Engineering <span>Scalable</span> Frontend",
      subheadline: "Senior Frontend Engineer",
      cta: "Explore My Work",
      image: "/images/home-banner.png"
    }
  }
}));

vi.mock('@/data/resume.json', () => ({
  default: {
    personalInfo: {
      linkedin: "https://linkedin.com",
      github: "https://github.com",
    }
  }
}));

test('Hero renders correctly', () => {
  render(<Hero />);
  expect(screen.getByText(/Open to Relocate/i)).toBeDefined();
  expect(screen.getByText(/Explore My Work/i)).toBeDefined();
});
