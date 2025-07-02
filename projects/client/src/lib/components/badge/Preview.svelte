<script lang="ts">
  import * as m from "$lib/features/i18n/messages.ts";
  import { useMedia, WellKnownMediaQuery } from "$lib/stores/css/useMedia";
  import { Tooltip } from "@svelte-plugins/tooltips";
  import { onMount } from "svelte";
  import { writable } from "svelte/store";
  import StemTag from "../tags/StemTag.svelte";

  const isMouse = useMedia(WellKnownMediaQuery.mouse);
  const tooltipAction = $derived(isMouse ? "hover" : "click");

  const isMounted = writable(false);

  onMount(() => {
    isMounted.set(true);
  });
</script>

{#if $isMounted}
  <Tooltip
    content={m.tooltip_text_preview_feature()}
    theme="preview-tooltip"
    hideOnClickOutside={true}
    action={tooltipAction}
    maxWidth={300}
  >
    <div class="trakt-preview-badge">
      <StemTag
        --color-background-stem-tag={"var(--color-background-preview-tag)"}
        --color-foreground-stem-tag={"var(--color-text-preview-tag)"}
        text={m.tag_text_preview()}
      />
    </div>
  </Tooltip>
{/if}

<style>
  .trakt-preview-badge {
    user-select: none;
  }

  :global(.preview-tooltip) {
    --tooltip-z-index: var(--layer-overlay);

    --tooltip-background-color: var(--color-tooltip-background);
    --tooltip-color: var(--color-tooltip-text);

    --tooltip-border-radius: var(--border-radius-s);
    --tooltip-padding: var(--ni-8);

    --tooltip-font-size: var(--ni-12);
    --tooltip-font-weight: 400;
    --tooltip-font-family: initial;

    &:not(.show) {
      display: none;
    }
  }
</style>
