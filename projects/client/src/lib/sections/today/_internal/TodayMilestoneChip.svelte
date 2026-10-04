<script lang="ts">
  import StemTag from "$lib/components/tags/StemTag.svelte";
  import type { TodayMilestone } from "../models/TodayMilestone.ts";
  import TodayMilestoneIcon from "./TodayMilestoneIcon.svelte";
  import { toMilestoneLabel } from "./toMilestoneLabel.ts";
  import { toMilestoneText } from "./toMilestoneText.ts";

  const {
    milestone,
    variant = "full",
  }: {
    milestone: TodayMilestone;
    variant?: "full" | "icon";
  } = $props();

  const text = $derived(toMilestoneText(milestone));
</script>

{#snippet icon()}
  <TodayMilestoneIcon {milestone} />
{/snippet}

<today-milestone-chip
  data-milestone={milestone.type}
  role="img"
  aria-label={toMilestoneLabel(milestone)}
>
  <StemTag {icon} text={variant === "full" ? text : undefined} />
</today-milestone-chip>

<style>
  today-milestone-chip {
    flex-shrink: 0;

    :global(p) {
      white-space: nowrap;
    }

    --color-background-stem-tag: var(--purple-500);
    --color-foreground-stem-tag: var(--shade-10);

    &[data-milestone="series-end"] {
      --color-background-stem-tag: linear-gradient(
        120deg,
        var(--purple-400),
        var(--purple-700)
      );
    }
  }
</style>
