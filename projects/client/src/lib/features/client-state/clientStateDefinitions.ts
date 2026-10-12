import { z } from 'zod';
import { defineClientRecord } from './defineClientRecord.ts';
import { ClientStateKey } from './models/ClientStateKey.ts';

export const clientStateDefinitions = {
  [ClientStateKey.DismissedBanners]: defineClientRecord({
    entry: z.string(),
    legacyStorageKey: 'trakt-dismissed-banners',
  }),
} satisfies Record<ClientStateKey, { kind: 'record' | 'value' }>;
