<script lang="ts">
  import DroppedTag from "$lib/components/media/tags/DroppedTag.svelte";
  import PostCreditsTag from "$lib/components/media/tags/PostCreditsTag.svelte";
  import RewatchingTag from "$lib/components/media/tags/RewatchingTag.svelte";
  import StartedTag from "$lib/components/media/tags/StartedTag.svelte";
  import WatchedTag from "$lib/components/media/tags/WatchedTag.svelte";
  import WatchlistedTag from "$lib/components/media/tags/WatchlistedTag.svelte";
  import { FeatureFlag } from "$lib/features/feature-flag/models/FeatureFlag";
  import { useFeatureFlag } from "$lib/features/feature-flag/useFeatureFlag";
  import type { PosterTagsProps } from "./_internal/PosterTagsProps.ts";

  const props: PosterTagsProps = $props();

  const variant = $derived(props.variant ?? "default");
  const full = $derived(props.variant === "full" ? props : undefined);

  const isWatched = $derived(props.isWatched ?? false);
  const isPartiallyWatched = $derived(props.isPartiallyWatched ?? false);
  const isDropped = $derived(props.isDropped ?? false);
  const isWatchlisted = $derived(props.isWatchlisted ?? false);
  const postCreditsCount = $derived(full?.postCreditsCount ?? 0);

  const { isEnabled } = useFeatureFlag();
  const isRewatchingEnabled = $derived(isEnabled(FeatureFlag.Rewatching));
  const showRewatching = $derived(
    (props.isRewatching ?? false) && $isRewatchingEnabled,
  );

  type ActiveTag =
    | "rewatching"
    | "dropped"
    | "watched"
    | "started"
    | "postCredits"
    | "watchlisted"
    | null;

  const active: ActiveTag = $derived.by(() => {
    if (showRewatching) return "rewatching";
    if (isDropped) return "dropped";
    if (isWatched) return "watched";
    if (isPartiallyWatched) return "started";
    if (postCreditsCount > 0) return "postCredits";
    if (isWatchlisted) return "watchlisted";
    return null;
  });
</script>

{#if active === "rewatching"}
  <RewatchingTag {variant} link={full?.seasonsLink} />
{:else if active === "dropped"}
  <DroppedTag {variant} i18n={full?.i18n} />
{:else if active === "watched"}
  <WatchedTag
    {variant}
    count={props.watchCount}
    i18n={full?.i18n}
    link={full?.historyLink}
    onclick={full?.onWatchCountClick}
  />
{:else if active === "started"}
  <StartedTag {variant} link={full?.seasonsLink} />
{:else if active === "postCredits"}
  <PostCreditsTag {variant} count={postCreditsCount} i18n={full?.i18n} />
{:else if active === "watchlisted"}
  <WatchlistedTag {variant} />
{/if}
