<script lang="ts">
  import AirDateTag from "$lib/components/media/tags/AirDateTag.svelte";
  import DurationTag from "$lib/components/media/tags/DurationTag.svelte";
  import EpisodeCountTag from "$lib/components/media/tags/EpisodeCountTag.svelte";
  import { TagIntlProvider } from "$lib/components/media/tags/TagIntlProvider";
  import * as m from "$lib/features/i18n/messages";
  import SpoilerBlur from "$lib/features/spoilers/components/SpoilerBlur.svelte";
  import { useMediaSpoiler } from "$lib/features/spoilers/useMediaSpoiler.ts";
  import type { MediaCredit } from "$lib/requests/models/MediaCredits";
  import { toTranslatedJob } from "$lib/utils/formatting/string/toTranslatedJob";
  import DefaultMediaItem from "./DefaultMediaItem.svelte";

  const {
    mediaCredit,
    source,
    mode,
    style = "cover",
  }: {
    mediaCredit: MediaCredit;
    source: string;
    mode?: "standalone" | "mixed";
    style?: "summary" | "cover";
  } = $props();

  const toCharacter = (character?: string) => {
    return character || m.translated_value_status_unknown();
  };

  const toJob = (job?: string) => {
    if (!job) return m.translated_value_status_unknown();

    return toTranslatedJob(job);
  };

  const media = $derived(mediaCredit.media);
  const { isSpoilerHidden } = $derived(
    useMediaSpoiler({ media, type: media.type }),
  );
</script>

{#snippet tag()}
  <AirDateTag i18n={TagIntlProvider} airDate={media.airDate} year={media.year} />

  {#if media.type === "show" && mediaCredit.episodeCount}
    <SpoilerBlur {isSpoilerHidden}>
      <EpisodeCountTag
        i18n={TagIntlProvider}
        count={mediaCredit.episodeCount}
      />
    </SpoilerBlur>
  {/if}

  {#if media.type === "movie"}
    {#if media.airDate < new Date()}
      <DurationTag i18n={TagIntlProvider} runtime={media.runtime} />
    {/if}
  {/if}
{/snippet}

<DefaultMediaItem
  type={media.type}
  {media}
  {source}
  variant="credit"
  {mode}
  {style}
  tag={style === "cover" ? tag : undefined}
  role={mediaCredit.type === "cast"
    ? toCharacter(mediaCredit.character)
    : toJob(mediaCredit.job)}
/>
