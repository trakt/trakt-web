<script lang="ts">
  import * as m from "$lib/features/i18n/messages.ts";

  import InfoTag from "$lib/components/media/tags/InfoTag.svelte";

  type WatchListProps = {
    status: "released" | "unreleased";
  };

  const { status }: WatchListProps = $props();
</script>

<div class="watchlist-tag">
  <InfoTag>
    {m.tag_text_movies()}
  </InfoTag>
  <InfoTag>
    {#if status === "released"}
      {m.tag_text_released()}
    {:else}
      {m.tag_text_unreleased()}
    {/if}
  </InfoTag>
</div>

<style>
  .watchlist-tag {
    display: flex;
    align-items: center;
    gap: var(--ni-4);
  }
</style>
