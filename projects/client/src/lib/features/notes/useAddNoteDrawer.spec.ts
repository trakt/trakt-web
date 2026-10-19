import { AnalyticsEvent } from '$lib/features/analytics/events/AnalyticsEvent.ts';
import { useTrack } from '$lib/features/analytics/useTrack.ts';
import { of } from 'rxjs';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { addNoteDrawerStore } from './_internal/addNoteDrawerStore.ts';
import type { NoteDrawerProps } from './models/NoteDrawerProps.ts';
import { useAddNoteDrawer } from './useAddNoteDrawer.ts';

const PROPS: NoteDrawerProps = {
  type: 'drop',
  title: 'Heretic',
  id: 1,
  mediaType: 'movie',
};

const state = vi.hoisted(() => ({ isVip: false, current: 5 }));
const track = vi.hoisted(() => vi.fn());

vi.mock('$lib/features/analytics/useTrack.ts', () => ({
  useTrack: vi.fn(() => ({ track })),
}));

vi.mock('$lib/features/auth/stores/useUser.ts', () => ({
  useUser: () => ({
    user: of({ isVip: state.isVip }),
    limits: of({ totalNotes: { current: state.current, free: 5, vip: 100 } }),
    notes: of({ movies: new Map(), shows: new Map() }),
  }),
}));

describe('feature: useAddNoteDrawer', () => {
  beforeEach(() => {
    state.isVip = false;
    state.current = 5;
    track.mockClear();
    addNoteDrawerStore.close();
  });

  it('should record a vip gate when a free user hits the notes limit', async () => {
    await useAddNoteDrawer().open(PROPS);

    expect(useTrack).toHaveBeenCalledWith(AnalyticsEvent.VipGate);
    expect(track).toHaveBeenCalledExactlyOnceWith({ feature: 'notes' });
  });

  it('should not record a vip gate for a vip at their own limit', async () => {
    state.isVip = true;
    state.current = 100;

    await useAddNoteDrawer().open(PROPS);

    expect(track).not.toHaveBeenCalled();
  });

  it('should not record a vip gate below the limit', async () => {
    state.current = 1;

    await useAddNoteDrawer().open(PROPS);

    expect(track).not.toHaveBeenCalled();
  });
});
