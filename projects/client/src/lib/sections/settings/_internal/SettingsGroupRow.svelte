<script lang="ts">
  import CaretRightIcon from "$lib/components/icons/CaretRightIcon.svelte";
  import type { Snippet } from "svelte";

  type CommonRowProps = {
    title: string;
    description?: string;
    icon?: Snippet;
    tag?: Snippet;
  };

  type ButtonRowProps = {
    variant: "button";
    label: string;
    onclick: () => void;
    disabled?: boolean;
    value?: string;
  };

  type LinkRowProps = {
    variant: "link";
    href: string;
  };

  type CustomRowProps = {
    variant: "custom";
  } & ChildrenProps;

  type SettingsGroupRowProps = CommonRowProps &
    (ButtonRowProps | LinkRowProps | CustomRowProps);

  const { title, description, icon, tag, ...rest }: SettingsGroupRowProps =
    $props();
</script>

{#snippet rowContent()}
  {#if icon}
    <div class="row-icon-container">
      {@render icon()}
    </div>
  {/if}

  <div class="row-body">
    <div class="row-title-line">
      <span class="row-title">{title}</span>
      {#if tag}
        {@render tag()}
      {/if}
    </div>
    {#if description}
      <span class="row-description secondary small">{description}</span>
    {/if}
  </div>

  {#if rest.variant === "custom"}
    {@render rest.children()}
  {:else if rest.variant === "button" || rest.variant === "link"}
    {#if rest.variant === "button" && rest.value}
      <span class="row-value secondary small ellipsis">{rest.value}</span>
    {/if}

    <span class="row-caret">
      <CaretRightIcon />
    </span>
  {/if}
{/snippet}

{#if rest.variant === "link"}
  <a class="trakt-settings-group-row" href={rest.href}>
    {@render rowContent()}
  </a>
{:else if rest.variant === "button"}
  <button
    class="trakt-settings-group-row"
    onclick={rest.onclick}
    disabled={rest.disabled}
    aria-label={rest.label}
    type="button"
  >
    {@render rowContent()}
  </button>
{:else}
  <div class="trakt-settings-group-row">
    {@render rowContent()}
  </div>
{/if}

<style lang="scss">
  @use "$style/scss/mixins/index" as *;

  .trakt-settings-group-row {
    display: flex;
    align-items: center;
    gap: var(--gap-m);
    padding: var(--gap-s) var(--gap-m);
    min-height: var(--ni-64);
    width: 100%;
    box-sizing: border-box;
    text-align: start;
    background: transparent;
    border: none;
    text-decoration: none;

    &:is(a, button) {
      cursor: pointer;
      -webkit-tap-highlight-color: transparent;

      transition: background var(--transition-increment) ease-in-out;

      @include for-mouse {
        &:hover:not([disabled]) {
          background: color-mix(
            in srgb,
            var(--color-foreground) 5%,
            transparent
          );
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

    :global(svg) {
      width: var(--ni-20);
      height: var(--ni-20);
    }
  }

  .row-body {
    flex: 1;
    display: flex;
    flex-direction: column;
    gap: var(--gap-xxs);
  }

  .row-title-line {
    display: flex;
    align-items: center;
    gap: var(--gap-s);
  }

  .row-title {
    color: var(--color-text-primary);
    line-height: 1.3;
  }

  .row-description {
    line-height: 1.3;

    overflow: hidden;
    display: -webkit-box;
    -webkit-box-orient: vertical;

    line-clamp: 2;
    -webkit-line-clamp: 2;
  }

  .row-value {
    min-width: 0;
    margin-inline-end: var(--gap-xxs);
  }

  .row-caret {
    flex-shrink: 0;
    display: flex;
    align-items: center;
    opacity: 0.35;
    color: var(--color-text-secondary);
  }
</style>
