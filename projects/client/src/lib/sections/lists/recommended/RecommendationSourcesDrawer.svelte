<script lang="ts">
  import Drawer from "$lib/components/drawer/Drawer.svelte";
  import FavoriteIcon from "$lib/components/icons/FavoriteIcon.svelte";
  import SparkleIcon from "$lib/components/icons/SparkleIcon.svelte";
  import TrackIcon from "$lib/components/icons/TrackIcon.svelte";
  import StemTag from "$lib/components/tags/StemTag.svelte";
  import * as m from "$lib/features/i18n/messages.ts";
  import type { RecommendationSource } from "$lib/requests/models/RecommendationSource.ts";
  import { toTranslatedSubgenre } from "$lib/utils/formatting/string/toTranslatedSubgenre.ts";
  import RecommendationSourceItem from "./RecommendationSourceItem.svelte";

  type SubgenreGroup = {
    key: string;
    labels: string[];
    sources: RecommendationSource[];
  };

  type RecommendationSourcesDrawerProps = {
    sources: RecommendationSource[];
    title: string;
    onClose: () => void;
  };

  const { sources, title, onClose }: RecommendationSourcesDrawerProps =
    $props();

  const activitySources = $derived(
    sources.filter((s) => s.type === "activity"),
  );
  const favoriteSources = $derived(
    sources.filter((s) => s.type === "favorite"),
  );

  const subgenreSources = $derived.by(() => [
    ...sources
      .reduce((groups, source) => {
        if (source.type !== "subgenre") return groups;
        const key = source.subgenres.map((s) => s.slug).join(",");
        const existing = groups.get(key);
        groups.set(key, {
          key,
          labels: source.subgenres.map((s) => s.name),
          sources: [...(existing?.sources ?? []), source],
        });
        return groups;
      }, new Map<string, SubgenreGroup>())
      .values(),
  ]);
</script>

{#snippet sectionHeader(
  label: string,
  type: "activity" | "favorite" | "subgenre",
)}
  <div class="recommendation-sources-section-header" data-type={type}>
    <div class="recommendation-sources-section-icon">
      {#if type === "activity"}
        <TrackIcon />
      {:else if type === "favorite"}
        <FavoriteIcon />
      {:else}
        <SparkleIcon />
      {/if}
    </div>
    <span class="capitalize bold">{label}</span>
  </div>
{/snippet}

<Drawer
  {onClose}
  {title}
  size="large"
  metaInfo={m.drawer_title_recommendation_sources()}
>
  <div class="trakt-recommendation-sources-drawer">
    {#if activitySources.length > 0}
      <div class="recommendation-sources-section">
        {@render sectionHeader(
          m.list_title_recommendation_sources_activity(),
          "activity",
        )}
        <div class="recommendation-sources-items">
          {#each activitySources as source (source.id)}
            <RecommendationSourceItem {source} />
          {/each}
        </div>
      </div>
    {/if}

    {#if favoriteSources.length > 0}
      <div class="recommendation-sources-section">
        {@render sectionHeader(
          m.list_title_recommendation_sources_favorite(),
          "favorite",
        )}
        <div class="recommendation-sources-items">
          {#each favoriteSources as source (source.id)}
            <RecommendationSourceItem {source} />
          {/each}
        </div>
      </div>
    {/if}

    {#if subgenreSources.length > 0}
      <div class="recommendation-sources-section">
        {@render sectionHeader(
          m.list_title_recommendation_sources_subgenre(),
          "subgenre",
        )}
        <div class="recommendation-sources-subgenre-groups">
          {#each subgenreSources as group (group.key)}
            <div class="recommendation-sources-subgenre-group">
              <div class="recommendation-sources-subgenre-group-tags">
                {#each group.labels as subgenre, index (index)}
                  <StemTag>
                    <span class="tag bold capitalize">
                      {toTranslatedSubgenre(subgenre)}
                    </span>
                  </StemTag>
                {/each}
              </div>
              <div class="recommendation-sources-items">
                {#each group.sources as source (source.id)}
                  <RecommendationSourceItem {source} />
                {/each}
              </div>
            </div>
          {/each}
        </div>
      </div>
    {/if}
  </div>
</Drawer>

<style lang="scss">
  .trakt-recommendation-sources-drawer {
    display: flex;
    flex-direction: column;
    gap: var(--gap-xl);
    padding: var(--ni-4);
  }

  .recommendation-sources-section {
    display: flex;
    flex-direction: column;
    gap: var(--gap-xs);
  }

  .recommendation-sources-section-header {
    display: flex;
    align-items: center;
    gap: var(--gap-xs);
    padding: var(--ni-10) var(--ni-12);
    border-radius: var(--border-radius-m);
    background: color-mix(
      in srgb,
      var(--section-accent, var(--color-text-primary)) 8%,
      transparent
    );
    border: var(--ni-1) solid
      color-mix(
        in srgb,
        var(--section-accent, var(--color-text-primary)) 12%,
        transparent
      );

    &[data-type="activity"] {
      --section-accent: var(--list-meta-info-color);
    }

    &[data-type="favorite"] {
      --section-accent: var(--color-vip-border-accent);
    }

    &[data-type="subgenre"] {
      --section-accent: var(--color-text-secondary);
    }
  }

  .recommendation-sources-section-icon {
    display: flex;
    color: var(--section-accent, var(--color-text-secondary));

    :global(svg) {
      width: var(--ni-14);
      height: var(--ni-14);
    }
  }

  .recommendation-sources-items {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    gap: var(--gap-xs);
    container-type: inline-size;

    --width-override-card: calc((100cqi - 3 * var(--gap-xs)) / 4);
    --card-aspect-ratio: calc(
      var(--height-portrait-card-cover) / var(--width-portrait-card)
    );
    --height-override-card-cover: calc(
      var(--width-override-card) * var(--card-aspect-ratio)
    );
    --height-override-card: calc(
      var(--height-override-card-cover) + var(--gap-xxs)
    );
  }

  .recommendation-sources-subgenre-groups {
    display: flex;
    flex-direction: column;
    gap: var(--gap-xs);
  }

  .recommendation-sources-subgenre-group {
    display: flex;
    flex-direction: column;
    gap: var(--gap-xs);
    padding: var(--ni-12);
    border-radius: var(--border-radius-l);
    background: color-mix(in srgb, var(--color-text-primary) 4%, transparent);
  }

  .recommendation-sources-subgenre-group-tags {
    display: flex;
    gap: var(--gap-xs);

    :global(.trakt-stem-tag) {
      display: flex;
    }
  }
</style>
