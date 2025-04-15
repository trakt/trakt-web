<script lang="ts">
  import StemTag from "$lib/components/tags/StemTag.svelte";
  import type { TagIntl } from "./TagIntl";

  const {
    watchers,
    i18n,
  }: {
    watchers: number;
    i18n: TagIntl;
  } = $props();
</script>

<StemTag>
  <p class="meta-info capitalize no-wrap">
    {i18n.toWatcherCount(watchers)}
  </p>
</StemTag>
