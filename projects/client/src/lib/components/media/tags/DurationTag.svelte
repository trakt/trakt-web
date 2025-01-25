<script lang="ts">
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

<StemTag
  --color-background-stem-tag="var(--color-background-duration-tag)"
  --color-text-stem-tag="var(--color-text-duration-tag)"
>
  <p class="meta-info capitalize no-wrap">
    {i18n.toDuration(runtime)}
  </p>
</StemTag>
