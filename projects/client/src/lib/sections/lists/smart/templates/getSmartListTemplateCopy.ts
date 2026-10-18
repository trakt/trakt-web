import * as m from '$lib/features/i18n/messages.ts';
import type { SmartListFilters } from '$lib/requests/models/SmartListFilters.ts';
import type { SmartListTemplateId } from './SmartListTemplateId.ts';

type SmartListTemplateCopy = {
  name: () => string;
  pitch: () => string;
  showcase: keyof SmartListFilters;
};

const COPY: Record<SmartListTemplateId, SmartListTemplateCopy> = {
  'hidden-gems': {
    name: m.smart_list_template_hidden_gems_name,
    pitch: m.smart_list_template_hidden_gems_pitch,
    showcase: 'votes',
  },
  'critics-darlings': {
    name: m.smart_list_template_critics_darlings_name,
    pitch: m.smart_list_template_critics_darlings_pitch,
    showcase: 'metascores',
  },
  'finished-stories': {
    name: m.smart_list_template_finished_stories_name,
    pitch: m.smart_list_template_finished_stories_pitch,
    showcase: 'statuses',
  },
  'short-and-sweet': {
    name: m.smart_list_template_short_and_sweet_name,
    pitch: m.smart_list_template_short_and_sweet_pitch,
    showcase: 'runtimes',
  },
  'time-twisters': {
    name: m.smart_list_template_time_twisters_name,
    pitch: m.smart_list_template_time_twisters_pitch,
    showcase: 'keywords',
  },
  'a24-after-dark': {
    name: m.smart_list_template_a24_after_dark_name,
    pitch: m.smart_list_template_a24_after_dark_pitch,
    showcase: 'studios',
  },
  'a24-essentials': {
    name: m.smart_list_template_a24_essentials_name,
    pitch: m.smart_list_template_a24_essentials_pitch,
    showcase: 'studios',
  },
  'the-auteurs': {
    name: m.smart_list_template_the_auteurs_name,
    pitch: m.smart_list_template_the_auteurs_pitch,
    showcase: 'people',
  },
  'hbo-prestige': {
    name: m.smart_list_template_hbo_prestige_name,
    pitch: m.smart_list_template_hbo_prestige_pitch,
    showcase: 'networks',
  },
  'kdrama-fever': {
    name: m.smart_list_template_kdrama_fever_name,
    pitch: m.smart_list_template_kdrama_fever_pitch,
    showcase: 'countries',
  },
  'beyond-the-stars': {
    name: m.smart_list_template_beyond_the_stars_name,
    pitch: m.smart_list_template_beyond_the_stars_pitch,
    showcase: 'genres',
  },
  whodunits: {
    name: m.smart_list_template_whodunits_name,
    pitch: m.smart_list_template_whodunits_pitch,
    showcase: 'genres',
  },
  'just-landed-services': {
    name: m.smart_list_template_just_landed_services_name,
    pitch: m.smart_list_template_just_landed_services_pitch,
    showcase: 'released_within_days',
  },
  'havent-seen-it': {
    name: m.smart_list_template_havent_seen_it_name,
    pitch: m.smart_list_template_havent_seen_it_pitch,
    showcase: 'ignore_watched',
  },
  'little-ones': {
    name: m.smart_list_template_little_ones_name,
    pitch: m.smart_list_template_little_ones_pitch,
    showcase: 'parental_frightening',
  },
  'next-obsession': {
    name: m.smart_list_template_next_obsession_name,
    pitch: m.smart_list_template_next_obsession_pitch,
    showcase: 'ignore_watchlisted',
  },
};

export function getSmartListTemplateCopy(
  id: string,
): SmartListTemplateCopy | undefined {
  return Object.hasOwn(COPY, id) ? COPY[id as SmartListTemplateId] : undefined;
}
