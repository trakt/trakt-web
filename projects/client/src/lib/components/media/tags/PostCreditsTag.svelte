<script lang="ts">
  import StemTag from "$lib/components/tags/StemTag.svelte";
  import type { TagIntl } from "./TagIntl";

  const { count, i18n }: { count: number; i18n: TagIntl } = $props();
</script>

<StemTag
  --color-background-stem-tag="var(--color-background-indicator-tag)"
  --color-foreground-stem-tag="var(--color-text-indicator-tag)"
>
  <p class="bold uppercase no-wrap">
    {i18n.postCredits(count)}
  </p>
</StemTag>
