<script lang="ts">
  import Link from "$lib/components/link/Link.svelte";
  import * as m from "$lib/features/i18n/messages";
  import SummaryHeaderLabel from "../../header-kit/SummaryHeaderLabel.svelte";
  import type { PersonStat } from "./PersonStat.ts";

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
  }: {
    stats: ReadonlyArray<PersonStat>;
    name: string;
    /*
      `row` sits them side by side on their own line; `stacked` is a single column,
      used when they flank the portrait and each side holds one.
    */
    orientation?: "row" | "stacked";
  } = $props();
</script>

{#if stats.length > 0}
  <ul class="trakt-person-masthead-stats" data-orientation={orientation}>
    {#each stats as stat (stat.key)}
      <li>
        <Link
          href={stat.href}
          target="_self"
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

      text-decoration: none;
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
