<script lang="ts">
  import CardFooter from "$lib/components/card/CardFooter.svelte";
  import EpisodeCard from "$lib/components/episode/card/EpisodeCard.svelte";
  import { EpisodeIntlProvider } from "$lib/components/episode/EpisodeIntlProvider";
  import EpisodeTimeTag from "$lib/components/episode/tags/EpisodeTimeTag.svelte";
  import Link from "$lib/components/link/Link.svelte";
  import MediaCover from "$lib/components/media/card/MediaCover.svelte";
  import DurationTag from "$lib/components/media/tags/DurationTag.svelte";
  import { TagIntlProvider } from "$lib/components/media/tags/TagIntlProvider";
  import RenderFor from "$lib/guards/RenderFor.svelte";
  import type { EpisodeEntry } from "$lib/requests/models/EpisodeEntry";
  import type { MediaEntry } from "$lib/requests/models/MediaEntry";
  import MarkAsWatchedAction from "$lib/sections/media-actions/mark-as-watched/MarkAsWatchedAction.svelte";
  import { EPISODE_COVER_PLACEHOLDER } from "$lib/utils/constants";
  import { UrlBuilder } from "$lib/utils/url/UrlBuilder";

  type EpisodeProps = {
    episode: EpisodeEntry;
    show: MediaEntry;
    context?: "show" | "standalone";
  };

  const { show, episode, context = "show" }: EpisodeProps = $props();

  const isFuture = $derived(episode.airDate > new Date());
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
            {EpisodeIntlProvider.timestampText(episode.airDate)}
          </EpisodeTimeTag>
        {:else}
          <DurationTag i18n={TagIntlProvider} runtime={episode.runtime} />
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
    {#snippet action()}
      {#if isFuture === false}
        <RenderFor audience="authenticated">
          <MarkAsWatchedAction
            style="action"
            type="episode"
            title={episode.title}
            media={episode}
            {show}
            {episode}
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
