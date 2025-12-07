<script lang="ts">
  import * as m from "$lib/features/i18n/messages.ts";
  import { onMount } from "svelte";
  import { writable } from "svelte/store";
  import StemTag from "../tags/StemTag.svelte";
  import Tooltip from "../tooltip/Tooltip.svelte";

  const isMounted = writable(false);

  onMount(() => {
    isMounted.set(true);
  });
</script>

{#if $isMounted}
  <Tooltip content={m.tooltip_text_preview_feature()}>
    <div class="trakt-preview-badge">
      <StemTag
        --color-background-stem-tag="var(--color-background-preview-tag)"
        --color-foreground-stem-tag="var(--color-text-preview-tag)"
        text={m.tag_text_preview()}
      />
    </div>
  </Tooltip>
{/if}

<style>
  .trakt-preview-badge {
    user-select: none;
  }
</style>
