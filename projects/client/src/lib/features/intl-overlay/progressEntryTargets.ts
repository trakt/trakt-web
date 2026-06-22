import { makeTargets } from './makeTargets.ts';

type ProgressEntryBase = {
  show: { id: number; title: string };
};

/**
 * Targets for progress entries (watched / dropped shows).
 * Every entry carries a nested `show`; we patch the show title in place.
 */
export const progressEntryTargets = <T extends ProgressEntryBase>(entry: T) =>
  makeTargets<T>({
    get: (e) => ({ id: e.show.id, type: 'show' }),
    patch: (e, title) => ({ ...e, show: { ...e.show, title } } as T),
  })(entry);
