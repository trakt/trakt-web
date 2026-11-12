<script lang="ts">
  import Link from "$lib/components/link/Link.svelte";
  import { languageTag } from "$lib/features/i18n";
  import { episodeNumberLabel } from "$lib/utils/intl/episodeNumberLabel.ts";
  import { UrlBuilder } from "$lib/utils/url/UrlBuilder";
  import type { MonthReviewPlay } from "../models/MonthReviewPlay.ts";

  const { play, label }: { play: MonthReviewPlay; label: string } = $props();

  const when = $derived(
    new Intl.DateTimeFormat(languageTag(), {
      weekday: "long",
      day: "numeric",
      hour: "numeric",
      minute: "2-digit",
    }).format(play.watchedAt),
  );
</script>

<Link
  href={UrlBuilder.media(play.title.type, play.title.slug)}
  label={play.title.title}
  underline="none"
>
  <figure class="trakt-month-review-play-card">
    <img src={play.title.cover} alt="" loading="lazy" />
    <figcaption>
      <span class="label bold">{label}</span>
      <span class="title bold">{play.title.title}</span>
      {#if play.episode}
        <span class="episode">
          {episodeNumberLabel({
            seasonNumber: play.episode.season,
            episodeNumber: play.episode.number,
          })} · {play.episode.title}
        </span>
      {/if}
      <span class="when">{when}</span>
    </figcaption>
  </figure>
</Link>

<style>
  .trakt-month-review-play-card {
    display: flex;
    flex-direction: column;
    gap: var(--gap-s);
    margin: 0;

    img {
      width: 100%;
      aspect-ratio: 16 / 9;
      border-radius: var(--border-radius-m);
      object-fit: cover;
      background: var(--color-month-review-track);
    }
  }

  figcaption {
    display: flex;
    flex-direction: column;
    gap: var(--gap-xxs);
  }

  .label {
    font-size: var(--font-size-text-small);
    letter-spacing: 0.12em;
    text-transform: uppercase;
    color: var(--color-text-secondary);
  }

  .title {
    font-size: var(--font-size-title);
  }

  .episode,
  .when {
    color: var(--color-text-secondary);
  }
</style>
