<script lang="ts">
  import { EpisodeIntlProvider } from "$lib/components/episode/EpisodeIntlProvider";
  import UpNextEpisode from "$lib/components/episode/up-next/UpNextEpisode.svelte";
  import type { EpisodeProgressEntry } from "$lib/models/EpisodeProgressEntry";
  import type { ShowMeta } from "$lib/models/ShowMeta";
  import { useMarkAsWatched } from "$lib/stores/useMarkAsWatched";

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

<UpNextEpisode
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
  onMarkAsWatched={async () => {
    await markAsWatched();
    onMarkAsWatched();
  }}
/>
