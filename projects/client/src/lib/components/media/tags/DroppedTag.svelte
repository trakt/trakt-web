<script lang="ts">
  import DropIcon from "$lib/components/icons/DropIcon.svelte";
  import IndicatorTag from "$lib/components/media/tags/IndicatorTag.svelte";
  import StemLinkTag from "$lib/components/media/tags/StemLinkTag.svelte";
  import type { TagIntl } from "$lib/components/media/tags/TagIntl.ts";
  import { TagIntlProvider } from "$lib/components/media/tags/TagIntlProvider.ts";

  const {
    variant = "default",
    i18n = TagIntlProvider,
  }: {
    variant?: "default" | "full";
    i18n?: TagIntl;
  } = $props();
</script>

{#if variant === "full"}
  <StemLinkTag label={i18n.droppedLabel()}>
    {#snippet icon()}
      <DropIcon />
    {/snippet}
  </StemLinkTag>
{:else}
  <IndicatorTag>
    <DropIcon />
  </IndicatorTag>
{/if}
