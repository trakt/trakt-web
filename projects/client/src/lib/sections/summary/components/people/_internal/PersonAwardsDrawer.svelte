<script lang="ts">
  import Drawer from "$lib/components/drawer/Drawer.svelte";
  import TrophyIcon from "$lib/components/icons/TrophyIcon.svelte";
  import * as m from "$lib/features/i18n/messages";
  import type { MediaAward } from "$lib/sections/summary/components/awards/MediaAward.ts";

  /*
    Awards over nominations, as two bands. The split is the point: a win and a
    shortlisting are different achievements, and one mixed list with per-row
    qualifiers made the wins invisible. Either band vanishes when empty.
  */
  const {
    awards,
    onClose,
  }: {
    awards: ReadonlyArray<MediaAward>;
    onClose: () => void;
  } = $props();

  const wins = $derived(awards.filter((award) => award.isWinner));
  const nominations = $derived(awards.filter((award) => !award.isWinner));
</script>

{#snippet awardRows(rows: ReadonlyArray<MediaAward>)}
  <ul class="award-rows">
    {#each rows as award (award.key)}
      <li class="award-row">
        <span class="award-mark" class:is-winner={award.isWinner}>
          <TrophyIcon />
        </span>
        <span class="award-text">
          <span class="award-body bold">{award.body} {award.year}</span>
          <span class="award-category">{award.category}</span>
        </span>
      </li>
    {/each}
  </ul>
{/snippet}

<Drawer title={m.header_awards()} {onClose}>
  <div class="trakt-person-awards-drawer">
    {#if wins.length > 0}
      <section class="awards-section">
        <h3 class="awards-section-title">{m.header_awards()}</h3>
        {@render awardRows(wins)}
      </section>
    {/if}

    {#if nominations.length > 0}
      <section class="awards-section">
        <h3 class="awards-section-title">{m.header_nominations()}</h3>
        {@render awardRows(nominations)}
      </section>
    {/if}
  </div>
</Drawer>

<style lang="scss">
  .trakt-person-awards-drawer {
    display: flex;
    flex-direction: column;
    gap: var(--ni-24);
  }

  .awards-section {
    display: flex;
    flex-direction: column;
    gap: var(--ni-14);

    &:not(:first-child) {
      padding-top: var(--ni-24);
      border-top: var(--ni-1) solid var(--color-hairline);
    }
  }

  .awards-section-title {
    margin: 0;

    font-size: var(--font-size-tag);
    font-weight: 700;
    letter-spacing: 0.13em;
    text-transform: uppercase;
    color: var(--color-text-secondary);
  }

  .award-rows {
    margin: 0;
    padding: 0;
    list-style: none;

    display: flex;
    flex-direction: column;
    gap: var(--ni-14);
  }

  .award-row {
    display: flex;
    align-items: flex-start;
    gap: var(--gap-s);
  }

  .award-mark {
    display: inline-flex;
    color: var(--color-text-secondary);

    /* Gold for the wins; the shortlist stays quiet. */
    &.is-winner {
      color: var(--yellow-400);
    }

    :global(svg) {
      width: var(--ni-16);
      height: var(--ni-16);
    }
  }

  .award-text {
    display: flex;
    flex-direction: column;
    gap: var(--ni-2);

    font-size: var(--font-size-text);
  }

  .award-category {
    color: var(--color-text-secondary);
  }
</style>
