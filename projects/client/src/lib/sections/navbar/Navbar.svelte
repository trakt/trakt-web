<script lang="ts">
  import Logo from "$lib/components/Logo.svelte";
  import { onMount } from "svelte";
  import ThemePicker from "$lib/features/theme/components/ThemePicker.svelte";
  import type { Theme } from "$lib/features/theme/models/Theme";

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

<div class="trakt-navbar" class:trakt-navbar-scroll={isScrolled}>
  <div class="trakt-logo">
    <Logo />
  </div>
  <div class="trakt-theme-selector">
    <ThemePicker {theme} />
  </div>
</div>

<div class="trakt-navbar-spacer"></div>

<style>
  .trakt-navbar,
  .trakt-navbar-spacer {
    box-sizing: border-box;
    margin: 0.75rem auto;
    padding: 0.75rem 1rem;
    height: 4rem;
  }
  .trakt-navbar {
    z-index: 1;
    position: fixed;
    top: 0;
    left: var(--layout-distance-side);

    display: flex;
    justify-content: space-between;
    width: calc(100dvw - 2 * var(--layout-distance-side));

    align-items: center;
    gap: 3rem;

    border-radius: 1rem;

    transition: 150ms cubic-bezier(0.4, 0, 0.2, 1);
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
    width: 7rem;
  }
</style>
