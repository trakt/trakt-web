<script lang="ts">
  import type { SettingsHighlightCardProps } from "./SettingsHighlightCardProps.ts";

  const { icon, primary, secondary }: SettingsHighlightCardProps = $props();
</script>

<div class="trakt-settings-highlight-card">
  <span class="highlight-icon" aria-hidden="true">
    {@render icon()}
  </span>
  <div class="highlight-body">
    <p class="highlight-line">{@render primary()}</p>
    {#if secondary}
      <p class="highlight-line subtle">{@render secondary()}</p>
    {/if}
  </div>
</div>

<style lang="scss">
  .trakt-settings-highlight-card {
    display: flex;
    align-items: center;
    gap: var(--gap-m);

    padding: var(--ni-16) var(--ni-20);

    border-radius: var(--border-radius-l);
    background-image: linear-gradient(
      120deg,
      color-mix(
          in srgb,
          var(--color-link-active) 22%,
          var(--color-card-background)
        )
        0%,
      var(--color-card-background) 60%
    );
  }

  .highlight-icon {
    flex-shrink: 0;
  }

  .highlight-body {
    display: flex;
    flex-direction: column;
    gap: var(--ni-2);
  }

  .highlight-line {
    margin: 0;
  }

  .highlight-line.subtle {
    color: var(--color-text-secondary);
    font-size: var(--font-size-tag);
  }
</style>
