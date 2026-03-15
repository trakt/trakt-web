<script lang="ts">
  import PostCreditsTag from "$lib/components/media/tags/PostCreditsTag.svelte";
  import { TagIntlProvider } from "$lib/components/media/tags/TagIntlProvider";
  import DroppedTag from "./DroppedTag.svelte";
  import WatchCountTag from "./WatchCountTag.svelte";

  const {
    postCreditsCount,
    watchCount,
    isDropped,
  }: { postCreditsCount: number; watchCount: number; isDropped?: boolean } =
    $props();
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
