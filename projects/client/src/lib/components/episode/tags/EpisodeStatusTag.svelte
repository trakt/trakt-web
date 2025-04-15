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
  <StemTag text={i18n.fullSeasonText()} />
{/if}
{#if isFinale}
  <StemTag text={i18n.finaleText({ type: type as EpisodeFinaleType })} />
{/if}
{#if isPremiere}
  <StemTag text={i18n.premiereText({ type: type as EpisodePremiereType })} />
{/if}
{#if isSeasonPremiere}
  <StemTag text={i18n.premiereText({ type: type as EpisodePremiereType })} />
{/if}
