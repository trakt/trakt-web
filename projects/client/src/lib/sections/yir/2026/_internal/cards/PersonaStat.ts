import type { YirHighlightKind } from '$lib/requests/models/YirPersonaResult.ts';

export type PersonaStat = {
  key: YirHighlightKind;
  value: string;
  label: string;
};
