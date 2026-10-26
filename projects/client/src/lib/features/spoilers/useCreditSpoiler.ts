import type { ExtendedMediaStoreProps } from '$lib/models/MediaStoreProps.ts';
import { useMediaSpoiler } from './useMediaSpoiler.ts';
import { useSpoiler } from './_internal/useSpoiler.ts';

export function useCreditSpoiler(source?: ExtendedMediaStoreProps) {
  return source ? useMediaSpoiler(source) : useSpoiler();
}
