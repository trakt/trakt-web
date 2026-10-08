<script lang="ts">
  import ReactionIcon from "$lib/components/icons/ReactionIcon.svelte";
  import ReactionEmoji from "$lib/components/reactions/ReactionEmoji.svelte";
  import { REACTIONS_CODE_MAP } from "$lib/components/reactions/constants.ts";
  import { getLocale } from "$lib/features/i18n/index.ts";
  import type { MediaReaction } from "$lib/requests/models/MediaReaction.ts";
  import { useMedia, WellKnownMediaQuery } from "$lib/stores/css/useMedia.ts";
  import { toHumanCount } from "$lib/utils/formatting/number/toHumanCount.ts";
  import { toTranslatedReaction } from "$lib/utils/formatting/string/toTranslatedReaction.ts";
  import { time } from "$lib/utils/timing/time.ts";
  import type { MediaReactionsBadgeProps } from "./MediaReactionsBadgeProps.ts";
  import { MAX_MEDIA_REACTIONS } from "./constants.ts";
  import type { ReactionsSnapshot } from "./_internal/ReactionsSnapshot.ts";
  import ReactionsPopover from "./_internal/ReactionsPopover.svelte";
  import { useOptimisticReactions } from "./_internal/useOptimisticReactions.svelte.ts";
  import { reactionRoll } from "./_internal/reactionRoll.ts";
  import { fromRune } from "$lib/utils/store/fromRune.svelte.ts";
  import { useMediaReaction } from "./stores/useMediaReaction.ts";
  import { useMediaReactions } from "./stores/useMediaReactions.ts";

  const { type, slug, id }: MediaReactionsBadgeProps = $props();

  const { summary, held, isLoading } = useMediaReactions({
    target$: fromRune(() => ({ type, slug, id })),
  });
  const { react, remove } = useMediaReaction();

  const live = $derived<ReactionsSnapshot>({
    held: [...new Set($held.map((entry) => entry.reaction))],
    distribution: $summary.distribution,
    totalCount: $summary.totalCount,
  });

  const reactions = useOptimisticReactions({
    live: () => live,
    idsOf: (reaction) =>
      $held
        .filter((entry) => entry.reaction === reaction)
        .map((entry) => entry.id),
    react: (reaction) => react({ type, slug, reaction }),
    remove: (ids) => remove({ type, slug, ids }),
    limit: MAX_MEDIA_REACTIONS,
  });

  const merged = $derived(reactions.merged);

  const chosen = $derived(merged.chosen);

  const ROLL_INTERVAL = time.seconds(2.6);

  let shown = $state(0);

  const isReducedMotion = useMedia(WellKnownMediaQuery.reducedMotion);

  const pickCount = $derived(chosen.length);

  $effect(() => {
    const count = pickCount;
    if (count < 2 || $isReducedMotion) return;

    const timer = setInterval(() => {
      if (document.hidden) return;
      shown = (shownIndex + 1) % count;
    }, ROLL_INTERVAL);

    return () => clearInterval(timer);
  });

  const current = $derived(chosen.at(shown) ?? chosen.at(0));
  const shownIndex = $derived(chosen.at(shown) ? shown : 0);

  function selectHandler(reaction: MediaReaction) {
    const isAdding = !chosen.includes(reaction);
    const index = chosen.length;

    if (!reactions.select(reaction)) return;
    if (isAdding) shown = index;
  }

  const glyphs = $derived(merged.top);

  const hasRoom = $derived(glyphs.length > 0 || merged.totalCount > 0);
</script>

<ReactionsPopover
  {chosen}
  distribution={merged.distribution}
  isLoading={$isLoading}
  onSelect={selectHandler}
>
  {#snippet trigger()}
    <span
      class="trakt-media-reactions-badge"
      class:is-bare={!hasRoom && chosen.length === 0}
    >
      <span class="badge-mine">
        {#if current}
          <span class="mine-roll">
            {#key current}
              <span
                class="mine-glyph"
                in:reactionRoll={{ direction: "in" }}
                out:reactionRoll={{ direction: "out" }}
              >
                <ReactionEmoji
                  code={REACTIONS_CODE_MAP[current]}
                  label={toTranslatedReaction(current)}
                />
              </span>
            {/key}
          </span>
        {:else}
          <ReactionIcon state="add" />
        {/if}
      </span>

      {#if hasRoom || chosen.length > 1}
        <span
          class="badge-divider"
          class:has-icon-before={chosen.length === 0}
          aria-hidden="true"
        >
          {#if chosen.length > 1}
            <span class="mine-dots">
              {#each chosen as reaction, index (reaction)}
                <span class="mine-dot" class:is-shown={index === shownIndex}
                ></span>
              {/each}
            </span>
          {:else}
            <span class="badge-hairline"></span>
          {/if}
        </span>
      {/if}

      {#if hasRoom}
        <span class="badge-room">
          <span class="badge-glyphs" aria-hidden="true">
            {#each glyphs as reaction (reaction)}
              <ReactionEmoji
                code={REACTIONS_CODE_MAP[reaction]}
                label={toTranslatedReaction(reaction)}
              />
            {/each}
          </span>

          {#if merged.totalCount > 0}
            <span class="badge-count bold">
              {toHumanCount(merged.totalCount, getLocale())}
            </span>
          {/if}
        </span>
      {/if}
    </span>
  {/snippet}
</ReactionsPopover>

<style lang="scss">
  @use "$style/scss/mixins/index" as *;

  .trakt-media-reactions-badge {
    display: inline-flex;
    align-items: center;
    gap: var(--gap-xs);

    min-height: var(--ni-36);
    box-sizing: border-box;
    padding: var(--ni-4) var(--ni-12);

    border-radius: var(--border-radius-xxl);

    background: none;

    transition: background-color var(--transition-increment) ease-in-out;

    @include for-mouse {
      :global(.trakt-reactions-popover-trigger:hover) & {
        background: color-mix(in srgb, var(--color-foreground) 10%, transparent);
      }
    }

    :global(.trakt-reactions-popover-trigger[aria-expanded="true"]) & {
      background: color-mix(in srgb, var(--color-foreground) 10%, transparent);
    }

    :global(svg) {
      width: var(--ni-20);
      height: var(--ni-20);
    }
  }

  .trakt-media-reactions-badge.is-bare {
    width: var(--ni-36);
    padding-inline: 0;
    justify-content: center;
    border-radius: 50%;
  }

  .badge-room {
    display: inline-flex;
    align-items: center;
    gap: var(--gap-xs);
  }

  .badge-glyphs {
    display: inline-flex;
    align-items: center;
  }

  .badge-count {
    font-size: var(--font-size-text-small);
    color: var(--color-text-primary);
  }

  .badge-divider {
    display: flex;
    align-items: center;
    justify-content: center;

    width: var(--ni-8);
    align-self: stretch;
  }

  .badge-divider.has-icon-before {
    margin-inline-end: var(--ni-2);
  }

  .badge-divider:not(.has-icon-before) {
    margin-inline-start: var(--ni-3);
  }

  .badge-hairline {
    width: var(--border-thickness-xxs);
    height: var(--ni-20);

    background: var(--color-border);
  }

  .badge-mine {
    display: inline-flex;
    align-items: center;
    justify-content: center;

    --reaction-emoji-box: var(--ni-18);

    color: var(--color-text-primary);
  }

  .mine-roll {
    display: grid;
    width: var(--ni-18);
    height: var(--ni-18);
  }

  .mine-glyph {
    grid-area: 1 / 1;
    display: inline-flex;
  }

  .mine-dots {
    display: flex;
    flex-direction: column;
    gap: var(--ni-2);
  }

  .mine-dot {
    width: var(--ni-3);
    height: var(--ni-3);
    border-radius: 50%;

    background: var(--color-text-secondary);
    opacity: 0.4;

    transition: var(--transition-increment) ease-out;
    transition-property: opacity, transform;

    &.is-shown {
      opacity: 1;
      transform: scale(1.25);
    }
  }
</style>
