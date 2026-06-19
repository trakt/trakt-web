<script lang="ts">
  import ActivityTag from "$lib/components/media/tags/ActivityTag.svelte";
  import MediaStatusTag from "$lib/components/media/tags/MediaStatusTag.svelte";
  import ProgressTag from "$lib/components/media/tags/ProgressTag.svelte";
  import { TagIntlProvider } from "$lib/components/media/tags/TagIntlProvider";
  import { useMedia, WellKnownMediaQuery } from "$lib/stores/css/useMedia";
  import type { Snippet } from "svelte";
  import HoverSummaryWrapper from "./_internal/HoverSummaryWrapper.svelte";
  import MediaCard from "./MediaCard.svelte";
  import MediaSummaryCard from "./MediaSummaryCard.svelte";
  import type { MediaCardProps } from "./models/MediaCardProps";

  const {
    contextualTag,
    sortTag,
    ...props
  }: MediaCardProps & { contextualTag?: Snippet; sortTag?: Snippet } = $props();

  const isTabletLarge = useMedia(WellKnownMediaQuery.tabletLarge);
  const isDesktop = useMedia(WellKnownMediaQuery.desktop);
  const isMouse = useMedia(WellKnownMediaQuery.mouse);

  const style = $derived(props.style ?? "cover");
  const resolvedStyle = $derived<"cover" | "summary">(
    style === "compact" || style === "minimal" ? "summary" : style,
  );
  const summaryCardLayout = $derived(
    style === "compact" || style === "minimal" ? style : "default",
  );

  const isCover = $derived(resolvedStyle === "cover");
  const isHoverMode = $derived(
    resolvedStyle === "summary" &&
      summaryCardLayout === "default" &&
      ($isTabletLarge || $isDesktop) &&
      $isMouse,
  );
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
    style={resolvedStyle}
    action={props.action}
    popupActions={props.badge ? undefined : props.popupActions}
  />
{/if}

{#if resolvedStyle === "summary"}
  {#if isHoverMode}
    <HoverSummaryWrapper>
      {#snippet coverCard()}
        <MediaCard
          {...props}
          {coverTag}
          style="cover"
          action={props.action}
          popupActions={props.badge ? undefined : props.popupActions}
        />
      {/snippet}
      {#snippet summaryOverlay()}
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
      {/snippet}
    </HoverSummaryWrapper>
  {:else}
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
