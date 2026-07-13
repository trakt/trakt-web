<script lang="ts">
  import * as m from "$lib/features/i18n/messages.ts";
  import type { Snippet } from "svelte";

  type QueuedIndicatorProps = {
    isQueued: boolean;
    children: Snippet;
  };

  const { isQueued, children }: QueuedIndicatorProps = $props();
</script>

<div class="trakt-queued-indicator" class:is-queued={isQueued}>
  {@render children()}
  {#if isQueued}
    <span class="queued-dot" role="status" aria-label={m.label_queued_action()}
    ></span>
  {/if}
</div>

<style lang="scss">
  .trakt-queued-indicator {
    position: relative;
    display: inline-flex;

    // A queued action disables its button. Chromium ignores `cursor` on a
    // disabled <button> and falls back to the ancestor's, so set it here to
    // cover the whole control (not just the icon, which inherits it).
    &.is-queued {
      cursor: not-allowed;
    }

    .queued-dot {
      position: absolute;
      inset-block-start: 0;
      inset-inline-end: 0;

      width: var(--ni-10);
      height: var(--ni-10);
      box-sizing: border-box;

      border-radius: 50%;
      background-color: var(--color-background-queued-tag);
      border: var(--border-thickness-xs) solid var(--color-background);

      pointer-events: none;
    }
  }
</style>
