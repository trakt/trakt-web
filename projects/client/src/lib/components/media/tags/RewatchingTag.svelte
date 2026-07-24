<script lang="ts">
  import FastRewindIcon from "$lib/components/icons/FastRewindIcon.svelte";
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
  <StemLinkTag label={m.tag_text_rewatching()} {link}>
    {#snippet icon()}
      <FastRewindIcon />
    {/snippet}
  </StemLinkTag>
{:else}
  <IndicatorTag>
    <FastRewindIcon />
  </IndicatorTag>
{/if}
