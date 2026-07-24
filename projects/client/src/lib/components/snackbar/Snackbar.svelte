<script lang="ts">
  import AutoCloseButton from "$lib/components/buttons/AutoCloseButton.svelte";
  import Button from "$lib/components/buttons/Button.svelte";
  import MessageWithBold from "$lib/components/text/MessageWithBold.svelte";
  import { m } from "$lib/features/i18n/messages.ts";
  import { onMount } from "svelte";
  import { backOut, cubicIn } from "svelte/easing";
  import { fly } from "svelte/transition";

  type SnackbarAction = {
    text: string;
    label: string;
    onAction: () => void;
    /**
     * `outline` renders a purple outlined pill (confirmation toasts, e.g.
     * "Undo" / "Change list"); `button` (default) is the filled call-to-action.
     */
    style?: "outline" | "button";
  };

  type SnackbarProps = {
    open: boolean;
    onDismiss: () => void;
    title?: string;
    message: string;
    action?: SnackbarAction;
    variant?: "default" | "error";
    dismissDurationMs?: number;
  };

  const {
    open,
    onDismiss,
    title,
    message,
    action,
    variant = "default",
    dismissDurationMs,
  }: SnackbarProps = $props();

  let navbarHeight = $state(0);

  // A cute bottom entrance: slide up from below the screen with a soft
  // overshoot on the way in, then drop back down on the way out. Collapses to
  // a quick fade when the viewer prefers reduced motion.
  const prefersReducedMotion =
    globalThis.matchMedia?.("(prefers-reduced-motion: reduce)")?.matches ??
      false;

  const enterTransition = prefersReducedMotion
    ? { y: 0, duration: 120 }
    : { y: 150, duration: 400, easing: backOut };

  const exitTransition = prefersReducedMotion
    ? { y: 0, duration: 120 }
    : { y: 150, duration: 250, easing: cubicIn };

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
    {#if action.style === "outline"}
      <Button
        style="outline"
        size="small"
        color="purple"
        label={action.label}
        onclick={action.onAction}
      >
        {action.text}
      </Button>
    {:else}
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
    in:fly|global={enterTransition}
    out:fly|global={exitTransition}
  >
    {#if title}
      <span class="bold">{title}</span>
    {/if}

    <div class="snackbar-content">
      <p class="snackbar-message"><MessageWithBold {message} /></p>
      {@render actionButton()}
      <AutoCloseButton
        onclick={onDismiss}
        label={m.button_label_close()}
        durationMs={dismissDurationMs}
      />
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
    // The floating background can melt into a dark page, so a hairline border
    // plus the raised shadow give the toast a defined, lifted edge.
    border: var(--ni-1) solid var(--color-border);
    border-radius: var(--border-radius-l);
    box-shadow: var(--shadow-raised);
    backdrop-filter: blur(var(--ni-16));

    margin-bottom: var(--ni-24);

    .snackbar-content {
      display: flex;
      align-items: center;
      gap: var(--ni-12);
    }

    // Toast action pill: a soft 1px purple stroke with plain foreground text
    // (purple-on-purple read as garish). The stroke token adapts per theme so
    // it stays crisp on both the light and dark toast surface. Scoped here on
    // purpose; the shared outline Button still needs a global restyle (tracked
    // separately).
    :global(.trakt-button[data-style="outline"]) {
      color: var(--color-foreground);
      box-shadow: inset 0 0 0 var(--ni-1) var(--color-snackbar-action-stroke);
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
