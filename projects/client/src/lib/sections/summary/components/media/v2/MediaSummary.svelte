<script lang="ts">
  import CoverImageSetter from "$lib/components/background/CoverImageSetter.svelte";
  import RenderFor from "$lib/guards/RenderFor.svelte";
  import type { MediaCrew } from "$lib/requests/models/MediaCrew";
  import type { MediaIntl } from "$lib/requests/models/MediaIntl";
  import NavbarStateSetter from "$lib/sections/navbar/NavbarStateSetter.svelte";
  import { SummaryDrawers } from "$lib/sections/summary/SummaryDrawers.ts";
  import { summaryDrawerNavigation } from "$lib/sections/summary/summaryDrawerNavigation.ts";
  import SocialActivitiesButton from "../../_internal/SocialActivitiesButton.svelte";
  import SummaryRateNow from "../../_internal/SummaryRateNow.svelte";
  import { useIsRateable } from "../../rating/_internal/useIsRateable";
  import type { MediaSummaryEntry } from "../models/MediaSummaryEntry";
  import MediaSummaryBody from "../MediaSummaryBody.svelte";
  import MediaActions from "./_internal/MediaActions.svelte";
  import SideActions from "./_internal/SideActions.svelte";

  const {
    intl,
    crew,
    ...target
  }: {
    intl: MediaIntl;
    crew: MediaCrew;
  } & MediaSummaryEntry = $props();

  const media = $derived(target.media);

  const title = $derived(intl?.title ?? media?.title ?? "");
  const socialTarget = $derived({
    type: target.type,
    slug: media.slug,
  });

  const { isRateable } = $derived(useIsRateable(target));

  const { buildDrawerLink } = summaryDrawerNavigation();
  const ratingsDrilldown = $derived(buildDrawerLink(SummaryDrawers.Ratings));
</script>

{#snippet sideActions()}
  <SideActions {title} type={target.type} {media} />
{/snippet}

{#snippet actions()}
  <RenderFor audience="authenticated">
    <MediaActions {media} {title} />
    <SocialActivitiesButton target={socialTarget} {title} />
  </RenderFor>
{/snippet}

<CoverImageSetter
  src={media.cover.url.medium}
  colors={media.colors}
  type={target.type}
/>

{#if $isRateable}
  <NavbarStateSetter>
    {#snippet contextualActions()}
      <SummaryRateNow {...target} />
    {/snippet}
  </NavbarStateSetter>
{/if}

<MediaSummaryBody
  {intl}
  {crew}
  {actions}
  {sideActions}
  color={media.colors?.at(0)}
  {ratingsDrilldown}
  {...target}
/>
