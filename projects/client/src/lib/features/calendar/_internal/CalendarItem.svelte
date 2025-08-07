<script lang="ts">
  import StemTag from "$lib/components/tags/StemTag.svelte";
  import { getLocale } from "$lib/features/i18n";
  import DefaultMediaItem from "$lib/sections/lists/components/DefaultMediaItem.svelte";
  import EpisodeItem from "$lib/sections/lists/components/EpisodeItem.svelte";
  import { toHumanDay } from "$lib/utils/formatting/date/toHumanDay";
  import type { CalendarItem } from "../models/CalendarEntry";

  const { item }: { item: CalendarItem } = $props();
</script>

{#snippet tag()}
  <StemTag>
    <p class="meta-info capitalize no-wrap">
      {toHumanDay(item.airDate, getLocale())}
    </p>
  </StemTag>
{/snippet}

{#if "show" in item}
  <EpisodeItem episode={item} {tag} show={item.show} variant="upcoming" />
{/if}

{#if item.type === "movie"}
  <DefaultMediaItem media={item} {tag} type={item.type} variant="landscape" />
{/if}
