<script lang="ts">
  import * as m from "$lib/features/i18n/messages.ts";
  import { useMedia, WellKnownMediaQuery } from "$lib/stores/css/useMedia";
  import { Tooltip } from "@svelte-plugins/tooltips";
  import StemTag from "../tags/StemTag.svelte";

  const isMouse = useMedia(WellKnownMediaQuery.mouse);
  const tooltipAction = $derived(isMouse ? "hover" : "click");
</script>

<Tooltip
  content={m.preview_description()}
  theme="preview-tooltip"
  hideOnClickOutside={true}
  action={tooltipAction}
  maxWidth={300}
>
  <div class="trakt-preview-badge">
    <StemTag
      --color-background-stem-tag={"var(--color-background-preview-tag)"}
      --color-text-stem-tag={"var(--color-text-preview-tag)"}
    >
      {m.preview()}
    </StemTag>
  </div>
</Tooltip>

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
