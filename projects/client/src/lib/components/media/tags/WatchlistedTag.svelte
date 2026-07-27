<script lang="ts">
  import BookmarkIcon from "$lib/components/icons/BookmarkIcon.svelte";
  import IndicatorTag from "$lib/components/media/tags/IndicatorTag.svelte";
  import StemLinkTag from "$lib/components/media/tags/StemLinkTag.svelte";
  import * as m from "$lib/features/i18n/messages.ts";

  const { variant = "default" }: { variant?: "default" | "full" } = $props();
</script>

{#if variant === "full"}
  <StemLinkTag label={m.tag_text_watchlisted()}>
    {#snippet icon()}
      <BookmarkIcon state="added" />
    {/snippet}
  </StemLinkTag>
{:else}
  <IndicatorTag indicator="watchlisted" />
{/if}
