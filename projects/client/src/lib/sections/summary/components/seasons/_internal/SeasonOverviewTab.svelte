<script lang="ts">
  import * as m from "$lib/features/i18n/messages.ts";
  import type { Season } from "$lib/requests/models/Season";
  import type { ShowEntry } from "$lib/requests/models/ShowEntry.ts";
  import SeasonCastSection from "./SeasonCastSection.svelte";
  import SeasonInfoSection from "./SeasonInfoSection.svelte";
  import SeasonTabTitle from "./SeasonTabTitle.svelte";
  import { useSeasonPeople } from "./useSeasonPeople";

  const {
    show,
    season,
  }: {
    show: ShowEntry;
    season: Season;
  } = $props();

  const { crew, isLoading } = $derived(
    useSeasonPeople(show.slug, season.number),
  );
</script>

<div class="season-overview-tab">
  <div class="season-overview-block">
    <SeasonTabTitle title={m.section_title_seasons_overview()} />
    <SeasonInfoSection {season} showTitle={show.title} />
  </div>

  <SeasonCastSection crew={$crew} type="show" isLoading={$isLoading} />
</div>

<style lang="scss">
  .season-overview-tab {
    display: flex;
    flex-direction: column;
    gap: var(--gap-l);
  }

  .season-overview-block {
    display: flex;
    flex-direction: column;
    gap: var(--gap-s);
  }
</style>
