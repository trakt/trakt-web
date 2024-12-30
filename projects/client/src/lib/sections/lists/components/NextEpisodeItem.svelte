<script lang="ts">
  import MarkAsWatchedButton from "$lib/components/buttons/mark-as-watched/MarkAsWatchedButton.svelte";
  import CardFooter from "$lib/components/card/CardFooter.svelte";
  import EpisodeCard from "$lib/components/episode/card/EpisodeCard.svelte";
  import EpisodeCover from "$lib/components/episode/card/EpisodeCover.svelte";
  import { EpisodeIntlProvider } from "$lib/components/episode/EpisodeIntlProvider";
  import ShowProgressTag from "$lib/components/episode/tags/ShowProgressTag.svelte";
  import Link from "$lib/components/link/Link.svelte";
  import type { EpisodeProgressEntry } from "$lib/models/EpisodeProgressEntry";
  import type { ShowSummary } from "$lib/requests/models/ShowSummary";
  import { useMarkAsWatched } from "$lib/stores/useMarkAsWatched";
  import { EPISODE_COVER_PLACEHOLDER } from "$lib/utils/constants";
  import { UrlBuilder } from "$lib/utils/url/UrlBuilder";

  type UpNextItemProps = {
    episode: EpisodeProgressEntry;
    show: ShowSummary;
  };

  const { episode, show }: UpNextItemProps = $props();

  const { isMarkingAsWatched, markAsWatched, removeWatched } = $derived(
    useMarkAsWatched({
      type: "episode",
      media: episode,
      show,
      episode,
    }),
  );
</script>

<EpisodeCard>
  <Link
    focusable={false}
    href={UrlBuilder.episode(show.slug, episode.season, episode.number)}
  >
    <EpisodeCover
      i18n={EpisodeIntlProvider}
      type={episode.type}
      src={`${episode.cover.url ?? show.cover.url.thumb ?? EPISODE_COVER_PLACEHOLDER}`}
      alt={`${show.title} - ${episode.title}`}
      isLoading={$isMarkingAsWatched}
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
      {episode.season}x{episode.number} - {episode.title}
    </p>
    {#snippet actions()}
      <MarkAsWatchedButton
        type="action"
        title={episode.title}
        isWatched={false}
        isMarkingAsWatched={$isMarkingAsWatched}
        onWatch={markAsWatched}
        onRemove={removeWatched}
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
