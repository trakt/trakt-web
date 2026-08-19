<script lang="ts">
  import MovieIcon from "$lib/components/icons/MovieIcon.svelte";
  import ShowIcon from "$lib/components/icons/ShowIcon.svelte";
  import * as m from "$lib/features/i18n/messages.ts";
  import { useQuery } from "$lib/features/query/useQuery.ts";
  import { plexSettingsQuery } from "$lib/requests/plex/plexSettingsQuery.ts";
  import { map } from "rxjs";
  import PlexToggleSettings from "./PlexToggleSettings.svelte";
  import { usePlexSettingsToggle } from "./usePlexSettingsToggle.ts";

  const toggle = usePlexSettingsToggle("scrobbler");

  const settingsQuery = useQuery(plexSettingsQuery());
  const settings = settingsQuery.pipe(map((q) => q.data?.scrobbler.toggles));
  const isLoading = settingsQuery.pipe(map((q) => q.isLoading));
</script>

{#snippet movieIcon()}<MovieIcon />{/snippet}
{#snippet showIcon()}<ShowIcon />{/snippet}

{#if $isLoading || !$settings}
  <PlexToggleSettings
    title={m.header_plex_scrobbler_settings()}
    description={m.description_plex_scrobbler_settings()}
    isLoading={true}
    rows={[]}
    onToggle={toggle}
  />
{:else}
  {@const t = $settings}
  <PlexToggleSettings
    title={m.header_plex_scrobbler_settings()}
    description={m.description_plex_scrobbler_settings()}
    isLoading={false}
    onToggle={toggle}
    rows={[
      {
        mediaKind: "movie",
        icon: movieIcon,
        title: m.button_text_browse_movies(),
        chips: [
          {
            settingKey: "watching",
            label: m.button_plex_toggle_scrobble(),
            ariaLabel: m.button_label_plex_scrobble_movie_watching(),
            isActive: t.movie.watching,
          },
          {
            settingKey: "watched",
            label: m.button_plex_toggle_watched(),
            ariaLabel: m.button_label_plex_scrobble_movie_watched(),
            isActive: t.movie.watched,
          },
          {
            settingKey: "rated",
            label: m.header_ratings(),
            ariaLabel: m.button_label_plex_scrobble_movie_rated(),
            isActive: t.movie.rated,
          },
          {
            settingKey: "collected",
            label: m.text_library(),
            ariaLabel: m.button_label_plex_scrobble_movie_library(),
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
            ariaLabel: m.button_label_plex_scrobble_show_rated(),
            isActive: t.show.rated,
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
            ariaLabel: m.button_label_plex_scrobble_season_rated(),
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
            settingKey: "watching",
            label: m.button_plex_toggle_scrobble(),
            ariaLabel: m.button_label_plex_scrobble_episode_watching(),
            isActive: t.episode.watching,
          },
          {
            settingKey: "watched",
            label: m.button_plex_toggle_watched(),
            ariaLabel: m.button_label_plex_scrobble_episode_watched(),
            isActive: t.episode.watched,
          },
          {
            settingKey: "rated",
            label: m.header_ratings(),
            ariaLabel: m.button_label_plex_scrobble_episode_rated(),
            isActive: t.episode.rated,
          },
          {
            settingKey: "collected",
            label: m.text_library(),
            ariaLabel: m.button_label_plex_scrobble_episode_library(),
            isActive: t.episode.collected,
          },
        ],
      },
    ]}
  />
{/if}
