import { safeSessionStorage } from '$lib/utils/storage/safeStorage.ts';
import type { LivingPosterTiltOutcome } from '../models/LivingPosterTiltOutcome.ts';

const STORAGE_KEY = 'living-poster-tilt-outcome';

let outcome: LivingPosterTiltOutcome | null = null;

const parse = (raw: string | null): LivingPosterTiltOutcome | null =>
  raw === 'granted' || raw === 'denied' ? raw : null;

export const orientationPermissionSession = {
  read: () => outcome ?? parse(safeSessionStorage.getItem(STORAGE_KEY)),
  write: (next: LivingPosterTiltOutcome) => {
    outcome = next;
    safeSessionStorage.setItem(STORAGE_KEY, next);
  },
};
