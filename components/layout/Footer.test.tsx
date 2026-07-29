import { render, screen } from '@testing-library/react';
import Footer from './Footer';
import { expect, test, vi } from 'vitest';

vi.mock('@/data/resume.json', () => ({
  default: {
    personalInfo: {
      name: 'John Doe',
      github: 'https://github.com/johndoe',
      linkedin: 'https://linkedin.com/in/johndoe',
      email: 'john@example.com'
    }
  }
}));

test('Footer renders copyright and social links', () => {
  render(<Footer />);

  expect(screen.getByText(/John Doe/)).toBeDefined();
  expect(screen.getByText('GitHub')).toHaveAttribute('href', 'https://github.com/johndoe');
  expect(screen.getByText('LinkedIn')).toHaveAttribute('href', 'https://linkedin.com/in/johndoe');
  expect(screen.getByText('Email')).toHaveAttribute('href', 'mailto:john@example.com');
});
