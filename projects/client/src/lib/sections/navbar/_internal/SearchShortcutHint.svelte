<script lang="ts">
  import { isApplePlatform } from "$lib/utils/devices/isApplePlatform";
  import { onMount } from "svelte";

  // Platform is only known in the browser; render nothing until mounted so
  // SSR output never shows the wrong modifier.
  let modifier = $state<string | null>(null);

  onMount(() => {
    modifier = isApplePlatform(navigator.platform) ? "⌘" : "Ctrl";
  });
</script>

{#if modifier}
  <span class="trakt-search-shortcut-hint" aria-hidden="true">
    <kbd>{modifier}</kbd><kbd>K</kbd>
  </span>
{/if}

<style lang="scss">
  @use "$style/scss/mixins/index" as *;

  .trakt-search-shortcut-hint {
    display: inline-flex;
    align-items: center;
    gap: var(--ni-2);

    color: var(--color-text-secondary);

    @include for-touch {
      display: none;
    }

    kbd {
      display: inline-flex;
      align-items: center;
      justify-content: center;

      box-sizing: border-box;
      min-width: var(--ni-14);
      height: var(--ni-14);
      line-height: 1;

      padding-inline: var(--ni-2);
      border-radius: var(--border-radius-xs);
      background: color-mix(in srgb, var(--color-text-primary) 10%, transparent);
      font-family: inherit;
      font-size: var(--font-size-tag);
    }
  }
</style>
