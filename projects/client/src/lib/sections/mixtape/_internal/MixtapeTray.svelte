<script lang="ts">
  import PlusIcon from "$lib/components/icons/PlusIcon.svelte";
  import * as m from "$lib/features/i18n/messages.ts";
  import { MAX_MIXTAPE_PICKS } from "./MAX_MIXTAPE_PICKS.ts";
  import MixtapePickSlot from "./MixtapePickSlot.svelte";
  import type { MixtapeTrayProps } from "./MixtapeTrayProps.ts";

  const { picks, picked, removeHref, onAdd }: MixtapeTrayProps = $props();

  const addLabel = $derived(
    picks.length === 0 ? m.text_mixtape_slot_first() : m.text_mixtape_slot_next(),
  );
</script>

<div class="trakt-mixtape-tray">
  {#each picks as id (id)}
    <MixtapePickSlot
      media={picked.find((media) => media.id === id)}
      removeHref={removeHref(id)}
    />
  {/each}

  {#if picks.length < MAX_MIXTAPE_PICKS}
    <button type="button" class="add-slot" onclick={onAdd}>
      <PlusIcon />
      <span class="small bold add-label">{addLabel}</span>
    </button>
  {/if}
</div>

<style lang="scss">
  @use "$style/scss/mixins/index" as *;

  .trakt-mixtape-tray {
    container-type: inline-size;

    display: grid;
    grid-template-columns: repeat(5, minmax(0, 1fr));
    gap: var(--gap-xs);

    .add-slot {
      all: unset;
      box-sizing: border-box;
      aspect-ratio: 2 / 3;

      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      gap: var(--gap-xxs);
      padding: var(--gap-xxs);

      border: var(--border-thickness-xs) dashed
        color-mix(in srgb, var(--purple-400) 70%, transparent);
      border-radius: var(--border-radius-m);
      background: color-mix(in srgb, var(--purple-500) 10%, transparent);
      color: var(--color-text-emphasis);

      text-align: center;
      cursor: pointer;
      -webkit-tap-highlight-color: transparent;

      :global(svg) {
        width: var(--ni-20);
        height: var(--ni-20);
      }

      &:focus-visible {
        outline: var(--border-thickness-xs) solid var(--purple-300);
        outline-offset: var(--ni-2);
      }
    }
  }

  @container (max-width: 280px) {
    .trakt-mixtape-tray {
      --mixtape-remove-size: var(--ni-20);

      .add-slot .add-label {
        @include visually-hidden;
      }
    }
  }
</style>
