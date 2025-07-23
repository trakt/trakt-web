<script lang="ts">
  import AnticipatedIcon from "$lib/components/icons/AnticipatedIcon.svelte";
  import StemTag from "$lib/components/tags/StemTag.svelte";
  import type { TagIntl } from "./TagIntl";

  const {
    score,
    i18n,
  }: {
    score: number;
    i18n: TagIntl;
  } = $props();
</script>

<StemTag>
  {#snippet icon()}
    <AnticipatedIcon />
  {/snippet}
  <p class="meta-info capitalize no-wrap">
    {i18n.toAnticipatedCount(score)}
  </p>
</StemTag>
