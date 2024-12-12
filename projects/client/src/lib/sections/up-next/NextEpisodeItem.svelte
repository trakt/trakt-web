<script lang="ts">
  import { EpisodeIntlProvider } from "$lib/components/episode/EpisodeIntlProvider";
  import type { EpisodeProgressEntry } from "$lib/models/EpisodeProgressEntry";
  import type { ShowMeta } from "$lib/models/ShowMeta";
  import { useMarkAsWatched } from "$lib/stores/useMarkAsWatched";
  import { UrlBuilder } from "$lib/utils/url/UrlBuilder";
  import NextEpisode from "../../components/episode/next/NextEpisode.svelte";

  type UpNextItemProps = {
    episode: EpisodeProgressEntry;
    show: ShowMeta;
    onMarkAsWatched?: () => void;
  };

  const { episode, show, onMarkAsWatched }: UpNextItemProps = $props();

  const { isMarkingAsWatched, markAsWatched } = $derived(
    useMarkAsWatched({
      id: episode.id,
      type: "episode",
    }),
  );
</script>

<NextEpisode
  i18n={EpisodeIntlProvider}
  episodeNumber={episode.number}
  seasonNumber={episode.season}
  posterUrl={episode.poster.url ?? show.cover.url}
  showTitle={show.title}
  episodeTitle={episode.title}
  completed={episode.completed}
  total={episode.total}
  remaining={episode.remaining}
  minutesLeft={episode.minutesLeft}
  type={episode.type}
  isLoading={$isMarkingAsWatched}
  showHref={UrlBuilder.show(show.slug)}
  onMarkAsWatched={async () => {
    await markAsWatched();
    onMarkAsWatched?.();
  }}
/>
