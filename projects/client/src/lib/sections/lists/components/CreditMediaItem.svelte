<script lang="ts">
  import AirDateTag from "$lib/components/media/tags/AirDateTag.svelte";
  import DurationTag from "$lib/components/media/tags/DurationTag.svelte";
  import EpisodeCountTag from "$lib/components/media/tags/EpisodeCountTag.svelte";
  import { TagIntlProvider } from "$lib/components/media/tags/TagIntlProvider";
  import * as m from "$lib/features/i18n/messages";
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
</script>

{#snippet tag()}
  <AirDateTag i18n={TagIntlProvider} airDate={media.airDate} />

  {#if media.type === "show" && mediaCredit.episodeCount}
    <EpisodeCountTag i18n={TagIntlProvider} count={mediaCredit.episodeCount} />
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
