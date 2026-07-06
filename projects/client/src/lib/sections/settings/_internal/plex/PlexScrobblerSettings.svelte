<script lang="ts">
  import MovieIcon from "$lib/components/icons/MovieIcon.svelte";
  import ShowIcon from "$lib/components/icons/ShowIcon.svelte";
  import * as m from "$lib/features/i18n/messages.ts";
  import { useQuery } from "$lib/features/query/useQuery.ts";
  import { InvalidateAction } from "$lib/requests/models/InvalidateAction.ts";
  import { plexSettingsQuery } from "$lib/requests/plex/plexSettingsQuery.ts";
  import { plexUpdateSettingsRequest } from "$lib/requests/plex/plexUpdateSettingsRequest.ts";
  import { useInvalidator } from "$lib/stores/useInvalidator.ts";
  import { map } from "rxjs";
  import PlexToggleSettings from "./PlexToggleSettings.svelte";

  const { invalidate } = useInvalidator();

  const settingsQuery = useQuery(plexSettingsQuery());
  const settings = settingsQuery.pipe(map((q) => q.data?.scrobbler.toggles));
  const isLoading = settingsQuery.pipe(map((q) => q.isLoading));

  type MediaKind = "movie" | "show" | "season" | "episode";

  async function toggle(
    { mediaKind, key, current }: {
      mediaKind: MediaKind;
      key: string;
      current: boolean;
    },
  ) {
    await plexUpdateSettingsRequest({
      settings: { scrobbler: { toggles: { [mediaKind]: { [key]: !current } } } },
    });
    await invalidate(InvalidateAction.Plex.Settings);
  }
</script>

{#snippet movieIcon()}<MovieIcon />{/snippet}
{#snippet showIcon()}<ShowIcon />{/snippet}

{#if $isLoading || !$settings}
  <PlexToggleSettings
    title={m.header_plex_scrobbler_settings()}
    description={m.description_plex_scrobbler_settings()}
    isLoading={true}
    rows={[]}
  />
{:else}
  {@const t = $settings}
  <PlexToggleSettings
    title={m.header_plex_scrobbler_settings()}
    description={m.description_plex_scrobbler_settings()}
    isLoading={false}
    rows={[
      {
        icon: movieIcon,
        title: m.button_text_browse_movies(),
        chips: [
          {
            label: m.button_plex_toggle_scrobble(),
            ariaLabel: m.button_label_plex_scrobble_movie_watching(),
            isActive: t.movie.watching,
            onToggle: () => toggle({ mediaKind: "movie", key: "watching", current: t.movie.watching }),
          },
          {
            label: m.button_plex_toggle_watched(),
            ariaLabel: m.button_label_plex_scrobble_movie_watched(),
            isActive: t.movie.watched,
            onToggle: () => toggle({ mediaKind: "movie", key: "watched", current: t.movie.watched }),
          },
          {
            label: m.header_ratings(),
            ariaLabel: m.button_label_plex_scrobble_movie_rated(),
            isActive: t.movie.rated,
            onToggle: () => toggle({ mediaKind: "movie", key: "rated", current: t.movie.rated }),
          },
          {
            label: m.text_library(),
            ariaLabel: m.button_label_plex_scrobble_movie_library(),
            isActive: t.movie.collected,
            onToggle: () => toggle({ mediaKind: "movie", key: "collected", current: t.movie.collected }),
          },
        ],
      },
      {
        icon: showIcon,
        title: m.button_text_browse_shows(),
        chips: [
          {
            label: m.header_ratings(),
            ariaLabel: m.button_label_plex_scrobble_show_rated(),
            isActive: t.show.rated,
            onToggle: () => toggle({ mediaKind: "show", key: "rated", current: t.show.rated }),
          },
        ],
      },
      {
        icon: showIcon,
        title: m.list_title_seasons(),
        chips: [
          {
            label: m.header_ratings(),
            ariaLabel: m.button_label_plex_scrobble_season_rated(),
            isActive: t.season.rated,
            onToggle: () => toggle({ mediaKind: "season", key: "rated", current: t.season.rated }),
          },
        ],
      },
      {
        icon: showIcon,
        title: m.list_title_episodes(),
        chips: [
          {
            label: m.button_plex_toggle_scrobble(),
            ariaLabel: m.button_label_plex_scrobble_episode_watching(),
            isActive: t.episode.watching,
            onToggle: () => toggle({ mediaKind: "episode", key: "watching", current: t.episode.watching }),
          },
          {
            label: m.button_plex_toggle_watched(),
            ariaLabel: m.button_label_plex_scrobble_episode_watched(),
            isActive: t.episode.watched,
            onToggle: () => toggle({ mediaKind: "episode", key: "watched", current: t.episode.watched }),
          },
          {
            label: m.header_ratings(),
            ariaLabel: m.button_label_plex_scrobble_episode_rated(),
            isActive: t.episode.rated,
            onToggle: () => toggle({ mediaKind: "episode", key: "rated", current: t.episode.rated }),
          },
          {
            label: m.text_library(),
            ariaLabel: m.button_label_plex_scrobble_episode_library(),
            isActive: t.episode.collected,
            onToggle: () => toggle({ mediaKind: "episode", key: "collected", current: t.episode.collected }),
          },
        ],
      },
    ]}
  />
{/if}
