<script lang="ts">
  import Link from "$lib/components/link/Link.svelte";
  import { UrlBuilder } from "$lib/utils/url/UrlBuilder";
  import type { Snippet } from "svelte";
  import type { MonthReviewTitle } from "../models/MonthReviewTitle.ts";

  const {
    titles,
    trailing,
    start = 1,
    layout = "list",
  }: {
    titles: ReadonlyArray<MonthReviewTitle>;
    trailing: Snippet<[MonthReviewTitle]>;
    start?: number;
    layout?: "list" | "grid";
  } = $props();
</script>

<ol class="trakt-month-review-ranked-list" data-layout={layout}>
  {#each titles as title, index (title.key)}
    <li>
      <Link
        href={UrlBuilder.media(title.type, title.slug)}
        label={title.title}
        underline="none"
      >
        <span class="row">
          <span class="rank bold">{start + index}</span>
          <img src={title.poster} alt="" loading="lazy" />
          <span class="title ellipsis bold">{title.title}</span>
          <span class="trailing">{@render trailing(title)}</span>
        </span>
      </Link>
    </li>
  {/each}
</ol>

<style>
  .trakt-month-review-ranked-list {
    list-style: none;
    margin: 0;
    padding: 0;
    display: flex;
    flex-direction: column;
    gap: var(--gap-s);

    &[data-layout="grid"] {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(var(--ni-320), 1fr));
      column-gap: var(--gap-xl);
    }

    :global(.trakt-link) {
      color: inherit;
    }
  }

  .row {
    display: grid;
    grid-template-columns: var(--ni-20) var(--ni-40) minmax(0, 1fr) auto;
    align-items: center;
    gap: var(--gap-s);
  }

  .rank {
    font-size: var(--font-size-text-small);
    color: var(--color-text-secondary);
  }

  img {
    width: var(--ni-40);
    aspect-ratio: 2 / 3;
    border-radius: var(--border-radius-xs);
    object-fit: cover;
  }

  .trailing {
    display: inline-flex;
    align-items: center;
    gap: var(--gap-s);
    color: var(--color-text-secondary);
    white-space: nowrap;
  }
</style>
