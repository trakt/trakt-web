import { mergeOnboardingSet } from '$lib/features/onboarding/mergeOnboardingSet.ts';
import { OnboardingSetRecordSchema } from '$lib/features/onboarding/models/OnboardingSetRecord.ts';
import { defineClientRecord } from './defineClientRecord.ts';
import { ClientStateKey } from './models/ClientStateKey.ts';

export const clientStateDefinitions = {
  [ClientStateKey.Onboarding]: defineClientRecord({
    entry: OnboardingSetRecordSchema,
    mergeEntry: mergeOnboardingSet,
  }),
} satisfies Record<ClientStateKey, { kind: 'record' | 'value' }>;
