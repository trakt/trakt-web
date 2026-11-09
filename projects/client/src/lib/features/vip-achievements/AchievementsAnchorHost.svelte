<script lang="ts">
  import AchievementsAnchor from "./AchievementsAnchor.svelte";
  import AchievementsDrawer from "./AchievementsDrawer.svelte";
  import type { VipAchievementId } from "./models/VipAchievementId.ts";
  import { useSeenAchievementTiers } from "./stores/useSeenAchievementTiers.ts";
  import { useVipAchievements } from "./stores/useVipAchievements.ts";
  import { toAchievementCounts } from "./_internal/toAchievementCounts.ts";
  import { toNewAchievementIds } from "./_internal/toNewAchievementIds.ts";
  import type { VipAchievementMilestone } from "./models/VipAchievementMilestone.ts";
  import { fromRune } from "$lib/utils/store/fromRune.svelte.ts";

  const {
    milestones = new Set(),
  }: { milestones?: ReadonlySet<VipAchievementMilestone> } = $props();

  const { achievements } = useVipAchievements(fromRune(() => milestones));
  const { readSeen, markSeen } = useSeenAchievementTiers();

  let isDrawerOpen = $state(false);
  let newIds = $state<ReadonlySet<VipAchievementId>>(new Set());

  const list = $derived($achievements ?? []);
  const counts = $derived(toAchievementCounts(list));

  const openDrawer = () => {
    newIds = toNewAchievementIds({ achievements: list, seen: readSeen() });
    if (list.length > 0) {
      markSeen(list);
    }
    isDrawerOpen = true;
  };
</script>

<AchievementsAnchor
  unlockedCount={counts.earned}
  totalCount={counts.total}
  onclick={openDrawer}
/>

{#if isDrawerOpen}
  <AchievementsDrawer
    achievements={list}
    {newIds}
    onClose={() => (isDrawerOpen = false)}
  />
{/if}
