<script lang="ts">
  import CaretRightIcon from "$lib/components/icons/CaretRightIcon.svelte";
  import type { Snippet } from "svelte";

  type SettingsNavRowProps = {
    title: string;
    description?: string;
    value?: string;
    icon?: Snippet;
    danger?: boolean;
    href?: string;
    onclick?: () => void;
    disabled?: boolean;
  };

  const {
    title,
    description,
    value,
    icon,
    danger = false,
    href,
    onclick,
    disabled = false,
  }: SettingsNavRowProps = $props();
</script>

{#snippet rowContent()}
  {#if icon}
    <div class="row-icon-container" class:danger>
      {@render icon()}
    </div>
  {/if}

  <div class="row-body">
    <span class="row-title" class:danger>{title}</span>
    {#if description}
      <span class="row-description">{description}</span>
    {/if}
  </div>

  {#if value}
    <span class="row-value">{value}</span>
  {/if}

  <span class="row-caret" class:danger>
    <CaretRightIcon />
  </span>
{/snippet}

{#if href}
  <a class="settings-nav-row" class:danger {href}>
    {@render rowContent()}
  </a>
{:else}
  <button
    class="settings-nav-row"
    class:danger
    {onclick}
    {disabled}
  >
    {@render rowContent()}
  </button>
{/if}

<style lang="scss">
  @use "$style/scss/mixins/index" as *;

  .settings-nav-row {
    display: flex;
    align-items: center;
    gap: var(--gap-m);
    padding: var(--gap-s) var(--gap-m);
    min-height: var(--ni-64);
    width: 100%;
    text-align: left;
    background: transparent;
    border: none;
    cursor: pointer;
    text-decoration: none;
    transition: background var(--transition-increment) ease-in-out;

    @include for-mouse {
      &:hover:not([disabled]) {
        background: color-mix(in srgb, var(--color-foreground) 5%, transparent);
      }
    }

    &:active:not([disabled]) {
      background: color-mix(in srgb, var(--color-foreground) 8%, transparent);
    }

    &[disabled] {
      opacity: 0.5;
      cursor: not-allowed;
      pointer-events: none;
    }
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

    &.danger {
      background: color-mix(
        in srgb,
        var(--color-foreground-red) 15%,
        transparent
      );
      color: var(--color-foreground-red);
    }
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

    &.danger {
      color: var(--color-foreground-red);
    }
  }

  .row-description {
    font-size: var(--font-size-text-small);
    color: var(--color-text-secondary);
    line-height: 1.3;

    overflow: hidden;
    display: -webkit-box;
    -webkit-box-orient: vertical;
    -webkit-line-clamp: 2;
  }

  .row-value {
    flex-shrink: 0;
    font-size: var(--font-size-text-small);
    color: var(--color-text-secondary);
    white-space: nowrap;
    margin-right: var(--gap-xxs);
  }

  .row-caret {
    flex-shrink: 0;
    display: flex;
    align-items: center;
    opacity: 0.35;
    color: var(--color-text-secondary);

    &.danger {
      color: var(--color-foreground-red);
    }
  }
</style>
