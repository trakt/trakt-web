import type { SmartListTemplateResponse } from '@trakt/api';
import { SmartListItemsResponseMock } from './SmartListItemsResponseMock.ts';

export const SmartListTemplatesResponseMock: SmartListTemplateResponse[] = [
  {
    id: 'hidden-gems',
    source: 'discover',
    media_type: 'movies',
    filters: { ratings: [78], votes: [300, 3000] },
    personal: false,
    total: 315,
    items: SmartListItemsResponseMock,
  },
  {
    id: 'havent-seen-it',
    source: 'trending',
    media_type: 'movies',
    filters: { ignore_watched: true },
    personal: true,
    total: null,
    items: [],
  },
];
