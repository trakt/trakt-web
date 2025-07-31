import * as m from '$lib/features/i18n/messages.ts';

export function episodeNumberLabel({ seasonNumber, episodeNumber }: {
  seasonNumber: number;
  episodeNumber: number;
}): string {
  return m.episode_footer_season_episode({
    seasonNumber,
    episodeNumber,
  });
}
