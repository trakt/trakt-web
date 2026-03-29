import { m } from '$lib/features/i18n/messages.ts';
import type { MediaType } from '$lib/requests/models/MediaType.ts';

function toTypeText(type: MediaType) {
  return type === 'movie' ? m.button_text_movies() : m.button_text_shows();
}

type ListMediaType = {
  type?: MediaType;
  text: string;
};

export function mapToMediaType(params: URLSearchParams): ListMediaType {
  const type = params.get('type');

  if (type !== 'movie' && type !== 'show') {
    return { text: m.button_text_media() };
  }

  return { type, text: toTypeText(type) };
}
