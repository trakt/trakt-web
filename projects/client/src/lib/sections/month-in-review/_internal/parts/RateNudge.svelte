<script lang="ts">
  import * as m from "$lib/features/i18n/messages.ts";
  import RateAction from "$lib/sections/media-actions/rating/RateAction.svelte";
  import type { MonthReviewTitle } from "../models/MonthReviewTitle.ts";
  import { toPlaysLabel } from "./toPlaysLabel.ts";

  const MAX_TITLES = 3;

  const { titles }: { titles: ReadonlyArray<MonthReviewTitle> } = $props();

  const shown = $derived(titles.slice(0, MAX_TITLES));
</script>

<div class="trakt-month-review-rate-nudge">
  <div class="copy">
    <h3>{m.month_review_unrated_title()}</h3>
    <p>{m.month_review_unrated_body()}</p>
  </div>
  <ul class="titles">
    {#each shown as title (title.key)}
      <li>
        <img src={title.poster} alt="" loading="lazy" />
        <span class="name ellipsis bold"
          >{title.title || toPlaysLabel(title.plays)}</span
        >
        <span class="rate">
          <RateAction
            target={{ type: title.type, media: { id: title.id } }}
            title={title.title || undefined}
          />
        </span>
      </li>
    {/each}
  </ul>
</div>

<style>
  .trakt-month-review-rate-nudge {
    display: flex;
    flex-direction: column;
    gap: var(--gap-m);
    height: 100%;
    container-type: inline-size;
  }

  .copy {
    display: flex;
    flex-direction: column;
    gap: var(--gap-xxs);

    h3 {
      margin: 0;
      font-size: var(--font-size-title);
    }

    p {
      margin: 0;
      color: var(--color-text-secondary);
    }
  }

  .titles {
    list-style: none;
    margin: 0;
    padding: 0;
    display: grid;
    grid-template-columns: minmax(0, 1fr);
    gap: var(--gap-s);

    li {
      display: grid;
      grid-template-columns: var(--ni-56) minmax(0, 1fr) auto;
      align-items: center;
      gap: var(--gap-s);
    }

    img {
      width: var(--ni-56);
      aspect-ratio: 2 / 3;
      border-radius: var(--border-radius-xs);
      object-fit: cover;
      background: var(--color-month-review-track);
    }
  }

  .rate {
    display: inline-flex;
  }

  @container (min-width: 640px) {
    .titles {
      grid-template-columns: repeat(2, minmax(0, 1fr));
      column-gap: var(--gap-xl);
    }
  }
</style>
