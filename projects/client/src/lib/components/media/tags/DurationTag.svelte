<script lang="ts">
  import ClockIcon from "$lib/components/icons/ClockIcon.svelte";
  import StemTag from "$lib/components/tags/StemTag.svelte";
  import type { TagIntl } from "./TagIntl";

  const {
    runtime,
    i18n,
  }: {
    runtime: number;
    i18n: TagIntl;
  } = $props();
</script>

<StemTag>
  {#snippet icon()}
    <ClockIcon />
  {/snippet}
  <p class="meta-info capitalize no-wrap">
    {i18n.toDuration(runtime)}
  </p>
</StemTag>
