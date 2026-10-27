<script lang="ts">
  import * as m from "$lib/features/i18n/messages.ts";
  import type { Season } from "$lib/requests/models/Season.ts";
  import type { ShowRecapStory } from "$lib/requests/models/ShowRecapStory.ts";
  import InlineMarkdown from "$lib/sections/components/markdown/InlineMarkdown.svelte";
  import MarkdownText from "$lib/sections/components/markdown/MarkdownText.svelte";
  import { Accordion } from "bits-ui";
  import RecapAccordionItem from "./RecapAccordionItem.svelte";
  import { toStorySeasonMeta } from "./toStorySeasonMeta.ts";

  const { segments, seasons, nextSeason }: {
    segments: ShowRecapStory["segments"];
    seasons: ReadonlyArray<Pick<Season, "number" | "episodes" | "airDate">>;
    nextSeason: number | null;
  } = $props();

  const entries = $derived(
    segments.map((segment) => {
      const [lead = "", ...more] = segment.text.trim().split(/\n{2,}/);
      const season = seasons.find(({ number }) => number === segment.season);

      return {
        key: `story-season-${segment.season}`,
        number: segment.season,
        lead,
        more: more.join("\n\n"),
        meta: toStorySeasonMeta(season),
      };
    }),
  );

  let toggled = $state(new Map<string, boolean>());

  const latestKey = $derived(entries.at(-1)?.key);
  const isOpen = (key: string) => toggled.get(key) ?? key === latestKey;
  const openKeys = $derived(
    entries.map(({ key }) => key).filter(isOpen),
  );
</script>

<div class="trakt-recap-story-timeline">
  <span class="timeline-line" aria-hidden="true"></span>

  <Accordion.Root
    type="multiple"
    value={openKeys}
    onValueChange={(keys) =>
      (toggled = new Map(
        entries.map(({ key }) => [key, keys.includes(key)]),
      ))}
    class="timeline-list"
  >
    {#each entries as entry (entry.key)}
      {@const isEntryOpen = isOpen(entry.key)}
      <div class="timeline-item">
        <span class="bold timeline-node" class:is-open={isEntryOpen} aria-hidden="true">
          {entry.number}
        </span>

        <div class="timeline-card" class:is-open={isEntryOpen}>
          <RecapAccordionItem value={entry.key} isOpen={isEntryOpen}>
            {#snippet trigger()}
              <span class="timeline-heading">
                <span class="bold">
                  {m.text_season_number({ number: entry.number })}
                </span>
                {#if entry.meta}
                  <span class="small secondary">{entry.meta}</span>
                {/if}
              </span>
            {/snippet}

            {#snippet preview()}
              <p class="timeline-lead" class:is-open={isEntryOpen}>
                <InlineMarkdown text={entry.lead} />
              </p>
            {/snippet}

            {#if entry.more}
              <div class="secondary">
                <MarkdownText text={entry.more} spacing="relaxed" />
              </div>
            {/if}
          </RecapAccordionItem>
        </div>
      </div>
    {/each}
  </Accordion.Root>

  {#if nextSeason != null}
    <div class="timeline-up-next">
      <span class="bold timeline-node is-pending" aria-hidden="true">
        {nextSeason}
      </span>
      <span class="secondary">
        {m.text_recap_story_up_next({ number: nextSeason })}
      </span>
    </div>
  {/if}
</div>

<style lang="scss">
  .trakt-recap-story-timeline {
    --timeline-node-size: var(--ni-28);

    position: relative;

    display: flex;
    flex-direction: column;
    gap: var(--ni-14);

    .timeline-line {
      position: absolute;
      top: var(--ni-14);
      bottom: var(--ni-14);
      inset-inline-start: calc(var(--timeline-node-size) / 2 - 1px);

      width: var(--ni-2);

      background: linear-gradient(
        180deg,
        var(--color-vip-border-accent),
        color-mix(in srgb, var(--color-vip-border-accent) 30%, transparent)
      );
    }

    :global(.timeline-list) {
      display: flex;
      flex-direction: column;
      gap: var(--ni-14);
    }

    .timeline-item {
      position: relative;

      display: flex;
      gap: var(--gap-s);
    }

    .timeline-node {
      position: relative;

      display: flex;
      align-items: center;
      justify-content: center;
      flex-shrink: 0;

      width: var(--timeline-node-size);
      height: var(--timeline-node-size);
      margin-top: var(--ni-10);

      border-radius: 50%;
      background-color: var(--purple-800);
      box-shadow: 0 0 0 var(--border-thickness-s)
        var(--color-card-background);
      color: var(--shade-10);

      font-size: var(--font-size-text-small);

      &.is-pending {
        box-sizing: border-box;
        margin-top: 0;

        border: var(--border-thickness-xs) dashed var(--color-text-secondary);
        background-color: var(--color-card-background);
        box-shadow: none;
        color: var(--color-text-secondary);
      }
    }

    .timeline-node.is-open {
      background-color: var(--color-vip-border-accent);
    }

    .timeline-card {
      --recap-accordion-gap: var(--gap-xs);
      --recap-accordion-trigger-height: var(--ni-28);
      --recap-accordion-focus-offset: var(--ni-2);

      flex: 1;
      min-width: 0;
      padding: var(--gap-s) var(--ni-14) var(--ni-14);

      border-radius: var(--border-radius-m);
      background: color-mix(in srgb, var(--color-text-primary) 4%, transparent);
    }

    .timeline-card.is-open {
      background: var(--recap-card-background);
      box-shadow: inset 0 0 0 var(--border-thickness-xxs)
        var(--recap-card-ring);
    }

    .timeline-heading {
      display: flex;
      flex-direction: column;
      gap: var(--ni-2);
    }

    .timeline-lead {
      line-height: 1.5;
      color: var(--color-text-secondary);

      display: -webkit-box;
      -webkit-box-orient: vertical;
      -webkit-line-clamp: 2;
      line-clamp: 2;
      overflow: hidden;
    }

    .timeline-lead.is-open {
      display: block;
      color: var(--color-text-primary);
    }

    .timeline-up-next {
      position: relative;

      display: flex;
      align-items: center;
      gap: var(--gap-s);
    }
  }

</style>
