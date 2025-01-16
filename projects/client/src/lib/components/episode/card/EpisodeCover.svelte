<script lang="ts">
  import CardCover from "$lib/components/card/CardCover.svelte";
  import type { CardCoverProps } from "$lib/components/card/CardCoverProps";
  import {
    EpisodeFinaleType,
    EpisodePremiereType,
    type EpisodeType,
  } from "$lib/models/EpisodeType";
  import type { EpisodeIntl } from "../EpisodeIntl";
  import EpisodeStatusTag from "../tags/EpisodeStatusTag.svelte";

  type EpisodeCoverProps = {
    i18n: EpisodeIntl;
    type: EpisodeType;
  } & CardCoverProps;

  const {
    i18n,
    src,
    alt,
    tags: episodeTags,
    type,
    isLoading,
  }: EpisodeCoverProps = $props();

  const isSeasonPremiere = $derived(
    [EpisodePremiereType.MidSeason, EpisodePremiereType.Season].includes(
      type as EpisodePremiereType,
    ),
  );

  const isPremiere = $derived(
    EpisodePremiereType.Series === (type as EpisodePremiereType),
  );

  const isFinale = $derived(
    [
      EpisodeFinaleType.MidSeason,
      EpisodeFinaleType.Season,
      EpisodeFinaleType.Series,
    ].includes(type as EpisodeFinaleType),
  );

  const isFullSeason = $derived(type === "full_season");
</script>

<CardCover {src} {alt} {isLoading}>
  {#snippet tags()}
    {#if isFullSeason}
      <EpisodeStatusTag
        --color-background-status-tag={"var(--color-background-full-season-tag)"}
        --color-text-status-tag={"var(--color-text-full-season-tag)"}
      >
        {i18n.fullSeasonText()}
      </EpisodeStatusTag>
    {/if}
    {#if isFinale}
      <EpisodeStatusTag
        --color-background-status-tag={"var(--color-background-finale-tag)"}
        --color-text-status-tag={"var(--color-text-finale-tag)"}
      >
        {i18n.finaleText({ type: type as EpisodeFinaleType })}
      </EpisodeStatusTag>
    {/if}
    {#if isPremiere}
      <EpisodeStatusTag
        --color-background-status-tag={"var(--color-background-series-premiere-tag)"}
        --color-text-status-tag={"var(--color-text-series-premiere-tag)"}
      >
        {i18n.premiereText({ type: type as EpisodePremiereType })}
      </EpisodeStatusTag>
    {/if}
    {#if isSeasonPremiere}
      <EpisodeStatusTag
        --color-background-status-tag={"var(--color-background-season-premiere-tag)"}
        --color-text-status-tag={"var(--color-text-season-premiere-tag)"}
      >
        {i18n.premiereText({ type: type as EpisodePremiereType })}
      </EpisodeStatusTag>
    {/if}
    {@render episodeTags?.()}
  {/snippet}
</CardCover>
