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

    openReviewDrawer({ id: 42 });

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

  it('should drop the insights tab when the insights drawer closes', () => {
    window.history.replaceState(
      {},
      '',
      '/movies/heretic-2024?view=sentiment&tab=sentiment',
    );
    const searchParams = new URL(window.location.href).searchParams;
    const { close } = summaryDrawerNavigation(searchParams);

    close();

    const target = new URL(vi.mocked(goto).mock.calls.at(0)?.[0] ?? '');
    expect(target.searchParams.get('view')).toBeNull();
    expect(target.searchParams.get('tab')).toBeNull();
  });

  it('should open the comments drawer with the source replies shown', () => {
    window.history.replaceState({}, '', '/movies/heretic-2024');
    const { buildCommentsDrawerLink } = summaryDrawerNavigation();

    const { href } = buildCommentsDrawerLink({ id: 42, showReplies: true });

    const { showSourceReplies, sourceCommentId } = summaryDrawerNavigation(
      new URL(href).searchParams,
    );
    expect(sourceCommentId).toBe(42);
    expect(showSourceReplies).toBe(true);
  });

  it('should open the comments drawer with the source replies hidden', () => {
    window.history.replaceState({}, '', '/movies/heretic-2024');
    const { buildCommentsDrawerLink } = summaryDrawerNavigation();

    const { href } = buildCommentsDrawerLink({ id: 42 });

    const { showSourceReplies } = summaryDrawerNavigation(
      new URL(href).searchParams,
    );
    expect(showSourceReplies).toBe(false);
  });

  it('should keep the shown replies when a shared comments drawer url becomes a direct comment drawer', () => {
    window.history.replaceState(
      {},
      '',
      '/movies/heretic-2024?view=comments&comment_id=42&show_replies=true',
    );
    const searchParams = new URL(window.location.href).searchParams;
    const { openReviewDrawer, showSourceReplies } =
      summaryDrawerNavigation(searchParams);

    openReviewDrawer({ id: 42, showReplies: showSourceReplies });

    const target = new URL(vi.mocked(goto).mock.calls.at(0)?.[0] ?? '');
    expect(target.searchParams.get('view')).toBe('review');
    expect(target.searchParams.get('comment_id')).toBe('42');
    expect(target.searchParams.get('show_replies')).toBe('true');
  });

  it('should drop the shown replies when a direct comment closes in the episode drawer', () => {
    window.history.replaceState(
      {},
      '',
      '/shows/silo?view=episode&comment_id=42&show_replies=true&season=2&episode=3',
    );
    const searchParams = new URL(window.location.href).searchParams;
    const { closeCommentDrawer } = summaryDrawerNavigation(searchParams);

    closeCommentDrawer();

    const target = new URL(vi.mocked(goto).mock.calls.at(0)?.[0] ?? '');
    expect(target.searchParams.get('view')).toBe('episode');
    expect(target.searchParams.get('show_replies')).toBeNull();
  });

  it('should drop the shown replies when the comments drawer closes', () => {
    window.history.replaceState(
      {},
      '',
      '/movies/heretic-2024?view=comments&comment_id=42&show_replies=true',
    );
    const searchParams = new URL(window.location.href).searchParams;
    const { close } = summaryDrawerNavigation(searchParams);

    close();

    const target = new URL(vi.mocked(goto).mock.calls.at(0)?.[0] ?? '');
    expect(target.searchParams.get('comment_id')).toBeNull();
    expect(target.searchParams.get('show_replies')).toBeNull();
  });
});
