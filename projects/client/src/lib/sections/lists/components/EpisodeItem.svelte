<script lang="ts">
  import { EpisodeIntlProvider } from "$lib/components/episode/EpisodeIntlProvider";
  import ShowProgressTag from "$lib/components/episode/tags/ShowProgressTag.svelte";
  import ActivityTag from "$lib/components/media/tags/ActivityTag.svelte";
  import AirDateTag from "$lib/components/media/tags/AirDateTag.svelte";
  import DurationTag from "$lib/components/media/tags/DurationTag.svelte";
  import { TagIntlProvider } from "$lib/components/media/tags/TagIntlProvider";
  import RenderFor from "$lib/guards/RenderFor.svelte";
  import MarkAsWatchedAction from "$lib/sections/media-actions/mark-as-watched/MarkAsWatchedAction.svelte";
  import EpisodeCard from "./EpisodeCard.svelte";
  import type { EpisodeCardProps } from "./EpisodeCardProps";
  import MediaSummaryCard from "./MediaSummaryCard.svelte";

  const props: EpisodeCardProps = $props();

  const isFuture = $derived(props.episode.airDate > new Date());
  const isActivity = $derived(props.variant === "activity");
  const isHidden = $derived(props.status === "hidden");
  const style = $derived(props.style ?? "cover");

  const runtime = $derived(
    isNaN(props.episode.runtime) ? props.show.runtime : props.episode.runtime,
  );

  const isSummary = $derived(style === "summary");
</script>

{#snippet action()}
  {#if !isFuture && !isActivity && !isHidden}
    <RenderFor audience="authenticated">
      <MarkAsWatchedAction
        allowRewatch={props.variant === "next"}
        style="action"
        type="episode"
        size="small"
        title={props.episode.title}
        media={props.episode}
        show={props.show}
      />
    </RenderFor>
  {/if}
{/snippet}

{#snippet tag()}
  {#if props.tag}
    {@render props.tag()}
  {:else}
    <div class="trakt-episode-tag" class:is-summary={isSummary}>
      {#if ["next", "default"].includes(props.variant)}
        <DurationTag i18n={TagIntlProvider} {runtime} isTextOnly={isSummary} />
      {/if}

      {#if props.variant === "next"}
        {#if isSummary}
          <span class="secondary meta-info">·</span>
        {/if}
        <ShowProgressTag
          total={props.episode.total}
          progress={props.episode.completed}
          isTextOnly={isSummary}
        >
          <div class="show-progress">
            <span class="ellipsis">
              {EpisodeIntlProvider.remainingText(props.episode.remaining)}
            </span>
            <span class="no-wrap">
              {#if isSummary}
                ({EpisodeIntlProvider.durationText(props.episode.minutesLeft)})
              {:else}
                {EpisodeIntlProvider.durationText(props.episode.minutesLeft)}
              {/if}
            </span>
          </div>
        </ShowProgressTag>
      {/if}

      {#if props.variant === "upcoming"}
        <AirDateTag
          i18n={TagIntlProvider}
          airDate={props.episode.airDate}
          isTextOnly={isSummary}
        />
      {/if}

      {#if props.variant === "activity"}
        <ActivityTag
          i18n={TagIntlProvider}
          activityDate={props.date}
          isTextOnly={isSummary}
        />
      {/if}
    </div>
  {/if}
{/snippet}

{#snippet card()}
  {#if style === "summary"}
    <MediaSummaryCard
      episode={props.episode}
      source={props.source}
      media={{
        ...props.show,
        episode: {
          count: 0,
        },
      }}
      popupActions={props.popupActions}
      {tag}
      {action}
      type="episode"
      variant="landscape"
      style="summary"
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

  .show-progress {
    display: flex;
    align-items: center;
    justify-content: space-between;

    gap: var(--gap-xs);

    position: relative;
  }

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

    &.is-summary {
      gap: var(--gap-xs);

      .show-progress {
        gap: var(--gap-micro);
      }
    }
  }
</style>
