import { afterNavigate } from '$app/navigation';
import { describe, expect, it, type Mock, vi } from 'vitest';
import { useActiveLink } from './useActiveLink.ts';

vi.mock('$app/state', () => ({
  page: {
    url: {
      pathname: '/initial',
    },
  },
}));

describe('useActiveLink', () => {
  it('should initialize with correct active state', () => {
    const { isActive } = useActiveLink('/initial');
    let value;
    isActive.subscribe((v) => value = v)();
    expect(value).toBe(true);
  });

  it('should initialize as inactive for non-matching route', () => {
    const { isActive } = useActiveLink('/other');
    let value;
    isActive.subscribe((v) => value = v)();
    expect(value).toBe(false);
  });

  it('should update active state on navigation', () => {
    const { isActive } = useActiveLink('/new');
    const [[navigationCallback]] = (afterNavigate as Mock).mock.calls;

    navigationCallback({ to: { url: { pathname: '/new' } } });

    let value;
    isActive.subscribe((v) => value = v)();
    expect(value).toBe(true);
  });

  it('should handle null href', () => {
    const { isActive } = useActiveLink(null);
    let value;
    isActive.subscribe((v) => value = v)();
    expect(value).toBe(false);
  });
});
