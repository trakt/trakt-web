<script lang="ts">
  import StemTag from "$lib/components/tags/StemTag.svelte";
  import {
    EpisodeFinaleType,
    EpisodePremiereType,
    type EpisodeType,
  } from "$lib/requests/models/EpisodeType";
  import type { EpisodeIntl } from "../EpisodeIntl";

  type EpisodeCoverProps = {
    i18n: EpisodeIntl;
    type: EpisodeType;
  };

  const { i18n, type }: EpisodeCoverProps = $props();

  const isSeasonPremiere = $derived(
    EpisodePremiereType.mid_season_premiere === (type as EpisodePremiereType) ||
      EpisodePremiereType.season_premiere === (type as EpisodePremiereType),
  );

  const isPremiere = $derived(
    EpisodePremiereType.series_premiere === (type as EpisodePremiereType),
  );

  const isFinale = $derived(
    [
      EpisodeFinaleType.mid_season_finale,
      EpisodeFinaleType.season_finale,
      EpisodeFinaleType.series_finale,
    ].includes(type as EpisodeFinaleType),
  );

  const isFullSeason = $derived(type === "full_season");
</script>

{#if isFullSeason}
  <StemTag
    --color-background-stem-tag={"var(--color-background-full-season-tag)"}
    --color-text-stem-tag={"var(--color-text-full-season-tag)"}
  >
    {i18n.fullSeasonText()}
  </StemTag>
{/if}
{#if isFinale}
  <StemTag
    --color-background-stem-tag={"var(--color-background-finale-tag)"}
    --color-text-stem-tag={"var(--color-text-finale-tag)"}
  >
    {i18n.finaleText({ type: type as EpisodeFinaleType })}
  </StemTag>
{/if}
{#if isPremiere}
  <StemTag
    --color-background-stem-tag={"var(--color-background-series-premiere-tag)"}
    --color-text-stem-tag={"var(--color-text-series-premiere-tag)"}
  >
    {i18n.premiereText({ type: type as EpisodePremiereType })}
  </StemTag>
{/if}
{#if isSeasonPremiere}
  <StemTag
    --color-background-stem-tag={"var(--color-background-season-premiere-tag)"}
    --color-text-stem-tag={"var(--color-text-season-premiere-tag)"}
  >
    {i18n.premiereText({ type: type as EpisodePremiereType })}
  </StemTag>
{/if}
