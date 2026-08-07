<script lang="ts">
  import Link from "$lib/components/link/Link.svelte";
  import * as m from "$lib/features/i18n/messages";
  import { riseFade } from "$lib/utils/transitions/riseFade";
  import SummaryHeaderLabel from "../../header-kit/SummaryHeaderLabel.svelte";
  import type { PersonStat } from "./PersonStat.ts";
  import type { PersonStatsFrame } from "./PersonStatsFrame.ts";

  /*
    A person's body of work, as a figure over a label.

    Deliberately not part of the meta row above. Appended to that run these read as
    two more interchangeable items in a list of five, and the row turns to clutter.
    Given their own line and the label-over-figure treatment they read as what they
    are - a summary of the work, and the one thing here worth clicking.

    Each is a link to its drilldown. The label carries the meaning, so the figure is
    free to take the weight.
  */
  const {
    stats,
    name,
    orientation = "row",
    frame = "none",
  }: {
    stats: ReadonlyArray<PersonStat>;
    name: string;
    frame?: PersonStatsFrame;
    /*
      `row` sits them side by side on their own line; `stacked` is a single column,
      used when they flank the portrait and each side holds one.
    */
    orientation?: "row" | "stacked";
  } = $props();
</script>

{#if stats.length > 0}
  <ul
    class="trakt-person-masthead-stats"
    data-orientation={orientation}
    data-frame={frame}
  >
    {#each stats as stat, index (stat.key)}
      <!--
        These arrive after everything around them - the counts come from the credit
        queries - so they surface rather than appearing from nowhere. Staggered just
        enough to read as two things rather than one block; see riseFade for why the
        travel is only a few pixels.
      -->
      <li in:riseFade={{ delay: index * 70 }}>
        <Link
          href={stat.href}
          target="_self"
          color="inherit"
          label={m.link_label_view_person_credits({
            credits: stat.label,
            name,
          })}
        >
          <span class="stat-value">{stat.value}</span>
          <SummaryHeaderLabel text={stat.label} />
        </Link>
      </li>
    {/each}
  </ul>
{/if}

<style lang="scss">
  @use "$style/scss/mixins/index" as *;

  .trakt-person-masthead-stats {
    display: flex;
    align-items: flex-start;
    justify-content: center;
    /*
      Wide enough that the two read as separate stats rather than one run. This is
      the gap doing the work the removed separators used to.
    */
    gap: var(--ni-40);

    margin: 0;
    padding: 0;
    list-style: none;

    &[data-orientation="stacked"] {
      flex-direction: column;
      gap: var(--gap-m);
    }

    :global(a) {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: var(--ni-2);

      padding: var(--gap-xs) var(--gap-m);
      border-radius: var(--border-radius-m);

      text-decoration: none;

      /*
        The hover deliberately does NOT recolour the text. Link's default turns it
        the link colour, which is meant for inline prose - on a 24px figure it reads
        as the number having changed meaning rather than as something hoverable.
        Hence `color="inherit"` on the Link.

        Instead the surface arrives: a soft fill and the label stepping up from
        secondary to primary. Nothing moves position and no hue changes, so the
        figure stays the figure.
      */
      transition: var(--transition-increment) ease-in-out;
      transition-property: background-color;

      @include for-mouse {
        &:hover {
          background-color: color-mix(
            in srgb,
            var(--color-foreground) 10%,
            transparent
          );

          --summary-header-label-color: var(--color-text-primary);
        }
      }

      &:focus-visible {
        background-color: color-mix(
          in srgb,
          var(--color-foreground) 10%,
          transparent
        );
      }
    }

    /* A permanent soft surface, rather than one that only arrives on hover. */
    &[data-frame="glass"] :global(a) {
      background-color: color-mix(
        in srgb,
        var(--color-foreground) 6%,
        transparent
      );
    }

    /* A permanent outline. The loudest option, and the only one that puts a stroke
       back over the artwork. */
    &[data-frame="ghost"] :global(a) {
      border: var(--ni-1) solid
        color-mix(in srgb, var(--color-foreground) 22%, transparent);
    }
  }

  .stat-value {
    /*
      The figure carries the weight, so it steps above the meta row's 16px rather
      than matching it - the label beneath is what identifies it.
    */
    font-size: var(--ni-24);
    font-weight: 700;
    line-height: 1.1;
    color: var(--color-text-primary);
  }
</style>
