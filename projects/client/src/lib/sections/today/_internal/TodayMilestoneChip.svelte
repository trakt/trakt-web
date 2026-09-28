<script lang="ts">
  import * as m from "$lib/features/i18n/messages.ts";
  import type { TodayMilestone } from "../models/TodayMilestone.ts";
  import TodayMilestoneIcon from "./TodayMilestoneIcon.svelte";

  const {
    milestone,
    size = "normal",
  }: { milestone: TodayMilestone; size?: "normal" | "small" } = $props();

  const text = $derived.by(() => {
    switch (milestone.type) {
      case "series-start":
        return m.tag_text_today_started_show();
      case "season-start":
        return m.tag_text_today_started_season({ season: milestone.season });
      case "season-end":
        return m.tag_text_today_finished_season({ season: milestone.season });
      case "series-end":
        return m.tag_text_today_finished_show();
    }
  });
</script>

<div
  class="trakt-today-milestone-chip"
  data-milestone={milestone.type}
  data-size={size}
>
  <TodayMilestoneIcon {milestone} />
  <span class="bold uppercase ellipsis">{text}</span>
</div>

<style lang="scss">
  .trakt-today-milestone-chip {
    display: inline-flex;
    align-items: center;
    gap: var(--gap-xxs);
    max-width: 100%;

    padding: var(--ni-4) var(--ni-10);
    border-radius: var(--border-radius-xxl);

    background: var(--purple-500);
    color: var(--shade-10);
    box-shadow: var(--shadow-base);

    &[data-milestone="series-end"] {
      background: linear-gradient(
        120deg,
        var(--purple-400),
        var(--purple-700)
      );
    }

    span {
      color: inherit;
      font-size: var(--font-size-tag);
    }

    :global(svg) {
      flex-shrink: 0;
      width: var(--ni-16);
      height: var(--ni-16);
    }

    &[data-size="small"] {
      padding: var(--ni-2) var(--ni-6);

      :global(svg) {
        width: var(--ni-12);
        height: var(--ni-12);
      }
    }
  }
</style>
