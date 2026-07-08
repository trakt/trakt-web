<script lang="ts">
  import * as m from "$lib/features/i18n/messages.ts";
  import type { EpisodeEntry } from "$lib/requests/models/EpisodeEntry.ts";
  import type { ShowEntry } from "$lib/requests/models/ShowEntry.ts";
  import DrawerCastSection from "$lib/sections/summary/components/_internal/DrawerCastSection.svelte";
  import DrawerTabTitle from "$lib/sections/summary/components/_internal/DrawerTabTitle.svelte";
  import { fromRune } from "$lib/utils/store/fromRune.svelte.ts";
  import EpisodeInfoSection from "./EpisodeInfoSection.svelte";
  import { useEpisodePeople } from "./useEpisodePeople.ts";

  const {
    show,
    episode,
  }: {
    show: ShowEntry;
    episode: EpisodeEntry;
  } = $props();

  const params$ = fromRune(() => ({
    slug: show.slug,
    season: episode.season,
    episode: episode.number,
  }));

  const { crew, isLoading } = useEpisodePeople(params$);
</script>

<div class="episode-info-tab">
  <div class="episode-info-block">
    <DrawerTabTitle title={m.section_title_seasons_overview()} />
    <EpisodeInfoSection {episode} {show} />
  </div>

  <DrawerCastSection crew={$crew} type="episode" isLoading={$isLoading} />
</div>

<style lang="scss">
  .episode-info-tab {
    display: flex;
    flex-direction: column;
    gap: var(--gap-l);
  }

  .episode-info-block {
    display: flex;
    flex-direction: column;
    gap: var(--gap-s);
  }
</style>
