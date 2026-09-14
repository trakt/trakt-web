<script lang="ts">
  import RenderFor from "$lib/guards/RenderFor.svelte";
  import type { MediaCrew } from "$lib/requests/models/MediaCrew";
  import type { MediaIntl } from "$lib/requests/models/MediaIntl";
  import { UrlBuilder } from "$lib/utils/url/UrlBuilder.ts";
  import SummaryRateNow from "../../_internal/SummaryRateNow.svelte";
  import MediaSummaryBody from "../../media/MediaSummaryBody.svelte";
  import type { MediaSummaryEntry } from "../../media/models/MediaSummaryEntry";
  import { useIsRateable } from "../../rating/_internal/useIsRateable";
  import MediaGlanceActions from "./MediaGlanceActions.svelte";

  const {
    intl,
    crew,
    ...target
  }: {
    intl: MediaIntl;
    crew: MediaCrew;
  } & MediaSummaryEntry = $props();

  const media = $derived(target.media);
  const href = $derived(UrlBuilder.media(target.type, media.slug));

  const { isRateable } = $derived(useIsRateable(target));
</script>

{#snippet actions()}
  <RenderFor audience="authenticated">
    <div class="trakt-media-glance-actions">
      <MediaGlanceActions {media} />
    </div>

    {#if $isRateable}
      <SummaryRateNow {...target} />
    {/if}
  </RenderFor>
{/snippet}

<MediaSummaryBody
  {intl}
  {crew}
  {actions}
  variant="drawer"
  color={media.colors?.at(0)}
  titleHref={href}
  hasDetails={false}
  hasReservedRows
  {...target}
/>

<style>
  .trakt-media-glance-actions {
    min-height: var(--glance-actions-height);
  }
</style>
