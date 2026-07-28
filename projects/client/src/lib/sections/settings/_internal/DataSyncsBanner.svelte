<script lang="ts">
  import { getLocale } from "$lib/features/i18n";
  import * as m from "$lib/features/i18n/messages.ts";
  import { toHumanDate } from "$lib/utils/formatting/date/toHumanDate.ts";
  import SettingsHighlightCard from "./SettingsHighlightCard.svelte";

  const {
    count,
    latestAt,
  }: {
    count: number;
    latestAt: Date;
  } = $props();
</script>

{#snippet icon()}
  <span class="banner-emoji">👾</span>
{/snippet}

{#snippet primary()}
  {m.text_data_syncs_count_before()}
  <strong>{count}</strong>
  {m.text_data_syncs_count_after()}
{/snippet}

{#snippet secondary()}
  {m.text_data_syncs_recent_before()}
  <strong>{toHumanDate(new Date(), latestAt, getLocale())}</strong>
{/snippet}

<SettingsHighlightCard {icon} {primary} {secondary} />

<style lang="scss">
  .banner-emoji {
    font-size: var(--ni-28);
    line-height: 1;
  }
</style>
