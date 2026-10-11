<script lang="ts">
  import Button from "$lib/components/buttons/Button.svelte";
  import CloseIcon from "$lib/components/icons/CloseIcon.svelte";
  import * as m from "$lib/features/i18n/messages.ts";
  import { useMobileNavbarHeight } from "$lib/sections/navbar/useMobileNavbarHeight.ts";
  import { useMedia, WellKnownMediaQuery } from "$lib/stores/css/useMedia";
  import { UrlBuilder } from "$lib/utils/url/UrlBuilder.ts";
  import { fade } from "svelte/transition";
  import NudgePosters from "./NudgePosters.svelte";
  import { toNudgeMessage } from "./toNudgeMessage.ts";

  const { count, onDismiss }: { count: number; onDismiss: () => void } =
    $props();

  const isMobile = useMedia(WellKnownMediaQuery.mobile);
  const prefersReducedMotion = useMedia(WellKnownMediaQuery.reducedMotion);
  const { height: navbarHeight } = useMobileNavbarHeight();

  const message = $derived(toNudgeMessage({ count, isMobile: $isMobile }));
</script>

<div
  class="trakt-smart-list-nudge-pill"
  style="--navbar-height: {$navbarHeight}px"
  in:fade|global={{ duration: $prefersReducedMotion ? 0 : 200 }}
>
  {#if !$isMobile}
    <NudgePosters />
  {/if}

  <p class="nudge-message ellipsis">{message}</p>

  <div class="nudge-cta">
    <Button
      href={UrlBuilder.lists.user("me")}
      label={m.button_label_show_convertible_lists()}
      variant="secondary"
      style="ghost"
      color="purple"
      size="small"
    >
      {m.button_text_show_me()}
    </Button>
  </div>

  <button
    class="nudge-close"
    type="button"
    aria-label={m.button_label_close()}
    onclick={onDismiss}
  >
    <CloseIcon />
  </button>
</div>

<style lang="scss">
  @use "$style/scss/mixins/index" as *;

  .trakt-smart-list-nudge-pill {
    position: fixed;
    z-index: var(--layer-floating);
    inset-inline-end: var(--ni-24);
    bottom: var(--ni-24);

    display: flex;
    align-items: center;
    gap: var(--gap-s);

    box-sizing: border-box;
    height: var(--ni-48);
    max-width: calc(100dvw - 2 * var(--layout-distance-side));
    padding-inline: var(--gap-m) var(--ni-4);

    color: var(--color-smart-list-nudge-foreground);
    background: var(--color-smart-list-nudge-background);
    border-radius: var(--ni-24);
    box-shadow: var(--shadow-floating);

    @include for-mobile {
      inset-inline: var(--layout-distance-side);
      bottom: max(
        calc(var(--navbar-height) + var(--gap-s)),
        calc(env(safe-area-inset-bottom, 0px) + var(--gap-s))
      );

      max-width: none;
    }
  }

  .nudge-message {
    flex: 1 1 auto;
    min-width: 0;
  }

  .nudge-cta {
    flex-shrink: 0;
    display: flex;
  }

  .nudge-close {
    all: unset;

    flex-shrink: 0;
    display: grid;
    place-items: center;

    width: var(--ni-44);
    height: var(--ni-44);
    box-sizing: border-box;

    border-radius: 50%;
    cursor: pointer;

    :global(svg) {
      width: var(--ni-16);
      height: var(--ni-16);
    }

    &:focus-visible {
      outline: var(--border-thickness-xs) solid var(--purple-300);
    }
  }
</style>
