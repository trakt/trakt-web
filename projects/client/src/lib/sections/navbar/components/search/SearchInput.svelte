<script lang="ts">
  import Link from "$lib/components/link/Link.svelte";
  import * as m from "$lib/features/i18n/messages";
  import CrossOriginImage from "$lib/features/image/components/CrossOriginImage.svelte";
  import { UrlBuilder } from "$lib/utils/url/UrlBuilder";
  import { onMount } from "svelte";
  import { useSearch } from "./useSearch";

  let windowScrollY = $state(0);

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

<div class="trakt-search" class:search-is-loading={$isSearching}>
  <input
    bind:this={inputElement}
    class="trakt-search-input"
    type="search"
    placeholder={m.search_placeholder()}
    oninput={onSearch}
  />
  {#if $results.length > 0}
    <div class="trakt-search-results">
      {#each $results as result}
        <Link
          href={UrlBuilder.media(result.type, result.slug)}
          onclick={() => {
            inputElement.value = "";
            clear();
          }}
        >
          <div class="trakt-search-result-item">
            <CrossOriginImage alt={result.title} src={result.poster.url} />
            <span>{result.title} ({result.year})</span>
          </div>
        </Link>
      {/each}
    </div>
  {/if}
</div>

<style>
  @keyframes slide-left-to-right {
    0% {
      background-position: 200% 0;
    }
    100% {
      background-position: -200% 0;
    }
  }

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
      width: calc(var(--ni-120) + 10vw);
    }

    &.search-is-loading {
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
      min-height: calc(var(--height-result-item) * 7);
      min-width: 100%;

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
      height: 100vh;
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
          width: var(--ni-64);
          border: var(--ni-2) solid white;
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
</style>
