import { safeLocalStorage } from '$lib/utils/storage/safeStorage.ts';
import z from 'zod';

const EASTER_EGG_KEY = 'trakt-easter-eggs';

const EasterEggProgressSchema = z
  .object({
    rated_higher_streak: z.number().int().nonnegative().optional(),
  })
  .passthrough();

type EasterEggProgress = z.infer<typeof EasterEggProgressSchema>;

function parseProgress(raw: string | null): EasterEggProgress {
  try {
    const result = EasterEggProgressSchema.safeParse(JSON.parse(raw ?? '{}'));
    return result.success ? result.data : {};
  } catch {
    return {};
  }
}

export const easterEggStorage = {
  read: (): EasterEggProgress =>
    parseProgress(safeLocalStorage.getItem(EASTER_EGG_KEY)),
  write: (progress: Partial<EasterEggProgress>) =>
    safeLocalStorage.setItem(
      EASTER_EGG_KEY,
      JSON.stringify({ ...easterEggStorage.read(), ...progress }),
    ),
};
