<script lang="ts">
  import Button from "$lib/components/buttons/Button.svelte";
  import Link from "$lib/components/link/Link.svelte";
  import Logo from "$lib/components/logo/Logo.svelte";
  import LogoMark from "$lib/components/logo/LogoMark.svelte";
  import * as m from "$lib/features/i18n/messages";
  import RenderFor from "$lib/guards/RenderFor.svelte";
  import { onMount } from "svelte";
  import JoinTraktButton from "./components/JoinTraktButton.svelte";
  import SearchInput from "./components/search/SearchInput.svelte";
  import ProfileButton from "./ProfileButton.svelte";

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

<header>
  <nav class="trakt-navbar" class:trakt-navbar-scroll={isScrolled}>
    <div class="trakt-logo">
      <Link color="inherit" href="/">
        <RenderFor audience="authenticated">
          <LogoMark />
        </RenderFor>
        <RenderFor audience="public">
          <Logo />
        </RenderFor>
      </Link>
    </div>
    <RenderFor audience="authenticated">
      <SearchInput />
    </RenderFor>
    <div class="trakt-navbar-links">
      <Link href="/shows" color="inherit">
        <Button
          label={m.navbar_link_shows_label()}
          style="ghost"
          variant="secondary"
        >
          {m.navbar_link_shows()}
        </Button>
      </Link>
      <Link href="/movies" color="inherit">
        <Button
          label={m.navbar_link_movies_label()}
          style="ghost"
          variant="secondary"
        >
          {m.navbar_link_movies()}
        </Button>
      </Link>
      <RenderFor audience="public">
        <JoinTraktButton />
      </RenderFor>
      <RenderFor
        audience="authenticated"
        device={["tablet-sm", "tablet-lg", "desktop"]}
      >
        <Link href="/profile/me" color="inherit">
          <ProfileButton />
        </Link>
      </RenderFor>
    </div>
  </nav>

  <div class="trakt-navbar-spacer"></div>
</header>

<style>
  .trakt-navbar,
  .trakt-navbar-spacer {
    box-sizing: border-box;
    margin: var(--ni-12) auto;
    padding: var(--ni-12) var(--ni-16);
    height: var(--ni-64);
  }

  .trakt-navbar-links {
    display: flex;
    gap: var(--ni-16);
    align-items: center;
    width: 100%;
    justify-content: end;
  }

  .trakt-navbar {
    z-index: 999;
    position: fixed;
    top: 0;
    left: var(--layout-distance-side);

    display: flex;
    width: calc(100dvw - 2 * var(--layout-distance-side));

    align-items: center;
    gap: var(--ni-24);

    border-radius: var(--ni-16);

    transition: var(--transition-increment) cubic-bezier(0.4, 0, 0.2, 1);
    transition-property: background-color, box-shadow;
  }

  .trakt-navbar-scroll {
    background-color: var(--color-background-navbar);
    box-shadow: 0px 24px 64px 0px
      color-mix(in srgb, var(--color-shadow) 32%, transparent 68%);

    backdrop-filter: blur(8px);

    color: var(--color-foreground-navbar);
  }

  .trakt-logo {
    height: var(--ni-32);
    display: flex;
    justify-content: center;

    :global(svg) {
      /* Safari 🥲 */
      height: 100%;
    }
  }
</style>
