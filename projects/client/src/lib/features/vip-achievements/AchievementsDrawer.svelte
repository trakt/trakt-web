<script lang="ts">
  import Drawer from "$lib/components/drawer/Drawer.svelte";
  import Switch from "$lib/components/toggles/Switch.svelte";
  import * as m from "$lib/features/i18n/messages.ts";
  import type { VipAchievement } from "./models/VipAchievement.ts";
  import type { VipAchievementCategory } from "./models/VipAchievementCategory.ts";
  import AchievementCategorySection from "./_internal/AchievementCategorySection.svelte";
  import { toAchievementSections } from "./_internal/toAchievementSections.ts";

  const {
    achievements,
    onClose,
  }: {
    achievements: readonly VipAchievement[];
    onClose: () => void;
  } = $props();

  // Until the member flips the switch, locked achievements show only when
  // nothing is unlocked yet - otherwise a new member opens an empty drawer.
  let lockedChoice = $state<boolean | null>(null);
  const hasUnlocked = $derived(
    achievements.some((achievement) => achievement.isUnlocked),
  );
  const showLocked = $derived(lockedChoice ?? !hasUnlocked);

  let collapsed = $state<ReadonlySet<VipAchievementCategory>>(new Set());

  const toggleSection = (id: VipAchievementCategory) => {
    collapsed = collapsed.has(id)
      ? new Set([...collapsed].filter((category) => category !== id))
      : new Set([...collapsed, id]);
  };

  const sections = $derived(toAchievementSections({ achievements, showLocked }));
</script>

<Drawer title={m.vip_achievements_section_title()} {onClose}>
  <div class="achievements-drawer">
    <div class="achievements-drawer-controls">
      <span class="secondary bold">{m.vip_achievements_show_locked()}</span>
      <Switch
        label={m.vip_achievements_show_locked()}
        checked={showLocked}
        onclick={() => (lockedChoice = !showLocked)}
      />
    </div>

    {#each sections as section (section.id)}
      <AchievementCategorySection
        {section}
        isOpen={!collapsed.has(section.id)}
        onToggle={() => toggleSection(section.id)}
      />
    {:else}
      <p class="achievements-drawer-empty secondary">
        {m.vip_achievements_empty()}
      </p>
    {/each}
  </div>
</Drawer>

<style lang="scss">
  .achievements-drawer {
    display: flex;
    flex-direction: column;
    gap: var(--gap-s);
  }

  .achievements-drawer-controls {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: var(--gap-s);
    padding-block-end: var(--ni-4);
  }

  .achievements-drawer-empty {
    margin: 0;
    padding-block: var(--ni-24);
    text-align: center;
  }
</style>
