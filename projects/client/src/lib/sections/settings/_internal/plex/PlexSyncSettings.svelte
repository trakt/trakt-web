<script lang="ts">
  import Button from "$lib/components/buttons/Button.svelte";
  import MovieIcon from "$lib/components/icons/MovieIcon.svelte";
  import ShowIcon from "$lib/components/icons/ShowIcon.svelte";
  import * as m from "$lib/features/i18n/messages.ts";
  import { useQuery } from "$lib/features/query/useQuery.ts";
  import { InvalidateAction } from "$lib/requests/models/InvalidateAction.ts";
  import { plexSettingsQuery } from "$lib/requests/plex/plexSettingsQuery.ts";
  import { plexUpdateSettingsRequest } from "$lib/requests/plex/plexUpdateSettingsRequest.ts";
  import { useInvalidator } from "$lib/stores/useInvalidator.ts";
  import { map } from "rxjs";
  import SettingsGroupCard from "../SettingsGroupCard.svelte";
  import SettingsGroupRow from "../SettingsGroupRow.svelte";
  import SettingsSectionLabel from "../SettingsSectionLabel.svelte";

  const { invalidate } = useInvalidator();

  const settingsQuery = useQuery(plexSettingsQuery());
  const settings = settingsQuery.pipe(map((q) => q.data?.sync.toggles));
  const isLoading = settingsQuery.pipe(map((q) => q.isLoading));

  type MediaKind = "movie" | "show" | "season" | "episode";
  type ToggleKey = string;

  async function toggle(
    mediaKind: MediaKind,
    key: ToggleKey,
    current: boolean,
  ) {
    await plexUpdateSettingsRequest({
      settings: {
        sync: {
          toggles: {
            [mediaKind]: { [key]: !current },
          },
        },
      },
    });
    await invalidate(InvalidateAction.Plex.Settings);
  }

  const skeletonRows = [{ tags: 3 }, { tags: 4 }, { tags: 2 }, { tags: 1 }];
</script>

<SettingsSectionLabel
  title={m.header_plex_sync_settings()}
  description={m.description_plex_sync_settings()}
/>

{#if $isLoading || !$settings}
  <SettingsGroupCard>
    {#each skeletonRows as row, i (i)}
      <div class="skeleton-row">
        <div class="skeleton skeleton-icon"></div>
        <div class="skeleton skeleton-label"></div>
        <div class="skeleton-tags">
          {#each Array(row.tags) as _, j (j)}
            <div class="skeleton skeleton-tag"></div>
          {/each}
        </div>
      </div>
    {/each}
  </SettingsGroupCard>
{:else}
  {@const t = $settings}
  <SettingsGroupCard>
    <SettingsGroupRow title={m.button_text_browse_movies()} variant="custom">
      {#snippet icon()}<MovieIcon />{/snippet}
      <div class="plex-toggle-tags">
        <Button
          size="tag"
          label={m.button_label_plex_toggle_movie_watched()}
          color={t.movie.watched ? "purple" : "default"}
          onclick={() => toggle("movie", "watched", t.movie.watched)}
        >
          {m.button_plex_toggle_watched()}
        </Button>
        <Button
          size="tag"
          label={m.button_label_plex_toggle_movie_rated()}
          color={t.movie.rated ? "purple" : "default"}
          onclick={() => toggle("movie", "rated", t.movie.rated)}
        >
          {m.header_ratings()}
        </Button>
        <Button
          size="tag"
          label={m.button_label_plex_toggle_movie_watchlist()}
          color={t.movie.watchlist ? "purple" : "default"}
          onclick={() => toggle("movie", "watchlist", t.movie.watchlist)}
        >
          {m.button_text_watchlist()}
        </Button>
        <Button
          size="tag"
          label={m.button_label_plex_toggle_movie_library()}
          color={t.movie.collected ? "purple" : "default"}
          onclick={() => toggle("movie", "collected", t.movie.collected)}
        >
          {m.text_library()}
        </Button>
      </div>
    </SettingsGroupRow>

    <SettingsGroupRow title={m.button_text_browse_shows()} variant="custom">
      {#snippet icon()}<ShowIcon />{/snippet}
      <div class="plex-toggle-tags">
        <Button
          size="tag"
          label={m.button_label_plex_toggle_show_rated()}
          color={t.show.rated ? "purple" : "default"}
          onclick={() => toggle("show", "rated", t.show.rated)}
        >
          {m.header_ratings()}
        </Button>
        <Button
          size="tag"
          label={m.button_label_plex_toggle_show_watchlist()}
          color={t.show.watchlist ? "purple" : "default"}
          onclick={() => toggle("show", "watchlist", t.show.watchlist)}
        >
          {m.button_text_watchlist()}
        </Button>
      </div>
    </SettingsGroupRow>

    <SettingsGroupRow title={m.list_title_seasons()} variant="custom">
      {#snippet icon()}<ShowIcon />{/snippet}
      <div class="plex-toggle-tags">
        <Button
          size="tag"
          label={m.button_label_plex_toggle_season_rated()}
          color={t.season.rated ? "purple" : "default"}
          onclick={() => toggle("season", "rated", t.season.rated)}
        >
          {m.header_ratings()}
        </Button>
      </div>
    </SettingsGroupRow>

    <SettingsGroupRow title={m.list_title_episodes()} variant="custom">
      {#snippet icon()}<ShowIcon />{/snippet}
      <div class="plex-toggle-tags">
        <Button
          size="tag"
          label={m.button_label_plex_toggle_episode_watched()}
          color={t.episode.watched ? "purple" : "default"}
          onclick={() => toggle("episode", "watched", t.episode.watched)}
        >
          {m.button_plex_toggle_watched()}
        </Button>
        <Button
          size="tag"
          label={m.button_label_plex_toggle_episode_rated()}
          color={t.episode.rated ? "purple" : "default"}
          onclick={() => toggle("episode", "rated", t.episode.rated)}
        >
          {m.header_ratings()}
        </Button>
        <Button
          size="tag"
          label={m.button_label_plex_toggle_episode_library()}
          color={t.episode.collected ? "purple" : "default"}
          onclick={() => toggle("episode", "collected", t.episode.collected)}
        >
          {m.text_library()}
        </Button>
      </div>
    </SettingsGroupRow>
  </SettingsGroupCard>
{/if}

<style>
  .plex-toggle-tags {
    display: flex;
    flex-wrap: wrap;
    gap: var(--gap-xs);
    justify-content: flex-end;
  }

  .skeleton-row {
    min-height: var(--ni-64);
    display: flex;
    align-items: center;
    gap: var(--gap-m);
    padding: var(--gap-s) var(--gap-m);
  }

  .skeleton-tags {
    display: flex;
    gap: var(--gap-xs);
    margin-inline-start: auto;
  }

  .skeleton {
    background-color: color-mix(in srgb, var(--color-border) 80%, transparent);
    border-radius: var(--border-radius-s);
    animation: pulse calc(5 * var(--transition-increment)) ease-in-out infinite
      alternate;
  }

  .skeleton-icon {
    flex-shrink: 0;
    width: var(--ni-36);
    height: var(--ni-36);
    border-radius: var(--border-radius-m);
  }

  .skeleton-label {
    width: var(--ni-80);
    height: var(--ni-16);
  }

  .skeleton-tag {
    width: var(--ni-60);
    height: var(--ni-28);
    border-radius: var(--border-radius-s);
  }
</style>
