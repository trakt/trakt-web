<script lang="ts">
  import StemTag from "$lib/components/tags/StemTag.svelte";
  import type { TagIntl } from "./TagIntl";

  const {
    count,
    i18n,
  }: {
    count: number;
    i18n: TagIntl;
  } = $props();
</script>

<StemTag
  --color-background-stem-tag="var(--color-background-episode-count-tag)"
  --color-text-stem-tag="var(--color-text-episode-count-tag)"
>
  <p class="meta-info capitalize no-wrap">
    {i18n.toEpisodeCount(count)}
  </p>
</StemTag>
