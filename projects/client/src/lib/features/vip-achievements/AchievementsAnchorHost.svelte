<script lang="ts">
  import { fromRune } from "$lib/utils/store/fromRune.svelte.ts";
  import type { VipAchievementProfile } from "./models/VipAchievementProfile.ts";
  import AchievementsAnchor from "./AchievementsAnchor.svelte";
  import AchievementsDrawer from "./AchievementsDrawer.svelte";
  import { useVipAchievements } from "./stores/useVipAchievements.ts";

  const { profile }: { profile: VipAchievementProfile } = $props();

  const profile$ = fromRune(() => profile);
  const { achievements } = useVipAchievements(profile$);

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
