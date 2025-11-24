<script lang="ts">
  import StemTag from "$lib/components/tags/StemTag.svelte";
  import type { TagIntl } from "./TagIntl";

  const { plays, i18n }: { plays: number; i18n: TagIntl } = $props();
</script>

<StemTag>
  <p class="bold uppercase no-wrap">
    {i18n.toPlayCount(plays)}
  </p>
</StemTag>
