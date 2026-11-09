<script lang="ts">
  import Drawer from "$lib/components/drawer/Drawer.svelte";
  import Switch from "$lib/components/toggles/Switch.svelte";
  import * as m from "$lib/features/i18n/messages.ts";
  import type { VipAchievement } from "./models/VipAchievement.ts";
  import type { VipAchievementCategory } from "./models/VipAchievementCategory.ts";
  import type { VipAchievementId } from "./models/VipAchievementId.ts";
  import AchievementCategorySection from "./_internal/AchievementCategorySection.svelte";
  import AchievementPin from "./_internal/AchievementPin.svelte";
  import { toAchievementSections } from "./_internal/toAchievementSections.ts";
  import { toAchievementCounts } from "./_internal/toAchievementCounts.ts";
  import { toShelfAchievements } from "./_internal/toShelfAchievements.ts";

  const SHELF_SIZE = 3;

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
  const counts = $derived(toAchievementCounts(achievements));

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

  const shelf = $derived(
    toShelfAchievements({ achievements, newIds, limit: SHELF_SIZE }),
  );
</script>

<Drawer title={m.vip_achievements_section_title()} {onClose}>
  <div class="achievements-drawer">
    <div class="achievements-drawer-summary">
      {#if shelf.length > 0}
        <div class="summary-shelf" aria-hidden="true">
          {#each shelf as achievement (achievement.id)}
            <span class="summary-pin">
              <AchievementPin {achievement} hasStuds={false} />
            </span>
          {/each}
        </div>
      {/if}
      <div class="summary-body">
        <span class="summary-count bold">
          {m.vip_achievements_earned_summary({
            earned: counts.earned,
            total: counts.total,
          })}
        </span>
        <span
          class="summary-bar"
          style:--earned-share={`${(counts.earned / Math.max(counts.total, 1)) * 100}%`}
          aria-hidden="true"
        ></span>
      </div>
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
    --summary-fill: color-mix(in srgb, var(--color-foreground) 70%, transparent);

    display: flex;
    flex-direction: column;
    gap: var(--gap-s);
  }

  // One shelf of pins, the count and a single bar: it reads the same at 13
  // achievements or 100.
  .achievements-drawer-summary {
    display: flex;
    align-items: center;
    gap: var(--gap-s);
    padding: var(--ni-14) var(--ni-16);
    border-radius: var(--border-radius-l);
    background: var(--color-card-background);
    box-shadow: var(--shadow-base);
  }

  .summary-shelf {
    display: flex;
    flex: none;
  }

  .summary-pin {
    inline-size: var(--ni-40);
    block-size: var(--ni-40);

    & + & {
      margin-inline-start: calc(var(--ni-8) * -1);
    }
  }

  .summary-body {
    flex: 1;
    min-width: 0;

    display: flex;
    flex-direction: column;
    gap: var(--ni-8);
  }

  .summary-count {
    font-size: var(--font-size-title);
  }

  .summary-bar {
    block-size: var(--ni-6);
    border-radius: var(--border-radius-pill);
    background: linear-gradient(
      to right,
      var(--summary-fill) var(--earned-share),
      var(--summary-track) var(--earned-share)
    );

    &:dir(rtl) {
      background: linear-gradient(
        to left,
        var(--summary-fill) var(--earned-share),
        var(--summary-track) var(--earned-share)
      );
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
