<script lang="ts">
  import MarkdownText from "$lib/sections/components/markdown/MarkdownText.svelte";
  import type { SeasonRecap } from "$lib/requests/models/SeasonRecap.ts";
  import { AnalyticsEvent } from "$lib/features/analytics/events/AnalyticsEvent.ts";
  import { useTrack } from "$lib/features/analytics/useTrack.ts";
  import { Accordion } from "bits-ui";
  import RecapAccordionItem from "./RecapAccordionItem.svelte";

  const { chapters }: { chapters: SeasonRecap["chapters"] } = $props();

  const { track: trackChapter } = useTrack(AnalyticsEvent.RecapChapter);

  let openKey = $state("");

  function onValueChange(key: string) {
    openKey = key;
    if (key !== "") trackChapter();
  }
</script>

<Accordion.Root
  type="single"
  value={openKey}
  {onValueChange}
  class="trakt-recap-chapters"
>
  {#each chapters as chapter, index (chapter.key)}
    <div class="chapter-item" class:is-open={openKey === chapter.key}>
      <RecapAccordionItem value={chapter.key} isOpen={openKey === chapter.key}>
        {#snippet trigger()}
          <span class="bold chapter-number" aria-hidden="true">{index + 1}</span>
          <span class="bold chapter-title">{chapter.title}</span>
        {/snippet}

        <div class="chapter-body secondary">
          <MarkdownText text={chapter.body} spacing="relaxed" />
        </div>
      </RecapAccordionItem>
    </div>
  {/each}
</Accordion.Root>

<style lang="scss">
  @use "$style/scss/mixins/index" as *;

  :global(.trakt-recap-chapters) {
    --recap-accordion-trigger-height: var(--ni-56);
    --recap-accordion-trigger-padding: var(--ni-14);
    --recap-accordion-focus-offset: calc(-1 * var(--border-thickness-xs));

    display: flex;
    flex-direction: column;

    overflow: hidden;
    border-radius: var(--border-radius-m);
    background: color-mix(in srgb, var(--color-text-primary) 4%, transparent);

    .chapter-item + .chapter-item {
      border-top: var(--border-thickness-xxs) solid
        color-mix(in srgb, var(--color-text-primary) 8%, transparent);
    }

    @include for-mouse {
      .chapter-item:hover .chapter-number {
        background-color: color-mix(
          in srgb,
          var(--color-text-primary) 16%,
          transparent
        );
      }
    }

    .chapter-number {
      display: flex;
      align-items: center;
      justify-content: center;
      flex-shrink: 0;

      width: var(--ni-28);
      height: var(--ni-28);

      border-radius: 50%;
      background-color: color-mix(
        in srgb,
        var(--color-text-primary) 10%,
        transparent
      );
      color: var(--color-text-secondary);

      font-size: var(--font-size-text-small);

      transition: background-color var(--transition-increment) ease-in-out;
    }

    .chapter-title {
      flex: 1;
      min-width: 0;
      text-align: start;
    }

    .chapter-item.is-open .chapter-number {
      background-color: var(--color-vip-border-accent);
      color: var(--shade-10);
    }

    .chapter-body {
      padding-block-end: var(--gap-m);
      padding-inline-end: var(--ni-14);
      padding-inline-start: calc(var(--ni-14) + var(--ni-28) + var(--gap-s));
    }
  }
</style>
