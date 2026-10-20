<script lang="ts">
  import AchievementsAnchor from "./AchievementsAnchor.svelte";
  import AchievementsDrawer from "./AchievementsDrawer.svelte";
  import { useVipAchievements } from "./stores/useVipAchievements.ts";

  const { achievements } = useVipAchievements();

  let isDrawerOpen = $state(false);

  const list = $derived($achievements ?? []);
  const unlockedCount = $derived(
    list.filter((achievement) => achievement.isUnlocked).length,
  );
</script>

<AchievementsAnchor
  {unlockedCount}
  totalCount={list.length}
  onclick={() => (isDrawerOpen = true)}
/>

{#if isDrawerOpen}
  <AchievementsDrawer
    achievements={list}
    onClose={() => (isDrawerOpen = false)}
  />
{/if}
