<script lang="ts">
  import * as m from "$lib/features/i18n/messages";
  import type { MediaCredit } from "$lib/requests/models/MediaCredits";
  import { toTranslatedJob } from "$lib/utils/formatting/string/toTranslatedJob";
  import DefaultMediaItem from "./DefaultMediaItem.svelte";

  const {
    mediaCredit,
    source,
    mode,
  }: {
    mediaCredit: MediaCredit;
    source: string;
    mode?: "standalone" | "mixed";
  } = $props();

  const toCharacter = (character?: string) => {
    return character || m.translated_value_status_unknown();
  };

  const toJob = (job?: string) => {
    if (!job) return m.translated_value_status_unknown();

    return toTranslatedJob(job);
  };
</script>

<DefaultMediaItem
  type={mediaCredit.media.type}
  media={mediaCredit.media}
  {source}
  variant="credit"
  {mode}
  role={mediaCredit.type === "cast"
    ? toCharacter(mediaCredit.character)
    : toJob(mediaCredit.job)}
/>
