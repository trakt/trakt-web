import { AnalyticsEvent } from '$lib/features/analytics/events/AnalyticsEvent.ts';
import { SPOILER_CLASS_NAME } from '$lib/features/spoilers/constants.ts';
import { renderComponent } from '$test/beds/component/renderComponent.ts';
import { screen } from '@testing-library/svelte';
import userEvent from '@testing-library/user-event';
import { createRawSnippet } from 'svelte';
import { of } from 'rxjs';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import SpoilerBlur from './SpoilerBlur.svelte';

const { track, useTrack } = vi.hoisted(() => {
  const track = vi.fn();
  return { track, useTrack: vi.fn(() => ({ track })) };
});

vi.mock('$lib/features/analytics/useTrack.ts', () => ({ useTrack }));

function renderBlur(isHidden: boolean, focusable?: boolean) {
  return renderComponent(SpoilerBlur, {
    props: {
      isSpoilerHidden: of(isHidden),
      focusable,
      children: createRawSnippet(() => ({
        render: () => '<span data-testid="count">12 episodes</span>',
      })),
    },
  });
}

const findBlur = async () => (await screen.findByTestId('count')).parentElement;

describe('SpoilerBlur', () => {
  beforeEach(() => track.mockClear());

  it('should blur the content when spoilers are hidden', async () => {
    renderBlur(true);

    expect((await findBlur())?.classList).toContain(SPOILER_CLASS_NAME);
  });

  it('should not blur the content when spoilers are shown', async () => {
    renderBlur(false);

    expect((await findBlur())?.classList).not.toContain(SPOILER_CLASS_NAME);
  });

  it('should reveal the content and track it on click', async () => {
    renderBlur(true);

    await userEvent.click(await screen.findByTestId('count'));

    expect((await findBlur())?.classList).not.toContain(SPOILER_CLASS_NAME);
    expect(track).toHaveBeenCalledWith({ type: 'show' });
    expect(useTrack).toHaveBeenCalledWith(AnalyticsEvent.SpoilerReveal);
  });

  it('should reveal the content from the keyboard', async () => {
    renderBlur(true);

    const control = await screen.findByRole('button');
    control.focus();
    await userEvent.keyboard('{Enter}');

    expect((await findBlur())?.classList).not.toContain(SPOILER_CLASS_NAME);
    expect(screen.queryByRole('button')).toBeNull();
    expect(track).toHaveBeenCalledWith({ type: 'show' });
  });

  it('should reveal on click without being focusable when focusable is false', async () => {
    renderBlur(true, false);

    expect(screen.queryByRole('button')).toBeNull();

    await userEvent.click(await screen.findByTestId('count'));

    expect((await findBlur())?.classList).not.toContain(SPOILER_CLASS_NAME);
    expect(track).toHaveBeenCalledWith({ type: 'show' });
  });
});
