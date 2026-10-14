import * as m from '$lib/features/i18n/messages.ts';
import { NextStepId } from '$lib/features/next-steps/NextStepId.ts';
import { UrlBuilder } from '$lib/utils/url/UrlBuilder.ts';

type NextStepEntry = {
  label: string;
  href: string;
};

export function toNextStepEntry(id: NextStepId): NextStepEntry {
  switch (id) {
    case NextStepId.WatchHistory:
      return {
        label: m.text_next_step_watch_history(),
        href: UrlBuilder.settings.data(),
      };
    case NextStepId.Watchlist:
      return {
        label: m.text_next_step_watchlist(),
        href: UrlBuilder.discover(),
      };
    case NextStepId.Rate:
      return {
        label: m.text_next_step_rate(),
        href: UrlBuilder.history.home(),
      };
    case NextStepId.FavoriteGenres:
      return {
        label: m.text_next_step_favorite_genres(),
        href: UrlBuilder.settings.general(),
      };
    case NextStepId.FavoriteServices:
      return {
        label: m.text_next_step_favorite_services(),
        href: UrlBuilder.settings.streamingServices(),
      };
    case NextStepId.StreamingSync:
      return {
        label: m.text_next_step_streaming_sync(),
        href: UrlBuilder.settings.streamingServices(),
      };
    case NextStepId.Follow:
      return {
        label: m.text_next_step_follow(),
        href: UrlBuilder.social.activity(),
      };
    case NextStepId.CreateList:
      return {
        label: m.text_next_step_create_list(),
        href: UrlBuilder.lists.all('me', 'personal'),
      };
    case NextStepId.Comment:
      return {
        label: m.text_next_step_comment(),
        href: UrlBuilder.history.home(),
      };
  }
}
