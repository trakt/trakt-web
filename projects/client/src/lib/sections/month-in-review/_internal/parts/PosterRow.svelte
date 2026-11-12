<script lang="ts">
  import Link from "$lib/components/link/Link.svelte";
  import UserRating from "$lib/sections/components/UserRating.svelte";
  import { UrlBuilder } from "$lib/utils/url/UrlBuilder";
  import type { MonthReviewTitle } from "../models/MonthReviewTitle.ts";
  import { toPlaysLabel } from "./toPlaysLabel.ts";

  const { titles }: { titles: ReadonlyArray<MonthReviewTitle> } = $props();
</script>

<div class="trakt-month-review-poster-row">
  {#each titles as title (title.key)}
    <Link
      href={UrlBuilder.media(title.type, title.slug)}
      label={title.title || toPlaysLabel(title.plays)}
      underline="none"
    >
      <figure class="item">
        <div class="poster">
          <img src={title.poster} alt="" loading="lazy" />
          {#if title.rating !== undefined}
            <span class="rating"
              ><UserRating rating={title.rating} size="small" /></span
            >
          {/if}
        </div>
        <figcaption>
          {#if title.title}
            <span class="name ellipsis bold">{title.title}</span>
          {/if}
          <span class="plays">{toPlaysLabel(title.plays)}</span>
        </figcaption>
      </figure>
    </Link>
  {/each}
</div>

<style lang="scss">
  @use "$style/scss/mixins/index" as *;

  .trakt-month-review-poster-row {
    display: grid;
    grid-template-columns: repeat(5, minmax(0, 1fr));
    gap: var(--gap-s);

    :global(.trakt-link) {
      min-width: 0;
      color: inherit;
    }

    :global(.trakt-link:nth-child(n + 6)) {
      display: none;
    }

    @include for-tablet-sm-and-below {
      grid-template-columns: repeat(4, minmax(0, 1fr));

      :global(.trakt-link:nth-child(5)) {
        display: none;
      }
    }

    @include for-mobile {
      grid-template-columns: repeat(3, minmax(0, 1fr));

      :global(.trakt-link:nth-child(-n + 6)) {
        display: block;
      }
    }
  }

  .item {
    display: flex;
    flex-direction: column;
    gap: var(--gap-xs);
    margin: 0;
    min-width: 0;
  }

  .poster {
    position: relative;
    aspect-ratio: 2 / 3;
    border-radius: var(--border-radius-m);
    overflow: hidden;
    background: var(--color-month-review-track);

    img {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }
  }

  .rating {
    position: absolute;
    inset-inline-end: var(--gap-xxs);
    bottom: var(--gap-xxs);
    padding: var(--ni-2) var(--ni-6);
    border-radius: var(--border-radius-pill);
    background: var(--color-background-cover-tag);
    color: var(--shade-10);
  }

  figcaption {
    display: flex;
    flex-direction: column;
    gap: var(--gap-xxs);
    min-width: 0;
  }

  .plays {
    font-size: var(--font-size-text-small);
    color: var(--color-text-secondary);
  }
</style>
