<script lang="ts">
  import * as m from "$lib/features/i18n/messages.ts";
  import UpsellCta from "$lib/features/upsell/UpsellCta.svelte";
  import type { MovieLore } from "$lib/requests/models/MovieLore.ts";
  import { toLockedTease } from "./toLockedTease.ts";

  const PREVIEW_OPACITIES = [0.6, 0.4, 0.25];

  const { locked, hasEarlier }: {
    locked: MovieLore["locked"];
    hasEarlier: boolean;
  } = $props();

  const tease = $derived(locked ? toLockedTease(locked) : "");
</script>

<div class="trakt-movie-lore-locked">
  {#if tease}
    <p class="small secondary">{tease}</p>
  {/if}

  <div class="locked-timeline" aria-hidden="true">
    {#each PREVIEW_OPACITIES as opacity (opacity)}
      <div class="locked-row" style="--locked-opacity: {opacity}">
        <span class="locked-node"></span>
        <span class="locked-card"></span>
      </div>
    {/each}
  </div>

  <UpsellCta source="movie-lore" title={m.tab_text_movie_lore_lore()}>
    {hasEarlier
      ? m.text_movie_lore_upsell_with_earlier()
      : m.text_movie_lore_upsell()}
  </UpsellCta>
</div>

<style lang="scss">
  @use "$style/scss/mixins/index" as *;

  .trakt-movie-lore-locked {
    display: flex;
    flex-direction: column;
    gap: var(--gap-m);

    .locked-timeline {
      position: relative;

      display: flex;
      flex-direction: column;
      gap: var(--gap-s);

      &::before {
        content: "";
        position: absolute;
        top: var(--ni-18);
        bottom: var(--ni-18);
        inset-inline-start: calc(var(--ni-36) / 2 - 1px);

        width: var(--ni-2);
        background-color: color-mix(
          in srgb,
          var(--color-text-primary) 14%,
          transparent
        );
      }
    }

    .locked-row {
      position: relative;

      display: flex;
      gap: var(--gap-s);

      opacity: var(--locked-opacity);

      @include spoiler-blur();
    }

    .locked-node {
      flex-shrink: 0;

      width: var(--ni-36);
      aspect-ratio: 2 / 3;
      margin-top: var(--ni-4);

      border-radius: var(--ni-6);
      background-color: var(--purple-800);
      box-shadow: 0 0 0 var(--border-thickness-s) var(--color-card-background);
    }

    .locked-card {
      flex: 1;
      height: var(--ni-88);

      border-radius: var(--border-radius-m);
      background: color-mix(in srgb, var(--color-text-primary) 4%, transparent);
    }
  }
</style>
