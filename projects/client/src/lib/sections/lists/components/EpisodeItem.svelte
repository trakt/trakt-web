<script lang="ts">
  import MarkAsWatchedButton from "$lib/components/buttons/mark-as-watched/MarkAsWatchedButton.svelte";
  import CardFooter from "$lib/components/card/CardFooter.svelte";
  import EpisodeCard from "$lib/components/episode/card/EpisodeCard.svelte";
  import { EpisodeIntlProvider } from "$lib/components/episode/EpisodeIntlProvider";
  import EpisodeTimeTag from "$lib/components/episode/tags/EpisodeTimeTag.svelte";
  import Link from "$lib/components/link/Link.svelte";
  import MediaCover from "$lib/components/media/card/MediaCover.svelte";
  import DurationTag from "$lib/components/media/tags/DurationTag.svelte";
  import { languageTag } from "$lib/features/i18n";
  import RenderFor from "$lib/guards/RenderFor.svelte";
  import type { EpisodeEntry } from "$lib/models/EpisodeEntry";
  import type { MediaSummary } from "$lib/requests/models/MediaSummary";
  import { useMarkAsWatched } from "$lib/stores/useMarkAsWatched";
  import { EPISODE_COVER_PLACEHOLDER } from "$lib/utils/constants";
  import { toHumanDuration } from "$lib/utils/formatting/date/toHumanDuration";
  import { UrlBuilder } from "$lib/utils/url/UrlBuilder";

  type EpisodeProps = {
    episode: EpisodeEntry;
    show: MediaSummary;
    context?: "show" | "standalone";
  };

  const { show, episode, context = "show" }: EpisodeProps = $props();

  const { isWatched, isMarkingAsWatched, markAsWatched, removeWatched } =
    $derived(
      useMarkAsWatched({
        type: "episode",
        media: episode,
        show,
        episode,
      }),
    );

  const isFuture = $derived(episode.airedDate > new Date());
</script>

<EpisodeCard>
  <Link
    focusable={false}
    href={UrlBuilder.episode(show.slug, episode.season, episode.number)}
  >
    <MediaCover
      src={episode.cover.url ??
        show.cover.url.thumb ??
        EPISODE_COVER_PLACEHOLDER}
      alt={`${episode.title} poster`}
    >
      {#snippet tags()}
        {#if isFuture}
          <EpisodeTimeTag>
            {EpisodeIntlProvider.timestampText(episode.airedDate)}
          </EpisodeTimeTag>
        {:else}
          <DurationTag>
            {toHumanDuration({ minutes: episode.runtime }, languageTag())}
          </DurationTag>
        {/if}
      {/snippet}
    </MediaCover>
  </Link>

  <CardFooter>
    {#if context === "standalone"}
      <p class="episode-title small ellipsis">
        {show.title}
      </p>
      <p class="episode-subtitle small ellipsis">
        {episode.season}x{episode.number} - {episode.title}
      </p>
    {:else}
      <p class="episode-title small ellipsis">
        {episode.title}
      </p>
      <p class="episode-subtitle small ellipsis">
        {episode.season}x{episode.number}
      </p>
    {/if}
    {#snippet actions()}
      {#if isFuture === false}
        <RenderFor audience="authenticated">
          <MarkAsWatchedButton
            type="action"
            title={episode.title}
            isWatched={$isWatched}
            isMarkingAsWatched={$isMarkingAsWatched}
            onWatch={markAsWatched}
            onRemove={removeWatched}
          />
        </RenderFor>
      {/if}
    {/snippet}
  </CardFooter>
</EpisodeCard>

<style>
  .episode-title {
    color: var(--color-text-primary);
    margin: 0;

    font-weight: 600;
  }

  .episode-subtitle {
    color: var(--color-text-secondary);
    margin: 0;

    font-weight: 500;
  }
</style>
