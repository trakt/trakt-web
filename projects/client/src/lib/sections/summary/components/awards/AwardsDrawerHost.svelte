<script lang="ts">
  import { page } from "$app/state";
  import FadeInDrawer from "$lib/components/drawer/FadeInDrawer.svelte";
  import { AnalyticsEvent } from "$lib/features/analytics/events/AnalyticsEvent.ts";
  import { useTrack } from "$lib/features/analytics/useTrack.ts";
  import { SOURCE_PARAM } from "$lib/sections/summary/constants.ts";
  import { onMount } from "svelte";
  import { AwardsOpenSourceSchema } from "./models/AwardsOpenSource.ts";
  import * as m from "$lib/features/i18n/messages.ts";
  import { fromRune } from "$lib/utils/store/fromRune.svelte";
  import AwardGroupHeader from "./_internal/AwardGroupHeader.svelte";
  import AwardRow from "./_internal/AwardRow.svelte";
  import type { AwardGroup } from "./_internal/models/AwardGroup.ts";
  import type { AwardDecade } from "./_internal/models/AwardDecade.ts";
  import { toAwardDecades } from "./_internal/toAwardDecades.ts";
  import { getLocale } from "$lib/features/i18n";
  import { toOrdinal } from "$lib/utils/formatting/number/toOrdinal.ts";
  import { toAwardSummary } from "./_internal/toAwardSummary.ts";
  import AwardSummaryLine from "./_internal/AwardSummaryLine.svelte";
  import type { AwardsTarget } from "./models/AwardsTarget.ts";
  import { useAwards } from "./useAwards.ts";

  const { target, onClose }: { target: AwardsTarget; onClose: () => void } =
    $props();

  const { awards, groups } = useAwards(fromRune(() => target));
  const { track } = useTrack(AnalyticsEvent.Awards);

  onMount(() => {
    const source = AwardsOpenSourceSchema.safeParse(
      page.url.searchParams.get(SOURCE_PARAM),
    );
    track({ source: source.success ? source.data : "link", type: target.type });
  });

  const summaryTallies = $derived(toAwardSummary($groups));
  const decades = $derived(toAwardDecades($awards ?? []));
  const isPerson = $derived(target.type === "person");

  function toGroupMeta(group: AwardGroup) {
    const latest = group.years.at(0);
    const first = group.years.at(-1);
    if (latest == null || first == null) return undefined;
    if (latest !== first) {
      return m.text_award_year_range({ from: first, to: latest });
    }

    const ceremony = group.entries.at(0)?.ceremony;
    return ceremony?.edition != null
      ? `${toOrdinal(ceremony.edition, getLocale())} · ${latest}`
      : String(latest);
  }

  function toGroupTally(group: AwardGroup) {
    if (group.isFestival && group.wins > 0) {
      return `<b>${m.text_award_tally_festival()}</b>`;
    }
    if (group.phase === "pre") {
      return m.text_award_tally_pending({
        count: group.entries.filter((entry) => entry.won === null).length,
      });
    }
    return m.text_award_tally_wins({
      wins: group.wins,
      count: group.nominations,
    });
  }

  function toDecadeTally(decade: AwardDecade) {
    const count = decade.entries.length;
    if (decade.wins > 0) {
      return m.text_award_tally_wins({ wins: decade.wins, count });
    }
    return count === 1
      ? m.text_award_nomination_count_one({ count })
      : m.text_award_nomination_count_other({ count });
  }
</script>

{#snippet metaInfo()}
  <AwardSummaryLine tallies={summaryTallies} />
{/snippet}

<FadeInDrawer
  {onClose}
  title={m.drawer_title_awards()}
  size="medium"
  {metaInfo}
>
  <ul class="trakt-awards-drawer">
    {#if isPerson}
      {#each decades as decade (decade.key)}
        <AwardGroupHeader
          title={m.text_award_decade({ decade: decade.decade })}
          tally={toDecadeTally(decade)}
          isWin={decade.wins > 0}
        />
        {#each decade.entries as entry (entry.key)}
          <AwardRow {entry} variant="person" />
        {/each}
      {/each}
    {:else}
      {#each $groups as group (group.id)}
        <AwardGroupHeader
          title={group.name}
          meta={toGroupMeta(group)}
          tally={toGroupTally(group)}
          isWin={group.wins > 0}
        />
        {#each group.entries as entry (entry.key)}
          <AwardRow {entry} variant="title" />
        {/each}
      {/each}
    {/if}
  </ul>
</FadeInDrawer>

<style lang="scss">
  @use "$style/scss/mixins/index" as *;

  .trakt-awards-drawer {
    --award-drawer-inset: var(--ni-12);

    display: flex;
    flex-direction: column;
    gap: var(--ni-2);

    margin: 0;
    padding: 0 0 var(--ni-20);
    list-style: none;

    @include for-mobile {
      --award-drawer-inset: var(--ni-16);
    }
  }
</style>
