<script lang="ts">
  import TrackIcon from "$lib/components/icons/TrackIcon.svelte";
  import type { DrawerLinkProps } from "$lib/components/media/tags/DrawerLinkProps.ts";
  import IndicatorTag from "$lib/components/media/tags/IndicatorTag.svelte";
  import StemLinkTag from "$lib/components/media/tags/StemLinkTag.svelte";
  import * as m from "$lib/features/i18n/messages.ts";

  const {
    variant = "default",
    link,
  }: {
    variant?: "default" | "full";
    link?: DrawerLinkProps;
  } = $props();
</script>

{#if variant === "full"}
  <StemLinkTag label={m.tag_text_started()} {link}>
    {#snippet icon()}
      <TrackIcon />
    {/snippet}
  </StemLinkTag>
{:else}
  <IndicatorTag variant="partial">
    <TrackIcon />
  </IndicatorTag>
{/if}
