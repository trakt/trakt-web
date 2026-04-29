<script lang="ts">
  import AutoCloseButton from "$lib/components/buttons/AutoCloseButton.svelte";
  import Button from "$lib/components/buttons/Button.svelte";
  import Popover from "$lib/components/popover/Popover.svelte";
  import { m } from "$lib/features/i18n/messages.ts";
  import RenderFor from "$lib/guards/RenderFor.svelte";
  import type { Snippet } from "svelte";
  import { onMount } from "svelte";
  import { fly } from "svelte/transition";

  type SnackbarProps = {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    onDismiss: () => void;
    onAction: () => void;
    title: string;
    message: string;
    actionLabel: string;
    actionText: string;
    children?: Snippet;
    anchor?: HTMLElement | Nil;
  };

  const {
    open,
    onOpenChange,
    onDismiss,
    onAction,
    title,
    message,
    actionLabel,
    actionText,
    children,
    anchor,
  }: SnackbarProps = $props();

  let navbarHeight = $state(0);

  onMount(() => {
    const navbar = document.querySelector(".trakt-mobile-navbar");
    if (!navbar) return;

    const update = () => {
      navbarHeight = navbar.getBoundingClientRect().height;
    };

    update();

    const observer = new ResizeObserver(update);
    observer.observe(navbar);

    return () => observer.disconnect();
  });
</script>

{#snippet actionButton()}
  <Button
    size="small"
    variant="primary"
    color="purple"
    label={actionLabel}
    onclick={onAction}
  >
    {actionText}
  </Button>
{/snippet}

<RenderFor audience="all" device={["mobile", "tablet-sm"]}>
  {@render children?.()}

  {#if open}
    <div
      class="trakt-snackbar"
      role="status"
      aria-live="polite"
      aria-atomic="true"
      style="bottom: {navbarHeight + 8}px;"
      transition:fly={{ y: 20, duration: 200 }}
    >
      <p class="snackbar-message">{message}</p>
      {@render actionButton()}
      <AutoCloseButton onclick={onDismiss} label={m.button_label_close()} />
    </div>
  {/if}
</RenderFor>

{#snippet popoverContent()}
  <div class="snackbar-popover" role="status" aria-live="polite">
    <div class="snackbar-popover-header">
      <span class="bold title">{title}</span>
      <AutoCloseButton onclick={onDismiss} label={m.button_label_close()} />
    </div>
    <p>{message}</p>
    <div class="snackbar-popover-actions">
      <Button
        size="small"
        color="default"
        label={m.button_label_cancel()}
        onclick={onDismiss}
      >
        {m.button_text_cancel()}
      </Button>
      {@render actionButton()}
    </div>
  </div>
{/snippet}

<RenderFor audience="all" device={["tablet-lg", "desktop"]}>
  {#if anchor}
    <Popover
      {open}
      {onOpenChange}
      customAnchor={anchor}
      content={popoverContent}
    />
  {:else}
    <Popover {open} {onOpenChange} content={popoverContent}>
      {@render children?.()}
    </Popover>
  {/if}
</RenderFor>

<style lang="scss">
  .trakt-snackbar {
    position: fixed;
    left: 50%;
    transform: translateX(-50%);
    z-index: var(--layer-top);

    width: min(var(--ni-480), calc(100dvw - var(--ni-32)));
    padding: var(--ni-12) var(--ni-16);
    box-sizing: border-box;

    display: flex;
    align-items: center;
    gap: var(--ni-12);

    background-color: var(--color-modal-background);
    border-radius: var(--border-radius-l);
    box-shadow: var(--shadow-raised);
    backdrop-filter: blur(var(--ni-16));
  }

  .snackbar-message {
    flex: 1;
  }

  .snackbar-popover {
    display: flex;
    flex-direction: column;
    gap: var(--ni-12);

    min-width: var(--ni-240);
    padding: var(--ni-16);

    background-color: var(--color-modal-background);
    border-radius: var(--border-radius-l);
    box-shadow: var(--shadow-menu);

    animation: fade-in var(--transition-increment) ease-out forwards;
  }

  .snackbar-popover-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: var(--ni-8);
  }

  .snackbar-popover-actions {
    display: flex;
    justify-content: flex-end;
    gap: var(--ni-8);
  }
</style>
