<script lang="ts">
  import CircularProgressChart from "$lib/components/charts/CircularProgressChart.svelte";
  import { m } from "$lib/paraglide/messages";
  import type { YirListProgress } from "$lib/requests/models/YirDetail";
  import { formatNumber } from "$lib/utils/format/formatNumber";
  import YirPageInner from "../../_internal/YirPageInner.svelte";
  import YirSectionHeader from "../../_internal/YirSectionHeader.svelte";

  const {
    lists,
  }: {
    lists: YirListProgress[];
  } = $props();
</script>

{#snippet ratioLabel(list: YirListProgress)}
  {m.yir_label_watched_of({
    watched: formatNumber(list.watched),
    total: formatNumber(list.total),
  })}
{/snippet}

<section class="trakt-yir-list-progress-section" id="section-list-progress">
  <YirPageInner>
    <YirSectionHeader>
      {m.yir_section_title_list_progress()}
    </YirSectionHeader>

    <div class="yir-list-progress-grid">
      {#each lists as list (list.id)}
        <div class="yir-list-progress-item">
          <CircularProgressChart percentage={list.percentage}>
            <div class="list-progress-center">
              {#if list.logo}
                <!-- media-og.trakt.tv (Cloudflare) hotlink-blocks non-trakt
                     referrers, which 403s on localhost; sending no referrer
                     is allowed in both dev and prod. -->
                <img
                  class="list-logo"
                  src={list.logo}
                  alt={list.title}
                  referrerpolicy="no-referrer"
                />
              {/if}
              <span class="list-name">{list.title}</span>
              <div class="list-divider"></div>
              <span class="list-percent">{list.percentage}%</span>
              <span class="list-ratio">{@render ratioLabel(list)}</span>
            </div>
          </CircularProgressChart>

          <!-- Compact-row layout (mobile only): the ring keeps just the % inside
               while the name + ratio sit beside it, so a full circle per row
               doesn't dominate small screens. Hidden on desktop, where the
               content stays inside the ring above. -->
          <div class="list-progress-aside">
            <div class="list-progress-heading">
              <span class="list-name">{list.title}</span>
              {#if list.logo}
                <!-- no-referrer for the same Cloudflare hotlink reason as above. -->
                <img
                  class="list-logo"
                  src={list.logo}
                  alt={list.title}
                  referrerpolicy="no-referrer"
                />
              {/if}
            </div>
            <div class="list-divider"></div>
            <span class="list-ratio">{@render ratioLabel(list)}</span>
          </div>
        </div>
      {/each}
    </div>
  </YirPageInner>
</section>

<style lang="scss">
  @use "$style/scss/mixins/index" as *;

  .trakt-yir-list-progress-section {
    background-color: var(--color-yir-background);
    padding-bottom: var(--ni-72);

    @include for-mobile {
      padding-bottom: var(--ni-40);
    }

    // Compact layout runs edge-to-edge otherwise; keep the header + rows off the
    // screen edges.
    @include for-tablet-sm-and-below {
      padding-inline: var(--ni-16);
    }
  }

  .yir-list-progress-grid {
    display: grid;
    grid-template-columns: repeat(3, minmax(0, 1fr));
    gap: var(--ni-40);
    justify-items: center;

    @include for-tablet-sm-and-below {
      // Compact rows: full-width items, tighter vertical rhythm.
      grid-template-columns: 1fr;
      gap: var(--ni-16);
      justify-items: stretch;
    }
  }

  .yir-list-progress-item {
    width: 100%;
    max-width: var(--ni-340);
    aspect-ratio: 1;

    // Purple progress arc on a neutral track; thin ring to match v2. Both the
    // arc (--viz-1) and track (--viz-track) flip with the theme so the ring
    // reads correctly on the light and dark chrome surface alike.
    --circular-progress-size: 100%;
    --circular-progress-indicator: var(--viz-1);
    --circular-progress-track: var(--viz-track);
    --circular-progress-thickness: 1.5;

    @include for-tablet-sm-and-below {
      // Ring + text side by side instead of one big circle per row. The ring
      // shrinks to a fixed size (its aspect-ratio is intrinsic now, so drop the
      // item's) and the aside takes the remaining width.
      max-width: none;
      aspect-ratio: auto;
      display: flex;
      align-items: center;
      gap: var(--ni-16);
      --circular-progress-size: var(--ni-96);
      --circular-progress-thickness: 2.5;
    }
  }

  // Stacked content centered inside the ring; kept narrow so it stays within
  // the circle. On mobile only the percentage remains inside; everything else
  // moves to the aside.
  .list-progress-center {
    width: 70%;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: var(--ni-8);

    // 3-col grid persists here but the rings shrink (~150-180px), so scale the
    // in-ring content down to stay within the circle.
    @include for-tablet-lg {
      gap: var(--ni-4);

      .list-logo {
        height: var(--ni-20);
        padding-block: var(--ni-4);
        padding-inline: var(--ni-12);
      }

      .list-percent {
        font-size: var(--font-size-title);
      }

      .list-name,
      .list-ratio {
        font-size: var(--font-size-text-small);
      }
    }

    @include for-tablet-sm-and-below {
      width: auto;
      gap: 0;

      .list-logo,
      .list-name,
      .list-divider,
      .list-ratio {
        display: none;
      }

      .list-percent {
        font-size: var(--ni-20);
      }
    }
  }

  // Beside-the-ring info shown only in the compact mobile layout.
  .list-progress-aside {
    display: none;

    @include for-tablet-sm-and-below {
      display: flex;
      flex: 1;
      min-width: 0;
      flex-direction: column;
      align-items: stretch;
      gap: var(--ni-8);
      text-align: start;

      // Name and logo share the top line: title at the start, wordmark pushed
      // to the end. Negative inline end cancels the glow padding so the ink
      // sits flush with the row's end.
      .list-progress-heading {
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: var(--ni-12);
      }

      .list-logo {
        height: var(--ni-24);
        max-width: 40%;
        padding-block: var(--ni-8);
        padding-inline: var(--ni-12);
        margin-inline-end: calc(-1 * var(--ni-12));
      }
    }
  }

  .list-logo {
    height: var(--ni-40);
    max-width: 100%;
    object-fit: contain;
    // Most list logos are white wordmarks built for dark UIs. A soft, wide
    // radial glow (theme token, no-op in dark mode) diffuses out behind the
    // wordmark and fades to transparent - no plate - so white logos stay
    // legible on the light surface. Generous padding extends the glow well
    // past the logo's ink.
    padding-block: var(--ni-12);
    padding-inline: var(--ni-32);
    background: var(--color-yir-list-logo-backdrop);
  }

  .list-name {
    font-size: var(--font-size-text);
    font-weight: 600;
    color: var(--color-yir-text-primary);
  }

  .list-divider {
    width: 100%;
    border-bottom: var(--border-thickness-xxs) solid var(--color-yir-separator);
    margin: var(--ni-4) 0;
  }

  .list-percent {
    font-size: var(--ni-44);
    font-weight: bold;
    line-height: 1;
    color: var(--color-yir-text-primary);

    @include for-mobile {
      font-size: var(--ni-40);
    }
  }

  .list-ratio {
    font-size: var(--ni-12);
    color: var(--color-yir-text-muted);
  }
</style>
