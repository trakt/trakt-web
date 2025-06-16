import type { MediaType } from '$lib/requests/models/MediaType.ts';

export function typeToListMethod(type?: MediaType) {
  if (!type) {
    return 'all' as const;
  }

  switch (type) {
    case 'movie':
      return 'movie' as const;
    case 'show':
      return 'show' as const;
  }
}
