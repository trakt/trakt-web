<script lang="ts">
  import Card from "$lib/components/card/Card.svelte";
  import ArrowRightIcon from "$lib/components/icons/ArrowRightIcon.svelte";
  import Link from "$lib/components/link/Link.svelte";
  import { AnalyticsEvent } from "$lib/features/analytics/events/AnalyticsEvent";
  import { useTrack } from "$lib/features/analytics/useTrack";
  import * as m from "$lib/features/i18n/messages.ts";
  import Spoiler from "$lib/features/spoilers/components/Spoiler.svelte";
  import type { MediaEntry } from "$lib/requests/models/MediaEntry";
  import type { MediaTrivia } from "$lib/requests/models/MediaTrivia";
  import ShadowScroller from "$lib/sections/components/ShadowScroller.svelte";
  import {
    Drawers,
    summaryDrawerNavigation,
  } from "$lib/sections/summary/_internal/summaryDrawerNavigation";
  import { Marked } from "marked";

  const {
    trivia,
    media,
    variant = "default",
  }: {
    trivia: MediaTrivia;
    media: MediaEntry;
    variant?: "summary" | "default";
  } = $props();

  const marked = new Marked();

  const { buildDrawerLink } = summaryDrawerNavigation();
  const { track } = useTrack(AnalyticsEvent.Drilldown);
</script>

{#snippet parsedContent()}
  {@html marked.parse(trivia.text)}
{/snippet}

{#snippet content()}
  {#if !trivia.isSpoiler}
    {@render parsedContent()}
  {:else}
    <Spoiler {media} type={media.type}>
      {@render parsedContent()}
    </Spoiler>
  {/if}
{/snippet}

{#snippet triviaCard()}
  <Card --width-card="100%" --height-card="fit-content">
    <div class="trakt-trivia-container" data-variant="default">
      {@render content()}
    </div>
  </Card>
{/snippet}

{#snippet triviaSummaryCard()}
  <div class="trakt-trivia-summary-card">
    <Link
      href={buildDrawerLink(Drawers.Trivia)}
      label={m.button_label_view_trivia()}
      noscroll
      color="inherit"
      onclick={() => track({ source: "trivia" })}
    >
      <Card
        --width-card="var(--width-trivia-card)"
        --height-card="var(--height-trivia-card)"
      >
        <div class="trakt-trivia-container" data-variant="summary">
          <ShadowScroller>
            {@render content()}
          </ShadowScroller>
          <div class="trakt-trivia-footer">
            <ArrowRightIcon />
          </div>
        </div>
      </Card>
    </Link>
  </div>
{/snippet}

{#if variant === "summary"}
  {@render triviaSummaryCard()}
{:else}
  {@render triviaCard()}
{/if}

<style lang="scss">
  @use "$style/scss/mixins/index" as *;

  .trakt-trivia-container {
    position: relative;

    display: flex;
    flex-direction: column;
    gap: var(--gap-s);
    justify-content: space-between;

    padding: var(--ni-16) var(--ni-20);

    height: 100%;
    box-sizing: border-box;

    :global(.trakt-spoiler) {
      cursor: pointer;
    }

    :global(li) {
      font-size: var(--font-size-text);
    }

    &[data-variant="summary"] {
      :global(ul) {
        margin: 0;
        padding-left: var(--font-size-text);
      }
    }
  }

  .trakt-trivia-summary-card {
    .trakt-trivia-container {
      gap: var(--gap-micro);

      border-radius: var(--border-radius-m);
      background: var(--background-vip-drawer);
    }

    :global(.trakt-link) {
      text-decoration: none;
    }

    @include for-mobile() {
      --width-override-card: calc(100dvw - 2 * var(--layout-distance-side));
    }
  }

  .trakt-trivia-footer {
    display: flex;
    justify-content: flex-end;
  }
</style>
