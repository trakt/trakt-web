<script lang="ts">
  import StemTag from "$lib/components/tags/StemTag.svelte";
  import type { TagIntl } from "./TagIntl";

  const { count, i18n }: { count: number; i18n: TagIntl } = $props();
</script>

<StemTag
  --color-background-stem-tag="var(--shade-10)"
  --color-foreground-stem-tag="var(--shade-920)"
>
  <p class="bold uppercase no-wrap">
    {i18n.postCredits(count)}
  </p>
</StemTag>
