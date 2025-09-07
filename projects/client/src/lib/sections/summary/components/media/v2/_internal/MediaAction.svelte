<script lang="ts">
  const {
    text,
    children,
    label,
    onclick,
    href,
    disabled = false,
    action: externalAction,
  }: {
    text: string;
    label: string;
    onclick?: () => void;
    href?: string;
    action?: (node: HTMLElement) => void;
    disabled?: boolean;
  } & ChildrenProps = $props();

  const action = (node: HTMLElement) => {
    if (!externalAction) {
      return;
    }

    return externalAction(node);
  };

  // TODO disabled state
</script>

{#snippet content()}
  <div class="trakt-media-action-content">
    {@render children()}
  </div>
  <span class="meta-info">{text}</span>
{/snippet}

{#if href}
  <a
    class="trakt-media-action"
    aria-label={label}
    {onclick}
    {href}
    data-disabled={disabled}
  >
    {@render content()}
  </a>
{:else}
  <button
    class="trakt-media-action"
    aria-label={label}
    {onclick}
    use:action
    data-disabled={disabled}
  >
    {@render content()}
  </button>
{/if}

<style>
  .trakt-media-action {
    all: unset;
    -webkit-tap-highlight-color: transparent;

    position: relative;

    display: flex;
    flex-direction: column;
    align-items: center;
    gap: var(--gap-micro);

    height: var(--ni-40);
    width: var(--ni-64);

    cursor: pointer;

    transform-origin: center;
    transition: var(--transition-increment) ease-in-out;
    transition-property: transform, color;

    &:hover {
      transform: scale(1.1);
      color: var(--purple-300);
    }

    &[data-disabled="true"] {
      pointer-events: none;
      cursor: not-allowed;

      color: var(--color-foreground-button-disabled);
    }

    :global(svg) {
      width: var(--ni-24);
      height: var(--ni-24);
    }

    .trakt-media-action-content {
      display: flex;
      align-items: center;

      height: var(--ni-28);
    }
  }
</style>
