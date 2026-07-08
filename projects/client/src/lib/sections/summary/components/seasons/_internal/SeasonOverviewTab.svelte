<script lang="ts">
  import * as m from "$lib/features/i18n/messages.ts";
  import type { Season } from "$lib/requests/models/Season";
  import type { ShowEntry } from "$lib/requests/models/ShowEntry.ts";
  import DrawerCastSection from "$lib/sections/summary/components/_internal/DrawerCastSection.svelte";
  import SeasonInfoSection from "./SeasonInfoSection.svelte";
  import DrawerTabTitle from "$lib/sections/summary/components/_internal/DrawerTabTitle.svelte";
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
    <DrawerTabTitle title={m.section_title_seasons_overview()} />
    <SeasonInfoSection {season} {show} />
  </div>

  <DrawerCastSection crew={$crew} type="show" isLoading={$isLoading} />
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
