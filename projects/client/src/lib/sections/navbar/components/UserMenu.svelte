<script lang="ts">
  import ClockIcon from "$lib/components/icons/ClockIcon.svelte";
  import GearIcon from "$lib/components/icons/GearIcon.svelte";
  import LibraryIcon from "$lib/components/icons/LibraryIcon.svelte";
  import Link from "$lib/components/link/Link.svelte";
  import Tooltip from "$lib/components/tooltip/Tooltip.svelte";
  import * as m from "$lib/features/i18n/messages.ts";
  import { UrlBuilder } from "$lib/utils/url/UrlBuilder";
  import type { Snippet } from "svelte";

  const {
    children,
    isExpanded = false,
  }: {
    children: Snippet;
    isExpanded?: boolean;
  } = $props();

  let hoverVisible = $state(false);
  let hideTimeout: ReturnType<typeof setTimeout> | null = null;

  const menuVisible = $derived(isExpanded || hoverVisible);

  function showMenu() {
    if (isExpanded) return;
    if (hideTimeout) clearTimeout(hideTimeout);
    hoverVisible = true;
  }

  function scheduleHide() {
    if (isExpanded) return;
    hideTimeout = setTimeout(() => (hoverVisible = false), 150);
  }
</script>

{#snippet navItem(href: string, label: string, title: string, icon: Snippet)}
  <div class="item">
    <Tooltip
      content={title}
      disabled={isExpanded}
      variant="compact"
      side="right"
      delayDuration={0}
      sideOffset={16}
    >
      <Link {href} {label}>
        {@render icon()}
        {#if isExpanded}
          <span class="item-label ellipsis bold">{title}</span>
        {/if}
      </Link>
    </Tooltip>
  </div>
{/snippet}

{#snippet iconHistory()}<ClockIcon />{/snippet}
{#snippet iconLibrary()}<LibraryIcon />{/snippet}
{#snippet iconSettings()}<GearIcon />{/snippet}

<div
  class="trakt-user-menu-zone"
  class:is-expanded={isExpanded}
  onmouseenter={showMenu}
  onmouseleave={scheduleHide}
  role="presentation"
>
  <div class="menu" class:is-visible={menuVisible}>
    <div class="items-grid">
      <nav class="items" aria-label="User menu">
        {@render navItem(
          UrlBuilder.history.home(),
          m.button_label_history(),
          m.page_title_history(),
          iconHistory,
        )}
        {@render navItem(
          UrlBuilder.library.home(),
          m.button_label_library(),
          m.page_title_library(),
          iconLibrary,
        )}
        {@render navItem(
          UrlBuilder.settings.general(),
          m.button_label_settings(),
          m.button_label_settings(),
          iconSettings,
        )}
      </nav>
    </div>

    <div class="profile">
      <Tooltip
        content={m.page_title_profile()}
        disabled={isExpanded}
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
  .trakt-user-menu-zone {
    --zone-align: center;
    --zone-gap: var(--gap-l);
    --zone-icon-size: var(--ni-24);
    --zone-icon-padding: 0;
    --zone-items-padding: var(--ni-10) 0;

    position: relative;
    height: var(--side-navbar-actions-height);

    &.is-expanded {
      --zone-align: flex-start;
      --zone-gap: var(--gap-s);
      --zone-icon-size: var(--ni-32);
      --zone-icon-padding: 0 var(--ni-6);
      --zone-items-padding: 0;

      height: auto;
      width: 100%;
    }
  }

  .menu {
    position: absolute;
    bottom: 0;
    left: 50%;
    transform: translateX(-50%);
    display: flex;
    flex-direction: column;
    align-items: var(--zone-align);
    width: var(--side-navbar-width);
    border-radius: var(--ni-60);
    transition:
      background-color var(--transition-increment) ease-in-out,
      box-shadow var(--transition-increment) ease-in-out;

    &.is-visible {
      background-color: var(--color-background-side-navbar);
      box-shadow: var(--shadow-navbar);
    }

    .is-expanded & {
      position: static;
      transform: none;
      width: 100%;
      border-radius: 0;
      padding: 0 calc(var(--ni-16) * 0.5);
      overflow: hidden;
      background-color: transparent;
      box-shadow: none;
    }
  }

  .items-grid {
    display: grid;
    grid-template-rows: 0fr;
    transition: grid-template-rows var(--transition-increment) ease-in-out;

    .is-visible & {
      grid-template-rows: 1fr;
    }

    .is-expanded & {
      width: 100%;
    }
  }

  .items {
    overflow: hidden;
    min-height: 0;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: var(--zone-gap);
    padding: var(--zone-items-padding);
    opacity: 0;
    pointer-events: none;
    transition: opacity var(--transition-increment) ease-in-out;

    .is-visible & {
      opacity: 1;
      pointer-events: auto;
    }

    .is-expanded & {
      align-items: flex-start;
    }
  }

  .profile {
    display: flex;
    align-items: center;
    justify-content: center;
    padding: var(--gap-xs) 0;

    .is-expanded & {
      justify-content: flex-start;
      width: 100%;

      :global(a.trakt-link) {
        justify-content: flex-start;
        gap: var(--gap-s);
      }
    }
  }

  .item {
    .is-expanded & {
      width: 100%;
    }

    :global(.trakt-tooltip-trigger) {
      min-width: 0;
    }

    :global(svg) {
      width: var(--zone-icon-size);
      height: var(--zone-icon-size);
      padding: var(--zone-icon-padding);
      box-sizing: border-box;
      flex-shrink: 0;
      display: block;
    }

    :global(a.trakt-link) {
      text-decoration: none;
      transition-property: color;
      display: flex;
      align-items: center;
      justify-content: center;
      min-width: 0;

      .is-expanded & {
        justify-content: flex-start;
        gap: var(--gap-s);
      }
    }
  }

  .item-label {
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }
</style>
