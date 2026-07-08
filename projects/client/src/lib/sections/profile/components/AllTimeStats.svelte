<script lang="ts">
  import Button from "$lib/components/buttons/Button.svelte";
  import CaretRightIcon from "$lib/components/icons/CaretRightIcon.svelte";
  import * as m from "$lib/features/i18n/messages.ts";
  import { useAllTimeStats } from "../stores/useAllTimeStats.ts";
  import AllTimeStatsDrawerHost from "./_internal/drawers/AllTimeStatsDrawerHost.svelte";
  import StatsCard from "./_internal/StatsCard.svelte";

  const { stats, isLoading } = useAllTimeStats();

  let isDrawerOpen = $state(false);
</script>

<StatsCard title={m.text_all_time()} stats={$stats} isLoading={$isLoading}>
  {#snippet footer()}
    <div class="all-time-footer">
      <Button
        label={m.button_label_all_time_stats()}
        onclick={() => (isDrawerOpen = true)}
        size="small"
      >
        {m.button_text_all_time_stats()}
        {#snippet icon()}
          <CaretRightIcon />
        {/snippet}
      </Button>
    </div>
  {/snippet}
</StatsCard>

{#if isDrawerOpen}
  <AllTimeStatsDrawerHost onClose={() => (isDrawerOpen = false)} />
{/if}

<style lang="scss">
  @use "$style/scss/mixins/index" as *;

  .all-time-footer {
    display: flex;

    :global(.trakt-button) {
      width: 100%;
      border: var(--ni-1) solid var(--color-text-primary);
    }

    // Match the card hover: recolor the stroke to purple and drop the flat
    // button's lift (transform + raised shadow).
    @include for-mouse {
      :global(
          .trakt-button[data-style="flat"]:hover:not([disabled]):not(
              [aria-disabled="true"]
            )
        ),
      :global(
          .trakt-button[data-style="flat"]:focus-visible:not([disabled]):not(
              [aria-disabled="true"]
            )
        ) {
        transform: none;
        box-shadow: none;
        border-color: var(--color-card-border-hover);
      }
    }
  }
</style>
