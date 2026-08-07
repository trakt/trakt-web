<script lang="ts">
  import type { TagType } from "$lib/components/media/tags/models/TagType";
  import StemTag from "$lib/components/tags/StemTag.svelte";
  import TextTag from "$lib/components/tags/TextTag.svelte";
  import { type EpisodeType } from "$lib/requests/models/EpisodeType";
  import type { CoalescedEpisodes } from "../CoalescedEpisodes";
  import type { EpisodeIntl } from "../EpisodeIntl";
  import { getEpisodeStatus } from "../getEpisodeStatus";

  type EpisodeStatusProps = {
    i18n: EpisodeIntl;
    episodeType: EpisodeType;
    type?: TagType;
    isLatestAired?: boolean;
    releaseDate?: Date;
    episodes?: CoalescedEpisodes;
  };

  const {
    i18n,
    episodeType,
    type = "text",
    isLatestAired,
    releaseDate,
    episodes,
  }: EpisodeStatusProps = $props();

  const status = $derived(
    getEpisodeStatus(episodeType, { isLatestAired, releaseDate, episodes }),
  );
</script>

{#snippet tagContent(text: string)}
  <div class="trakt-episode-status">
    <div class="trakt-episode-status-indicator" data-status={status}></div>
    <p class="bold capitalize ellipsis">
      {text}
    </p>
  </div>
{/snippet}

{#snippet tag(text: string)}
  {#if type === "text"}
    <TextTag>{@render tagContent(text)}</TextTag>
  {:else}
    <StemTag>{@render tagContent(text)}</StemTag>
  {/if}
{/snippet}

{#if status === "finale"}
  {@render tag(i18n.finaleText())}
{:else if status === "premiere"}
  {@render tag(i18n.premiereText())}
{:else if status === "new-season"}
  {@render tag(i18n.newSeasonText())}
{:else if status === "new"}
  {@render tag(i18n.newText())}
{/if}

<style>
  .trakt-episode-status {
    display: flex;
    align-items: center;
    gap: var(--gap-xxs);
  }

  .trakt-episode-status-indicator {
    --indicator-size: var(--ni-6);

    width: var(--indicator-size);
    height: var(--indicator-size);
    border-radius: 50%;

    &[data-status="finale"] {
      background-color: var(--red-500);
    }

    &[data-status="premiere"],
    &[data-status="new-season"] {
      background-color: var(--green-500);
    }

    &[data-status="new"] {
      background-color: var(--blue-500);
    }
  }
</style>
