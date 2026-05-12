<script lang="ts">
  import Button from "$lib/components/buttons/Button.svelte";
  import { useUser } from "$lib/features/auth/stores/useUser";
  import UsageLimitItem from "../vip/_internal/UsageLimitItem.svelte";
  import SettingsBlock from "./_internal/SettingsBlock.svelte";

  const { history, limits } = useUser();

  const uniqueMovies = $derived($history?.movies.size ?? 0);
  const uniqueEpisodes = $derived(
    [...($history?.shows.values() ?? [])].reduce(
      (sum, show) => sum + show.episodes.length,
      0,
    ),
  );

  const totalMovies = $derived(
    [...($history?.movies.values() ?? [])].reduce(
      (sum, movie) => sum + movie.plays,
      0,
    ),
  );
  const totalEpisodes = $derived(
    [...($history?.shows.values() ?? [])].reduce(
      (sum, show) => sum + show.episodes.reduce((s, ep) => s + ep.plays, 0),
      0,
    ),
  );

  const duplicateMoviePlays = $derived(totalMovies - uniqueMovies);
  const duplicateEpisodePlays = $derived(totalEpisodes - uniqueEpisodes);

  const item = $derived({
    title: () => "History",
    limits: $limits?.history!,
  });
</script>

<SettingsBlock
  title="History Analysis"
  description="Analyze your watch history for duplicate entries."
>
  <!-- TODO: styling shouldn't be based on variant -->
  {#if $limits}
    <UsageLimitItem {item} variant="free" isLoading={!$limits} />
  {/if}

  <div class="history-stats-grid">
    {#each [{ label: "Movies", duplicates: duplicateMoviePlays, unique: uniqueMovies, total: totalMovies }, { label: "Episodes", duplicates: duplicateEpisodePlays, unique: uniqueEpisodes, total: totalEpisodes }] as category (category.label)}
      <div
        class="history-stat-card"
        data-has-duplicates={category.duplicates > 0}
      >
        <span class="secondary category-label bold tag">{category.label}</span>

        <div class="duplicate-hero">
          <span class="duplicate-count bold">{category.duplicates}</span>
          <span class="secondary duplicate-label">duplicate plays</span>
        </div>

        <div class="stat-divider"></div>

        <div class="stat-breakdown">
          <div class="breakdown-item">
            <span class="breakdown-value">{category.unique}</span>
            <span class="secondary breakdown-label">unique</span>
          </div>
          <div class="breakdown-separator"></div>
          <div class="breakdown-item">
            <span class="breakdown-value">{category.total}</span>
            <span class="secondary breakdown-label">total</span>
          </div>
          <div class="breakdown-separator"></div>
          <Button
            label="todo"
            size="small"
            color="red"
            variant="secondary"
            onclick={() => {}}>Clean up</Button
          >
        </div>
      </div>
    {/each}
  </div>
</SettingsBlock>

<style lang="scss">
  @use "$style/scss/mixins/index" as *;

  .history-stats-grid {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: var(--gap-m);

    @include for-mobile {
      grid-template-columns: 1fr;
    }
  }

  .history-stat-card {
    display: flex;
    flex-direction: column;
    gap: var(--gap-s);

    padding: var(--ni-20) var(--ni-24);
    border-radius: var(--border-radius-m);
    background-color: var(--color-card-background);
    box-shadow: var(--shadow-base);

    border: var(--ni-1) solid transparent;
    transition: border-color 0.2s ease;

    &[data-has-duplicates="true"] {
      border-color: color-mix(
        in srgb,
        var(--color-sentiment-bad) 25%,
        transparent
      );

      .duplicate-count {
        color: var(--color-sentiment-bad);
      }
    }
  }

  .duplicate-hero {
    display: flex;
    flex-direction: column;
    gap: var(--gap-micro);
  }

  .duplicate-count {
    font-size: var(--ni-40);
  }

  .stat-divider {
    height: var(--ni-1);
    background-color: color-mix(in srgb, var(--color-border) 60%, transparent);
    margin: var(--gap-xs) 0;
  }

  .stat-breakdown {
    display: flex;
    align-items: center;
    gap: var(--gap-m);
  }

  .breakdown-item {
    display: flex;
    flex-direction: column;
    gap: var(--gap-micro);
  }

  .breakdown-value {
    font-size: var(--font-size-title);
    font-weight: 600;
    line-height: 1;
  }

  .breakdown-separator {
    width: var(--ni-1);
    height: var(--ni-24);
    background-color: color-mix(in srgb, var(--color-border) 60%, transparent);
  }
</style>
