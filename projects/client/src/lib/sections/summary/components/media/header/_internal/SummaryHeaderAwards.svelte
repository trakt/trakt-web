<script lang="ts">
  import TrophyIcon from "$lib/components/icons/TrophyIcon.svelte";
  import * as m from "$lib/features/i18n/messages";
  import type { MediaAward } from "../../../awards/MediaAward.ts";

  /*
    Awards as a strip section: a marker, the award, then what it was for.

    Wins and nominations share one list rather than being split into two. Splitting
    them doubled the labels for what is usually two or three items, and the win is
    already legible from the marker's colour plus the "Won"/"Nominated" qualifier -
    colour is never carrying it alone.
  */
  const { awards }: { awards: ReadonlyArray<MediaAward> } = $props();
</script>

<ul class="trakt-summary-header-awards">
  {#each awards as award (award.key)}
    <li data-outcome={award.isWinner ? "won" : "nominated"}>
      <span class="award-marker" aria-hidden="true">
        <TrophyIcon />
      </span>

      <span class="award-body">
        <span class="award-title">{award.body} {award.year}</span>
        <span class="award-detail">
          {award.isWinner ? m.text_award_won() : m.text_award_nominated()}
          · {award.category}
        </span>
      </span>
    </li>
  {/each}
</ul>

<style lang="scss">
  .trakt-summary-header-awards {
    display: flex;
    flex-direction: column;
    gap: var(--gap-s);

    margin: 0;
    padding: 0;
    list-style: none;

    li {
      display: flex;
      align-items: flex-start;
      gap: var(--gap-s);

      /* Gold for a win, muted for a nomination - alongside the wording, not instead. */
      &[data-outcome="won"] {
        --award-marker-color: var(--yellow-400);
      }

      &[data-outcome="nominated"] {
        --award-marker-color: var(--color-text-secondary);
      }
    }
  }

  /*
    One line of the award title tall, centring the marker on it - the same
    construction the sentiment bullets and trivia facts use, so no column's marker
    sits optically higher than its neighbours'.
  */
  .award-marker {
    display: flex;
    align-items: center;
    justify-content: center;
    flex: none;

    width: var(--ni-16);
    height: calc(var(--font-size-text) * 1.5);

    color: var(--award-marker-color);

    :global(svg) {
      width: var(--ni-16);
      height: var(--ni-16);
    }
  }

  .award-body {
    display: flex;
    flex-direction: column;
    gap: var(--ni-2);

    min-width: 0;
  }

  .award-title {
    font-size: var(--font-size-text);
    font-weight: 600;
    color: var(--color-text-primary);
  }

  .award-detail {
    font-size: var(--font-size-text-small);
    color: var(--color-text-secondary);
    text-wrap: pretty;
  }
</style>
