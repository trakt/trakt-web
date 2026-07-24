<script lang="ts">
  import DropIcon from "$lib/components/icons/DropIcon.svelte";
  import type { TagIntl } from "$lib/components/media/tags/TagIntl";
  import StemTag from "$lib/components/tags/StemTag.svelte";

  const { i18n }: { i18n: TagIntl } = $props();
</script>

<StemTag
  --color-background-stem-tag="var(--color-background-indicator-tag)"
  --color-foreground-stem-tag="var(--color-text-indicator-tag)"
>
  {#snippet icon()}
    <DropIcon />
  {/snippet}

  <p class="bold uppercase no-wrap">{i18n.droppedLabel()}</p>
</StemTag>
