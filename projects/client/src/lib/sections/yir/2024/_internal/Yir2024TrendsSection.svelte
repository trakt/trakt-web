<script lang="ts">
  import { m } from "$lib/paraglide/messages";
  import type { YirTrendItem } from "$lib/requests/models/YirDetail.ts";
  import Yir2024TrendCard from "./Yir2024TrendCard.svelte";

  type Yir2024TrendsSectionProps = {
    type: "shows" | "movies";
    items: YirTrendItem[];
    year: number;
  };

  const { type, items, year }: Yir2024TrendsSectionProps = $props();

  // Render in calendar order regardless of how the API sorts the payload.
  const ordered = $derived([...items].sort((a, b) => a.month - b.month));
  const watchedCount = $derived(items.filter((item) => item.watched).length);

  const heading = $derived(
    type === "shows" ? m.yir_2024_show_trends() : m.yir_2024_movie_trends(),
  );
  const subtitle = $derived(
    type === "shows"
      ? m.yir_2024_trends_subtitle_shows({ year })
      : m.yir_2024_trends_subtitle_movies({ year }),
  );
  const watchedSummary = $derived(
    type === "shows"
      ? m.yir_2024_trends_watched_shows({
          watched: watchedCount,
          total: items.length,
        })
      : m.yir_2024_trends_watched_movies({
          watched: watchedCount,
          total: items.length,
        }),
  );
</script>

<section class="yir-2024-trends" id="section-{type}-trends">
  <header class="yir-2024-trends-header">
    <h2 class="bold yir-2024-trends-title">{heading}</h2>
    <p class="yir-2024-trends-subtitle">{subtitle}</p>
    <p class="yir-2024-trends-subtitle">{watchedSummary}</p>
  </header>

  <ol class="yir-2024-trends-grid" role="list">
    {#each ordered as item (item.month)}
      <li role="listitem">
        <Yir2024TrendCard {item} />
      </li>
    {/each}
  </ol>
</section>

<style lang="scss">
  @use "$style/scss/mixins/index" as *;

  // Purple gradient panel (matches v2's trends sections).
  .yir-2024-trends {
    // border-box so the panel's padding stays inside its 100% width (there's
    // no global box-sizing reset) — otherwise it overflows the page wrapper.
    box-sizing: border-box;
    width: 100%;
    color: var(--shade-10);
    border-radius: var(--border-radius-xxl);
    padding: var(--ni-44);
    background: linear-gradient(
      19.44deg,
      var(--purple-900) 21.85%,
      color-mix(in srgb, var(--purple-900) 80%, transparent) 59.01%,
      color-mix(in srgb, var(--purple-700) 0%, transparent) 104.87%
    );

    @include for-mobile {
      border-radius: var(--border-radius-xl);
      padding: var(--ni-20);
    }
  }

  .yir-2024-trends-header {
    margin-bottom: var(--ni-32);

    @include for-mobile {
      margin-bottom: var(--ni-20);
    }
  }

  .yir-2024-trends-title {
    margin: 0;
    font-size: clamp(var(--ni-32), 5vw, var(--ni-56));
    line-height: 1;

    @include for-mobile {
      font-size: var(--ni-28);
    }
  }

  .yir-2024-trends-subtitle {
    margin: var(--ni-4) 0 0;
    font-size: var(--ni-22);
    line-height: 1.2;
    color: var(--shade-10);

    @include for-mobile {
      font-size: var(--font-size-title);
    }
  }

  // Six across (12 items → two rows) on desktop, stepping down with the
  // viewport. List semantics preserved with reset styles.
  .yir-2024-trends-grid {
    list-style: none;
    margin: 0;
    padding: 0;
    display: grid;
    grid-template-columns: repeat(6, minmax(0, 1fr));
    gap: var(--ni-24) var(--ni-20);

    @include for-tablet-lg {
      grid-template-columns: repeat(4, minmax(0, 1fr));
    }

    @include for-tablet-sm {
      grid-template-columns: repeat(3, minmax(0, 1fr));
    }

    @include for-mobile {
      grid-template-columns: repeat(2, minmax(0, 1fr));
      gap: var(--ni-20) var(--ni-12);
    }
  }
</style>
