<script lang="ts">
  import * as m from "$lib/features/i18n/messages.ts";
  import { MAX_MIXTAPE_PICKS } from "./MAX_MIXTAPE_PICKS.ts";
  import MixtapePickSlot from "./MixtapePickSlot.svelte";
  import type { MixtapeTrayProps } from "./MixtapeTrayProps.ts";

  const { picks, picked, removeHref }: MixtapeTrayProps = $props();

  const emptySlots = $derived(
    Array.from(
      { length: MAX_MIXTAPE_PICKS - picks.length },
      (_, index) => picks.length + index,
    ),
  );
</script>

<div class="trakt-mixtape-tray">
  {#each picks as id (id)}
    <MixtapePickSlot
      media={picked.find((media) => media.id === id)}
      removeHref={removeHref(id)}
    />
  {/each}

  {#each emptySlots as position (position)}
    <div class="empty-slot" class:is-next={position === picks.length}>
      {#if position === picks.length}
        <span class="small secondary">
          {position === 0 ? m.text_mixtape_slot_first() : m.text_mixtape_slot_next()}
        </span>
      {/if}
    </div>
  {/each}
</div>

<style lang="scss">
  .trakt-mixtape-tray {
    display: grid;
    grid-template-columns: repeat(5, minmax(0, 1fr));
    gap: var(--gap-s);
    max-width: var(--ni-520);

    .empty-slot {
      aspect-ratio: 2 / 3;
      border-radius: var(--border-radius-m);
      background: var(--color-card-background);
      opacity: 0.5;

      display: flex;
      align-items: center;
      justify-content: center;
      padding: var(--gap-xxs);
      text-align: center;

      &.is-next {
        opacity: 1;
      }
    }
  }
</style>
