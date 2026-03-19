<script lang="ts">
  import ClockIcon from "$lib/components/icons/ClockIcon.svelte";
  import GearIcon from "$lib/components/icons/GearIcon.svelte";
  import LibraryIcon from "$lib/components/icons/LibraryIcon.svelte";
  import Link from "$lib/components/link/Link.svelte";
  import Tooltip from "$lib/components/tooltip/Tooltip.svelte";
  import * as m from "$lib/features/i18n/messages.ts";
  import { UrlBuilder } from "$lib/utils/url/UrlBuilder";

  const { children }: ChildrenProps = $props();

  let menuVisible = $state(false);
  let hideTimeout = $state<ReturnType<typeof setTimeout> | null>(null);

  function showMenu() {
    if (hideTimeout) clearTimeout(hideTimeout);
    menuVisible = true;
  }

  function scheduleHide() {
    hideTimeout = setTimeout(() => {
      menuVisible = false;
    }, 150);
  }
</script>

<div
  class="trakt-user-menu-zone"
  onmouseenter={showMenu}
  onmouseleave={scheduleHide}
  role="presentation"
>
  <div class="trakt-user-menu" class:is-visible={menuVisible}>
    <div class="trakt-user-menu-items">
      <nav class="trakt-user-menu-items-inner" aria-label="User menu">
        <div class="trakt-user-menu-item">
          <Tooltip
            content={m.page_title_history()}
            variant="compact"
            side="right"
            delayDuration={0}
            sideOffset={16}
          >
            <Link href={UrlBuilder.history.home()} label={m.button_label_history()}>
              <ClockIcon />
            </Link>
          </Tooltip>
        </div>

        <div class="trakt-user-menu-item">
          <Tooltip
            content={m.page_title_library()}
            variant="compact"
            side="right"
            delayDuration={0}
            sideOffset={16}
          >
            <Link href={UrlBuilder.library.home()} label={m.button_label_library()}>
              <LibraryIcon />
            </Link>
          </Tooltip>
        </div>

        <div class="trakt-user-menu-item">
          <Tooltip
            content={m.button_label_settings()}
            variant="compact"
            side="right"
            delayDuration={0}
            sideOffset={16}
          >
            <Link
              href={UrlBuilder.settings.general()}
              label={m.button_label_settings()}
            >
              <GearIcon />
            </Link>
          </Tooltip>
        </div>
      </nav>
    </div>

    <div class="trakt-user-menu-profile">
      <Tooltip
        content={m.page_title_profile()}
        variant="compact"
        side="right"
        delayDuration={0}
        sideOffset={16}
      >
        {@render children()}
      </Tooltip>
    </div>
  </div>
</div>

<style lang="scss">
  @use "$style/scss/mixins/index" as *;

  .trakt-user-menu-zone {
    position: relative;
    height: var(--side-navbar-actions-height);
  }

  .trakt-user-menu {
    position: absolute;
    bottom: 0;
    left: 50%;
    transform: translateX(-50%);

    display: flex;
    flex-direction: column;
    align-items: center;
    width: var(--side-navbar-width);
    border-radius: var(--ni-60);

    transition:
      background-color var(--transition-increment) ease-in-out,
      box-shadow var(--transition-increment) ease-in-out;

    &.is-visible {
      background-color: var(--color-background-side-navbar);
      box-shadow: var(--shadow-navbar);
    }
  }

  .trakt-user-menu-items {
    display: grid;
    grid-template-rows: 0fr;
    transition: grid-template-rows var(--transition-increment) ease-in-out;

    .is-visible & {
      grid-template-rows: 1fr;
    }
  }

  .trakt-user-menu-items-inner {
    overflow: hidden;
    min-height: 0;

    display: flex;
    flex-direction: column;
    align-items: center;
    gap: var(--gap-xl);

    padding: var(--ni-10) 0;

    opacity: 0;
    pointer-events: none;
    transition: opacity var(--transition-increment) ease-in-out;

    .is-visible & {
      opacity: 1;
      pointer-events: auto;
    }
  }

  .trakt-user-menu-profile {
    display: flex;
    align-items: center;
    justify-content: center;
    padding: var(--gap-xs) 0;
  }

  .trakt-user-menu-item {
    :global(svg) {
      width: var(--ni-24);
      height: var(--ni-24);
      display: block;
    }

    :global(a.trakt-link) {
      text-decoration: none;
      transition-property: color;
      display: flex;
      align-items: center;
      justify-content: center;
    }
  }
</style>
