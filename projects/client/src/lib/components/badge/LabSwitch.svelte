<script lang="ts">
  import { clickOutside } from "$lib/utils/actions/clickOutside";
  import { Tooltip } from "flowbite-svelte";
  import { writable } from "svelte/store";
  import Switch from "../toggles/Switch.svelte";

  type LabSwitchProps = {
    tooltip: string;
    label: string;
    enabled: boolean;
  } & HTMLElementProps;

  const { tooltip, label, enabled, onclick, ...props }: LabSwitchProps =
    $props();

  // FIXME: settle on a tooltip component (&fix them), or create our own
  const isClicked = writable(false);
  const isTooltipVisible = $derived(writable(enabled && $isClicked));
</script>

<div
  class="trakt-lab-switch"
  use:clickOutside
  onclickoutside={() => isTooltipVisible.set(false)}
>
  <Switch
    {label}
    checked={enabled}
    innerText="Lab"
    color="orange"
    onclick={(e) => {
      isClicked.set(true);
      onclick?.(e);
    }}
    {...props}
  />
  <Tooltip
    isOpen={$isTooltipVisible}
    placement="bottom"
    trigger="click"
    type={undefined}
    class="trakt-tooltip"
    arrow={false}
  >
    <p class="small">{tooltip}</p>
  </Tooltip>
</div>

<style>
  .trakt-lab-switch {
    :global(.trakt-tooltip) {
      all: unset;

      z-index: var(--layer-overlay);
      max-width: var(--ni-276);

      background-color: var(--color-tooltip-background);
      color: var(--color-tooltip-text);

      border-radius: var(--border-radius-s);
      padding: var(--ni-8);
    }
  }
</style>
