<script lang="ts">
  import { EpisodeIntlProvider } from "$lib/components/episode/EpisodeIntlProvider";
  import ShowProgressTag from "$lib/components/episode/tags/ShowProgressTag.svelte";
  import ActivityTag from "$lib/components/media/tags/ActivityTag.svelte";
  import AirDateTag from "$lib/components/media/tags/AirDateTag.svelte";
  import DurationTag from "$lib/components/media/tags/DurationTag.svelte";
  import { TagIntlProvider } from "$lib/components/media/tags/TagIntlProvider";
  import TagBar from "$lib/components/tags/TagBar.svelte";
  import TextTag from "$lib/components/tags/TextTag.svelte";
  import RenderFor from "$lib/guards/RenderFor.svelte";
  import MarkAsWatchedAction from "$lib/sections/media-actions/mark-as-watched/MarkAsWatchedAction.svelte";
  import { episodeNumberLabel } from "$lib/utils/intl/episodeNumberLabel";
  import type { Snippet } from "svelte";
  import SummaryCardRating from "./_internal/SummaryCardRating.svelte";
  import EpisodeCard from "./EpisodeCard.svelte";
  import MediaSummaryCard from "./MediaSummaryCard.svelte";
  import type { EpisodeCardProps } from "./models/EpisodeCardProps";

  const { sortTag, ...props }: EpisodeCardProps & { sortTag?: Snippet } =
    $props();

  const isFuture = $derived(props.episode.airDate > new Date());
  const isActivity = $derived(props.variant === "activity");
  const isHidden = $derived(props.status === "hidden");
  const isListItem = $derived(props.variant === "list-item");
  const style = $derived(props.style ?? "cover");

  const runtime = $derived(
    isNaN(props.episode.runtime) ? props.media.runtime : props.episode.runtime,
  );
</script>

{#snippet action()}
  {#if !isFuture && !isActivity && !isHidden && !isListItem}
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
{/snippet}

{#snippet tag()}
  {#if props.tag}
    {@render props.tag()}
  {:else}
    <div class="trakt-episode-tag">
      {#if ["default"].includes(props.variant)}
        <DurationTag i18n={TagIntlProvider} {runtime} type="tag" />
      {/if}

      {#if props.variant === "next"}
        <ShowProgressTag
          i18n={TagIntlProvider}
          progress={props.episode.completed}
          total={props.episode.total}
          {runtime}
          {style}
        >
          {#snippet tags()}
            <TextTag>
              <p class="bold capitalize ellipsis">
                {EpisodeIntlProvider.remainingText(props.episode.remaining)}
              </p>
            </TextTag>
            <TextTag>
              <p class="bold capitalize no-wrap">
                {EpisodeIntlProvider.durationText(props.episode.minutesLeft)}
              </p>
            </TextTag>
          {/snippet}
        </ShowProgressTag>
      {/if}

      {#if props.variant === "upcoming"}
        <AirDateTag
          i18n={TagIntlProvider}
          airDate={props.episode.airDate}
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
            airDate={props.episode.airDate}
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
    </div>
  {/if}
{/snippet}

{#snippet card()}
  {#if style === "summary"}
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
      {tag}
      badge={action}
      type="episode"
      style="summary"
      {sortTag}
    />
  {/if}

  {#if style === "cover"}
    <EpisodeCard {...props} {tag} {action} />
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
