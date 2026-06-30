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
              <span class="uppercase list-ratio">
                {m.yir_label_watched_of({
                  watched: formatNumber(list.watched),
                  total: formatNumber(list.total),
                })}
              </span>
            </div>
          </CircularProgressChart>
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
  }

  .yir-list-progress-grid {
    display: grid;
    grid-template-columns: repeat(3, minmax(0, 1fr));
    gap: var(--ni-40);
    justify-items: center;

    @include for-tablet-sm-and-below {
      grid-template-columns: 1fr;
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
  }

  // Stacked content centered inside the ring; kept narrow so it stays within
  // the circle.
  .list-progress-center {
    width: 64%;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: var(--ni-8);
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
    padding-block: var(--ni-24);
    padding-inline: var(--ni-40);
    background: var(--color-yir-list-logo-backdrop);
  }

  .list-name {
    font-size: var(--font-size-text);
    font-weight: 600;
    color: var(--color-yir-text-primary);
    padding: var(--ni-8) 0;
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
