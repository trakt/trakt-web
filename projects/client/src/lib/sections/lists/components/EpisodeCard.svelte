<script lang="ts">
  import { EpisodeIntlProvider } from "$lib/components/episode/EpisodeIntlProvider";
  import EpisodeStatusTag from "$lib/components/episode/tags/EpisodeStatusTag.svelte";
  import EpisodeTimeTag from "$lib/components/episode/tags/EpisodeTimeTag.svelte";
  import ShowProgressTag from "$lib/components/episode/tags/ShowProgressTag.svelte";
  import DurationTag from "$lib/components/media/tags/DurationTag.svelte";
  import { TagIntlProvider } from "$lib/components/media/tags/TagIntlProvider";
  import MarkAsWatchedAction from "$lib/sections/media-actions/mark-as-watched/MarkAsWatchedAction.svelte";
  import type { EpisodeCardProps } from "./EpisodeCardProps";
  import EpisodeItemCard from "./EpisodeItemCard.svelte";
  import MediaSummaryCard from "./MediaSummaryCard.svelte";

  const props: EpisodeCardProps = $props();

  const isFuture = $derived(props.episode.airDate > new Date());
  const isDefault = $derived(props.variant === "default");
  const isActivity = $derived(props.variant === "activity");
  const isHidden = $derived(props.status === "hidden");
  const style = $derived(props.style ?? "cover");
</script>

{#snippet action()}
  {#if !isFuture && !isActivity && !isHidden}
    <MarkAsWatchedAction
      isRewatching={props.variant === "next"}
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

{#snippet progressTags()}
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

{#snippet badges()}
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
{/snippet}

{#snippet tags()}
  {#if style === "cover"}
    {@render badges()}
  {/if}
  {@render progressTags()}
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
      {tags}
      {action}
      {badges}
      type="episode"
      variant="thumb"
      style="summary"
    />
  {/if}

  {#if style === "cover"}
    <EpisodeItemCard {...props} {tags} {action} />
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
    :global(.card-cover),
    :global(.trakt-summary-item) {
      filter: contrast(0.65) grayscale(1);
    }
  }
</style>
