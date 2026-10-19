<script lang="ts">
  import DistributionBar from "$lib/components/charts/DistributionBar.svelte";
  import TabView from "$lib/components/tabs/TabView.svelte";
  import * as m from "$lib/features/i18n/messages.ts";

  const {
    importHistory,
    alwaysFullNote,
    onChoose,
  }: {
    importHistory: boolean;
    alwaysFullNote: string;
    onChoose: (importHistory: boolean) => void;
  } = $props();
</script>

{#snippet historySummary()}
  <p>
    {importHistory
      ? m.description_media_sync_history_all()
      : m.description_media_sync_history_today()}
    <span class="secondary">{alwaysFullNote}</span>
  </p>
{/snippet}

<div class="history-start">
  <p class="bold">{m.header_media_sync_history_start()}</p>
  <div class="timeline">
    <div class="track">
      <div class="past" class:is-dimmed={!importHistory}>
        <DistributionBar
          fraction={1}
          color="var(--purple-500)"
          fillStyle="flat"
          animated={false}
          label={m.label_media_sync_history_past()}
        />
      </div>
      <span class="today-marker"></span>
      <div class="future">
        <DistributionBar
          fraction={1}
          color="var(--purple-500)"
          fillStyle="flat"
          animated={false}
          label={m.label_media_sync_history_from_now()}
        />
      </div>
    </div>
    <div class="track-labels small secondary">
      <span class="past">
        {importHistory
          ? m.label_media_sync_history_first_play()
          : m.label_media_sync_history_skipped()}
      </span>
      <span class="future">{m.label_media_sync_history_today()}</span>
    </div>
  </div>
  <TabView
    value={importHistory ? "all" : "today"}
    onChange={(value) => onChoose(value === "all")}
    tabs={[
      {
        value: "all",
        label: m.tab_text_media_sync_history_all(),
        content: historySummary,
      },
      {
        value: "today",
        label: m.tab_text_media_sync_history_today(),
        content: historySummary,
      },
    ]}
  />
  <p class="small secondary">{m.hint_media_sync_history_resync()}</p>
</div>

<style lang="scss">
  p {
    margin: 0;
  }

  .history-start {
    display: flex;
    flex-direction: column;
    gap: var(--gap-m);
  }

  .timeline {
    display: flex;
    flex-direction: column;
    gap: var(--gap-xs);
  }

  .track,
  .track-labels {
    display: flex;
    gap: var(--gap-xs);

    .past {
      flex: 7;
    }

    .future {
      flex: 3;
    }
  }

  .track {
    align-items: center;

    .past {
      transition: opacity var(--transition-increment) ease-in-out;

      &.is-dimmed {
        opacity: 0.3;
      }
    }
  }

  .today-marker {
    width: var(--ni-4);
    height: var(--ni-16);
    border-radius: var(--border-radius-xl);
    background: var(--purple-500);
  }
</style>
