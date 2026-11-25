import CheckIcon from '$lib/components/icons/CheckIcon.svelte';
import EyeIcon from '$lib/components/icons/EyeIcon.svelte';
import FollowingIcon from '$lib/components/icons/FollowingIcon.svelte';
import { m } from '$lib/features/i18n/messages.ts';
import { UrlBuilder } from '$lib/utils/url/UrlBuilder.ts';
import { defineOnboardingSet } from '$lib/features/onboarding/defineOnboardingSet.ts';
import RateStepIcon from '$lib/features/onboarding/_internal/icons/RateStepIcon.svelte';
import WatchlistStepIcon from '$lib/features/onboarding/_internal/icons/WatchlistStepIcon.svelte';
import { accountYoungerThan } from '$lib/features/onboarding/_internal/rules/accountYoungerThan.ts';
import { importedAny } from '$lib/features/onboarding/_internal/rules/importedAny.ts';

const IMPORTED_ITEMS = 20;
const NEW_ACCOUNT_DAYS = 30;

export const firstSteps = defineOnboardingSet({
  id: 'first-steps',
  title: () => m.onboarding_set_first_steps_title(),
  subtitle: () => m.onboarding_set_first_steps_subtitle(),
  eligibleWhen: accountYoungerThan({ days: NEW_ACCOUNT_DAYS }),
  retireWhen: importedAny({
    threshold: IMPORTED_ITEMS,
    steps: ['watchlist', 'watched', 'rate'],
  }),
  steps: [
    {
      id: 'account',
      title: () => m.onboarding_step_account_title(),
      hint: () => m.onboarding_step_account_hint(),
      icon: CheckIcon,
      objective: null,
      action: null,
      completesWith: 'always',
      skippable: false,
    },
    {
      id: 'watchlist',
      title: () => m.onboarding_step_watchlist_title(),
      hint: () => m.onboarding_step_watchlist_hint(),
      icon: WatchlistStepIcon,
      objective: () => m.onboarding_step_watchlist_objective(),
      action: {
        text: () => m.onboarding_step_watchlist_cta(),
        href: () => UrlBuilder.trending(),
      },
      completesWith: { signal: 'watchlist', mutations: ['watchlist:add'] },
      skippable: true,
    },
    {
      id: 'watched',
      title: () => m.onboarding_step_watched_title(),
      hint: () => m.onboarding_step_watched_hint(),
      icon: EyeIcon,
      objective: () => m.onboarding_step_watched_objective(),
      action: {
        text: () => m.onboarding_step_watched_cta(),
        href: () => UrlBuilder.trending(),
      },
      completesWith: {
        signal: 'plays',
        mutations: ['history:add', 'media:check-in'],
      },
      skippable: true,
    },
    {
      id: 'rate',
      title: () => m.onboarding_step_rate_title(),
      hint: () => m.onboarding_step_rate_hint(),
      icon: RateStepIcon,
      objective: () => m.onboarding_step_rate_objective(),
      action: {
        text: () => m.onboarding_step_rate_cta(),
        href: () => UrlBuilder.history.home(),
      },
      completesWith: { signal: 'ratings', mutations: ['rating:add'] },
      skippable: true,
    },
    {
      id: 'follow',
      title: () => m.onboarding_step_follow_title(),
      hint: () => m.onboarding_step_follow_hint(),
      icon: FollowingIcon,
      objective: () => m.onboarding_step_follow_objective(),
      action: {
        text: () => m.onboarding_step_follow_cta(),
        href: () => `${UrlBuilder.about()}#meet-the-team`,
      },
      completesWith: { signal: 'following', mutations: ['user:follow'] },
      skippable: true,
    },
  ],
});
