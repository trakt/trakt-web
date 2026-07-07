<script lang="ts">
  import { afterNavigate, goto } from "$app/navigation";
  import DiscoverIcon from "$lib/components/icons/DiscoverIcon.svelte";
  import MovieIcon from "$lib/components/icons/MovieIcon.svelte";
  import SearchIcon from "$lib/components/icons/SearchIcon.svelte";
  import ShowIcon from "$lib/components/icons/ShowIcon.svelte";
  import * as m from "$lib/features/i18n/messages";
  import DefaultMediaItem from "$lib/sections/lists/components/DefaultMediaItem.svelte";
  import { Dialog } from "bits-ui";
  import { tick } from "svelte";
  import { filterSpotlightRoutes } from "./filterSpotlightRoutes.ts";
  import { getSpotlightContext } from "./getSpotlightContext.ts";
  import type { SpotlightRoute } from "./models/SpotlightRoute.ts";
  import { spotlightRoutes } from "./spotlightRoutes.ts";
  import { useSpotlightMedia } from "./useSpotlightMedia.ts";

  const { isOpen, close } = getSpotlightContext();
  const {
    media,
    isSearching,
    search: searchMedia,
    clear: clearMedia,
  } = useSpotlightMedia();

  let query = $state("");
  let selectedIndex = $state(0);
  let inputElement = $state<HTMLInputElement | null>(null);

  const pageResults = $derived(filterSpotlightRoutes(spotlightRoutes, query));
  const movies = $derived($media?.movies ?? []);
  const shows = $derived($media?.shows ?? []);

  const hasQuery = $derived(query.trim().length > 0);
  const hasResults = $derived(
    pageResults.length > 0 || movies.length > 0 || shows.length > 0,
  );
  const isEmpty = $derived(hasQuery && !hasResults && !$isSearching);
  const activeIndex = $derived(
    Math.min(selectedIndex, Math.max(0, pageResults.length - 1)),
  );

  function reset() {
    query = "";
    selectedIndex = 0;
  }

  $effect(() => {
    if (!$isOpen) return;

    reset();
    tick().then(() => inputElement?.focus());
  });

  // Drive the debounced media search off the input.
  $effect(() => {
    const term = query.trim();
    if (!term) {
      clearMedia();
      return;
    }

    searchMedia(term);
  });

  // Close when a media card link navigates away.
  afterNavigate(() => close());

  function navigateTo(route: SpotlightRoute | Nil) {
    if (!route) return;

    close();
    goto(route.url);
  }

  function moveSelection(delta: number) {
    if (pageResults.length === 0) return;

    const next =
      (activeIndex + delta + pageResults.length) % pageResults.length;
    selectedIndex = next;
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
        navigateTo(pageResults.at(activeIndex));
        return;
    }
  }
</script>

<Dialog.Root
  open={$isOpen}
  onOpenChange={(open) => {
    if (!open) close();
  }}
>
  <Dialog.Portal>
    <Dialog.Overlay class="trakt-spotlight-overlay" />
    <Dialog.Content
      class="trakt-spotlight"
      interactOutsideBehavior="close"
      aria-label={m.spotlight_dialog_label()}
    >
      <Dialog.Title class="trakt-spotlight-title">
        {m.spotlight_dialog_label()}
      </Dialog.Title>

      <div class="trakt-spotlight-search">
        <span class="trakt-spotlight-search-icon" aria-hidden="true">
          <SearchIcon />
        </span>
        <input
          bind:this={inputElement}
          bind:value={query}
          onkeydown={onKeydown}
          class="trakt-spotlight-input"
          type="text"
          autocomplete="off"
          autocapitalize="off"
          autocorrect="off"
          spellcheck="false"
          placeholder={m.spotlight_input_placeholder()}
          aria-label={m.spotlight_input_placeholder()}
        />
      </div>

      <div class="trakt-spotlight-results" class:is-expanded={hasQuery}>
        <div class="trakt-spotlight-results-inner">
          <div class="trakt-spotlight-scroll">
            {#if isEmpty}
              <p class="trakt-spotlight-empty">
                {m.spotlight_no_results({ query: query.trim() })}
              </p>
            {:else}
              {#if pageResults.length > 0}
                <section class="trakt-spotlight-section">
                  <h2 class="trakt-spotlight-section-title bold secondary">
                    <span
                      class="trakt-spotlight-section-icon"
                      aria-hidden="true"
                    >
                      <DiscoverIcon />
                    </span>
                    {m.spotlight_section_pages()}
                  </h2>
                  <ul class="trakt-spotlight-list">
                    {#each pageResults as route, index (route.id)}
                      <li>
                        <button
                          type="button"
                          class="trakt-spotlight-item"
                          class:is-active={index === activeIndex}
                          onpointermove={() => (selectedIndex = index)}
                          onclick={() => navigateTo(route)}
                        >
                          <span class="trakt-spotlight-item-label">
                            {route.label()}
                          </span>
                          <span class="trakt-spotlight-item-url"
                            >{route.url}</span
                          >
                        </button>
                      </li>
                    {/each}
                  </ul>
                </section>
              {/if}

              {#if movies.length > 0}
                <section class="trakt-spotlight-section">
                  <h2 class="trakt-spotlight-section-title bold secondary">
                    <span
                      class="trakt-spotlight-section-icon"
                      aria-hidden="true"
                    >
                      <MovieIcon />
                    </span>
                    {m.page_title_movies()}
                  </h2>
                  <div class="trakt-spotlight-media-list">
                    {#each movies as movie (movie.slug)}
                      <DefaultMediaItem
                        type={movie.type}
                        media={movie}
                        style="compact"
                        source="search"
                        mode="mixed"
                      />
                    {/each}
                  </div>
                </section>
              {/if}

              {#if shows.length > 0}
                <section class="trakt-spotlight-section">
                  <h2 class="trakt-spotlight-section-title bold secondary">
                    <span
                      class="trakt-spotlight-section-icon"
                      aria-hidden="true"
                    >
                      <ShowIcon />
                    </span>
                    {m.page_title_shows()}
                  </h2>
                  <div class="trakt-spotlight-media-list">
                    {#each shows as show (show.slug)}
                      <DefaultMediaItem
                        type={show.type}
                        media={show}
                        style="compact"
                        source="search"
                        mode="mixed"
                      />
                    {/each}
                  </div>
                </section>
              {/if}
            {/if}
          </div>
        </div>
      </div>

      <footer class="trakt-spotlight-hints" aria-hidden="true">
        <span class="trakt-spotlight-hint">
          <kbd>↑</kbd><kbd>↓</kbd>
          {m.spotlight_hint_navigate()}
        </span>
        <span class="trakt-spotlight-hint">
          <kbd>↵</kbd>
          {m.spotlight_hint_select()}
        </span>
        <span class="trakt-spotlight-hint">
          <kbd>esc</kbd>
          {m.spotlight_hint_dismiss()}
        </span>
      </footer>
    </Dialog.Content>
  </Dialog.Portal>
</Dialog.Root>

<style lang="scss">
  @use "$style/scss/mixins/index" as *;

  :global(.trakt-spotlight-overlay) {
    position: fixed;
    inset: 0;
    z-index: calc(var(--layer-top) - 1);

    backdrop-filter: blur(var(--ni-8));
    background: color-mix(in srgb, var(--color-background) 45%, transparent);
    opacity: 0;
    will-change: opacity;
  }

  :global(.trakt-spotlight-overlay[data-state="open"]) {
    animation: spotlightOverlayIn var(--transition-increment) ease-in-out
      forwards;
  }

  @keyframes spotlightOverlayIn {
    to {
      opacity: 1;
    }
  }

  :global(.trakt-spotlight) {
    position: fixed;
    inset-inline-start: 50%;
    inset-block-start: 15dvh;
    z-index: var(--layer-top);

    box-sizing: border-box;
    width: min(var(--ni-640), 92dvw);

    display: flex;
    flex-direction: column;

    padding: var(--ni-8);
    border-radius: var(--border-radius-l);
    border: var(--border-thickness-xxs) solid
      color-mix(in srgb, var(--color-text-primary) 8%, transparent);
    outline: none;
    background-color: var(--color-modal-background);
    color: var(--color-text-primary);
    box-shadow: var(--shadow-dialog);

    transform: translateX(-50%);
    transform-origin: top center;
  }

  :global(.trakt-spotlight[data-state="open"]) {
    animation: spotlightPanelIn var(--transition-increment) ease-out forwards;
  }

  @keyframes spotlightPanelIn {
    from {
      opacity: 0;
      transform: translateX(-50%) translateY(calc(-1 * var(--ni-8))) scale(0.98);
    }

    to {
      opacity: 1;
      transform: translateX(-50%) translateY(0) scale(1);
    }
  }

  :global(.trakt-spotlight-title) {
    position: absolute;
    width: var(--border-thickness-xxs);
    height: var(--border-thickness-xxs);
    padding: 0;
    margin: calc(-1 * var(--border-thickness-xxs));
    overflow: hidden;
    clip: rect(0, 0, 0, 0);
    white-space: nowrap;
    border: 0;
  }

  .trakt-spotlight-search {
    display: flex;
    align-items: center;
    gap: var(--ni-12);
    padding-inline: var(--ni-16);
    padding-block: var(--ni-12);
  }

  .trakt-spotlight-search-icon {
    display: inline-flex;
    flex-shrink: 0;
    font-size: var(--ni-20);
    color: var(--color-text-secondary);
  }

  .trakt-spotlight-input {
    flex: 1;
    min-width: 0;
    border: none;
    outline: none;
    background: transparent;
    color: var(--color-text-primary);
    font-size: var(--font-size-h6);
  }

  .trakt-spotlight-input::placeholder {
    color: var(--color-text-secondary);
  }

  .trakt-spotlight-results {
    display: grid;
    grid-template-rows: 0fr;
    transition: grid-template-rows var(--transition-increment) ease-out;
  }

  .trakt-spotlight-results.is-expanded {
    grid-template-rows: 1fr;
  }

  .trakt-spotlight-results-inner {
    overflow: hidden;
    min-height: 0;
  }

  .trakt-spotlight-scroll {
    display: flex;
    flex-direction: column;
    gap: var(--ni-16);

    max-height: 55dvh;
    overflow-y: auto;
    padding: var(--ni-4);
    border-block-start: var(--border-thickness-xxs) solid
      color-mix(in srgb, var(--color-text-primary) 8%, transparent);
  }

  .trakt-spotlight-section {
    display: flex;
    flex-direction: column;
    gap: var(--ni-8);
  }

  .trakt-spotlight-section + .trakt-spotlight-section {
    padding-block-start: var(--ni-16);
    border-block-start: var(--border-thickness-xxs) solid
      color-mix(in srgb, var(--color-text-primary) 10%, transparent);
  }

  .trakt-spotlight-section-title {
    display: flex;
    align-items: center;
    gap: var(--ni-8);
    padding-inline: var(--ni-12);
    font-size: var(--font-size-text);
  }

  .trakt-spotlight-section-icon {
    display: inline-flex;
    flex-shrink: 0;

    :global(svg) {
      width: var(--ni-16);
      height: var(--ni-16);
    }
  }

  .trakt-spotlight-list {
    list-style: none;
    margin: 0;
    padding: 0;
    display: flex;
    flex-direction: column;
    gap: var(--ni-2);
  }

  .trakt-spotlight-media-list {
    --width-summary-card-compact: 100%;

    display: flex;
    flex-direction: column;
    gap: var(--ni-4);
  }

  .trakt-spotlight-item {
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

  .trakt-spotlight-item.is-active {
    background: color-mix(in srgb, var(--color-text-primary) 8%, transparent);
  }

  .trakt-spotlight-item-label {
    font-size: var(--font-size-text);
  }

  .trakt-spotlight-item-url {
    flex-shrink: 0;
    font-size: var(--font-size-tag);
    color: var(--color-text-secondary);
  }

  .trakt-spotlight-empty {
    margin: 0;
    padding: var(--ni-12);
    font-size: var(--font-size-text);
    color: var(--color-text-secondary);
  }

  .trakt-spotlight-hints {
    display: flex;
    flex-wrap: wrap;
    gap: var(--ni-16);
    padding-inline: var(--ni-16);
    padding-block: var(--ni-8);
    font-size: var(--font-size-tag);
    color: var(--color-text-secondary);
  }

  .trakt-spotlight-hint {
    display: inline-flex;
    align-items: center;
    gap: var(--ni-4);
  }

  .trakt-spotlight-hint kbd {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    min-width: var(--ni-16);
    padding-inline: var(--ni-4);
    border-radius: var(--border-radius-xs);
    background: color-mix(in srgb, var(--color-text-primary) 10%, transparent);
    font-family: inherit;
    font-size: var(--font-size-micro);
  }

  @media (prefers-reduced-motion: reduce) {
    :global(.trakt-spotlight-overlay) {
      backdrop-filter: none;
    }

    :global(.trakt-spotlight),
    .trakt-spotlight-results {
      animation: none;
      transition: none;
    }
  }
</style>
