<script lang="ts">
  import Switch from "$lib/components/toggles/Switch.svelte";
  import type { Snippet } from "svelte";

  type SettingsToggleRowProps = {
    title: string;
    description?: string;
    label: string;
    checked: boolean;
    onclick: () => void;
    icon?: Snippet;
    disabled?: boolean;
  };

  const {
    title,
    description,
    label,
    checked,
    onclick,
    icon,
    disabled = false,
  }: SettingsToggleRowProps = $props();
</script>

<div class="settings-toggle-row">
  {#if icon}
    <div class="row-icon-container">
      {@render icon()}
    </div>
  {/if}

  <div class="row-body">
    <span class="row-title">{title}</span>
    {#if description}
      <span class="row-description">{description}</span>
    {/if}
  </div>

  <Switch
    {label}
    {checked}
    {onclick}
    {disabled}
    color="purple"
  />
</div>

<style lang="scss">
  .settings-toggle-row {
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

  .row-body {
    flex: 1;
    min-width: 0;
    display: flex;
    flex-direction: column;
    gap: var(--gap-xxs);
  }

  .row-title {
    font-size: var(--font-size-separator);
    color: var(--color-text-primary);
    line-height: 1.3;
  }

  .row-description {
    font-size: var(--font-size-text-small);
    color: var(--color-text-secondary);
    line-height: 1.3;
  }
</style>
