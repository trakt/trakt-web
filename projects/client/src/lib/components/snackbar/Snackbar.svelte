<script lang="ts">
  import AutoCloseButton from "$lib/components/buttons/AutoCloseButton.svelte";
  import Button from "$lib/components/buttons/Button.svelte";
  import { m } from "$lib/features/i18n/messages.ts";
  import { onMount } from "svelte";
  import { fly } from "svelte/transition";

  type SnackbarAction = {
    text: string;
    label: string;
    onAction: () => void;
  };

  type SnackbarProps = {
    open: boolean;
    onDismiss: () => void;
    title?: string;
    message: string;
    action?: SnackbarAction;
    variant?: "default" | "error";
  };

  const {
    open,
    onDismiss,
    title,
    message,
    action,
    variant = "default",
  }: SnackbarProps = $props();

  let navbarHeight = $state(0);

  onMount(() => {
    let currentNavbar: Element | null = null;
    let resizeObserver: ResizeObserver | undefined;

    const updateHeight = () => {
      navbarHeight = currentNavbar
        ? currentNavbar.getBoundingClientRect().height
        : 0;
    };

    const checkNavbar = () => {
      const navbar = document.querySelector(".trakt-mobile-navbar");
      if (navbar !== currentNavbar) {
        resizeObserver?.disconnect();
        currentNavbar = navbar;

        if (navbar) {
          resizeObserver = new ResizeObserver(updateHeight);
          resizeObserver.observe(navbar);
        }
        updateHeight();
      }
    };

    checkNavbar();

    const mutationObserver = new MutationObserver(checkNavbar);
    mutationObserver.observe(document.body, { childList: true, subtree: true });

    return () => {
      mutationObserver.disconnect();
      resizeObserver?.disconnect();
    };
  });
</script>

{#snippet actionButton()}
  {#if action}
    <Button
      size="small"
      variant="primary"
      color="purple"
      label={action.label}
      onclick={action.onAction}
    >
      {action.text}
    </Button>
  {/if}
{/snippet}

{#if open}
  <div
    class="trakt-snackbar"
    role="status"
    aria-live="polite"
    aria-atomic="true"
    style="bottom: {navbarHeight}px;"
    data-variant={variant}
    transition:fly={{ y: 20, duration: 200 }}
  >
    {#if title}
      <span class="bold">{title}</span>
    {/if}

    <div class="snackbar-content">
      <p class="snackbar-message">{message}</p>
      {@render actionButton()}
      <AutoCloseButton onclick={onDismiss} label={m.button_label_close()} />
    </div>
  </div>
{/if}

<style lang="scss">
  @use "$style/scss/mixins/index" as *;

  .trakt-snackbar {
    position: fixed;
    left: 50%;
    transform: translateX(-50%);
    z-index: var(--layer-top);

    width: min(var(--ni-480), calc(100dvw - var(--ni-32)));
    padding: var(--ni-12) var(--ni-16);
    box-sizing: border-box;

    display: flex;
    flex-direction: column;
    gap: var(--gap-micro);

    background-color: var(--color-modal-background);
    border-radius: var(--border-radius-l);
    box-shadow: var(--shadow-raised);
    backdrop-filter: blur(var(--ni-16));

    margin-bottom: var(--ni-24);

    .snackbar-content {
      display: flex;
      align-items: center;
      gap: var(--ni-12);
    }

    &[data-variant="error"] {
      border: var(--ni-1) solid var(--red-500);
    }

    @include for-tablet-sm-and-below {
      margin-bottom: var(--ni-8);
    }
  }

  .snackbar-message {
    flex: 1;
  }
</style>
