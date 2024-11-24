<script lang="ts">
  import Logo from "$lib/components/logo/Logo.svelte";
  import ThemePicker from "$lib/features/theme/components/ThemePicker.svelte";
  import type { Theme } from "$lib/features/theme/models/Theme";
  import { onMount } from "svelte";

  const { theme }: { theme: Theme } = $props();

  let windowScrollY = $state(0);
  const isScrolled = $derived(windowScrollY > 0);

  function handleScroll() {
    windowScrollY = window.scrollY;
  }

  onMount(() => {
    window.addEventListener("scroll", handleScroll);
    handleScroll();

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  });
</script>

<nav class="trakt-navbar" class:trakt-navbar-scroll={isScrolled}>
  <div class="trakt-logo">
    <Logo />
  </div>
  <ThemePicker {theme} />
</nav>

<div class="trakt-navbar-spacer"></div>

<style>
  .trakt-navbar,
  .trakt-navbar-spacer {
    box-sizing: border-box;
    margin: var(--ni-12) auto;
    padding: var(--ni-12) var(--ni-16);
    height: var(--ni-64);
  }

  .trakt-navbar {
    z-index: 999;
    position: fixed;
    top: 0;
    left: var(--layout-distance-side);

    display: flex;
    justify-content: space-between;
    width: calc(100dvw - 2 * var(--layout-distance-side));

    align-items: center;
    gap: var(--ni-48);

    border-radius: var(--ni-16);

    transition: var(--transition-increment) cubic-bezier(0.4, 0, 0.2, 1);
    transition-property: background-color, box-shadow;
  }

  .trakt-navbar-scroll {
    background-color: var(--color-background-navbar);
    box-shadow: 0px 24px 64px 0px
      color-mix(in srgb, var(--color-shadow) 32%, transparent 68%);

    backdrop-filter: blur(8px);

    --color-foreground: var(--color-foreground-navbar);
  }

  .trakt-logo {
    width: var(--ni-112);
  }
</style>
