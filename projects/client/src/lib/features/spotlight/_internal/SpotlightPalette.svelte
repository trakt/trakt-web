<script lang="ts">
  import { goto } from "$app/navigation";
  import CodeIcon from "$lib/components/icons/CodeIcon.svelte";
  import DiscoverIcon from "$lib/components/icons/DiscoverIcon.svelte";
  import MovieIcon from "$lib/components/icons/MovieIcon.svelte";
  import SearchIcon from "$lib/components/icons/SearchIcon.svelte";
  import ShowIcon from "$lib/components/icons/ShowIcon.svelte";
  import { devtoolsSpotlightActions } from "$lib/features/devtools/devtoolsSpotlightActions.ts";
  import * as m from "$lib/features/i18n/messages";
  import type { MediaResult } from "$lib/requests/queries/search/searchMediaQuery";
  import DefaultMediaItem from "$lib/sections/lists/components/DefaultMediaItem.svelte";
  import { UrlBuilder } from "$lib/utils/url/UrlBuilder";
  import type { SpotlightAction } from "../models/SpotlightAction.ts";
  import type { Snippet } from "svelte";
  import { filterSpotlightEntries } from "./filterSpotlightEntries";
  import { getSpotlightContext } from "./getSpotlightContext";
  import { spotlightRoutes } from "./spotlightRoutes";
  import { useSpotlightMedia } from "./useSpotlightMedia";

  const { close } = getSpotlightContext();
  const {
    media,
    isSearching,
    search: searchMedia,
    clear: clearMedia,
  } = useSpotlightMedia();

  type SpotlightListEntry = {
    id: string;
    label: string;
    url?: string;
    run: () => void;
  };

  let query = $state("");
  let selectedIndex = $state(0);
  let scrollElement = $state<HTMLElement | null>(null);

  const actions = $derived(
    import.meta.env.DEV ? devtoolsSpotlightActions : [],
  );
  const actionEntries = $derived(
    filterSpotlightEntries(actions, query).map((action) => ({
      id: action.id,
      label: action.label(),
      run: () => runAction(action),
    })),
  );
  const pageEntries = $derived(
    filterSpotlightEntries(spotlightRoutes, query).map((route) => ({
      id: route.id,
      label: route.label(),
      url: route.url,
      run: () => navigateTo(route.url),
    })),
  );
  const movies = $derived($media?.movies ?? []);
  const shows = $derived($media?.shows ?? []);

  const mediaResults = $derived([...movies, ...shows]);

  const items = $derived([
    ...actionEntries.map((entry) => entry.run),
    ...pageEntries.map((entry) => entry.run),
    ...mediaResults.map(
      (entry) => () => navigateTo(UrlBuilder.media(entry.type, entry.slug)),
    ),
  ]);

  const pagesOffset = $derived(actionEntries.length);
  const moviesOffset = $derived(pagesOffset + pageEntries.length);
  const showsOffset = $derived(moviesOffset + movies.length);

  const trimmedQuery = $derived(query.trim());
  const hasQuery = $derived(trimmedQuery.length > 0);
  const isEmpty = $derived(hasQuery && items.length === 0 && !$isSearching);
  const activeIndex = $derived(
    Math.min(selectedIndex, Math.max(0, items.length - 1)),
  );

  function scrollToActive(index: number) {
    const target = scrollElement?.querySelector(
      `[data-spotlight-index="${index}"]`,
    );

    if (!target) return;

    const section = target.closest(".spotlight-section");
    const isFirstInSection =
      section?.querySelector("[data-spotlight-index]") === target;
    const sectionTarget = isFirstInSection ? section : null;

    (sectionTarget ?? target).scrollIntoView({ block: "nearest" });
  }

  function onInput(
    event: Event & { currentTarget: EventTarget & HTMLInputElement },
  ) {
    query = event.currentTarget.value;
    selectedIndex = 0;
    scrollElement?.scrollTo({ top: 0 });

    if (!trimmedQuery) {
      clearMedia();
      return;
    }

    searchMedia(trimmedQuery);
  }

  function navigateTo(url: string | Nil) {
    if (!url) return;

    close();
    // eslint-disable-next-line svelte/no-navigation-without-resolve
    goto(url);
  }

  function runAction(action: SpotlightAction) {
    close();
    action.run();
  }

  function moveSelection(delta: number) {
    if (items.length === 0) return;

    selectedIndex = (activeIndex + delta + items.length) % items.length;
    scrollToActive(selectedIndex);
  }

  function onKeydown(event: KeyboardEvent) {
    switch (event.key) {
      case "ArrowDown":
        event.preventDefault();
        moveSelection(1);
        return;
      case "ArrowUp":
        event.preventDefault();
        moveSelection(-1);
        return;
      case "Enter":
        event.preventDefault();
        items.at(activeIndex)?.();
        return;
    }
  }
</script>

{#snippet codeIcon()}<CodeIcon />{/snippet}
{#snippet discoverIcon()}<DiscoverIcon />{/snippet}
{#snippet movieIcon()}<MovieIcon />{/snippet}
{#snippet showIcon()}<ShowIcon />{/snippet}

{#snippet sectionHeading(title: string, icon: Snippet)}
  <h2 class="spotlight-section-title bold secondary">
    <span class="spotlight-section-icon" aria-hidden="true">
      {@render icon()}
    </span>
    {title}
  </h2>
{/snippet}

{#snippet listSection(
  title: string,
  icon: Snippet,
  entries: ReadonlyArray<SpotlightListEntry>,
  startIndex: number,
)}
  <section class="spotlight-section">
    {@render sectionHeading(title, icon)}
    <ul class="spotlight-list">
      {#each entries as entry, index (entry.id)}
        {@const globalIndex = startIndex + index}
        <li>
          <button
            type="button"
            class="spotlight-item"
            class:is-active={globalIndex === activeIndex}
            data-spotlight-index={globalIndex}
            onpointermove={() => (selectedIndex = globalIndex)}
            onclick={entry.run}
          >
            <span class="spotlight-item-label">{entry.label}</span>
            {#if entry.url}
              <span class="spotlight-item-url">{entry.url}</span>
            {/if}
          </button>
        </li>
      {/each}
    </ul>
  </section>
{/snippet}

{#snippet mediaSection(
  title: string,
  icon: Snippet,
  entries: ReadonlyArray<MediaResult>,
  startIndex: number,
)}
  <section class="spotlight-section">
    {@render sectionHeading(title, icon)}
    <div class="spotlight-media-list">
      {#each entries as entry, index (entry.id)}
        {@const globalIndex = startIndex + index}
        <div
          class="spotlight-media-card"
          class:is-active={globalIndex === activeIndex}
          data-spotlight-index={globalIndex}
        >
          <DefaultMediaItem
            type={entry.type}
            media={entry}
            style="compact"
            source="search"
            mode="mixed"
          />
        </div>
      {/each}
    </div>
  </section>
{/snippet}

<div class="trakt-spotlight-palette">
  <div class="spotlight-search">
    <span class="spotlight-search-icon" aria-hidden="true">
      <SearchIcon />
    </span>
    <input
      value={query}
      oninput={onInput}
      onkeydown={onKeydown}
      class="spotlight-input"
      type="text"
      autocomplete="off"
      autocapitalize="off"
      autocorrect="off"
      spellcheck="false"
      placeholder={m.spotlight_input_placeholder()}
      aria-label={m.spotlight_input_placeholder()}
    />
  </div>

  <div class="spotlight-results" class:is-expanded={hasQuery}>
    <div class="spotlight-results-inner">
      <div class="spotlight-scroll" bind:this={scrollElement}>
        {#if isEmpty}
          <p class="spotlight-empty">
            {m.spotlight_no_results({ query: trimmedQuery })}
          </p>
        {:else}
          {#if actionEntries.length > 0}
            {@render listSection("Devtools", codeIcon, actionEntries, 0)}
          {/if}

          {#if pageEntries.length > 0}
            {@render listSection(
              m.spotlight_section_pages(),
              discoverIcon,
              pageEntries,
              pagesOffset,
            )}
          {/if}

          {#if movies.length > 0}
            {@render mediaSection(
              m.page_title_movies(),
              movieIcon,
              movies,
              moviesOffset,
            )}
          {/if}

          {#if shows.length > 0}
            {@render mediaSection(
              m.page_title_shows(),
              showIcon,
              shows,
              showsOffset,
            )}
          {/if}
        {/if}
      </div>
    </div>
  </div>

  <footer class="spotlight-hints" aria-hidden="true">
    <span class="spotlight-hint">
      <kbd data-key="arrow">↑</kbd><kbd data-key="arrow">↓</kbd>
      {m.spotlight_hint_navigate()}
    </span>
    <span class="spotlight-hint">
      <kbd data-key="return">↵</kbd>
      {m.spotlight_hint_select()}
    </span>
    <span class="spotlight-hint">
      <kbd>esc</kbd>
      {m.spotlight_hint_dismiss()}
    </span>
  </footer>
</div>

<style lang="scss">
  .trakt-spotlight-palette {
    display: contents;

    .spotlight-search {
      display: flex;
      align-items: center;
      gap: var(--ni-12);
      padding-inline: var(--ni-16);
      padding-block: var(--ni-12);
    }

    .spotlight-search-icon {
      display: inline-flex;
      flex-shrink: 0;
      font-size: var(--ni-20);
      color: var(--color-text-secondary);
    }

    .spotlight-input {
      flex: 1;
      min-width: 0;
      border: none;
      outline: none;
      background: transparent;
      color: var(--color-text-primary);
      font-size: var(--font-size-h6);

      &::placeholder {
        color: var(--color-text-secondary);
      }
    }

    .spotlight-results {
      display: grid;
      grid-template-rows: 0fr;
      transition: grid-template-rows var(--transition-increment) ease-out;

      &.is-expanded {
        grid-template-rows: 1fr;
      }
    }

    .spotlight-results-inner {
      overflow: hidden;
      min-height: 0;
    }

    .spotlight-scroll {
      display: flex;
      flex-direction: column;
      gap: var(--ni-16);

      max-height: 55dvh;
      overflow-y: auto;
      padding: var(--ni-4);
      border-block-start: var(--border-thickness-xxs) solid
        color-mix(in srgb, var(--color-text-primary) 8%, transparent);
    }

    .spotlight-section {
      display: flex;
      flex-direction: column;
      gap: var(--ni-8);

      & + .spotlight-section {
        padding-block-start: var(--ni-16);
        border-block-start: var(--border-thickness-xxs) solid
          color-mix(in srgb, var(--color-text-primary) 10%, transparent);
      }
    }

    .spotlight-section-title {
      display: flex;
      align-items: center;
      gap: var(--ni-8);
      padding-inline: var(--ni-12);
      font-size: var(--font-size-text);
    }

    .spotlight-section-icon {
      display: inline-flex;
      flex-shrink: 0;

      :global(svg) {
        width: var(--ni-16);
        height: var(--ni-16);
      }
    }

    .spotlight-list {
      list-style: none;
      margin: 0;
      padding: 0;
      display: flex;
      flex-direction: column;
      gap: var(--ni-2);
    }

    .spotlight-media-list {
      display: flex;
      flex-direction: column;
      gap: var(--ni-4);
    }

    .spotlight-media-card {
      display: grid;
      border-radius: var(--border-radius-m);
    }

    .spotlight-item {
      width: 100%;
      box-sizing: border-box;
      display: flex;
      align-items: baseline;
      justify-content: space-between;
      gap: var(--ni-16);

      padding-inline: var(--ni-12);
      padding-block: var(--ni-10);
      border: none;
      border-radius: var(--border-radius-m);
      background: transparent;
      color: inherit;
      text-align: start;
      cursor: pointer;
    }

    .spotlight-item,
    .spotlight-media-card {
      position: relative;

      &.is-active::after {
        content: "";
        position: absolute;
        inset: 0;
        box-sizing: border-box;
        border: var(--border-thickness-xs) solid var(--color-link-active);
        border-radius: inherit;
        pointer-events: none;
      }
    }

    .spotlight-item-label {
      font-size: var(--font-size-text);
    }

    .spotlight-item-url {
      flex-shrink: 0;
      font-size: var(--font-size-tag);
      color: var(--color-text-secondary);
    }

    .spotlight-empty {
      margin: 0;
      padding: var(--ni-12);
      font-size: var(--font-size-text);
      color: var(--color-text-secondary);
    }

    .spotlight-hints {
      display: flex;
      flex-wrap: wrap;
      gap: var(--ni-16);
      padding-inline: var(--ni-16);
      padding-block: var(--ni-8);
      font-size: var(--font-size-tag);
      color: var(--color-text-secondary);
    }

    .spotlight-hint {
      display: inline-flex;
      align-items: center;
      gap: var(--ni-4);

      kbd {
        display: inline-flex;
        align-items: center;
        justify-content: center;

        box-sizing: border-box;
        min-width: var(--ni-16);
        height: var(--ni-16);
        line-height: 1;

        padding-inline: var(--ni-4);
        border-radius: var(--border-radius-xs);
        background: color-mix(in srgb, var(--color-text-primary) 10%, transparent);
        font-family: inherit;
        font-size: var(--font-size-tag);
      }

      kbd[data-key] {
        font-size: 0.75em;
      }

      kbd[data-key="return"] {
        transform: translateY(0.15em);
      }
    }

    @media (prefers-reduced-motion: reduce) {
      .spotlight-results {
        transition: none;
      }
    }
  }
</style>
