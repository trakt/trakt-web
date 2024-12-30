<script lang="ts">
  import CertificationTag from "$lib/components/media/tags/CertificationTag.svelte";
  import PlaysTag from "$lib/components/media/tags/PlaysTag.svelte";
  import WatchingTag from "$lib/components/media/tags/WatchingTag.svelte";
  import YearTag from "$lib/components/media/tags/YearTag.svelte";
  import * as m from "$lib/features/i18n/messages";
  import type { ActiveWatcher } from "$lib/models/ActiveWatcher";
  import type { MediaStats } from "$lib/models/MediaStats";
  import { languageTag } from "$lib/paraglide/runtime";
  import { toHumanNumber } from "$lib/utils/formatting/number/toHumanNumber";

  type MediaMetaTagsProps = {
    certification: string | Nil;
    year: number | Nil;
    watchers: ActiveWatcher[];
    stats: MediaStats;
  };

  const { certification, year, stats, watchers }: MediaMetaTagsProps = $props();
</script>

<div class="trakt-meta-tags">
  {#if certification}
    <CertificationTag>
      {certification}
    </CertificationTag>
  {/if}

  {#if year}
    <YearTag>
      {year}
    </YearTag>
  {/if}

  <WatchingTag>
    {m.active_watchers({ count: watchers.length })}
  </WatchingTag>

  <PlaysTag>
    {toHumanNumber(stats.plays, languageTag())}
    {m.plays()}
  </PlaysTag>
</div>

<style>
  .trakt-meta-tags {
    display: flex;
    gap: var(--ni-8);
  }
</style>
