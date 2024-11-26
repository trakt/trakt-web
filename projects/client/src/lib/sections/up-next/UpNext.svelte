<script lang="ts">
  import { EpisodeIntlProvider } from "$lib/components/episode/EpisodeIntlProvider";
  import UpNextEpisode from "$lib/components/episode/up-next/UpNextEpisode.svelte";
  import SectionList from "$lib/components/section-list/SectionList.svelte";
  import * as m from "$lib/features/i18n/messages.ts";
  import { useMarkAsWatched } from "./useMarkAsWatched";
  import { useUpNextEpisodes } from "./useUpNextEpisodes";

  const { list, reload } = useUpNextEpisodes();
  const { isLoading, markAsWatched } = useMarkAsWatched();
</script>

<SectionList
  title={m.up_next_title()}
  --height-section-list="var(--height-episode-list)"
>
  {#each $list as episode (episode.show.id)}
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
      isLoading={isLoading(episode.id)}
      onMarkAsWatched={async () => {
        await markAsWatched(episode);
        reload();
      }}
    />
  {/each}
</SectionList>
