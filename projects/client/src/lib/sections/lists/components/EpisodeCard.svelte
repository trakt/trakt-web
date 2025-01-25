<script lang="ts">
  import Card from "$lib/components/card/Card.svelte";
  import CardCover from "$lib/components/card/CardCover.svelte";
  import CardFooter from "$lib/components/card/CardFooter.svelte";
  import { EpisodeIntlProvider } from "$lib/components/episode/EpisodeIntlProvider";
  import EpisodeStatusTag from "$lib/components/episode/tags/EpisodeStatusTag.svelte";
  import EpisodeTimeTag from "$lib/components/episode/tags/EpisodeTimeTag.svelte";
  import ShowProgressTag from "$lib/components/episode/tags/ShowProgressTag.svelte";
  import Link from "$lib/components/link/Link.svelte";
  import DurationTag from "$lib/components/media/tags/DurationTag.svelte";
  import { TagIntlProvider } from "$lib/components/media/tags/TagIntlProvider";
  import Spoiler from "$lib/features/spoilers/components/Spoiler.svelte";
  import { useEpisodeSpoilerImage } from "$lib/features/spoilers/useEpisodeSpoilerImage";
  import MarkAsWatchedAction from "$lib/sections/media-actions/mark-as-watched/MarkAsWatchedAction.svelte";
  import { EPISODE_COVER_PLACEHOLDER } from "$lib/utils/constants";
  import { UrlBuilder } from "$lib/utils/url/UrlBuilder";
  import type { EpisodeCardProps } from "./EpisodeCardProps";

  const props: EpisodeCardProps = $props();
  const { type, show, episode } = props;

  const src = useEpisodeSpoilerImage({ episode, show });
  const isFuture = $derived(episode.airDate > new Date());

  const isDefault = $derived(type === "default");
  const isShowContext = $derived(
    type === "default" && props.context === "show",
  );
</script>

<Card
  --width-card="var(--width-episode-card)"
  --height-card="var(--height-episode-card)"
  --height-card-cover="var(--height-episode-card-cover)"
>
  <Link
    focusable={false}
    href={UrlBuilder.episode(show.slug, episode.season, episode.number)}
  >
    <CardCover
      src={$src ?? EPISODE_COVER_PLACEHOLDER}
      alt={`${show.title} - ${episode.title}`}
    >
      {#snippet tags()}
        {#if !isDefault}
          <EpisodeStatusTag i18n={EpisodeIntlProvider} type={episode.type} />
        {/if}

        {#if type === "default"}
          {#if isFuture}
            <EpisodeTimeTag>
              {EpisodeIntlProvider.timestampText(episode.airDate)}
            </EpisodeTimeTag>
          {:else}
            <DurationTag i18n={TagIntlProvider} runtime={episode.runtime} />
          {/if}
        {/if}

        {#if type === "upcoming"}
          <EpisodeTimeTag>
            {EpisodeIntlProvider.timestampText(episode.airDate)}
          </EpisodeTimeTag>
        {/if}

        {#if type === "next"}
          <ShowProgressTag total={episode.total} progress={episode.completed}>
            <span class="show-progress-label">
              {EpisodeIntlProvider.remainingText(episode.remaining)} / {EpisodeIntlProvider.durationText(
                episode.minutesLeft,
              )}
            </span>
          </ShowProgressTag>
        {/if}
      {/snippet}
    </CardCover>
  </Link>

  <CardFooter>
    {#if isShowContext}
      <p class="episode-card-title ellipsis">
        <Spoiler media={episode} {show} {episode} type="episode">
          {episode.title}
        </Spoiler>
      </p>
      <p class="episode-card-subtitle ellipsis small">
        {episode.season}x{episode.number}
      </p>
    {:else}
      <Link href={UrlBuilder.show(show.slug)}>
        <p class="episode-card-title ellipsis">{show.title}</p>
      </Link>
      <p class="episode-card-subtitle ellipsis small">
        {episode.season}x{episode.number}
        <Spoiler media={episode} {show} {episode} type="episode">
          - {episode.title}
        </Spoiler>
      </p>
    {/if}

    {#snippet action()}
      {#if !isFuture}
        <MarkAsWatchedAction
          style="action"
          type="episode"
          title={episode.title}
          media={episode}
          {episode}
          {show}
        />
      {/if}
    {/snippet}
  </CardFooter>
</Card>

<style>
  .episode-card-title {
    color: var(--color-text-primary);
    margin: 0;
    font-weight: 600;
  }

  .episode-card-subtitle {
    color: var(--color-text-secondary);
    margin: 0;
    font-weight: 500;
  }

  .show-progress-label {
    position: relative;
  }
</style>
