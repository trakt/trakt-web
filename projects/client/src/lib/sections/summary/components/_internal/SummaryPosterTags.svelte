<script lang="ts">
  import PostCreditsTag from "$lib/components/media/tags/PostCreditsTag.svelte";
  import { TagIntlProvider } from "$lib/components/media/tags/TagIntlProvider";
  import DroppedTag from "./DroppedTag.svelte";
  import StartedTag from "./StartedTag.svelte";
  import WatchCountTag from "./WatchCountTag.svelte";

  type SummaryPosterTagsProps = {
    postCreditsCount: number;
    watchCount: number;
    isDropped?: boolean;
    isStarted?: boolean;
  };

  const {
    postCreditsCount,
    watchCount,
    isDropped,
    isStarted,
  }: SummaryPosterTagsProps = $props();
</script>

{#if isDropped}
  <DroppedTag i18n={TagIntlProvider} />
{/if}

{#if postCreditsCount > 0 && watchCount === 0}
  <PostCreditsTag count={postCreditsCount} i18n={TagIntlProvider} />
{/if}

{#if watchCount > 0}
  <WatchCountTag count={watchCount} i18n={TagIntlProvider} />
{/if}

{#if isStarted && watchCount === 0 && !isDropped}
  <StartedTag />
{/if}
