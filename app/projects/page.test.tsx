import { render, screen } from '@testing-library/react';
import ProjectsPage from './page';
import { expect, test, vi } from 'vitest';

vi.mock('next/dynamic', () => ({
  default: () => (props: any) => <div data-testid="projects-list">{JSON.stringify(props)}</div>,
}));

vi.mock('@/data/projects.json', () => ({
  default: [{ slug: 'p1', title: 'P1' }]
}));

test('ProjectsPage renders', () => {
  render(<ProjectsPage />);
  expect(screen.getByTestId('projects-list')).toBeDefined();
});
