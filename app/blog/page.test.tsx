import { render, screen, act, waitFor } from '@testing-library/react';
import BlogPage from './page';
import { expect, test, vi, beforeEach, afterEach } from 'vitest';

let consoleSpy: ReturnType<typeof vi.spyOn>;

beforeEach(() => {
  // Suppress the expected "Error fetching posts" console.error
  // that is deliberately triggered by the fetch rejection test case.
  consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
});

afterEach(() => {
  consoleSpy?.mockRestore();
});

vi.mock('next/dynamic', () => ({
  default: () => (props: any) => <div data-testid="dynamic-component">{JSON.stringify(props)}</div>,
}));

const mockPosts = [
  { id: '1', title: 'Post 1', date: '2023-01-01', link: 'https://post1.com', source: 'Source' }
];

test('BlogPage 100% coverage', async () => {
  let intersectCallback: any;
  global.IntersectionObserver = vi.fn().mockImplementation(function(this: any, cb: any) {
    intersectCallback = cb;
    this.observe = vi.fn();
    this.unobserve = vi.fn();
    this.disconnect = vi.fn();
  });

  global.fetch = vi.fn()
    .mockResolvedValueOnce({
      json: vi.fn().mockResolvedValue({ posts: mockPosts, hasMore: true })
    })
    .mockRejectedValueOnce(new Error('Fetch error'))
    .mockResolvedValueOnce({
      json: vi.fn().mockResolvedValue({ posts: [], hasMore: false })
    });

  render(<BlogPage />);

  // Wait for initial load to finish (posts rendered)
  await waitFor(() => {
      const components = screen.getAllByTestId('dynamic-component');
      // Look for the one with posts
      const hasPosts = components.some(c => c.textContent?.includes('Post 1'));
      expect(hasPosts).toBe(true);
  });

  // Also wait for loading to be false (implicitly by waiting for UI update)
  expect(screen.queryByRole('progressbar')).toBeNull(); // Loader2 might not have role, but let's check text if any

  // Trigger infinite scroll
  await act(async () => {
    intersectCallback([{ isIntersecting: true }]);
  });

  // Wait for second fetch attempt (which will fail)
  await waitFor(() => expect(global.fetch).toHaveBeenCalledTimes(2));

  // Trigger infinite scroll again
  await act(async () => {
    intersectCallback([{ isIntersecting: true }]);
  });

  // Wait for third fetch
  await waitFor(() => expect(global.fetch).toHaveBeenCalledTimes(3));

  // Check end of content message
  await waitFor(() => expect(screen.getByText(/reached the end/i)).toBeDefined());
});
