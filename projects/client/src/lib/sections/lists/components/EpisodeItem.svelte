<script lang="ts">
  import { EpisodeIntlProvider } from "$lib/components/episode/EpisodeIntlProvider";
  import ShowProgressTag from "$lib/components/episode/tags/ShowProgressTag.svelte";
  import MarkAsWatchedAction from "$lib/sections/media-actions/mark-as-watched/MarkAsWatchedAction.svelte";
  import EpisodeCard from "./EpisodeCard.svelte";
  import type { EpisodeCardProps } from "./EpisodeCardProps";
  import MediaSummaryCard from "./MediaSummaryCard.svelte";

  const props: EpisodeCardProps = $props();

  const isFuture = $derived(props.episode.airDate > new Date());
  const isActivity = $derived(props.variant === "activity");
  const isHidden = $derived(props.status === "hidden");
  const style = $derived(props.style ?? "cover");
</script>

{#snippet action()}
  {#if !isFuture && !isActivity && !isHidden}
    <MarkAsWatchedAction
      allowRewatch={props.variant === "next"}
      style="action"
      type="episode"
      size="small"
      title={props.episode.title}
      media={props.episode}
      episode={props.episode}
      show={props.show}
    />
  {/if}
{/snippet}

{#snippet tag()}
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

{#snippet card()}
  {#if style === "summary"}
    <MediaSummaryCard
      episode={props.episode}
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

<style>
  .show-progress-label {
    position: relative;
  }

  trakt-hidden-show {
    :global(.trakt-card-footer-information),
    :global(.trakt-card-cover),
    :global(.trakt-summary-item) {
      filter: contrast(0.65) grayscale(1);
    }
  }
</style>
