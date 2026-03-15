<script lang="ts">
  import DropIcon from "$lib/components/icons/DropIcon.svelte";
  import type { TagIntl } from "$lib/components/media/tags/TagIntl";
  import StemTag from "$lib/components/tags/StemTag.svelte";

  const { i18n }: { i18n: TagIntl } = $props();
</script>

<StemTag
  --color-background-stem-tag="var(--shade-10)"
  --color-foreground-stem-tag="var(--shade-920)"
>
  {#snippet icon()}
    <DropIcon />
  {/snippet}

  <p class="bold uppercase no-wrap">{i18n.droppedLabel()}</p>
</StemTag>
