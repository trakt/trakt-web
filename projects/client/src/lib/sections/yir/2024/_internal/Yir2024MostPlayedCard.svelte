<script lang="ts">
  import Link from "$lib/components/link/Link.svelte";
  import CrossOriginImage from "$lib/features/image/components/CrossOriginImage.svelte";
  import { languageTag } from "$lib/features/i18n";
  import { m } from "$lib/paraglide/messages";
  import type { YirMostWatchedItem } from "$lib/requests/models/YirDetail";
  import { formatNumber } from "$lib/utils/format/formatNumber";
  import { toHumanDuration } from "$lib/utils/formatting/date/toHumanDuration";
  import { UrlBuilder } from "$lib/utils/url/UrlBuilder";

  const {
    item,
    rank,
  }: {
    item: YirMostWatchedItem;
    rank: number;
  } = $props();

  const itemUrl = $derived(UrlBuilder.media(item.entry.type, item.entry.slug));

  const playsLabel = $derived(formatNumber(item.plays));
  const timeWatchedLabel = $derived(
    toHumanDuration({ minutes: item.minutes }, languageTag()),
  );
</script>

<li
  class="yir-2024-most-played-card"
  role="article"
  data-rank-position={(rank - 1) % 4}
>
  <div class="yir-2024-most-played-cover">
    <CrossOriginImage src={item.entry.cover?.url?.medium} alt="" />
  </div>
  <div class="yir-2024-most-played-shade"></div>

  <div class="yir-2024-most-played-grid">
    <span class="bold yir-2024-most-played-rank" aria-hidden="true"
      >.{rank}</span
    >

    <div class="yir-2024-most-played-details">
      <div class="yir-2024-most-played-stats">
        <div class="yir-2024-most-played-stat">
          <span class="bold yir-2024-most-played-stat-value">{playsLabel}</span>
          <span class="bold uppercase yir-2024-most-played-stat-label">
            {m.yir_2024_plays_label()}
          </span>
        </div>
        <div class="yir-2024-most-played-stat">
          <span class="bold yir-2024-most-played-stat-value">
            {timeWatchedLabel}
          </span>
          <span class="bold uppercase yir-2024-most-played-stat-label">
            {m.yir_2024_time_watched_label()}
          </span>
        </div>
      </div>

      <Link href={itemUrl} color="inherit">
        <h3 class="bold yir-2024-most-played-title">{item.entry.title}</h3>
      </Link>
    </div>

    <!-- Duplicate link to itemUrl: the title Link above is the accessible
         entry point. `focusable={false}` drops the redundant tab stop and
         `alt=""` on the image keeps the link nameless so screen readers
         skip it. (`aria-hidden` would need a type extension on
         Link.svelte that's out of scope here.) -->
    <Link href={itemUrl} color="inherit" focusable={false}>
      <div class="yir-2024-most-played-poster">
        <CrossOriginImage src={item.entry.poster?.url?.medium} alt="" />
      </div>
    </Link>
  </div>
</li>

<style lang="scss">
  @use "$style/scss/mixins/index" as *;

  // 90% width with alternating horizontal alignment so the stacked cards
  // visually sway across the section as you scroll (matches v2's every-4
  // rotation: center / end / center / start). Alignment is driven by
  // `align-self` on the flex-column parent so spacing between cards still
  // comes from the parent's `gap` — no per-card margin.
  .yir-2024-most-played-card {
    position: relative;
    width: 90%;
    height: var(--ni-640);
    overflow: hidden;
    border-radius: var(--border-radius-xxl);
    color: var(--shade-10);

    &[data-rank-position="0"] {
      align-self: center;
    }
    &[data-rank-position="1"] {
      align-self: flex-end;
    }
    &[data-rank-position="2"] {
      align-self: center;
    }
    &[data-rank-position="3"] {
      align-self: flex-start;
    }

    @include for-tablet-sm-and-below {
      width: 100%;
      height: var(--ni-560);

      // Stop alternating once the cards span full width; align-self has
      // nothing left to position.
      &[data-rank-position] {
        align-self: stretch;
      }
    }

    @include for-mobile {
      border-radius: var(--border-radius-xl);
    }
  }

  .yir-2024-most-played-cover {
    position: absolute;
    inset: 0;
    z-index: 0;

    :global(img) {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }
  }

  // Match v2's purple wash on top of the fanart so the photo reads through
  // tinted but the white type stays legible across the full card.
  .yir-2024-most-played-shade {
    position: absolute;
    inset: 0;
    z-index: 1;
    background: linear-gradient(
      to top,
      color-mix(in srgb, var(--purple-700) 95%, var(--shade-1000)) 0%,
      color-mix(in srgb, var(--purple-700) 70%, transparent) 40%,
      color-mix(in srgb, var(--purple-700) 35%, transparent) 70%,
      color-mix(in srgb, var(--purple-700) 10%, transparent) 100%
    );
  }

  // Desktop layout: rank in the top-left, details (stats + title) in the
  // bottom-left, poster spanning the right column. Parent-driven spacing
  // via grid `gap`; children carry no margin.
  .yir-2024-most-played-grid {
    position: relative;
    z-index: 2;
    height: 100%;
    box-sizing: border-box;
    padding: var(--ni-44) var(--ni-52);
    display: grid;
    grid-template-columns: minmax(0, 1fr) auto;
    grid-template-rows: 1fr auto;
    grid-template-areas:
      "rank    poster"
      "details poster";
    column-gap: var(--ni-32);
    row-gap: var(--ni-20);
    align-items: end;

    @include for-tablet-sm-and-below {
      // v2 mobile reflow: rank pairs with poster on top, details span full
      // width on the row beneath.
      grid-template-areas:
        "rank    poster"
        "details details";
      padding: var(--ni-32);
    }

    @include for-mobile {
      padding: var(--ni-20);
      column-gap: var(--ni-16);
      row-gap: var(--ni-12);
    }
  }

  .yir-2024-most-played-rank {
    grid-area: rank;
    align-self: end;
    // Tight line-height so the giant numeral's box doesn't add visual
    // padding under it — the rank is meant to sit flush against the
    // details row.
    line-height: 0.8;
    font-size: var(--ni-160);
    color: color-mix(in srgb, var(--shade-10) 30%, transparent);

    @include for-tablet-sm-and-below {
      font-size: var(--ni-104);
    }

    @include for-mobile {
      font-size: var(--ni-72);
    }
  }

  .yir-2024-most-played-details {
    grid-area: details;
    display: flex;
    flex-direction: column;
    gap: var(--ni-16);
    min-width: 0;
  }

  .yir-2024-most-played-stats {
    display: flex;
    gap: var(--ni-32);

    @include for-mobile {
      gap: var(--ni-16);
    }
  }

  .yir-2024-most-played-stat {
    display: flex;
    flex-direction: column;
    gap: var(--ni-2);
  }

  .yir-2024-most-played-stat-value {
    font-size: var(--ni-22);

    @include for-mobile {
      font-size: var(--font-size-title);
    }
  }

  .yir-2024-most-played-stat-label {
    font-size: var(--font-size-text);
    color: var(--shade-300);

    @include for-mobile {
      font-size: var(--font-size-tag);
    }
  }

  // Title link wrapper: keep the title block visually plain (no underline,
  // inherit white) but stay clickable through the Link.
  :global(.yir-2024-most-played-details > .trakt-link) {
    text-decoration: none;
    color: inherit;
  }

  .yir-2024-most-played-title {
    font-size: clamp(var(--ni-32), 4vw, var(--ni-52));

    @include for-mobile {
      font-size: var(--ni-24);
    }
  }

  // Poster: fixed dimensions matching v2's 322×483 with subtle shadow lift
  // so it visually floats off the fanart. Steps down at smaller viewports.
  :global(.yir-2024-most-played-grid > .trakt-link) {
    grid-area: poster;
    align-self: end;
    justify-self: end;
    display: block;
    text-decoration: none;
  }

  .yir-2024-most-played-poster {
    width: var(--ni-300);
    aspect-ratio: 2 / 3;
    overflow: hidden;
    border-radius: var(--border-radius-s);
    box-shadow: 0 var(--ni-16) var(--ni-48)
      color-mix(in srgb, var(--shade-1000) 50%, transparent);
    transition: transform 0.25s var(--transition-increment) ease-out;

    &:hover {
      transform: scale(1.05);
    }

    :global(img) {
      width: 100%;
      height: 100%;
      object-fit: cover;
      display: block;
    }

    @include for-tablet-sm-and-below {
      width: var(--ni-260);
    }

    @include for-mobile {
      width: var(--ni-160);
    }
  }
</style>
