<script lang="ts">
  import Link from "$lib/components/link/Link.svelte";
  import * as m from "$lib/features/i18n/messages";
  import CrossOriginImage from "$lib/features/image/components/CrossOriginImage.svelte";
  import { clickOutside } from "$lib/utils/actions/clickOutside";
  import { UrlBuilder } from "$lib/utils/url/UrlBuilder";
  import SearchResultDetails from "./SearchResultDetails.svelte";
  import { useSearch } from "./useSearch";

  const { search, clear, isSearching, results } = useSearch();

  function onSearch(ev: Event) {
    const inputElement = ev.target as HTMLInputElement;

    search(inputElement.value);
  }

  let inputElement: HTMLInputElement;
</script>

<div class="trakt-search" class:search-is-loading={$isSearching}>
  <input
    use:clickOutside
    bind:this={inputElement}
    onclick={(ev) => {
      if (!inputElement.value.trim()) {
        return;
      }

      onSearch(ev);
    }}
    onclickoutside={() => clear()}
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
          color="inherit"
        >
          <div class="trakt-search-result-item">
            <CrossOriginImage alt={result.title} src={result.poster.url} />
            <SearchResultDetails {result} />
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

      border-radius: var(--border-radius-s);
      border: var(--border-thickness-xs) solid var(--shade-800);
      background: rgba(25, 28, 30, 0.7);
      backdrop-filter: blur(var(--ni-8));
      width: calc(var(--ni-120) + 10vw);

      transition: border-color var(--transition-increment) ease-in-out;

      &:focus-within {
        border-color: var(--purple-600);
      }

      &::-webkit-search-cancel-button {
        -webkit-tap-highlight-color: transparent;
        -webkit-appearance: none;
        width: var(--ni-16);
        height: var(--ni-16);
        background-image: url("$lib/sections/navbar/components/search/SearchClearIcon.svg");
        background-size: contain;
        cursor: pointer;
      }

      &::-moz-search-cancel-button {
        -moz-appearance: none;
        width: var(--ni-16);
        height: var(--ni-16);
        background-image: url("$lib/sections/navbar/components/search/SearchClearIcon.svg");
        background-size: contain;
        cursor: pointer;
      }
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
      z-index: 999;

      position: absolute;
      top: 120%;
      left: 0;
      right: 0;

      min-height: calc(var(--height-result-item) * 7);
      height: 100vh;
      max-height: 80vh;
      min-width: var(--ni-280);
      padding: var(--ni-8);

      overflow: hidden;
      overflow-y: scroll;

      background: color-mix(
        in srgb,
        var(--color-background) 90%,
        transparent 10%
      );
      backdrop-filter: blur(var(--ni-8));
      border-radius: var(--border-radius-l);
      box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);

      :global(a.trakt-link) {
        transition: background-color var(--transition-increment) ease-in-out;

        &:hover,
        &:focus-visible {
          background: var(--purple-900);
          color: var(--shade-10);
          border-radius: var(--border-radius-m);
        }

        &:active {
          background: var(--purple-700);
        }
      }

      .trakt-search-result-item {
        padding: var(--ni-8);
        cursor: pointer;
        display: flex;
        align-items: center;
        gap: var(--ni-16);

        :global(img) {
          height: var(--ni-120);
          width: var(--ni-80);
          border: var(--border-thickness-xs) solid white;
          border-radius: var(--border-radius-s);
        }
      }
    }
  }
</style>
