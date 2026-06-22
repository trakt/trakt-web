<script lang="ts">
  import CheckIcon from "$lib/components/icons/CheckIcon.svelte";
  import * as m from "$lib/features/i18n/messages.ts";
  import type { StreamingSource } from "$lib/requests/models/StreamingSource.ts";
  import ServiceLogoBox from "./ServiceLogoBox.svelte";

  const {
    source,
    isFavorite,
    disabled = false,
    onToggle,
  }: {
    source: StreamingSource;
    isFavorite: boolean;
    disabled?: boolean;
    onToggle: () => void;
  } = $props();
</script>

<button
  class="trakt-favorite-service-tile"
  type="button"
  aria-pressed={isFavorite}
  aria-label={m.button_label_toggle_favorite_service({ service: source.name })}
  title={source.logoUrl ? source.name : undefined}
  {disabled}
  onclick={onToggle}
>
  <ServiceLogoBox
    source={source.source}
    dimmed={!isFavorite}
    selected={isFavorite}
  />
  {#if isFavorite}
    <span class="tile-check" aria-hidden="true">
      <CheckIcon />
    </span>
  {/if}
</button>

<style lang="scss">
  .trakt-favorite-service-tile {
    position: relative;

    display: block;
    width: 100%;
    // Reset the user-agent button padding so the logo box fills the grid cell
    // edge-to-edge — otherwise the default (wider) horizontal padding inset the
    // tiles and showed up as uneven spacing between columns.
    padding: 0;

    background: transparent;
    border: none;
    cursor: pointer;
    color: inherit;

    &:disabled {
      cursor: not-allowed;
      opacity: var(--de-emphasized-opacity);
    }
  }

  .tile-check {
    position: absolute;
    top: var(--ni-neg-6);
    right: var(--ni-neg-4);

    display: flex;
    align-items: center;
    justify-content: center;

    width: var(--ni-18);
    height: var(--ni-18);

    border-radius: 50%;
    background: var(--color-background-purple);
    color: var(--shade-10);

    :global(svg) {
      width: var(--ni-10);
      height: var(--ni-10);
    }

    :global(svg path) {
      stroke-width: 3;
    }
  }
</style>
