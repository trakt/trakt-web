<script lang="ts">
  import * as m from "$lib/features/i18n/messages";

  import Link from "$lib/components/link/Link.svelte";
  import type { EpisodeEntry } from "$lib/requests/models/EpisodeEntry";
  import type { MediaIntl } from "$lib/requests/models/MediaIntl";
  import type { ShowEntry } from "$lib/requests/models/ShowEntry";
  import { UrlBuilder } from "$lib/utils/url/UrlBuilder";

  const {
    episode,
    show,
    showIntl,
  }: {
    episode: EpisodeEntry;
    show: ShowEntry;
    showIntl: MediaIntl;
  } = $props();

  const showTitle = $derived(showIntl.title ?? show.title);
</script>

<div class="trakt-summary-episode-title">
  <Link href={UrlBuilder.show(show.slug)}>
    <h6>{showTitle}</h6>
  </Link>
  <p class="bold">{m.text_season_episode_number(episode)}</p>
</div>

<style>
  .trakt-summary-episode-title {
    display: flex;
    align-items: center;
    gap: var(--gap-s);
  }
</style>
