<script lang="ts">
  import * as m from "$lib/features/i18n/messages.ts";
  import { BehaviorSubject } from "rxjs";
  import { onMount } from "svelte";
  import StemTag from "../tags/StemTag.svelte";
  import Tooltip from "../tooltip/Tooltip.svelte";

  const isMounted = new BehaviorSubject(false);

  onMount(() => {
    isMounted.next(true);
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
