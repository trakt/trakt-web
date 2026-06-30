<script lang="ts">
  import { FeatureFlag } from "$lib/features/feature-flag/models/FeatureFlag.ts";
  import * as m from "$lib/features/i18n/messages.ts";
  import RenderForFeature from "$lib/guards/RenderForFeature.svelte";
  import { useAllTimeStats } from "../stores/useAllTimeStats.ts";
  import StatsCard from "./_internal/StatsCard.svelte";
  import AllTimeLink from "./AllTimeLink.svelte";
  import YearToDateLink from "./YearToDateLink.svelte";

  const { stats, isLoading } = useAllTimeStats();
</script>

<StatsCard title={m.text_all_time()} stats={$stats} isLoading={$isLoading}>
  {#snippet footer()}
    <div class="year-link">
      <YearToDateLink slug="me" source="profile" />
      <RenderForFeature flag={FeatureFlag.YearInReview}>
        {#snippet enabled()}
          <AllTimeLink slug="me" source="profile" />
        {/snippet}
      </RenderForFeature>
    </div>
  {/snippet}
</StatsCard>

<style>
  .year-link {
    height: var(--ni-40);
    display: flex;
    justify-content: flex-end;
    align-items: center;
    gap: var(--gap-m);
  }
</style>
