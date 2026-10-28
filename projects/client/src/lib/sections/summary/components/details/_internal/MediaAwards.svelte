<script lang="ts">
  import TrophyIcon from "$lib/components/icons/TrophyIcon.svelte";
  import * as m from "$lib/features/i18n/messages.ts";
  import { useMediaAwards } from "../../awards/useMediaAwards.ts";

  /*
    Every award and nomination, as a band in the details drawer - the one
    place the full list lives now that the dedicated awards drawer has
    retired. Wins wear the gold trophy and lead (useMediaAwards sorts them
    first); nominations follow with the quiet one and their qualifier.
  */
  const { slug }: { slug: string } = $props();

  const { awards } = $derived(useMediaAwards({ slug }));
</script>

{#if awards.length > 0}
  <section class="trakt-media-awards">
    <p class="awards-title">{m.header_awards()}</p>

    <ul class="awards-list">
      {#each awards as award (award.key)}
        <li class="award-row">
          <span class="award-mark" class:is-winner={award.isWinner}>
            <TrophyIcon />
          </span>
          <span class="award-text">
            <span class="award-body">{award.body} {award.year}</span>
            <span class="award-category">
              {award.isWinner ? m.text_award_won() : m.text_award_nominated()}
              · {award.category}
            </span>
          </span>
        </li>
      {/each}
    </ul>
  </section>
{/if}

<style lang="scss">
  .trakt-media-awards {
    display: flex;
    flex-direction: column;
    gap: var(--gap-s);
  }

  .awards-title {
    margin: 0;

    font-size: var(--font-size-tag);
    font-weight: 700;
    letter-spacing: 0.13em;
    text-transform: uppercase;
    color: var(--color-text-secondary);
  }

  .awards-list {
    margin: 0;
    padding: 0;
    list-style: none;

    display: flex;
    flex-direction: column;
    gap: var(--ni-12);
  }

  .award-row {
    display: flex;
    align-items: flex-start;
    gap: var(--gap-s);

    font-size: var(--font-size-text);
  }

  .award-mark {
    display: inline-flex;
    align-items: center;

    /* Spans the body line so the trophy centres on it. */
    height: calc(var(--font-size-text) * 1.5);

    color: var(--color-text-secondary);

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

    min-width: 0;
  }

  .award-body {
    color: var(--color-text-primary);
    line-height: 1.5;
  }

  .award-category {
    color: var(--color-text-secondary);
    font-size: var(--font-size-text-small);
  }
</style>
