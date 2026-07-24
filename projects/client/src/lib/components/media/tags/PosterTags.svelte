<script lang="ts">
  import BookmarkIcon from "$lib/components/icons/BookmarkIcon.svelte";
  import DropIcon from "$lib/components/icons/DropIcon.svelte";
  import FastRewindIcon from "$lib/components/icons/FastRewindIcon.svelte";
  import TrackIcon from "$lib/components/icons/TrackIcon.svelte";
  import DroppedTag from "$lib/components/media/tags/DroppedTag.svelte";
  import IndicatorTag from "$lib/components/media/tags/IndicatorTag.svelte";
  import PostCreditsTag from "$lib/components/media/tags/PostCreditsTag.svelte";
  import RewatchingTag from "$lib/components/media/tags/RewatchingTag.svelte";
  import StartedTag from "$lib/components/media/tags/StartedTag.svelte";
  import { TagIntlProvider } from "$lib/components/media/tags/TagIntlProvider.ts";
  import WatchCountTag from "$lib/components/media/tags/WatchCountTag.svelte";
  import { FeatureFlag } from "$lib/features/feature-flag/models/FeatureFlag";
  import { useFeatureFlag } from "$lib/features/feature-flag/useFeatureFlag";
  import type { PosterTagsProps } from "./_internal/PosterTagsProps.ts";

  const {
    variant = "default",
    isRewatching = false,
    isWatched = false,
    isPartiallyWatched = false,
    isWatchlisted = false,
    isDropped = false,
    watchCount = 0,
    postCreditsCount = 0,
    i18n = TagIntlProvider,
    historyLink,
    seasonsLink,
    onWatchCountClick,
  }: PosterTagsProps = $props();

  const { isEnabled } = useFeatureFlag();
  const isRewatchingFeatureEnabled = $derived(
    isEnabled(FeatureFlag.Rewatching),
  );
  const showRewatching = $derived(isRewatching && $isRewatchingFeatureEnabled);
</script>

{#if variant === "default"}
  {#if showRewatching}
    <IndicatorTag>
      <FastRewindIcon />
    </IndicatorTag>
  {:else if isDropped}
    <IndicatorTag>
      <DropIcon />
    </IndicatorTag>
  {:else if isWatched || isPartiallyWatched}
    <IndicatorTag variant={isPartiallyWatched ? "partial" : "full"}>
      <TrackIcon />
    </IndicatorTag>
  {:else if isWatchlisted}
    <IndicatorTag>
      <BookmarkIcon state="added" />
    </IndicatorTag>
  {/if}
{:else}
  {#if isDropped}
    <DroppedTag {i18n} />
  {/if}

  {#if showRewatching}
    <RewatchingTag link={seasonsLink} />
  {:else if postCreditsCount > 0 && !isWatched}
    <PostCreditsTag count={postCreditsCount} {i18n} />
  {/if}

  {#if !showRewatching && isWatched}
    <WatchCountTag
      count={watchCount}
      {i18n}
      link={historyLink}
      onclick={onWatchCountClick}
    />
  {/if}

  {#if !showRewatching && isPartiallyWatched && !isWatched && !isDropped}
    <StartedTag link={seasonsLink} />
  {/if}
{/if}
