<script lang="ts">
  import * as m from "$lib/features/i18n/messages.ts";
  import CrossOriginImage from "$lib/features/image/components/CrossOriginImage.svelte";
  import type { MovieEntry } from "$lib/requests/models/MovieEntry.ts";
  import type { MovieLore } from "$lib/requests/models/MovieLore.ts";
  import InlineMarkdown from "$lib/sections/components/markdown/InlineMarkdown.svelte";
  import MarkdownText from "$lib/sections/components/markdown/MarkdownText.svelte";
  import { useSpoiler } from "$lib/features/spoilers/_internal/useSpoiler.ts";
  import { toMediaImageUrl } from "$lib/utils/url/toMediaImageUrl.ts";
  import { Accordion } from "bits-ui";
  import RecapAccordionItem from "../../recap/_internal/RecapAccordionItem.svelte";
  import RecapSpoilerGuard from "../../recap/_internal/RecapSpoilerGuard.svelte";
  import { isLoreFilmGuarded } from "./isLoreFilmGuarded.ts";

  const { previously, movie, watchedIds, onReveal }: {
    previously: MovieLore["previously"];
    movie: Pick<MovieEntry, "id" | "title">;
    watchedIds: ReadonlySet<number>;
    onReveal: () => void;
  } = $props();

  const entries = $derived(
    previously.map(({ movie: earlier, summary }) => {
      const [lead = "", ...more] = summary.trim().split(/\n{2,}/);

      return {
        key: `previously-${earlier.id}`,
        movie: earlier,
        lead,
        more: more.join("\n\n"),
      };
    }),
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
  const isOpen = (key: string) => toggled.get(key) ?? key === latestKey;
  const openKeys = $derived(entries.map(({ key }) => key).filter(isOpen));
  const isGuarded = (id: number) =>
    isLoreFilmGuarded({
      isSpoilerHidden: $isSpoilerHidden,
      isWatched: watchedIds.has(id),
      isRevealed: revealed.has(id),
    });

  function reveal(id: number) {
    revealed = new Set([...revealed, id]);
    onReveal();
  }
</script>

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
        {@const isEntryOpen = isOpen(entry.key)}
        <div class="timeline-item">
          <span class="timeline-node" aria-hidden="true">
            {#if entry.movie.poster}
              <CrossOriginImage src={entry.movie.poster} alt="" />
            {/if}
          </span>

          <div class="timeline-card" class:is-open={isEntryOpen}>
            <RecapSpoilerGuard
              isGuarded={isGuarded(entry.movie.id)}
              message={m.text_movie_lore_spoiler_unseen({
                title: entry.movie.title,
              })}
              onReveal={() => reveal(entry.movie.id)}
            >
              <RecapAccordionItem value={entry.key} isOpen={isEntryOpen}>
                {#snippet trigger()}
                  <span class="timeline-heading">
                    <span class="bold">{entry.movie.title}</span>
                    {#if entry.movie.year}
                      <span class="small secondary">{entry.movie.year}</span>
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
            </RecapSpoilerGuard>
          </div>
        </div>
      {/each}
    </Accordion.Root>

    <div class="timeline-item timeline-up-next">
      <span class="timeline-node is-current" aria-hidden="true">
        <CrossOriginImage src={moviePoster} alt="" />
      </span>
      <span class="secondary">
        {m.text_movie_lore_up_next({ title: movie.title })}
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

      overflow: hidden;
      border-radius: var(--ni-6);
      background-color: var(--purple-800);
      box-shadow: 0 0 0 var(--border-thickness-s) var(--color-card-background);

      :global(img) {
        display: block;
        width: 100%;
        height: 100%;
        object-fit: cover;
      }

      &.is-current {
        box-shadow:
          0 0 0 var(--border-thickness-s) var(--color-card-background),
          0 0 0 calc(var(--border-thickness-s) + var(--ni-2))
            var(--color-vip-border-accent);
      }
    }

    .timeline-card {
      --recap-accordion-gap: var(--gap-xs);
      --recap-accordion-trigger-height: var(--ni-28);
      --recap-accordion-focus-offset: var(--ni-2);
      --recap-guard-min-height: var(--ni-168);

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

      &.is-open {
        display: block;
        color: var(--color-text-primary);
      }
    }

    .timeline-up-next {
      align-items: center;
    }
  }
</style>
