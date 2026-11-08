<script lang="ts">
  import AvatarPill from "$lib/components/avatar-pill/AvatarPill.svelte";
  import AvatarPillSkeleton from "$lib/components/avatar-pill/AvatarPillSkeleton.svelte";
  import ClockIcon from "$lib/components/icons/ClockIcon.svelte";
  import * as m from "$lib/features/i18n/messages.ts";
  import type { Season } from "$lib/requests/models/Season.ts";
  import type { ShowEntry } from "$lib/requests/models/ShowEntry.ts";
  import { SummaryDrawers } from "$lib/sections/summary/SummaryDrawers.ts";
  import { summaryDrawerNavigation } from "$lib/sections/summary/summaryDrawerNavigation.ts";
  import { fromRune } from "$lib/utils/store/fromRune.svelte.ts";
  import { toRecapScope } from "./toRecapScope.ts";
  import { useCaughtUpSeason } from "./useCaughtUpSeason.ts";
  import { useSeasonRecap } from "./useSeasonRecap.ts";

  const {
    show,
    seasons,
  }: {
    show: Pick<ShowEntry, "id" | "slug">;
    seasons: ReadonlyArray<Season>;
  } = $props();

  const caughtUpSeason = useCaughtUpSeason(
    fromRune(() => ({ showId: show.id, seasons })),
  );
  const season = $derived($caughtUpSeason ?? 0);
  const { recap } = useSeasonRecap(
    fromRune(() => ({
      slug: show.slug,
      season,
      enabled: season > 0,
    })),
  );
  const isLoading = $derived(
    $caughtUpSeason === null || (season > 0 && $recap === undefined),
  );

  const { buildDrawerLink } = summaryDrawerNavigation();
  const drawerLink = $derived(buildDrawerLink(SummaryDrawers.SeasonRecap));
  const scope = $derived(toRecapScope(season));
</script>

{#snippet icon()}
  <ClockIcon />
{/snippet}

{#if isLoading}
  <AvatarPillSkeleton countWidth="8ch" labelWidth="8ch" />
{:else if $recap && season > 0}
  <AvatarPill
    avatars={[]}
    countLabel={m.button_text_catch_up()}
    label={scope}
    ariaLabel={m.button_label_open_season_recap({ season: scope })}
    href={drawerLink.href}
    noscroll={drawerLink.noscroll}
    replacestate={drawerLink.replacestate}
    {icon}
  />
{/if}
