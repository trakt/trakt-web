import { fromLegacyNudgeDismissals } from '$lib/sections/smart-list-nudges/_internal/fromLegacyNudgeDismissals.ts';
import { mergeNudgeDismissal } from '$lib/sections/smart-list-nudges/_internal/mergeNudgeDismissal.ts';
import { NudgeDismissalRecordSchema } from '$lib/sections/smart-list-nudges/_internal/NudgeDismissalRecord.ts';
import { z } from 'zod';
import { defineClientRecord } from './defineClientRecord.ts';
import { ClientStateKey } from './models/ClientStateKey.ts';

export const clientStateDefinitions = {
  [ClientStateKey.DismissedBanners]: defineClientRecord({
    entry: z.string(),
    legacyStorageKey: 'trakt-dismissed-banners',
  }),
  [ClientStateKey.DismissedSmartListNudges]: defineClientRecord({
    entry: NudgeDismissalRecordSchema,
    mergeEntry: mergeNudgeDismissal,
    legacyStorageKey: 'trakt-dismissed-smart-list-nudges',
    fromLegacy: fromLegacyNudgeDismissals,
  }),
  [ClientStateKey.DismissedPinnedLists]: defineClientRecord({
    entry: z.literal(true),
    legacyStorageKey: 'trakt-dismissed-pinned-lists',
  }),
} satisfies Record<ClientStateKey, { kind: 'record' | 'value' }>;
