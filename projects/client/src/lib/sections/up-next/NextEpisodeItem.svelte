<script lang="ts">
  import { EpisodeIntlProvider } from "$lib/components/episode/EpisodeIntlProvider";
  import type { EpisodeProgressEntry } from "$lib/models/EpisodeProgressEntry";
  import type { ShowMeta } from "$lib/models/ShowMeta";
  import { useMarkAsWatched } from "$lib/stores/useMarkAsWatched";
  import { buildMediaLink } from "$lib/utils/url/buildMediaLink";
  import NextEpisode from "../../components/episode/next/NextEpisode.svelte";

  type UpNextItemProps = {
    episode: EpisodeProgressEntry;
    show: ShowMeta;
    onMarkAsWatched: () => void;
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
  posterUrl={episode.poster.url}
  showTitle={show.title}
  episodeTitle={episode.title}
  completed={episode.completed}
  total={episode.total}
  remaining={episode.remaining}
  runtime={episode.runtime}
  type={episode.type}
  isLoading={$isMarkingAsWatched}
  showHref={buildMediaLink("show", show.slug)}
  onMarkAsWatched={async () => {
    await markAsWatched();
    onMarkAsWatched();
  }}
/>
