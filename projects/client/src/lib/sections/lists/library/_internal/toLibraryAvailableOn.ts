import type { LibraryParams } from '$lib/requests/queries/sync/_internal/LibraryParams.ts';
import type { Library } from '../models/Library.ts';

export function toLibraryAvailableOn(
  library: Library,
): NonNullable<LibraryParams['availableOn']> {
  return library === 'plex' ? 'digital' : library;
}
