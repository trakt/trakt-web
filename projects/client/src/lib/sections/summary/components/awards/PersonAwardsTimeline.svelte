<script lang="ts">
  import ListHeader from "$lib/components/lists/ListHeader.svelte";
  import ListCollapseButton from "$lib/components/lists/section-list/ListCollapseButton.svelte";
  import { useCollapsedList } from "$lib/components/lists/section-list/useCollapsedList";
  import type { ListDrilldownProps } from "$lib/components/lists/section-list/models/ListDrilldownProps";
  import Link from "$lib/components/link/Link.svelte";
  import * as m from "$lib/features/i18n/messages.ts";
  import type { AwardEntry } from "$lib/requests/models/AwardEntry";
  import { SOURCE_PARAM } from "$lib/sections/summary/constants.ts";
  import { SummaryDrawers } from "$lib/sections/summary/SummaryDrawers.ts";
  import { summaryDrawerNavigation } from "$lib/sections/summary/summaryDrawerNavigation.ts";
  import { fromRune } from "$lib/utils/store/fromRune.svelte";
  import { UrlBuilder } from "$lib/utils/url/UrlBuilder";
  import AwardsLiveLine from "./_internal/AwardsLiveLine.svelte";
  import AwardTag from "./_internal/AwardTag.svelte";
  import { toAwardLiveText } from "./_internal/toAwardLiveText.ts";
  import { toAwardSummary } from "./_internal/toAwardSummary.ts";
  import MessageWithBold from "$lib/components/text/MessageWithBold.svelte";
  import { toAwardSummaryParts } from "./_internal/toAwardSummaryParts.ts";
  import { toAwardTimeline } from "./_internal/toAwardTimeline.ts";
  import { toNearestAwardYear } from "./_internal/toNearestAwardYear.ts";
  import { useCareerStart } from "./_internal/useCareerStart.ts";
  import { useAwards } from "./useAwards.ts";
  import { slide } from "svelte/transition";
  import { toAwardCategoryName } from "./_internal/toAwardCategoryName.ts";

  const LIST_LIMIT = 3;

  const { slug }: { slug: string } = $props();

  const slug$ = fromRune(() => slug);
  const { awards, groups } = useAwards(
    fromRune(() => ({ type: "person" as const, slug })),
  );
  const careerStart = useCareerStart(slug$);

  const today = new Date();
  const entries = $derived($awards ?? []);
  const topGroup = $derived($groups.at(0));
  const headline = $derived(
    topGroup
      ? toAwardSummaryParts(toAwardSummary([topGroup])).at(0)
      : undefined,
  );
  const liveText = $derived(toAwardLiveText({ groups: $groups, today }));
  const timeline = $derived(
    toAwardTimeline({ entries, careerStart: $careerStart, today }),
  );
  const wins = $derived(
    entries
      .filter((entry) => entry.won === true)
      .sort((a, b) => b.year - a.year),
  );

  let selectedYear = $state<number | null>(null);
  const isScrubbable = $derived(timeline.milestones.length === 0);
  const selected = $derived(
    timeline.years.find((year) => year.year === selectedYear),
  );
  const listed = $derived(
    selected?.entries ??
      (wins.length > 0 ? wins : entries).slice(0, LIST_LIMIT),
  );
  const restingRows = $derived(
    Math.min((wins.length > 0 ? wins : entries).length, LIST_LIMIT),
  );
  const announced = $derived(selected ?? timeline.years.at(-1));
  const selectedText = $derived(
    announced?.entries.map(toEntryLabel).join(", ") ??
      m.aria_label_award_timeline(),
  );

  const { isCollapsed: isListCollapsed, toggle } = $derived(
    useCollapsedList(`awards-timeline-${slug}`),
  );
  const isCollapsed = $derived($isListCollapsed);

  const { buildDrawerLink } = summaryDrawerNavigation();
  const drilldown: ListDrilldownProps = $derived({
    ...buildDrawerLink(SummaryDrawers.Awards, { [SOURCE_PARAM]: "timeline" }),
    source: { id: "awards" },
    label: m.button_text_view_all(),
  });

  function toStatus(entry: AwardEntry) {
    if (entry.won === true) return m.tag_text_award_won();
    if (entry.won === null) return m.tag_text_award_pending();
    return m.tag_text_award_nominee();
  }

  function toEntryLabel(entry: AwardEntry) {
    return m.aria_label_award_timeline_entry({
      year: entry.year,
      status: toStatus(entry),
      category: toAwardCategoryName(entry.category),
      title: entry.media?.title ?? "",
    });
  }

  function isRtl(element: HTMLElement) {
    return getComputedStyle(element).direction === "rtl";
  }

  function scrub(event: PointerEvent & { currentTarget: HTMLElement }) {
    const rect = event.currentTarget.getBoundingClientRect();
    const ratio = (event.clientX - rect.left) / rect.width;
    const x = (isRtl(event.currentTarget) ? 1 - ratio : ratio) * 100;
    selectedYear = toNearestAwardYear(timeline.years, x)?.year ?? null;
  }

  function release(event: PointerEvent) {
    if (event.pointerType !== "mouse") return;
    selectedYear = null;
  }

  function step(offset: number) {
    const last = timeline.years.length - 1;
    const index = timeline.years.findIndex(
      (year) => year.year === selectedYear,
    );
    const next = Math.min(
      Math.max((index === -1 ? last : index) + offset, 0),
      last,
    );
    selectedYear = timeline.years.at(next)?.year ?? null;
  }

  function navigate(event: KeyboardEvent & { currentTarget: HTMLElement }) {
    const sign = isRtl(event.currentTarget) ? -1 : 1;
    const offsets: Record<string, number> = {
      ArrowRight: sign,
      ArrowLeft: -sign,
      ArrowUp: 1,
      ArrowDown: -1,
      Home: -timeline.years.length,
      End: timeline.years.length,
    };

    if (event.key === "Escape") {
      selectedYear = null;
      return;
    }

    const offset = offsets[event.key];
    if (offset == null) return;

    event.preventDefault();
    step(offset);
  }

  function toMediaHref(entry: AwardEntry) {
    return entry.media
      ? UrlBuilder.media(entry.media.type, entry.media.slug)
      : undefined;
  }
</script>

{#snippet titleAction()}
  <ListCollapseButton
    title={m.list_title_awards()}
    {isCollapsed}
    onclick={toggle}
  />
{/snippet}

{#snippet liveLine()}
  <AwardsLiveLine text={liveText ?? ""} />
{/snippet}

{#if entries.length > 0 && topGroup}
  <section class="trakt-person-awards-timeline">
    <ListHeader
      title={m.list_title_awards()}
      {titleAction}
      titleBadge={liveText && !isCollapsed ? liveLine : undefined}
      drilldown={isCollapsed ? undefined : drilldown}
    />

    {#if !isCollapsed}
      <div class="timeline-content" transition:slide={{ duration: 150 }}>
        <article class="timeline-card">
          <div class="timeline-headline">
            <p class="headline-text" data-kind={headline?.kind}>
              <MessageWithBold message={headline?.message ?? ""} />
            </p>
            <p class="small secondary">
              {m.text_award_career_since({
                ceremony: topGroup.name,
                year: timeline.start,
              })}
            </p>
          </div>

          <div
            class="timeline-track"
            data-layout={timeline.milestones.length > 0
              ? `milestones-${timeline.milestones.length}`
              : "dots"}
            {...isScrubbable
              ? {
                  role: "slider",
                  tabindex: 0,
                  "aria-label": m.aria_label_award_timeline(),
                  "aria-valuemin": timeline.years.at(0)?.year,
                  "aria-valuemax": timeline.years.at(-1)?.year,
                  "aria-valuenow": announced?.year,
                  "aria-valuetext": selectedText,
                  onpointerdown: scrub,
                  onpointermove: scrub,
                  onpointerleave: release,
                  onkeydown: navigate,
                  onblur: () => (selectedYear = null),
                }
              : {}}
          >
            <span class="timeline-axis"></span>

            {#each timeline.ticks as tick (tick.key)}
              <span
                class="timeline-tick small"
                class:is-now={tick.isNow}
                style:--timeline-x="{tick.x}%"
              >
                {tick.isNow ? m.text_award_timeline_now() : tick.year}
              </span>
            {/each}

            {#if selected}
              <span
                class="timeline-cursor"
                style:--timeline-x="{selected.x}%"
                aria-hidden="true"
              ></span>
              <span
                class="timeline-cursor-label small bold"
                class:is-won={selected.isWon}
                style:--timeline-x="{selected.x}%"
                aria-hidden="true"
              >
                {selected.year}
              </span>
            {/if}

            {#each timeline.years as year (year.key)}
              <span
                class="timeline-dot"
                class:is-won={year.isWon}
                class:is-selected={year.year === selectedYear}
                style:--timeline-x="{year.x}%"
                aria-hidden="true"
              ></span>
            {/each}

            {#each timeline.winLabels as label (label.key)}
              <span
                class="timeline-win-label small bold"
                class:is-low={label.isLow}
                class:is-dimmed={selected != null}
                style:--timeline-x="{label.x}%"
              >
                {label.year}
              </span>
            {/each}

            {#each timeline.milestones as milestone (milestone.entry.key)}
              <div
                class="timeline-milestone"
                class:is-won={milestone.entry.won === true}
                class:is-below={milestone.isBelow}
                data-align={milestone.align}
                style:--timeline-x="{milestone.x}%"
              >
                {#if milestone.entry.won}
                  <AwardTag won={true} variant="inline" />
                {/if}
                <span class="bold">
                  {toAwardCategoryName(milestone.entry.category)}
                </span>
                <span class="small secondary">
                  <Link
                    href={toMediaHref(milestone.entry)}
                    color="accent"
                    underline="hover"
                  >
                    {milestone.entry.media?.title}
                  </Link>
                  · {milestone.entry.year}
                </span>
              </div>
            {/each}
          </div>

          {#if timeline.milestones.length === 0}
            <div class="timeline-legend small secondary">
              {#if wins.length > 0}
                <span class="legend-item">
                  <i class="legend-dot is-won"></i>{m.tag_text_award_won()}
                </span>
              {/if}
              <span class="legend-item">
                <i class="legend-dot"></i>{m.tag_text_award_nominee()}
              </span>
            </div>

            <ul class="timeline-list" style:--timeline-list-rows={restingRows}>
              {#each listed as entry (entry.key)}
                <li class="timeline-list-item">
                  <AwardTag won={entry.won} variant="inline" />
                  <span class="small ellipsis">
                    {toAwardCategoryName(entry.category)} ·
                    <Link
                      href={toMediaHref(entry)}
                      color="accent"
                      underline="hover"
                    >
                      <span class="timeline-link small"
                        >{entry.media?.title}</span
                      >
                    </Link>
                    <span class="small secondary">{entry.year}</span>
                  </span>
                </li>
              {/each}
            </ul>
          {/if}
        </article>
      </div>
    {/if}
  </section>
{/if}

<style lang="scss">
  @use "$style/scss/mixins/index" as *;

  .trakt-person-awards-timeline {
    display: flex;
    flex-direction: column;
    gap: var(--list-header-gap);
  }

  .timeline-content {
    padding-inline: var(--layout-distance-side);
  }

  .timeline-card {
    display: flex;
    flex-direction: column;
    gap: var(--gap-m);

    padding: var(--gap-m);
    border-radius: var(--border-radius-l);
    background: var(--color-card-background);
  }

  .headline-text {
    font-size: var(--ni-22);
    font-weight: 600;
    line-height: 1.15;

    :global(b) {
      font-weight: inherit;
    }

    &[data-kind="wins"] :global(b),
    &[data-kind="festival"] :global(b) {
      color: var(--color-award-gold-text);
    }
  }

  .timeline-track {
    --timeline-axis-top: var(--ni-48);

    position: relative;
    height: var(--ni-96);
    margin-inline: var(--ni-6);

    &[data-layout="milestones-1"] {
      --timeline-axis-top: var(--ni-104);

      height: var(--ni-148);
    }

    &[data-layout="milestones-2"] {
      --timeline-axis-top: var(--ni-96);

      height: var(--ni-208);
    }
  }

  .timeline-track[role="slider"] {
    touch-action: pan-y;
    user-select: none;
    -webkit-tap-highlight-color: transparent;

    @include for-mouse {
      cursor: pointer;
    }

    &:focus-visible {
      outline: var(--border-thickness-xs) solid var(--color-input-focus);
      outline-offset: var(--ni-4);
      border-radius: var(--border-radius-m);
    }
  }

  .timeline-cursor {
    position: absolute;
    inset-inline-start: var(--timeline-x);
    inset-block: var(--ni-28) calc(100% - var(--timeline-axis-top));
    translate: calc(var(--rtl-sign) * -50%) 0;

    width: var(--ni-2);
    border-radius: var(--ni-2);
    background: var(--color-award-nominee);
    opacity: 0.5;
    pointer-events: none;
  }

  .timeline-cursor-label {
    position: absolute;
    inset-inline-start: var(--timeline-x);
    inset-block-start: var(--ni-8);
    translate: calc(var(--rtl-sign) * -50%) 0;

    color: var(--color-text-primary);
    white-space: nowrap;
    pointer-events: none;

    &.is-won {
      color: var(--color-award-gold-text);
    }
  }

  .timeline-axis {
    position: absolute;
    inset-inline: 0;
    inset-block-start: var(--timeline-axis-top);

    height: var(--ni-2);
    border-radius: var(--ni-2);
    background: var(--color-award-axis);
  }

  .timeline-tick,
  .timeline-dot,
  .timeline-win-label,
  .timeline-milestone {
    position: absolute;
    inset-inline-start: var(--timeline-x);
    translate: calc(var(--rtl-sign) * -50%) 0;
  }

  .timeline-tick {
    inset-block-start: calc(var(--timeline-axis-top) + var(--ni-12));
    color: var(--color-text-secondary);
    font-variant-numeric: tabular-nums;

    &.is-now {
      color: var(--color-text-primary);
      font-weight: 600;
    }
  }

  .timeline-dot {
    inset-block-start: calc(var(--timeline-axis-top) - var(--ni-4));
    pointer-events: none;
    @media (prefers-reduced-motion: no-preference) {
      transition: scale var(--transition-increment) ease-out;
    }

    &.is-selected {
      scale: 1.6;
    }

    width: var(--ni-10);
    height: var(--ni-10);
    border-radius: 50%;

    background: var(--color-card-background);
    box-shadow: inset 0 0 0 var(--ni-2) var(--color-award-nominee);

    &.is-won {
      inset-block-start: calc(var(--timeline-axis-top) - var(--ni-8));

      width: var(--ni-16);
      height: var(--ni-16);

      background: var(--color-award-gold);
      box-shadow:
        0 0 0 var(--ni-3) var(--color-card-background),
        0 0 var(--ni-14) var(--color-award-gold-soft);
    }
  }

  .timeline-win-label {
    inset-block-start: var(--ni-8);
    transition: opacity var(--transition-increment) ease-out;

    &.is-dimmed {
      opacity: 0;
    }

    color: var(--color-award-gold-text);
    white-space: nowrap;

    &.is-low {
      inset-block-start: calc(var(--timeline-axis-top) + var(--ni-28));
    }
  }

  .timeline-milestone {
    inset-block-start: calc(var(--timeline-axis-top) - var(--ni-88));

    display: flex;
    flex-direction: column;
    align-items: flex-start;
    gap: var(--ni-2);

    max-width: min(var(--ni-280), 90%);
    min-height: var(--ni-64);
    padding: var(--ni-10) var(--ni-14);
    box-sizing: border-box;

    border-radius: var(--border-radius-m);
    background: var(--color-award-tag-background);
    white-space: nowrap;

    &[data-align="end"] {
      translate: calc(var(--rtl-sign) * (-100% + var(--ni-18))) 0;
    }

    &[data-align="start"] {
      translate: calc(var(--rtl-sign) * calc(-1 * var(--ni-18))) 0;
    }

    &.is-won {
      background: var(--color-award-gold-soft);
      box-shadow: inset 0 0 0 var(--ni-1) var(--color-award-tag-won-ring);
    }

    &.is-below {
      inset-block-start: calc(var(--timeline-axis-top) + var(--ni-38));
    }
  }

  .timeline-legend {
    display: flex;
    gap: var(--gap-s);

    .legend-item {
      display: inline-flex;
      align-items: center;
      gap: var(--ni-6);
    }

    .legend-dot {
      width: var(--ni-10);
      height: var(--ni-10);
      border-radius: 50%;
      box-shadow: inset 0 0 0 var(--ni-2) var(--color-award-nominee);

      &.is-won {
        background: var(--color-award-gold);
        box-shadow: none;
      }
    }
  }

  .timeline-list {
    --timeline-list-row-height: var(--ni-20);

    min-height: calc(
      var(--timeline-list-rows) * var(--timeline-list-row-height) +
        (var(--timeline-list-rows) - 1) * var(--gap-xs)
    );

    display: flex;
    flex-direction: column;
    gap: var(--gap-xs);

    margin: 0;
    padding: var(--gap-s) 0 0;
    list-style: none;
    border-block-start: var(--ni-1) solid var(--color-award-tag-ring);
  }

  .timeline-link {
    font-weight: 500;
  }

  .timeline-list-item {
    min-height: var(--timeline-list-row-height);
    display: grid;
    grid-template-columns: minmax(var(--ni-64), max-content) minmax(0, 1fr);
    align-items: center;
    gap: var(--gap-xs);
  }
</style>
