import { z } from 'zod';

export type LiberatorEpisodeShow = {
  showTvdb: number;
  season?: number;
  episode?: number;
};

type ToLiberatorEpisodeShowsParams = {
  shows: ReadonlyArray<unknown>;
  episodeWatches: ReadonlyArray<unknown>;
};

const TvdbIdSchema = z.object({ tvdb: z.number().nullish() }).nullish();

const ShowSchema = z.object({
  id: TvdbIdSchema,
  seasons: z
    .array(
      z.object({
        number: z.number().nullish(),
        episodes: z
          .array(z.object({ id: TvdbIdSchema, number: z.number().nullish() }))
          .nullish(),
      }),
    )
    .nullish(),
});

const EpisodeWatchSchema = z.object({
  episode_id: z.number(),
  series_id: z.number(),
});

function fromShows(
  shows: ReadonlyArray<unknown>,
): ReadonlyArray<[number, LiberatorEpisodeShow]> {
  return shows.flatMap((entry) => {
    const parsed = ShowSchema.safeParse(entry);
    const showTvdb = parsed.data?.id?.tvdb;
    if (showTvdb == null) return [];

    return (parsed.data?.seasons ?? []).flatMap((season) =>
      (season.episodes ?? []).flatMap((episode) => {
        const episodeTvdb = episode.id?.tvdb;
        if (episodeTvdb == null) return [];

        const link: LiberatorEpisodeShow = {
          showTvdb,
          season: season.number ?? undefined,
          episode: episode.number ?? undefined,
        };
        return [[episodeTvdb, link] as [number, LiberatorEpisodeShow]];
      }),
    );
  });
}

function fromEpisodeWatches(
  episodeWatches: ReadonlyArray<unknown>,
): ReadonlyArray<[number, LiberatorEpisodeShow]> {
  return episodeWatches.flatMap((entry) => {
    const parsed = EpisodeWatchSchema.safeParse(entry);
    if (!parsed.success) return [];

    const link: LiberatorEpisodeShow = { showTvdb: parsed.data.series_id };
    return [[parsed.data.episode_id, link] as [number, LiberatorEpisodeShow]];
  });
}

// Older Liberator exports nest every episode under its show in shows.json;
// newer ones carry the show id as series_id on each episode watch. Entries
// from shows.json win because they also carry season and episode numbers.
export function toLiberatorEpisodeShows({
  shows,
  episodeWatches,
}: ToLiberatorEpisodeShowsParams): ReadonlyMap<number, LiberatorEpisodeShow> {
  return new Map([...fromEpisodeWatches(episodeWatches), ...fromShows(shows)]);
}
