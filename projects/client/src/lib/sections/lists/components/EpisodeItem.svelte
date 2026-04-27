<script lang="ts">
  import { EpisodeIntlProvider } from "$lib/components/episode/EpisodeIntlProvider";
  import { getEpisodeStatus } from "$lib/components/episode/getEpisodeStatus";
  import EpisodeDurationTag from "$lib/components/episode/tags/EpisodeDurationTag.svelte";
  import EpisodeRemainingTag from "$lib/components/episode/tags/EpisodeRemainingTag.svelte";
  import EpisodeStatusTag from "$lib/components/episode/tags/EpisodeStatusTag.svelte";
  import ShowProgressTag from "$lib/components/episode/tags/ShowProgressTag.svelte";
  import ActivityTag from "$lib/components/media/tags/ActivityTag.svelte";
  import AirDateTag from "$lib/components/media/tags/AirDateTag.svelte";
  import DurationTag from "$lib/components/media/tags/DurationTag.svelte";
  import { TagIntlProvider } from "$lib/components/media/tags/TagIntlProvider";
  import TagBar from "$lib/components/tags/TagBar.svelte";
  import TextTag from "$lib/components/tags/TextTag.svelte";
  import RenderFor from "$lib/guards/RenderFor.svelte";
  import MarkAsWatchedAction from "$lib/sections/media-actions/mark-as-watched/MarkAsWatchedAction.svelte";
  import { useIsWatched } from "$lib/sections/media-actions/mark-as-watched/useIsWatched";
  import { episodeNumberLabel } from "$lib/utils/intl/episodeNumberLabel";
  import type { Snippet } from "svelte";
  import SummaryCardRating from "./_internal/SummaryCardRating.svelte";
  import EpisodeCard from "./EpisodeCard.svelte";
  import MediaSummaryCard from "./MediaSummaryCard.svelte";
  import type { EpisodeCardProps } from "./models/EpisodeCardProps";
  import StatusIndicators from "./StatusIndicators.svelte";

  const { sortTag, ...props }: EpisodeCardProps & { sortTag?: Snippet } =
    $props();

  const isFuture = $derived(props.episode.effectiveReleaseDate > new Date());
  const isActivity = $derived(props.variant === "activity");
  const isHidden = $derived(props.status === "hidden");
  const isListItem = $derived(props.variant === "list-item");
  const style = $derived(props.style ?? "cover");
  const isCompact = $derived(style === "compact");
  const resolvedStyle: "cover" | "summary" = $derived(
    style === "compact" ? "summary" : style,
  );

  const runtime = $derived(
    isNaN(props.episode.runtime) ? props.media.runtime : props.episode.runtime,
  );

  const status = $derived(getEpisodeStatus(props.episode.type));

  const { isWatched } = $derived(
    useIsWatched({ type: "episode", media: props.episode, show: props.media }),
  );

  const hasMarkAsWatched = $derived.by(() => {
    if (isListItem || isFuture || isHidden || isActivity) {
      return false;
    }

    return !$isWatched;
  });

  const hasIndicators = $derived.by(() => {
    const standAloneVariants: ReadonlyArray<string> = [
      "list-item",
      "default",
      "calendar",
    ];

    return standAloneVariants.includes(props.variant) ? $isWatched : false;
  });
</script>

{#snippet indicatorTags()}
  <StatusIndicators isWatched={$isWatched} isWatchlisted={false} />
{/snippet}

{#snippet action()}
  {#if props.action}
    {@render props.action()}
  {:else}
    {#if hasMarkAsWatched}
      <RenderFor audience="authenticated">
        <MarkAsWatchedAction
          mode={props.variant === "next" && props.context !== "show"
            ? "act"
            : "hybrid"}
          style="action"
          type="episode"
          size="small"
          title={props.episode.title}
          media={props.episode}
          show={props.media}
        />
      </RenderFor>
    {/if}

    {#if style === "summary" && isListItem}
      <SummaryCardRating item={props.episode} />
    {/if}
  {/if}
{/snippet}

{#snippet tag()}
  <div class="trakt-episode-tag">
    {#if props.tag}
      {@render props.tag()}
    {:else}
      {#if ["default"].includes(props.variant)}
        <DurationTag i18n={TagIntlProvider} {runtime} type="tag" />
      {/if}

      {#if props.variant === "next"}
        {#snippet statusTag()}
          <EpisodeStatusTag
            i18n={EpisodeIntlProvider}
            episodeType={props.episode.type}
          />
        {/snippet}

        {#snippet progressTags()}
          <EpisodeRemainingTag
            i18n={EpisodeIntlProvider}
            remaining={props.episode.remaining}
          />
          <EpisodeDurationTag
            i18n={EpisodeIntlProvider}
            minutesLeft={props.episode.minutesLeft}
          />
        {/snippet}

        <ShowProgressTag
          i18n={TagIntlProvider}
          progress={props.episode.completed}
          total={props.episode.total}
          tags={status ? statusTag : progressTags}
          {runtime}
          style={resolvedStyle}
        />
      {/if}

      {#if props.variant === "upcoming"}
        <AirDateTag
          i18n={TagIntlProvider}
          airDate={props.episode.effectiveReleaseDate}
          type="tag"
        />
        <EpisodeStatusTag
          i18n={EpisodeIntlProvider}
          episodeType={props.episode.type}
          type="tag"
        />
      {/if}

      {#if props.variant === "calendar"}
        <EpisodeStatusTag
          i18n={EpisodeIntlProvider}
          episodeType={props.episode.type}
          type="tag"
        />
      {/if}

      {#if props.variant === "activity"}
        <ActivityTag
          i18n={TagIntlProvider}
          activityDate={props.date}
          type="tag"
        />
      {/if}

      {#if isListItem}
        <TagBar>
          <AirDateTag
            i18n={TagIntlProvider}
            airDate={props.episode.effectiveReleaseDate}
            type="text"
          />
          <TextTag>
            <p class="bold capitalize no-wrap">
              {episodeNumberLabel({
                seasonNumber: props.episode.season,
                episodeNumber: props.episode.number,
              })}
            </p>
          </TextTag>
        </TagBar>
      {/if}
    {/if}
  </div>
{/snippet}

{#snippet card()}
  {#if style === "summary" || style === "compact"}
    <MediaSummaryCard
      variant="default"
      episode={props.episode}
      source={props.source}
      media={{
        ...props.media,
        episode: {
          count: 0,
        },
      }}
      popupActions={props.popupActions}
      layout={isCompact ? "compact" : "default"}
      context={"context" in props ? props.context : undefined}
      coverUrl={"coverUrl" in props ? props.coverUrl : undefined}
      {tag}
      badge={action}
      {sortTag}
      type="episode"
      indicators={hasIndicators ? indicatorTags : undefined}
    />
  {/if}

  {#if style === "cover"}
    <EpisodeCard
      {...props}
      {tag}
      {action}
      indicators={hasIndicators ? indicatorTags : undefined}
    />
  {/if}
{/snippet}

{#if props.status === "hidden"}
  <trakt-hidden-show>
    {@render card()}
  </trakt-hidden-show>
{:else}
  {@render card()}
{/if}

<style lang="scss">
  @use "$style/scss/mixins/index.scss" as *;

  trakt-hidden-show {
    :global(.trakt-card-footer-information),
    :global(.trakt-card-cover),
    :global(.trakt-summary-item) {
      filter: contrast(0.65) grayscale(1);
    }
  }

  .trakt-episode-tag {
    width: 100%;

    display: flex;
    align-items: center;

    gap: var(--gap-micro);

    :global(.trakt-tag) {
      background: var(--color-background-cover-tag);
    }
  }
</style>
