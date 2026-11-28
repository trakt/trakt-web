<script lang="ts">
  import Button from "$lib/components/buttons/Button.svelte";
  import HideIcon from "$lib/components/icons/HideIcon.svelte";
  import CollapseIcon from "$lib/components/lists/section-list/CollapseIcon.svelte";
  import IndicatorTag from "$lib/components/media/tags/IndicatorTag.svelte";
  import * as m from "$lib/features/i18n/messages.ts";
  import CrossOriginImage from "$lib/features/image/components/CrossOriginImage.svelte";
  import { useSpoiler } from "$lib/features/spoilers/_internal/useSpoiler.ts";
  import RenderFor from "$lib/guards/RenderFor.svelte";
  import type { MovieEntry } from "$lib/requests/models/MovieEntry.ts";
  import type { MovieLore } from "$lib/requests/models/MovieLore.ts";
  import MarkdownText from "$lib/sections/components/markdown/MarkdownText.svelte";
  import { toMediaImageUrl } from "$lib/utils/url/toMediaImageUrl.ts";
  import { Accordion } from "bits-ui";
  import { isLoreFilmGuarded } from "./isLoreFilmGuarded.ts";
  import MovieLoreFilmMenu from "./MovieLoreFilmMenu.svelte";
  import MovieLoreTag from "./MovieLoreTag.svelte";

  const { previously, movie, mustWatchIds, watchedIds, onReveal }: {
    previously: MovieLore["previously"];
    movie: Pick<MovieEntry, "id" | "title">;
    mustWatchIds: ReadonlySet<number>;
    watchedIds: ReadonlySet<number>;
    onReveal: () => void;
  } = $props();

  const entries = $derived(
    previously.map(({ movie: earlier, summary }) => ({
      key: `previously-${earlier.id}`,
      movie: earlier,
      summary,
    })),
  );

  const moviePoster = $derived(
    toMediaImageUrl({
      type: "movies",
      id: movie.id,
      slot: "poster",
      size: "thumb",
    }),
  );

  const { isSpoilerHidden } = useSpoiler();

  let toggled = $state(new Map<string, boolean>());
  let revealed = $state(new Set<number>());

  const latestKey = $derived(entries.at(-1)?.key);

  const isGuarded = (id: number) =>
    isLoreFilmGuarded({
      isSpoilerHidden: $isSpoilerHidden,
      isWatched: watchedIds.has(id),
      isRevealed: revealed.has(id),
    });

  const isOpen = ({ key, movie: earlier }: (typeof entries)[number]) =>
    !isGuarded(earlier.id) && (toggled.get(key) ?? key === latestKey);

  const openKeys = $derived(
    entries.filter(isOpen).map(({ key }) => key),
  );

  function reveal({ key, movie: earlier }: (typeof entries)[number]) {
    revealed = new Set([...revealed, earlier.id]);
    toggled = new Map([...toggled, [key, true]]);
    onReveal();
  }
</script>

{#snippet heading(entry: (typeof entries)[number])}
  <span class="timeline-heading">
    <span class="bold ellipsis">{entry.movie.title}</span>
    {#if entry.movie.year}
      <span class="timeline-year small secondary">{entry.movie.year}</span>
    {/if}
    {#if mustWatchIds.has(entry.movie.id) && !watchedIds.has(entry.movie.id)}
      <MovieLoreTag tone="must-watch" />
    {/if}
  </span>
{/snippet}

<section class="trakt-movie-lore-previously">
  <div class="previously-header">
    <h3>{m.header_movie_lore_previously()}</h3>
    <span class="small secondary">{m.text_movie_lore_previously_caption()}</span>
  </div>

  <div class="previously-timeline">
    <span class="timeline-line" aria-hidden="true"></span>

    <Accordion.Root
      type="multiple"
      value={openKeys}
      onValueChange={(keys) =>
        (toggled = new Map(
          entries.map(({ key }) => [key, keys.includes(key)]),
        ))}
      class="previously-list"
    >
      {#each entries as entry (entry.key)}
        {@const isEntryOpen = isOpen(entry)}
        {@const isEntryGuarded = isGuarded(entry.movie.id)}
        <div class="timeline-item">
          <span class="timeline-node" aria-hidden="true">
            {#if entry.movie.poster}
              <CrossOriginImage src={entry.movie.poster} alt="" />
            {/if}
            {#if watchedIds.has(entry.movie.id)}
              <span class="timeline-tick">
                <IndicatorTag indicator="watched" />
              </span>
            {/if}
          </span>

          <div class="timeline-card" class:is-open={isEntryOpen}>
            <Accordion.Item
              value={entry.key}
              disabled={isEntryGuarded}
              class="timeline-accordion-item"
            >
              <div class="timeline-row">
                {#if isEntryGuarded}
                  <div class="timeline-trigger">
                    {@render heading(entry)}
                  </div>
                  <span
                    class="timeline-reveal"
                    title={m.tooltip_text_movie_lore_spoils_film()}
                  >
                    <Button
                      label={m.button_label_movie_lore_show_spoiler({
                        title: entry.movie.title,
                      })}
                      style="outline"
                      color="default"
                      size="tag"
                      onclick={() => reveal(entry)}
                    >
                      {m.button_text_movie_lore_show_spoiler()}
                      {#snippet icon()}
                        <HideIcon />
                      {/snippet}
                    </Button>
                  </span>
                {:else}
                  <Accordion.Header level={4} class="timeline-heading-wrap">
                    <Accordion.Trigger class="timeline-trigger">
                      {@render heading(entry)}
                      <span
                        class="timeline-caret"
                        class:is-open={isEntryOpen}
                        aria-hidden="true"
                      >
                        <CollapseIcon
                          state={isEntryOpen ? "expanded" : "collapsed"}
                          variant="bare"
                          size={20}
                        />
                      </span>
                    </Accordion.Trigger>
                  </Accordion.Header>
                {/if}

                <RenderFor audience="authenticated">
                  <MovieLoreFilmMenu film={entry.movie} />
                </RenderFor>
              </div>

              {#if !isEntryGuarded}
                <Accordion.Content class="timeline-content">
                  <div class="secondary">
                    <MarkdownText text={entry.summary} spacing="relaxed" />
                  </div>
                </Accordion.Content>
              {/if}
            </Accordion.Item>
          </div>
        </div>
      {/each}
    </Accordion.Root>

    <div class="timeline-item timeline-up-next">
      <span class="timeline-node is-current" aria-hidden="true">
        <CrossOriginImage src={moviePoster} alt="" />
      </span>
      <span class="secondary">
        {m.text_movie_lore_up_next_title({ title: movie.title })}
      </span>
    </div>
  </div>
</section>

<style lang="scss">
  .trakt-movie-lore-previously {
    --timeline-node-width: var(--ni-36);

    display: flex;
    flex-direction: column;
    gap: var(--gap-s);

    .previously-header {
      display: flex;
      align-items: baseline;
      justify-content: space-between;
      gap: var(--gap-xs);
    }

    .previously-timeline {
      position: relative;
      display: flex;
      flex-direction: column;
      gap: var(--ni-14);
    }

    .timeline-line {
      position: absolute;
      top: var(--ni-18);
      bottom: var(--ni-18);
      inset-inline-start: calc(var(--timeline-node-width) / 2 - 1px);
      width: var(--ni-2);
      background: linear-gradient(
        180deg,
        var(--color-vip-border-accent),
        color-mix(in srgb, var(--color-vip-border-accent) 30%, transparent)
      );
    }

    :global(.previously-list) {
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
      flex-shrink: 0;
      align-self: flex-start;
      width: var(--timeline-node-width);
      aspect-ratio: 2 / 3;
      margin-top: var(--ni-4);
      border-radius: var(--ni-6);
      background-color: var(--purple-800);
      box-shadow: 0 0 0 var(--border-thickness-s) var(--color-card-background);

      :global(img) {
        display: block;
        width: 100%;
        height: 100%;
        border-radius: inherit;
        object-fit: cover;
      }

      &.is-current {
        box-shadow:
          0 0 0 var(--border-thickness-s) var(--color-card-background),
          0 0 0 calc(var(--border-thickness-s) + var(--ni-2))
            var(--color-vip-border-accent);
      }
    }

    .timeline-tick {
      position: absolute;
      inset-inline: 0;
      bottom: 0;
      display: flex;
      justify-content: center;
      transform: translateY(50%);
    }

    .timeline-card {
      flex: 1;
      min-width: 0;
      padding: var(--gap-s) var(--ni-14) var(--ni-14);
      border-radius: var(--border-radius-m);
      background: color-mix(in srgb, var(--color-text-primary) 4%, transparent);

      &.is-open {
        background: var(--recap-card-background);
        box-shadow: inset 0 0 0 var(--border-thickness-xxs)
          var(--recap-card-ring);
      }
    }

    .timeline-row {
      display: flex;
      align-items: center;
      gap: var(--gap-xs);
      min-height: var(--ni-28);
    }

    :global(.timeline-heading-wrap) {
      display: flex;
      flex: 1;
      min-width: 0;
      margin: 0;
    }

    :global(.timeline-trigger),
    .timeline-trigger {
      all: unset;
      box-sizing: border-box;
      display: flex;
      flex: 1;
      align-items: center;
      gap: var(--gap-s);
      min-width: 0;
      min-height: var(--ni-28);
    }

    :global(button.timeline-trigger) {
      cursor: pointer;
      -webkit-tap-highlight-color: transparent;

      &:focus-visible {
        outline: var(--border-thickness-xs) solid currentColor;
        outline-offset: var(--ni-2);
      }
    }

    .timeline-heading {
      display: flex;
      align-items: center;
      gap: var(--gap-xs);
      min-width: 0;
    }

    .timeline-year {
      flex-shrink: 0;
    }

    .timeline-reveal {
      display: flex;
      flex-shrink: 0;
    }

    .timeline-caret {
      display: flex;
      flex-shrink: 0;
      margin-inline-start: auto;
      color: var(--color-text-secondary);

      &.is-open {
        color: var(--color-text-emphasis);
      }
    }

    :global(.timeline-content) {
      padding-top: var(--gap-xs);
    }

    .timeline-up-next {
      align-items: center;
    }
  }
</style>
