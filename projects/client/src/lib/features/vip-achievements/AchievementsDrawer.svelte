<script lang="ts">
  import Drawer from "$lib/components/drawer/Drawer.svelte";
  import Switch from "$lib/components/toggles/Switch.svelte";
  import * as m from "$lib/features/i18n/messages.ts";
  import type { VipAchievement } from "./models/VipAchievement.ts";
  import type { VipAchievementCategory } from "./models/VipAchievementCategory.ts";
  import type { VipAchievementId } from "./models/VipAchievementId.ts";
  import AchievementCategorySection from "./_internal/AchievementCategorySection.svelte";
  import { toAchievementSections } from "./_internal/toAchievementSections.ts";

  const MAX_SEGMENTS = 40;

  const {
    achievements,
    newIds,
    onClose,
  }: {
    achievements: readonly VipAchievement[];
    newIds: ReadonlySet<VipAchievementId>;
    onClose: () => void;
  } = $props();

  // Locked achievements show greyed out, after the earned ones in each
  // section, so there is always something to aim for. The switch hides them.
  let showLocked = $state(true);
  const earnedCount = $derived(
    achievements.filter((achievement) => achievement.isUnlocked).length,
  );

  let collapsed = $state<ReadonlySet<VipAchievementCategory>>(new Set());

  const toggleSection = (id: VipAchievementCategory) => {
    collapsed = collapsed.has(id)
      ? new Set([...collapsed].filter((category) => category !== id))
      : new Set([...collapsed, id]);
  };

  const sections = $derived(toAchievementSections({ achievements, showLocked }));

  // New unlocks pop in one after another, in the order they appear.
  const revealOrder = $derived(
    new Map(
      sections
        .flatMap((section) => section.achievements)
        .filter((achievement) => newIds.has(achievement.id))
        .map((achievement, index) => [achievement.id, index]),
    ),
  );

  const segments = $derived(
    achievements.length <= MAX_SEGMENTS
      ? achievements.map((_, index) => index < earnedCount)
      : [],
  );
</script>

<Drawer title={m.vip_achievements_section_title()} {onClose}>
  <div class="achievements-drawer">
    <div class="achievements-drawer-summary">
      <span class="summary-count bold">
        {m.vip_achievements_earned_summary({
          earned: earnedCount,
          total: achievements.length,
        })}
      </span>
      <span
        class="summary-bar"
        class:is-continuous={segments.length === 0}
        style:--earned-share={`${(earnedCount / Math.max(achievements.length, 1)) * 100}%`}
        aria-hidden="true"
      >
        {#each segments as isEarned, index (index)}
          <span class="summary-segment" class:is-earned={isEarned}></span>
        {/each}
      </span>
    </div>

    <div class="achievements-drawer-controls">
      <span class="secondary bold">{m.vip_achievements_show_locked()}</span>
      <Switch
        label={m.vip_achievements_show_locked()}
        checked={showLocked}
        onclick={() => (showLocked = !showLocked)}
      />
    </div>

    {#each sections as section (section.id)}
      <AchievementCategorySection
        {section}
        {revealOrder}
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
    --summary-track: color-mix(in srgb, var(--color-foreground) 12%, transparent);

    display: flex;
    flex-direction: column;
    gap: var(--gap-s);
  }

  .achievements-drawer-summary {
    display: flex;
    flex-direction: column;
    gap: var(--ni-10);
    padding-block-end: var(--ni-4);
  }

  .summary-count {
    font-size: var(--font-size-title);
  }

  .summary-bar {
    display: flex;
    gap: var(--ni-3);
    block-size: var(--ni-6);

    &.is-continuous {
      border-radius: var(--border-radius-pill);
      background: linear-gradient(
        to right,
        var(--color-achievement-accent) var(--earned-share),
        var(--summary-track) var(--earned-share)
      );

      &:dir(rtl) {
        background: linear-gradient(
          to left,
          var(--color-achievement-accent) var(--earned-share),
          var(--summary-track) var(--earned-share)
        );
      }
    }
  }

  .summary-segment {
    flex: 1 1 0;
    border-radius: var(--border-radius-pill);
    background: var(--summary-track);

    &.is-earned {
      background: var(--color-achievement-accent);
    }
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
