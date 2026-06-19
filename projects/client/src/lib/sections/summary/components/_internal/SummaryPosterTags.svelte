<script lang="ts">
  import PostCreditsTag from "$lib/components/media/tags/PostCreditsTag.svelte";
  import { TagIntlProvider } from "$lib/components/media/tags/TagIntlProvider";
  import { FeatureFlag } from "$lib/features/feature-flag/models/FeatureFlag";
  import { useFeatureFlag } from "$lib/features/feature-flag/useFeatureFlag";
  import DroppedTag from "./DroppedTag.svelte";
  import RewatchingTag from "./RewatchingTag.svelte";
  import StartedTag from "./StartedTag.svelte";
  import WatchCountTag from "./WatchCountTag.svelte";

  type SummaryPosterTagsProps = {
    postCreditsCount: number;
    watchCount: number;
    isDropped?: boolean;
    isStarted?: boolean;
    isRewatching?: boolean;
  };

  const {
    postCreditsCount,
    watchCount,
    isDropped,
    isStarted,
    isRewatching,
  }: SummaryPosterTagsProps = $props();

  const { isEnabled } = useFeatureFlag();
  const isRewatchingFeatureEnabled = $derived(
    isEnabled(FeatureFlag.Rewatching),
  );
  const showRewatching = $derived(isRewatching && $isRewatchingFeatureEnabled);
</script>

{#if isDropped}
  <DroppedTag i18n={TagIntlProvider} />
{/if}

{#if showRewatching}
  <RewatchingTag />
{:else if postCreditsCount > 0 && watchCount === 0}
  <PostCreditsTag count={postCreditsCount} i18n={TagIntlProvider} />
{/if}

{#if !showRewatching && watchCount > 0}
  <WatchCountTag count={watchCount} i18n={TagIntlProvider} />
{/if}

{#if !showRewatching && isStarted && watchCount === 0 && !isDropped}
  <StartedTag />
{/if}
