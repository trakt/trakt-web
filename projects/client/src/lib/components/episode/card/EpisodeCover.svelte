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

  const { i18n, src, alt, tags, type, isLoading }: EpisodeCoverProps = $props();

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

  let isImagePending = $state(true);
  $effect(() => {
    if (!isLoading) {
      return;
    }

    isImagePending = true;
  });
</script>

<CardCover {src} {alt} {isLoading}>
  {#snippet tags()}
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
    {@render tags?.()}
  {/snippet}
</CardCover>
