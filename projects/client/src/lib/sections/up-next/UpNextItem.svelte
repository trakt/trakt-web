<script lang="ts">
  import { EpisodeIntlProvider } from "$lib/components/episode/EpisodeIntlProvider";
  import UpNextEpisode from "$lib/components/episode/up-next/UpNextEpisode.svelte";
  import type { UpNextEntry } from "$lib/requests/queries/sync/upNextQuery";
  import { useMarkAsWatched } from "$lib/stores/useMarkAsWatched";

  type UpNextItemProps = {
    episode: UpNextEntry;
    onMarkAsWatched: () => void;
  };

  const { episode, onMarkAsWatched }: UpNextItemProps = $props();

  const { isMarkingAsWatched, markAsWatched } = useMarkAsWatched({
    id: episode.id,
    type: "episode",
  });
</script>

<UpNextEpisode
  i18n={EpisodeIntlProvider}
  episodeNumber={episode.number}
  seasonNumber={episode.season}
  posterUrl={episode.poster.url}
  showTitle={episode.show.title}
  episodeTitle={episode.title}
  completed={episode.completed}
  total={episode.total}
  remaining={episode.remaining}
  runtime={episode.runtime}
  type={episode.type}
  isLoading={$isMarkingAsWatched}
  onMarkAsWatched={async () => {
    await markAsWatched(episode.id);
    onMarkAsWatched();
  }}
/>
