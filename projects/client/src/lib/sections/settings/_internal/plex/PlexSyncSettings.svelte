<script lang="ts">
  import Button from '$lib/components/buttons/Button.svelte';
  import * as m from '$lib/features/i18n/messages.ts';
  import { useQuery } from '$lib/features/query/useQuery.ts';
  import { InvalidateAction } from '$lib/requests/models/InvalidateAction.ts';
  import { plexSettingsQuery } from '$lib/requests/plex/plexSettingsQuery.ts';
  import { plexUpdateSettingsRequest } from '$lib/requests/plex/plexUpdateSettingsRequest.ts';
  import { useInvalidator } from '$lib/stores/useInvalidator.ts';
  import { map } from 'rxjs';
  import SettingsBlock from '../SettingsBlock.svelte';
  import ToggleRow from '../ToggleRow.svelte';

  const { invalidate } = useInvalidator();

  const settings = useQuery(plexSettingsQuery()).pipe(
    map((q) => q.data?.sync.toggles),
  );

  type MediaKind = 'movie' | 'show' | 'season' | 'episode';
  type ToggleKey = string;

  async function toggle(mediaKind: MediaKind, key: ToggleKey, current: boolean) {
    await plexUpdateSettingsRequest({
      settings: {
        sync: {
          toggles: {
            [mediaKind]: { [key]: !current },
          },
        },
      },
    });
    await invalidate([InvalidateAction.Plex.Settings]);
  }

  const movieLabel = m.button_text_browse_movies;
  const showLabel = m.button_text_browse_shows;
  const episodeLabel = m.list_title_episodes;
  const seasonLabel = m.list_title_seasons;
</script>

{#if $settings}
  {@const t = $settings}
  <SettingsBlock
    title={m.header_plex_sync_settings()}
    description={m.description_plex_sync_settings()}
  >
    <ToggleRow title={episodeLabel()}>
      {#snippet children()}
        <Button
          size="tag"
          color={t.episode.watched ? 'purple' : 'default'}
          onclick={() => toggle('episode', 'watched', t.episode.watched)}
        >
          {m.button_plex_toggle_watched()}
        </Button>
        <Button
          size="tag"
          color={t.episode.rated ? 'purple' : 'default'}
          onclick={() => toggle('episode', 'rated', t.episode.rated)}
        >
          {m.header_ratings()}
        </Button>
        <Button
          size="tag"
          color={t.episode.collected ? 'purple' : 'default'}
          onclick={() => toggle('episode', 'collected', t.episode.collected)}
        >
          {m.text_library()}
        </Button>
      {/snippet}
    </ToggleRow>

    <ToggleRow title={movieLabel()}>
      {#snippet children()}
        <Button
          size="tag"
          color={t.movie.watched ? 'purple' : 'default'}
          onclick={() => toggle('movie', 'watched', t.movie.watched)}
        >
          {m.button_plex_toggle_watched()}
        </Button>
        <Button
          size="tag"
          color={t.movie.rated ? 'purple' : 'default'}
          onclick={() => toggle('movie', 'rated', t.movie.rated)}
        >
          {m.header_ratings()}
        </Button>
        <Button
          size="tag"
          color={t.movie.watchlist ? 'purple' : 'default'}
          onclick={() => toggle('movie', 'watchlist', t.movie.watchlist)}
        >
          {m.button_text_watchlist()}
        </Button>
        <Button
          size="tag"
          color={t.movie.collected ? 'purple' : 'default'}
          onclick={() => toggle('movie', 'collected', t.movie.collected)}
        >
          {m.text_library()}
        </Button>
      {/snippet}
    </ToggleRow>

    <ToggleRow title={showLabel()}>
      {#snippet children()}
        <Button
          size="tag"
          color={t.show.rated ? 'purple' : 'default'}
          onclick={() => toggle('show', 'rated', t.show.rated)}
        >
          {m.header_ratings()}
        </Button>
        <Button
          size="tag"
          color={t.show.watchlist ? 'purple' : 'default'}
          onclick={() => toggle('show', 'watchlist', t.show.watchlist)}
        >
          {m.button_text_watchlist()}
        </Button>
      {/snippet}
    </ToggleRow>

    <ToggleRow title={seasonLabel()}>
      {#snippet children()}
        <Button
          size="tag"
          color={t.season.rated ? 'purple' : 'default'}
          onclick={() => toggle('season', 'rated', t.season.rated)}
        >
          {m.header_ratings()}
        </Button>
      {/snippet}
    </ToggleRow>
  </SettingsBlock>
{/if}
