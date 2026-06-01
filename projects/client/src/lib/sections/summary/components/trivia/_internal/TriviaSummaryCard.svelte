<script lang="ts">
  import Card from "$lib/components/card/Card.svelte";
  import ArrowRightIcon from "$lib/components/icons/ArrowRightIcon.svelte";
  import SparkleIcon from "$lib/components/icons/SparkleIcon.svelte";
  import Link from "$lib/components/link/Link.svelte";
  import { AnalyticsEvent } from "$lib/features/analytics/events/AnalyticsEvent";
  import { useTrack } from "$lib/features/analytics/useTrack";
  import * as m from "$lib/features/i18n/messages.ts";
  import {
    SummaryDrawers,
    summaryDrawerNavigation,
  } from "$lib/sections/summary/_internal/summaryDrawerNavigation";
  import { Marked } from "marked";

  const {
    summary,
  }: {
    summary: ReadonlyArray<string>;
  } = $props();

  const marked = new Marked();
  const { buildDrawerLink } = summaryDrawerNavigation();
  const { track } = useTrack(AnalyticsEvent.Drilldown);

  const labelMessages = [
    m.trivia_label_did_you_know,
    m.trivia_label_guess_what,
    m.trivia_label_fun_fact,
  ] as const;

  function labelFor(index: number): string {
    const message = labelMessages[index % labelMessages.length];
    return message ? message() : "";
  }
</script>

<div class="trakt-trivia-summary-card">
  <Link
    {...buildDrawerLink(SummaryDrawers.Trivia)}
    label={m.button_label_view_trivia()}
    color="inherit"
    onclick={() => track({ source: "trivia" })}
  >
    <Card
      --width-card="var(--width-trivia-card)"
      --height-card="var(--height-trivia-card)"
    >
      <article class="trakt-trivia-summary-card-body">
        <ul class="trakt-trivia-summary-list">
          {#each summary as fact, index (index)}
            <li class="trakt-trivia-summary-fact">
              <header class="trakt-trivia-summary-fact-header">
                <span class="trakt-trivia-summary-fact-icon">
                  <SparkleIcon />
                </span>
                <span class="tag secondary">{labelFor(index)}</span>
              </header>
              <div class="trakt-trivia-summary-fact-body">
                {@html marked.parse(fact)}
              </div>
            </li>
          {/each}
        </ul>

        <footer class="trakt-trivia-summary-footer">
          <ArrowRightIcon />
        </footer>
      </article>
    </Card>
  </Link>
</div>

<style lang="scss">
  @use "$style/scss/mixins/index" as *;

  .trakt-trivia-summary-card {
    width: fit-content;

    :global(.trakt-link) {
      text-decoration: none;
    }

    :global(.trakt-card-content) {
      border-radius: var(--border-radius-xl);
    }

    @include for-mobile() {
      --width-override-card: calc(100dvw - 2 * var(--layout-distance-side));
    }
  }

  .trakt-trivia-summary-card-body {
    position: relative;

    display: flex;
    flex-direction: column;
    justify-content: space-between;
    gap: var(--gap-m);

    box-sizing: border-box;
    min-height: var(--height-trivia-card);
    padding: var(--ni-28);

    background: var(--background-vip-drawer);
    border: var(--border-thickness-xxs) solid
      color-mix(in srgb, var(--color-text-primary) 17%, transparent);
    border-radius: var(--border-radius-xl);
  }

  .trakt-trivia-summary-list {
    display: flex;
    flex-direction: column;
    gap: var(--ni-20);

    margin: 0;
    padding: 0;
    list-style: none;
  }

  .trakt-trivia-summary-fact {
    display: flex;
    flex-direction: column;
    gap: var(--ni-6);
  }

  .trakt-trivia-summary-fact-header {
    display: flex;
    align-items: center;
    gap: var(--ni-8);
  }

  .trakt-trivia-summary-fact-icon {
    display: inline-flex;
    align-items: center;
    justify-content: center;

    width: var(--ni-24);
    height: var(--ni-24);

    color: var(--color-text-secondary);

    :global(svg) {
      width: 100%;
      height: 100%;
    }
  }

  .trakt-trivia-summary-fact-body {
    line-height: 1.5;

    :global(p) {
      margin: 0;
    }
  }

  .trakt-trivia-summary-footer {
    display: flex;
    justify-content: flex-end;
  }
</style>
