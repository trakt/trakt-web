<script lang="ts">
  import StemTag from "$lib/components/tags/StemTag.svelte";
  import type { TodayMilestone } from "../models/TodayMilestone.ts";
  import TodayMilestoneIcon from "./TodayMilestoneIcon.svelte";
  import { toMilestoneText } from "./toMilestoneText.ts";

  const {
    milestone,
    variant = "full",
  }: {
    milestone: TodayMilestone;
    variant?: "full" | "icon";
  } = $props();
</script>

{#snippet icon()}
  <TodayMilestoneIcon {milestone} />
{/snippet}

<today-milestone-chip data-milestone={milestone.type}>
  <StemTag
    {icon}
    text={variant === "full" ? toMilestoneText(milestone) : undefined}
  />
</today-milestone-chip>

<style>
  today-milestone-chip {
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
