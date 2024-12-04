<script lang="ts">
  import Link from "$lib/components/link/Link.svelte";
  import Logo from "$lib/components/logo/Logo.svelte";
  import LogoMark from "$lib/components/logo/LogoMark.svelte";
  import LocalePicker from "$lib/features/i18n/components/LocalePicker.svelte";
  import * as m from "$lib/features/i18n/messages";
  import CrossOriginImage from "$lib/features/image/components/CrossOriginImage.svelte";
  import ThemePicker from "$lib/features/theme/components/ThemePicker.svelte";
  import RenderFor from "$lib/guards/RenderFor.svelte";
  import { buildMediaLink } from "$lib/utils/url/buildMediaLink";
  import { onMount } from "svelte";
  import JoinTraktButton from "./components/JoinTraktButton.svelte";
  import { useSearch } from "./useSearch";

  let windowScrollY = $state(0);
  const isScrolled = $derived(windowScrollY > 0);

  const { search, clear, isSearching, results } = useSearch();

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

  function onSearch(ev: Event) {
    const inputElement = ev.target as HTMLInputElement;

    search(inputElement.value);
  }

  let inputElement: HTMLInputElement;
</script>

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
  <!-- FIXME: extract component -->
  <RenderFor audience="authenticated">
    <div class="trakt-search" class:is-loading-results={$isSearching}>
      <input
        bind:this={inputElement}
        class="trakt-search-input"
        type="search"
        placeholder={m.search_placeholder()}
        oninput={onSearch}
        onchange={onSearch}
      />
      {#if $results.length > 0}
        <div class="trakt-search-results">
          {#each $results as result}
            <div class="trakt-search-result-item">
              <Link
                href={buildMediaLink(result.type, result.slug)}
                onclick={() => {
                  inputElement.value = "";
                  clear();
                }}
              >
                <CrossOriginImage alt={result.title} src={result.poster.url} />
                <span>{result.title} ({result.year})</span>
              </Link>
            </div>
          {/each}
        </div>
      {/if}
    </div>
  </RenderFor>
  <div class="trakt-user-preferences">
    <RenderFor audience="public">
      <JoinTraktButton />
    </RenderFor>
    <LocalePicker />
    <ThemePicker />
  </div>
</nav>

<div class="trakt-navbar-spacer"></div>

<style>
  @keyframes slide-left-to-right {
    0% {
      background-position: 200% 0;
    }
    100% {
      background-position: -200% 0;
    }
  }

  /** FIXME: proper styling */
  .trakt-search {
    position: relative;

    .trakt-search-input {
      all: unset;

      display: flex;
      height: var(--ni-48);
      padding: var(--ni-8) var(--ni-16);
      align-items: center;
      box-sizing: border-box;
      gap: var(--ni-16);

      border-radius: var(--ni-8);
      border: var(--ni-2) solid var(--shade-700);
      background: rgba(25, 28, 30, 0.7);
      backdrop-filter: blur(var(--ni-8));
      width: calc(var(--ni-120) + 20vw);
    }

    &.is-loading-results {
      &::after {
        content: "";
        width: 90%;
        position: absolute;
        bottom: 0;
        left: 5%;
        right: 0;
        height: var(--ni-2);
        border-radius: 50%;
        background: linear-gradient(
          90deg,
          var(--color-foreground) 0%,
          var(--color-foreground) 50%,
          transparent 50%,
          transparent 100%
        );
        background-size: 200% 100%;
        animation: slide-left-to-right calc(var(--transition-increment) * 10)
          linear infinite;
      }
    }
    .trakt-search-results {
      position: absolute;

      top: 120%;
      left: 0;
      right: 0;

      background: color-mix(
        in srgb,
        var(--color-background) 80%,
        transparent 20%
      );
      backdrop-filter: blur(var(--ni-8));
      border-radius: var(--ni-8);
      padding: var(--ni-8);
      box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
      z-index: 999;

      max-height: 80vh;
      overflow: hidden;
      overflow-y: scroll;

      .trakt-search-result-item {
        padding: var(--ni-8);
        border-radius: var(--ni-8);
        cursor: pointer;
        display: flex;
        align-items: center;
        gap: var(--ni-16);

        :global(img) {
          height: var(--ni-96);
          border-radius: var(--ni-8);
        }

        &:hover {
          background-color: color-mix(
            in srgb,
            var(--color-foreground) 5%,
            transparent 95%
          );
        }
      }
    }
  }

  .trakt-navbar,
  .trakt-navbar-spacer {
    box-sizing: border-box;
    margin: var(--ni-12) auto;
    padding: var(--ni-12) var(--ni-16);
    height: var(--ni-64);
  }

  .trakt-user-preferences {
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
