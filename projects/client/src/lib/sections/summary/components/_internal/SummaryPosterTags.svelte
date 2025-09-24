<script lang="ts">
  import PostCreditsTag from "$lib/components/media/tags/PostCreditsTag.svelte";
  import { TagIntlProvider } from "$lib/components/media/tags/TagIntlProvider";
  import WatchCountTag from "./WatchCountTag.svelte";

  const {
    postCreditsCount,
    watchCount,
  }: { postCreditsCount: number; watchCount: number } = $props();
</script>

{#if postCreditsCount > 0 && watchCount === 0}
  <PostCreditsTag count={postCreditsCount} i18n={TagIntlProvider} />
{/if}

{#if watchCount > 0}
  <WatchCountTag count={watchCount} />
{/if}
