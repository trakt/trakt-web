import { goto } from '$app/navigation';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { summaryDrawerNavigation } from './summaryDrawerNavigation.ts';

describe('summaryDrawerNavigation', () => {
  beforeEach(() => {
    window.history.replaceState(
      {},
      '',
      '/shows/silo?view=episode&comment_id=42&season=2&episode=3',
    );
  });

  it('should close a direct comment without closing its episode drawer', () => {
    const searchParams = new URL(window.location.href).searchParams;
    const { closeCommentDrawer } = summaryDrawerNavigation(searchParams);

    closeCommentDrawer();

    const target = new URL(vi.mocked(goto).mock.calls.at(0)?.[0] ?? '');
    expect(target.pathname).toBe('/shows/silo');
    expect(target.searchParams.get('view')).toBe('episode');
    expect(target.searchParams.get('comment_id')).toBeNull();
    expect(target.searchParams.get('season')).toBe('2');
    expect(target.searchParams.get('episode')).toBe('3');
  });

  it('should replace a shared comments drawer url with a direct comment drawer', () => {
    window.history.replaceState(
      {},
      '',
      '/movies/heretic-2024?view=comments&comment_id=42',
    );
    const searchParams = new URL(window.location.href).searchParams;
    const { openReviewDrawer } = summaryDrawerNavigation(searchParams);

    openReviewDrawer(42);

    const target = new URL(vi.mocked(goto).mock.calls.at(0)?.[0] ?? '');
    expect(target.pathname).toBe('/movies/heretic-2024');
    expect(target.searchParams.get('view')).toBe('review');
    expect(target.searchParams.get('comment_id')).toBe('42');
    expect(vi.mocked(goto).mock.calls.at(0)?.[1]).toEqual({
      noScroll: true,
      replaceState: true,
    });
  });

  it('should close a standalone direct comment drawer', () => {
    window.history.replaceState(
      {},
      '',
      '/shows/silo?view=review&comment_id=42&season=2',
    );
    const searchParams = new URL(window.location.href).searchParams;
    const { closeCommentDrawer } = summaryDrawerNavigation(searchParams);

    closeCommentDrawer();

    const target = new URL(vi.mocked(goto).mock.calls.at(0)?.[0] ?? '');
    expect(target.searchParams.get('view')).toBeNull();
    expect(target.searchParams.get('comment_id')).toBeNull();
    expect(target.searchParams.get('season')).toBe('2');
  });
});
