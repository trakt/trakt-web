<script lang="ts">
  import Drawer from "$lib/components/drawer/Drawer.svelte";
  import Switch from "$lib/components/toggles/Switch.svelte";
  import * as m from "$lib/features/i18n/messages.ts";
  import type { VipAchievement } from "./models/VipAchievement.ts";
  import AchievementCardGrid from "./_internal/AchievementCardGrid.svelte";

  const {
    achievements,
    onClose,
  }: {
    achievements: readonly VipAchievement[];
    onClose: () => void;
  } = $props();

  let showLocked = $state(false);

  const visible = $derived(
    showLocked
      ? achievements
      : achievements.filter((achievement) => achievement.isUnlocked),
  );
</script>

<Drawer title={m.vip_achievements_section_title()} {onClose}>
  <div class="achievements-drawer">
    <p class="achievements-drawer-subtitle">{m.vip_achievements_subtitle()}</p>

    <div class="achievements-drawer-controls">
      <span class="secondary bold">{m.vip_achievements_show_locked()}</span>
      <Switch
        label={m.vip_achievements_show_locked()}
        checked={showLocked}
        onclick={() => (showLocked = !showLocked)}
      />
    </div>

    <AchievementCardGrid achievements={visible} />
  </div>
</Drawer>

<style lang="scss">
  .achievements-drawer {
    display: flex;
    flex-direction: column;
    gap: var(--gap-m);
  }

  .achievements-drawer-subtitle {
    margin: 0;
    color: var(--color-text-secondary);
    font-size: var(--font-size-text);
  }

  .achievements-drawer-controls {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: var(--gap-s);
  }
</style>
