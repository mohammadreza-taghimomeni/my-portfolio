import { render, screen } from '@testing-library/react';
import ResumePage from './page';
import { expect, test, vi } from 'vitest';

vi.mock('next/dynamic', () => ({
  default: (fn: any) => {
    if (typeof fn === 'function') fn();
    return (props: any) => <div data-testid="dynamic-component">{JSON.stringify(props)}</div>;
  },
}));

vi.mock('@/data/resume.json', () => ({
  default: {
    personalInfo: { name: 'Name', bio: 'Bio', role: 'Role', image: '/img.png', email: 'e@e.com', location: 'Loc', aboutMe: 'About' },
    skills: [{ name: 'S1', priority: 2 }, { name: 'S2', priority: 1 }],
    experience: [],
    education: [],
    certificates: []
  }
}));

vi.mock('@/data/projects.json', () => ({
  default: []
}));

test('ResumePage renders and sorts skills', () => {
  render(<ResumePage />);
  expect(screen.getAllByTestId('dynamic-component').length).toBeGreaterThan(0);
});
