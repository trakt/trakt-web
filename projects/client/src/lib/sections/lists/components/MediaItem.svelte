<script lang="ts">
  import ActivityTag from "$lib/components/media/tags/ActivityTag.svelte";
  import MediaStatusTag from "$lib/components/media/tags/MediaStatusTag.svelte";
  import ProgressTag from "$lib/components/media/tags/ProgressTag.svelte";
  import { TagIntlProvider } from "$lib/components/media/tags/TagIntlProvider";
  import { useLargeScreen } from "$lib/features/large-screen-cards/useLargeScreen.ts";
  import { resolveSummaryCardLayout } from "$lib/sections/lists/utils/resolveSummaryCardLayout.ts";
  import { useLargeScreenCards } from "$lib/features/large-screen-cards/useLargeScreenCards.ts";
  import type { Snippet } from "svelte";
  import ActivityDateTag from "./_internal/ActivityDateTag.svelte";
  import MediaHoverCard from "./_internal/MediaHoverCard.svelte";
  import { resolveItemCardStyle } from "$lib/sections/lists/utils/resolveItemCardStyle.ts";
  import MediaCard from "./MediaCard.svelte";
  import MediaSummaryCard from "./MediaSummaryCard.svelte";
  import type { MediaCardProps } from "./models/MediaCardProps";

  const {
    sortTag,
    hoverTag,
    detailsTag,
    ...props
  }: MediaCardProps & {
    sortTag?: Snippet;
    hoverTag?: Snippet;
    detailsTag?: Snippet;
  } = $props();

  const isLargeScreen = useLargeScreen();

  const isLargeScreenCards = useLargeScreenCards();

  const style = $derived(props.style ?? "cover");
  const resolvedStyle = $derived(
    resolveItemCardStyle(style, $isLargeScreenCards),
  );

  const summaryCardLayout = $derived(
    resolveSummaryCardLayout({ style, isLargeScreen: $isLargeScreen }),
  );

  const isCover = $derived(resolvedStyle === "cover");

  const hasHoverCard = $derived(
    isCover && style === "summary" &&
      (props.variant == null || props.variant === "start" ||
        props.variant === "credit" || props.variant === "progress" ||
        props.variant === "next" || props.variant === "activity"),
  );
  const hasFooterTitle = $derived(
    props.variant === "start" || props.variant === "progress" ||
      props.variant === "activity" || props.variant === "next",
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

{#snippet activityDateTag()}
  {#if props.variant === "activity"}
    <ActivityDateTag date={props.date} activityType={props.activityType} />
  {/if}
{/snippet}

{#snippet mediaCard(coverWrapper?: Snippet<[Snippet]>)}
  <MediaCard
    {...props}
    {coverTag}
    {coverWrapper}
    style={resolvedStyle}
    action={props.action}
    popupActions={props.badge ? undefined : props.popupActions}
  />
{/snippet}

{#if resolvedStyle === "cover"}
  {#if hasHoverCard}
    <MediaHoverCard
      media={props.media}
      title={hasFooterTitle ? undefined : props.media.title}
      tag={hoverTag}
      bottomTag={props.variant === "next" || props.variant === "progress"
        ? coverTag
        : undefined}
      ratingTag={props.variant === "activity" ? activityDateTag : undefined}
      hasRating={props.variant !== "activity" && props.variant !== "next"}
      runtime={props.variant === "activity" ? props.media.runtime : undefined}
      children={mediaCard}
    />
  {:else}
    {@render mediaCard()}
  {/if}
{/if}

{#if resolvedStyle === "summary"}
  <MediaSummaryCard
    {...props}
    style={resolvedStyle}
    layout={summaryCardLayout}
    {sortTag}
    {detailsTag}
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

    --color-background-stem-tag: var(--color-background-cover-tag);
    --shadow-stem-tag: var(--shadow-cover-tag);
  }
</style>
