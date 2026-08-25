<script lang="ts">
  import type { TagType } from "$lib/components/media/tags/models/TagType";
  import StemTag from "$lib/components/tags/StemTag.svelte";
  import TextTag from "$lib/components/tags/TextTag.svelte";
  import { type EpisodeType } from "$lib/requests/models/EpisodeType";
  import type { CoalescedEpisodes } from "../CoalescedEpisodes";
  import type { EpisodeIntl } from "../EpisodeIntl";
  import type { EpisodeStatus } from "../EpisodeStatus";
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

  const labels: Record<EpisodeStatus, () => string> = $derived({
    "new": i18n.newText,
    "premiere": i18n.premiereText,
    "finale": i18n.finaleText,
    "new-premiere": i18n.newPremiereText,
    "new-finale": i18n.newFinaleText,
  });
</script>

{#snippet tagContent(episodeStatus: EpisodeStatus)}
  <div class="trakt-episode-status">
    <div
      class="trakt-episode-status-indicator"
      data-status={episodeStatus}
    ></div>
    <p class="bold capitalize ellipsis">
      {labels[episodeStatus]()}
    </p>
  </div>
{/snippet}

{#if status}
  {#if type === "text"}
    <TextTag>
      {@render tagContent(status)}
    </TextTag>
  {:else}
    <StemTag>
      {@render tagContent(status)}
    </StemTag>
  {/if}
{/if}

<style>
  .trakt-episode-status {
    display: flex;
    align-items: center;
    gap: var(--gap-xxs);

    min-width: 0;
  }

  .trakt-episode-status-indicator {
    --indicator-size: var(--ni-6);

    flex-shrink: 0;
    width: var(--indicator-size);
    height: var(--indicator-size);
    border-radius: 50%;

    &[data-status="finale"],
    &[data-status="new-finale"] {
      background-color: var(--red-500);
    }

    &[data-status="premiere"],
    &[data-status="new-premiere"] {
      background-color: var(--green-500);
    }

    &[data-status="new"] {
      background-color: var(--blue-500);
    }
  }
</style>
