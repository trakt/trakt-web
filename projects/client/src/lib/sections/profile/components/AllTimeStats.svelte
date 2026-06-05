<script lang="ts">
  import * as m from '$lib/features/i18n/messages.ts';
  import { useAllTimeStats } from '../stores/useAllTimeStats.ts';
  import StatsCard from './_internal/StatsCard.svelte';
  import YearToDateLink from './YearToDateLink.svelte';

  const { stats, isLoading } = useAllTimeStats();
</script>

<StatsCard title={m.text_all_time()} stats={$stats} isLoading={$isLoading}>
  {#snippet footer()}
    <div class="year-link">
      <YearToDateLink slug="me" source="profile" />
    </div>
  {/snippet}
</StatsCard>

<style>
  .year-link {
    height: var(--ni-40);
    display: flex;
    justify-content: flex-end;
    align-items: center;
  }
</style>
