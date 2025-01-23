<script lang="ts">
  import CardFooter from "$lib/components/card/CardFooter.svelte";
  import EpisodeCard from "$lib/components/episode/card/EpisodeCard.svelte";
  import EpisodeCover from "$lib/components/episode/card/EpisodeCover.svelte";
  import { EpisodeIntlProvider } from "$lib/components/episode/EpisodeIntlProvider";
  import ShowProgressTag from "$lib/components/episode/tags/ShowProgressTag.svelte";
  import Link from "$lib/components/link/Link.svelte";
  import Spoiler from "$lib/features/spoilers/components/Spoiler.svelte";
  import { useEpisodeSpoilerImage } from "$lib/features/spoilers/useEpisodeSpoilerImage";
  import type { EpisodeProgressEntry } from "$lib/requests/models/EpisodeProgressEntry";
  import type { ShowEntry } from "$lib/requests/models/ShowEntry";
  import MarkAsWatchedAction from "$lib/sections/media-actions/mark-as-watched/MarkAsWatchedAction.svelte";
  import { EPISODE_COVER_PLACEHOLDER } from "$lib/utils/constants";
  import { UrlBuilder } from "$lib/utils/url/UrlBuilder";
  import { writable } from "svelte/store";

  type UpNextItemProps = {
    episode: EpisodeProgressEntry;
    show: ShowEntry;
  };

  const { episode, show }: UpNextItemProps = $props();

  const isLoading = writable(false);

  const src = useEpisodeSpoilerImage({ episode, show });
</script>

<EpisodeCard>
  <Link
    focusable={false}
    href={UrlBuilder.episode(show.slug, episode.season, episode.number)}
  >
    <EpisodeCover
      i18n={EpisodeIntlProvider}
      type={episode.type}
      src={$src ?? EPISODE_COVER_PLACEHOLDER}
      alt={`${show.title} - ${episode.title}`}
      isLoading={$isLoading}
    >
      {#snippet tags()}
        <ShowProgressTag total={episode.total} progress={episode.completed}>
          <span class="show-progress-text">
            {EpisodeIntlProvider.remainingText(episode.remaining)} / {EpisodeIntlProvider.durationText(
              episode.minutesLeft,
            )}
          </span>
        </ShowProgressTag>
      {/snippet}
    </EpisodeCover>
  </Link>

  <CardFooter>
    <Link href={UrlBuilder.show(show.slug)}>
      <p class="episode-show-title ellipsis">{show.title}</p>
    </Link>
    <p class="episode-title small ellipsis">
      {episode.season}x{episode.number}
      <Spoiler media={episode} {show} {episode} type="episode"
        >- {episode.title}</Spoiler
      >
    </p>
    {#snippet action()}
      <MarkAsWatchedAction
        style="action"
        type="episode"
        title={episode.title}
        media={episode}
        onAction={isLoading.set}
        {episode}
        {show}
      />
    {/snippet}
  </CardFooter>
</EpisodeCard>

<style>
  .show-progress-text {
    position: relative;
  }

  .episode-show-title {
    color: var(--color-text-primary);
    margin: 0;

    font-weight: 600;
  }

  .episode-title {
    color: var(--color-text-secondary);
    margin: 0;

    font-weight: 500;
  }
</style>
