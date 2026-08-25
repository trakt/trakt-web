<script lang="ts">
  import ActivityTag from "$lib/components/media/tags/ActivityTag.svelte";
  import MediaStatusTag from "$lib/components/media/tags/MediaStatusTag.svelte";
  import ProgressTag from "$lib/components/media/tags/ProgressTag.svelte";
  import { TagIntlProvider } from "$lib/components/media/tags/TagIntlProvider";
  import { useLargeScreenCards } from "$lib/features/large-screen-cards/useLargeScreenCards.ts";
  import { mediaGlanceNavigation } from "$lib/sections/summary/components/glance/mediaGlanceNavigation.ts";
  import type { Snippet } from "svelte";
  import { resolveItemCardStyle } from "./_internal/resolveItemCardStyle.ts";
  import MediaCard from "./MediaCard.svelte";
  import MediaSummaryCard from "./MediaSummaryCard.svelte";
  import type { MediaCardProps } from "./models/MediaCardProps";

  const {
    contextualTag,
    sortTag,
    ...props
  }: MediaCardProps & { contextualTag?: Snippet; sortTag?: Snippet } = $props();

  const isLargeScreenCards = useLargeScreenCards();

  const style = $derived(props.style ?? "cover");
  const resolvedStyle = $derived(
    resolveItemCardStyle(style, $isLargeScreenCards),
  );
  const { buildMediaGlanceLink } = mediaGlanceNavigation();
  const urlOverride = $derived(
    $isLargeScreenCards && style === "summary"
      ? buildMediaGlanceLink({
        type: props.media.type,
        slug: props.media.slug,
      })
      : undefined,
  );

  const summaryCardLayout = $derived(
    style === "compact" || style === "minimal" ? style : "default",
  );

  const isCover = $derived(resolvedStyle === "cover");
</script>

{#snippet coverTag()}
  <div class="trakt-media-tag">
    {#if props.variant === "activity"}
      <ActivityTag
        i18n={TagIntlProvider}
        activityDate={props.date}
        type={isCover ? "tag" : "text"}
      />
    {/if}
    {#if props.variant === "next"}
      <ProgressTag progress={props.progress ?? 0}>
        {TagIntlProvider.toRemainingDuration(props.minutesLeft)}
      </ProgressTag>
    {/if}
    {#if props.type === "movie" || props.type === "show"}
      <MediaStatusTag
        i18n={TagIntlProvider}
        status={props.media.status}
        effectiveReleaseDate={props.media.effectiveReleaseDate}
        type={isCover ? "tag" : "text"}
      />
    {/if}
    {#if props.coverTag}
      {@render props.coverTag()}
    {/if}
  </div>
{/snippet}

{#if resolvedStyle === "cover"}
  <MediaCard
    {...props}
    {coverTag}
    {urlOverride}
    style={resolvedStyle}
    action={props.action}
    popupActions={props.badge ? undefined : props.popupActions}
  />
{/if}

{#if resolvedStyle === "summary"}
  <MediaSummaryCard
    {...props}
    style={resolvedStyle}
    layout={summaryCardLayout}
    {contextualTag}
    {sortTag}
    badge={props.action}
    popupActions={props.badge ? undefined : props.popupActions}
    tag={props.variant === "next" || props.variant === "progress"
      ? coverTag
      : props.tag}
  />
{/if}

<style>
  .trakt-media-tag {
    width: 100%;

    display: flex;
    align-items: center;

    gap: var(--gap-micro);

    :global(.trakt-tag) {
      background: var(--color-background-cover-tag);
    }
  }
</style>
