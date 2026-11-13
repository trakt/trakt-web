import * as m from '$lib/features/i18n/messages.ts';
import { UrlBuilder } from '$lib/utils/url/UrlBuilder.ts';
import { MAX_MIXTAPE_PICKS } from './MAX_MIXTAPE_PICKS.ts';
import type { parseMixtapeParams } from './parseMixtapeParams.ts';
import { type MixState, toMixState } from './toMixState.ts';

type MixActionParams = {
  params: ReturnType<typeof parseMixtapeParams>;
  isMixing: boolean;
};

export type MixAction = {
  state: MixState;
  href: string | undefined;
  label: string;
  count: number;
  max: number;
};

/*
  The one description of the Mix it call to action, shared by the navbar
  entry and the phone dock so both always agree on where it leads.
*/
export function toMixAction({ params, isMixing }: MixActionParams): MixAction {
  const count = params.picks.length;
  const state = toMixState({
    count,
    max: MAX_MIXTAPE_PICKS,
    view: params.view,
    isMixing,
  });
  const base = {
    type: params.type,
    picks: params.picks,
    source: params.source ?? undefined,
  };

  const href =
    state === 'picking' || state === 'ready'
      ? UrlBuilder.mixtape({ ...base, view: 'results' })
      : state === 'done'
        ? UrlBuilder.mixtape(base)
        : undefined;

  const label =
    state === 'mixing'
      ? m.button_text_mixtape_mixing()
      : state === 'done'
        ? m.button_text_mixtape_remix()
        : m.button_text_mix_it();

  return { state, href, label, count, max: MAX_MIXTAPE_PICKS };
}
