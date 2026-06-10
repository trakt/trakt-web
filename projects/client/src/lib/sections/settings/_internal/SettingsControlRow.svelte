<script lang="ts">
  import type { Snippet } from "svelte";

  type SettingsControlRowProps = {
    title: string;
    icon?: Snippet;
    children: Snippet;
  };

  const { title, icon, children }: SettingsControlRowProps = $props();
</script>

<div class="settings-control-row">
  {#if icon}
    <div class="row-icon-container">
      {@render icon()}
    </div>
  {/if}

  <span class="row-title">{title}</span>

  <div class="row-control">
    {@render children()}
  </div>
</div>

<style lang="scss">
  .settings-control-row {
    display: flex;
    align-items: center;
    gap: var(--gap-m);
    padding: var(--gap-s) var(--gap-m);
    min-height: var(--ni-64);
  }

  .row-icon-container {
    flex-shrink: 0;
    width: var(--ni-36);
    height: var(--ni-36);
    border-radius: var(--border-radius-m);
    background: color-mix(in srgb, var(--purple-500) 15%, transparent);
    color: var(--purple-500);
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .row-title {
    flex: 1;
    font-size: var(--font-size-separator);
    color: var(--color-text-primary);
    line-height: 1.3;
  }

  .row-control {
    flex-shrink: 0;
  }
</style>
