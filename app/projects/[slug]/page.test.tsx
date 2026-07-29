import { render, screen } from '@testing-library/react';
import ProjectPage, { generateStaticParams } from './page';
import { expect, test, vi } from 'vitest';
import { notFound } from 'next/navigation';

vi.mock('next/navigation', () => ({
  notFound: vi.fn().mockImplementation(() => {
      throw new Error('NEXT_NOT_FOUND');
  }),
}));

vi.mock('next/dynamic', () => ({
  default: () => (props: any) => <div data-testid="dynamic-component">{JSON.stringify(props)}</div>,
}));

vi.mock('@/data/projects.json', () => ({
  default: [
    { slug: 'p1', title: 'P1', achievements: [{ metric: '1' }], architecture: [{ label: 'A' }], gallery: [{ src: 'G' }] },
    { slug: 'p2', title: 'P2' }
  ]
}));

test('ProjectPage renders correctly for existing project', async () => {
  const params = Promise.resolve({ slug: 'p1' });
  const result = await ProjectPage({ params });
  render(result);

  expect(screen.getAllByTestId('dynamic-component').length).toBeGreaterThan(0);
});

test('ProjectPage calls notFound for non-existing project', async () => {
  const params = Promise.resolve({ slug: 'non-existing' });
  await expect(ProjectPage({ params })).rejects.toThrow('NEXT_NOT_FOUND');
  expect(notFound).toHaveBeenCalled();
});

test('generateStaticParams returns all slugs', async () => {
  const params = await generateStaticParams();
  expect(params).toEqual([{ slug: 'p1' }, { slug: 'p2' }]);
});
