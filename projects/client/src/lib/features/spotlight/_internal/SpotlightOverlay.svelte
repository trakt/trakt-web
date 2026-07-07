<script lang="ts">
  import { goto } from "$app/navigation";
  import SearchIcon from "$lib/components/icons/SearchIcon.svelte";
  import * as m from "$lib/features/i18n/messages";
  import { Dialog } from "bits-ui";
  import { tick } from "svelte";
  import type { SpotlightRoute } from "./models/SpotlightRoute.ts";
  import { filterSpotlightRoutes } from "./filterSpotlightRoutes.ts";
  import { getSpotlightContext } from "./getSpotlightContext.ts";
  import { spotlightRoutes } from "./spotlightRoutes.ts";

  const { isOpen, close } = getSpotlightContext();

  let query = $state("");
  let selectedIndex = $state(0);
  let inputElement = $state<HTMLInputElement | null>(null);

  const results = $derived(filterSpotlightRoutes(spotlightRoutes, query));
  const hasQuery = $derived(query.trim().length > 0);
  const isEmpty = $derived(hasQuery && results.length === 0);
  const activeIndex = $derived(
    Math.min(selectedIndex, Math.max(0, results.length - 1)),
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

  function navigateTo(route: SpotlightRoute | Nil) {
    if (!route) return;

    close();
    goto(route.url);
  }

  function moveSelection(delta: number) {
    if (results.length === 0) return;

    const next = (activeIndex + delta + results.length) % results.length;
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
        navigateTo(results.at(activeIndex));
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

      <div
        class="trakt-spotlight-results"
        class:is-expanded={hasQuery}
      >
        <div class="trakt-spotlight-results-inner">
          {#if isEmpty}
            <p class="trakt-spotlight-empty">
              {m.spotlight_no_results({ query: query.trim() })}
            </p>
          {:else}
            <ul class="trakt-spotlight-list">
              {#each results as route, index (route.id)}
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
                    <span class="trakt-spotlight-item-url">{route.url}</span>
                  </button>
                </li>
              {/each}
            </ul>
          {/if}
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
      transform: translateX(-50%) translateY(calc(-1 * var(--ni-8)))
        scale(0.98);
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

  .trakt-spotlight-list {
    list-style: none;
    margin: 0;
    padding: var(--ni-4);
    display: flex;
    flex-direction: column;
    gap: var(--ni-2);
    max-height: 50dvh;
    overflow-y: auto;
    border-block-start: var(--border-thickness-xxs) solid
      color-mix(in srgb, var(--color-text-primary) 8%, transparent);
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
    padding: var(--ni-16);
    font-size: var(--font-size-text);
    color: var(--color-text-secondary);
    border-block-start: var(--border-thickness-xxs) solid
      color-mix(in srgb, var(--color-text-primary) 8%, transparent);
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
