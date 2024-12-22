<script lang="ts">
  import * as m from "$lib/features/i18n/messages.ts";
  import type { MediaStudio } from "$lib/models/MediaStudio";
  import type { MediaSummary } from "$lib/requests/models/MediaSummary";
  import { constructMediaDetails } from "../utils/constructMediaDetails";
  import MediaCollapsableValues from "./MediaCollapsableValues.svelte";

  type MediaDetailsProps = {
    media: MediaSummary;
    studios: MediaStudio[];
  };

  const { media, studios }: MediaDetailsProps = $props();

  /*TODO:
    -Director/writers
    -Differentiate between Show and Movie
  */

  const mediaDetails = constructMediaDetails({ media, studios });
</script>

<div class="trakt-summary-details">
  <h5>{m.details()}</h5>
  <div class="trakt-summary-details-content">
    {#each mediaDetails as { title, values }}
      {#if values}
        <div class="trakt-summary-detail">
          <p class="meta-info secondary">{title}</p>
          <MediaCollapsableValues category={title} {values} />
        </div>
      {/if}
    {/each}
  </div>
</div>

<style>
  .trakt-summary-details {
    display: flex;
    flex-direction: column;
    gap: var(--ni-24);
  }

  .trakt-summary-details-content {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: var(--ni-16);

    @media (max-width: 480px) {
      grid-template-columns: 1fr;
    }
  }
</style>
