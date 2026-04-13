<script lang="ts">
  import MenuIcon from "$lib/components/icons/MenuIcon.svelte";
  import Link from "$lib/components/link/Link.svelte";
  import Logo from "$lib/components/logo/Logo.svelte";
  import * as m from "$lib/features/i18n/messages";
  import { DpadNavigationType } from "$lib/features/navigation/models/DpadNavigationType";
  import RenderFor from "$lib/guards/RenderFor.svelte";
  import { useCollapsedSection } from "$lib/stores/useCollapsedSection";
  import { slide } from "svelte/transition";
  import NavbarActions from "./_internal/NavbarActions.svelte";
  import SideNavbarContent from "./_internal/SideNavbarContent.svelte";
  import ProfileLink from "./components/ProfileLink.svelte";
  import UserMenu from "./components/UserMenu.svelte";
  import { useNavbarState } from "./useNavbarState";

  const { state } = useNavbarState();
  const { isCollapsed, toggle } = useCollapsedSection("side-navbar", true);

  $effect(() => {
    const width = $isCollapsed
      ? "var(--side-navbar-width-collapsed)"
      : "var(--side-navbar-width-expanded)";
    document.documentElement.style.setProperty("--side-navbar-width", width);

    return () => {
      document.documentElement.style.removeProperty("--side-navbar-width");
    };
  });
</script>

{#if $state.mode !== "hidden"}
  <NavbarActions />

  <header>
    <nav
      class="trakt-side-navbar"
      data-dpad-navigation={DpadNavigationType.Navbar}
    >
      <div class="trakt-side-navbar-top">
        <button
          class="nav-menu-button"
          onclick={toggle}
          aria-label={$isCollapsed
            ? m.button_label_expand_navbar()
            : m.button_label_collapse_navbar()}
        >
          <MenuIcon state={$isCollapsed ? "closed" : "open"} />
        </button>
        {#if !$isCollapsed}
          <div class="nav-logo-link" transition:slide={{ duration: 150 }}>
            <Link href="/" label="Trakt">
              <Logo />
            </Link>
          </div>
        {/if}
      </div>

      <SideNavbarContent isCollapsed={$isCollapsed} />

      <div class="trakt-side-navbar-bottom" class:is-expanded={!$isCollapsed}>
        <RenderFor audience="authenticated">
          <UserMenu isExpanded={!$isCollapsed}>
            <ProfileLink isExpanded={!$isCollapsed} />
          </UserMenu>
        </RenderFor>
      </div>
    </nav>
  </header>
{/if}

<style>
  header {
    --navbar-margin: var(--gap-s);
    --navbar-margin-top: calc(var(--gap-m) + env(safe-area-inset-top));
    --navbar-margin-bottom: calc(var(--gap-m) + env(safe-area-inset-bottom));
    --nav-icon-size: var(--ni-24);
  }

  .trakt-side-navbar {
    contain: layout;

    z-index: var(--layer-overlay);

    position: fixed;
    top: 0;
    left: 0;
    width: var(--side-navbar-width);
    height: calc(
      100dvh - var(--navbar-margin-top) - var(--navbar-margin-bottom)
    );

    color: var(--color-foreground-navbar);

    margin: var(--navbar-margin);
    margin-top: var(--navbar-margin-top);
    margin-bottom: var(--navbar-margin-bottom);
    box-sizing: border-box;

    display: flex;
    flex-direction: column;
    align-items: flex-start;
    justify-content: space-between;
    gap: var(--gap-m);

    &:has(.is-expanded) {
      width: var(--side-navbar-width-expanded);
    }
  }

  .trakt-side-navbar-top,
  .trakt-side-navbar-bottom {
    display: flex;
    flex-direction: column;
    align-items: center;
    align-self: center;
    justify-content: center;
    gap: var(--gap-m);

    width: var(--side-navbar-width);
    height: var(--side-navbar-actions-height);
  }

  .trakt-side-navbar-bottom.is-expanded {
    height: auto;
  }

  .trakt-side-navbar-top {
    flex-direction: row;
    justify-content: flex-start;
    gap: var(--gap-xxs);
    align-self: stretch;

    :global(.nav-logo-link) {
      display: flex;
      align-items: center;
      overflow: hidden;
      height: var(--nav-icon-size);
    }

    :global(.nav-logo-link .trakt-link) {
      display: flex;

      &:focus-visible :global(svg) {
        color: var(--color-link-active);
      }
    }

    :global(.nav-logo-link svg) {
      height: var(--nav-icon-size);
      width: auto;
      color: var(--color-text-primary);
    }
  }

  .nav-menu-button {
    display: flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;

    width: var(--side-navbar-width-collapsed);
    height: var(--side-navbar-width-collapsed);

    padding: 0;
    background: none;
    border: none;
    outline: none;
    cursor: pointer;
    color: inherit;

    :global(svg) {
      width: var(--nav-icon-size);
      height: var(--nav-icon-size);
    }

    &:focus-visible {
      border-radius: var(--border-radius-m);
      outline: var(--border-thickness-xs) solid var(--color-link-active);
      outline-offset: var(--ni-neg-8);
    }
  }
</style>
