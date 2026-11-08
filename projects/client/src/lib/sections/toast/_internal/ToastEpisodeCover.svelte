<script lang="ts">
  import * as m from "$lib/features/i18n/messages.ts";
  import { useEpisodeSpoilerImage } from "$lib/features/spoilers/useEpisodeSpoilerImage";
  import type { EpisodeEntry } from "$lib/requests/models/EpisodeEntry";
  import type { ShowEntry } from "$lib/requests/models/ShowEntry";
  import { EPISODE_COVER_PLACEHOLDER } from "$lib/utils/assets";
  import { episodeActivityTitle } from "$lib/utils/intl/episodeActivityTitle";
  import { UrlBuilder } from "$lib/utils/url/UrlBuilder";
  import ToastCover from "./ToastCover.svelte";

  const { episode, show }: { episode: EpisodeEntry; show: ShowEntry } =
    $props();

  const src = $derived(
    useEpisodeSpoilerImage({ episode, show, variant: "activity" }),
  );
  const title = $derived(episodeActivityTitle(episode, show));
</script>

<ToastCover
  href={UrlBuilder.episodeDrawer(show.slug, episode.season, episode.number)}
  src={$src ?? EPISODE_COVER_PLACEHOLDER}
  {title}
  alt={m.image_alt_media_poster({ title })}
/>
