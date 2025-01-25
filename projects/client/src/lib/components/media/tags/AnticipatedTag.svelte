<script lang="ts">
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

<StemTag
  --color-background-stem-tag="var(--color-background-listing-tag)"
  --color-text-stem-tag="var(--color-text-listing-tag)"
>
  <p class="meta-info capitalize no-wrap">
    {i18n.toAnticipatedCount(score)}
  </p>
</StemTag>
