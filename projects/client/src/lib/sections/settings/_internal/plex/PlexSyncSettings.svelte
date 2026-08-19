<script lang="ts">
  import MovieIcon from "$lib/components/icons/MovieIcon.svelte";
  import ShowIcon from "$lib/components/icons/ShowIcon.svelte";
  import * as m from "$lib/features/i18n/messages.ts";
  import { useQuery } from "$lib/features/query/useQuery.ts";
  import { plexSettingsQuery } from "$lib/requests/plex/plexSettingsQuery.ts";
  import { map } from "rxjs";
  import PlexToggleSettings from "./PlexToggleSettings.svelte";
  import { usePlexSettingsToggle } from "./usePlexSettingsToggle.ts";

  const toggle = usePlexSettingsToggle("sync");

  const settingsQuery = useQuery(plexSettingsQuery());
  const settings = settingsQuery.pipe(map((q) => q.data?.sync.toggles));
  const isLoading = settingsQuery.pipe(map((q) => q.isLoading));
</script>

{#snippet movieIcon()}<MovieIcon />{/snippet}
{#snippet showIcon()}<ShowIcon />{/snippet}

{#if $isLoading || !$settings}
  <PlexToggleSettings
    title={m.header_plex_sync_settings()}
    description={m.description_plex_sync_settings()}
    isLoading={true}
    rows={[]}
    onToggle={toggle}
  />
{:else}
  {@const t = $settings}
  <PlexToggleSettings
    title={m.header_plex_sync_settings()}
    description={m.description_plex_sync_settings()}
    isLoading={false}
    onToggle={toggle}
    rows={[
      {
        mediaKind: "movie",
        icon: movieIcon,
        title: m.button_text_browse_movies(),
        chips: [
          {
            settingKey: "watched",
            label: m.button_plex_toggle_watched(),
            ariaLabel: m.button_label_plex_toggle_movie_watched(),
            isActive: t.movie.watched,
          },
          {
            settingKey: "rated",
            label: m.header_ratings(),
            ariaLabel: m.button_label_plex_toggle_movie_rated(),
            isActive: t.movie.rated,
          },
          {
            settingKey: "watchlist",
            label: m.button_text_watchlist(),
            ariaLabel: m.button_label_plex_toggle_movie_watchlist(),
            isActive: t.movie.watchlist,
          },
          {
            settingKey: "collected",
            label: m.text_library(),
            ariaLabel: m.button_label_plex_toggle_movie_library(),
            isActive: t.movie.collected,
          },
        ],
      },
      {
        mediaKind: "show",
        icon: showIcon,
        title: m.button_text_browse_shows(),
        chips: [
          {
            settingKey: "rated",
            label: m.header_ratings(),
            ariaLabel: m.button_label_plex_toggle_show_rated(),
            isActive: t.show.rated,
          },
          {
            settingKey: "watchlist",
            label: m.button_text_watchlist(),
            ariaLabel: m.button_label_plex_toggle_show_watchlist(),
            isActive: t.show.watchlist,
          },
        ],
      },
      {
        mediaKind: "season",
        icon: showIcon,
        title: m.list_title_seasons(),
        chips: [
          {
            settingKey: "rated",
            label: m.header_ratings(),
            ariaLabel: m.button_label_plex_toggle_season_rated(),
            isActive: t.season.rated,
          },
        ],
      },
      {
        mediaKind: "episode",
        icon: showIcon,
        title: m.list_title_episodes(),
        chips: [
          {
            settingKey: "watched",
            label: m.button_plex_toggle_watched(),
            ariaLabel: m.button_label_plex_toggle_episode_watched(),
            isActive: t.episode.watched,
          },
          {
            settingKey: "rated",
            label: m.header_ratings(),
            ariaLabel: m.button_label_plex_toggle_episode_rated(),
            isActive: t.episode.rated,
          },
          {
            settingKey: "collected",
            label: m.text_library(),
            ariaLabel: m.button_label_plex_toggle_episode_library(),
            isActive: t.episode.collected,
          },
        ],
      },
    ]}
  />
{/if}
