<script lang="ts">
  import StemTag from "$lib/components/tags/StemTag.svelte";
  import type { TagIntl } from "./TagIntl";

  const { plays, i18n }: { plays: number; i18n: TagIntl } = $props();
</script>

<StemTag
  --color-background-stem-tag="var(--color-background-plays-tag)"
  --color-text-stem-tag="var(--color-text-plays-tag)"
>
  <p class="meta-info uppercase no-wrap">
    {i18n.toPlayCount(plays)}
  </p>
</StemTag>
