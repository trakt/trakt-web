<script lang="ts">
  import CardCover from "$lib/components/card/CardCover.svelte";
  import Link from "$lib/components/link/Link.svelte";
  import * as m from "$lib/features/i18n/messages.ts";
  import { useEpisodeSpoilerImage } from "$lib/features/spoilers/useEpisodeSpoilerImage";
  import type { EpisodeEntry } from "$lib/requests/models/EpisodeEntry";
  import type { ShowEntry } from "$lib/requests/models/ShowEntry";
  import { EPISODE_COVER_PLACEHOLDER } from "$lib/utils/constants";
  import { episodeActivityTitle } from "$lib/utils/intl/episodeActivityTitle";
  import { UrlBuilder } from "$lib/utils/url/UrlBuilder";

  const { episode, show }: { episode: EpisodeEntry; show: ShowEntry } =
    $props();

  const src = $derived(
    useEpisodeSpoilerImage({ episode, show, variant: "activity" }),
  );
  const title = $derived(episodeActivityTitle(episode, show));
</script>

<Link
  focusable={false}
  href={UrlBuilder.episode(show.slug, episode.season, episode.number)}
>
  <CardCover
    {title}
    src={$src ?? EPISODE_COVER_PLACEHOLDER}
    alt={m.image_alt_media_poster({ title })}
  />
</Link>
