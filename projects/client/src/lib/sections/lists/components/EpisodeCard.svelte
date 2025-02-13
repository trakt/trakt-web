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
  import EpisodeSummaryCard from "./_internal/EpisodeSummaryCard.svelte";
  import type { EpisodeCardProps } from "./EpisodeCardProps";

  const props: EpisodeCardProps = $props();

  const src = $derived(useEpisodeSpoilerImage(props));
  const isFuture = $derived(props.episode.airDate > new Date());

  const isDefault = $derived(props.variant === "default");
  const isShowContext = $derived(
    props.variant === "default" && props.context === "show",
  );
  const isActivity = $derived(props.variant === "activity");
  const style = $derived(props.style ?? "cover");
</script>

{#snippet action()}
  {#if !isFuture && !isActivity}
    <MarkAsWatchedAction
      style="action"
      type="episode"
      title={props.episode.title}
      media={props.episode}
      episode={props.episode}
      show={props.show}
    />
  {/if}
{/snippet}

{#snippet tags()}
  {#if !isDefault}
    <EpisodeStatusTag i18n={EpisodeIntlProvider} type={props.episode.type} />
  {/if}

  {#if props.variant === "default"}
    {#if isFuture}
      <EpisodeTimeTag>
        {EpisodeIntlProvider.timestampText(props.episode.airDate)}
      </EpisodeTimeTag>
    {:else}
      <DurationTag i18n={TagIntlProvider} runtime={props.episode.runtime} />
    {/if}
  {/if}

  {#if props.variant === "upcoming"}
    <EpisodeTimeTag>
      {EpisodeIntlProvider.timestampText(props.episode.airDate)}
    </EpisodeTimeTag>
  {/if}

  {#if props.variant === "next"}
    <ShowProgressTag
      total={props.episode.total}
      progress={props.episode.completed}
    >
      <span class="show-progress-label">
        {EpisodeIntlProvider.remainingText(props.episode.remaining)} / {EpisodeIntlProvider.durationText(
          props.episode.minutesLeft,
        )}
      </span>
    </ShowProgressTag>
  {/if}
{/snippet}

{#if style === "summary"}
  <EpisodeSummaryCard
    episode={props.episode}
    show={props.show}
    {tags}
    {action}
  />
{/if}

{#if style === "cover"}
  <Card
    --width-card="var(--width-episode-card)"
    --height-card="var(--height-episode-card)"
    --height-card-cover="var(--height-episode-card-cover)"
  >
    <Link
      focusable={false}
      href={UrlBuilder.episode(
        props.show.slug,
        props.episode.season,
        props.episode.number,
      )}
    >
      <CardCover
        src={$src ?? EPISODE_COVER_PLACEHOLDER}
        alt={`${props.show.title} - ${props.episode.title}`}
        badges={props.badges}
        {tags}
      />
    </Link>

    <CardFooter {action}>
      {#if isShowContext}
        <p class="episode-card-title ellipsis">
          <Spoiler
            media={props.episode}
            show={props.show}
            episode={props.episode}
            type="episode"
          >
            {props.episode.title}
          </Spoiler>
        </p>
        <p class="episode-card-subtitle ellipsis small">
          {props.episode.season}x{props.episode.number}
        </p>
      {/if}

      {#if props.variant === "activity"}
        <Link href={UrlBuilder.show(props.show.slug)}>
          <p class="episode-card-title ellipsis">
            {props.episode.season}x{props.episode.number} - {props.show.title}
          </p>
        </Link>
        <p class="episode-card-subtitle ellipsis small">
          {EpisodeIntlProvider.timestampText(props.date)}
        </p>
      {/if}

      {#if !isShowContext && !isActivity}
        <Link href={UrlBuilder.show(props.show.slug)}>
          <p class="episode-card-title ellipsis">{props.show.title}</p>
        </Link>
        <p class="episode-card-subtitle ellipsis small">
          {props.episode.season}x{props.episode.number}
          <Spoiler
            media={props.episode}
            show={props.show}
            episode={props.episode}
            type="episode"
          >
            - {props.episode.title}
          </Spoiler>
        </p>
      {/if}
    </CardFooter>
  </Card>
{/if}

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
