<script lang="ts">
  import type { CollapseIconProps } from "./models/CollapseIconProps";

  const CIRCLED_PATH =
    "m480-360 160-160H320l160 160Zm0 280q-83 0-156-31.5T197-197q-54-54-85.5-127T80-480q0-83 31.5-156T197-763q54-54 127-85.5T480-880q83 0 156 31.5T763-763q54 54 85.5 127T880-480q0 83-31.5 156T763-197q-54 54-127 85.5T480-80Zm0-80q134 0 227-93t93-227q0-134-93-227t-227-93q-134 0-227 93t-93 227q0 134 93 227t227 93Zm0-320Z";
  const BARE_PATH = "M480-360 280-560h400L480-360Z";

  const { state, size = 24, variant = "circled" }: CollapseIconProps =
    $props();

  const path = $derived(variant === "bare" ? BARE_PATH : CIRCLED_PATH);
</script>

<svg
  class="trakt-collapse-icon"
  class:is-collapsed={state === "collapsed"}
  xmlns="http://www.w3.org/2000/svg"
  height="{size}px"
  viewBox="0 -960 960 960"
  width="{size}px"
  fill="currentColor"
>
  <path d={path} />
</svg>

<style>
  .trakt-collapse-icon {
    transition: transform var(--transition-increment) ease-in-out;
    transform: rotate(-180deg);
  }

  .trakt-collapse-icon.is-collapsed {
    transform: rotate(0deg);
  }
</style>
