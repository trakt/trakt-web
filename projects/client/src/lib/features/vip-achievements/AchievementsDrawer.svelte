<script lang="ts">
  import Drawer from "$lib/components/drawer/Drawer.svelte";
  import CalendarIcon from "$lib/components/icons/CalendarIcon.svelte";
  import ClockIcon from "$lib/components/icons/ClockIcon.svelte";
  import CommentIcon from "$lib/components/icons/CommentIcon.svelte";
  import CrownIcon from "$lib/components/icons/CrownIcon.svelte";
  import FlameIcon from "$lib/components/icons/FlameIcon.svelte";
  import ListIcon from "$lib/components/icons/mobile/ListIcon.svelte";
  import SparkleStarIcon from "$lib/components/icons/SparkleStarIcon.svelte";
  import Switch from "$lib/components/toggles/Switch.svelte";
  import type { ToggleOption } from "$lib/components/toggles/ToggleOption.ts";
  import Toggler from "$lib/components/toggles/Toggler.svelte";
  import * as m from "$lib/features/i18n/messages.ts";
  import type { VipAchievement } from "./models/VipAchievement.ts";
  import type { VipAchievementBucket } from "./models/VipAchievementBucket.ts";
  import AchievementCardGrid from "./_internal/AchievementCardGrid.svelte";

  type BucketFilter = VipAchievementBucket | "all";

  const {
    achievements,
    onClose,
  }: {
    achievements: readonly VipAchievement[];
    onClose: () => void;
  } = $props();

  let active = $state<BucketFilter>("all");
  let showLocked = $state(false);

  const options: ToggleOption<BucketFilter>[] = [
    {
      value: "all",
      text: m.vip_achievements_bucket_all,
      label: m.vip_achievements_bucket_all,
      icon: allIcon,
    },
    {
      value: "volume",
      text: m.vip_achievements_bucket_volume,
      label: m.vip_achievements_bucket_volume,
      icon: volumeIcon,
    },
    {
      value: "binge",
      text: m.vip_achievements_bucket_binge,
      label: m.vip_achievements_bucket_binge,
      icon: bingeIcon,
    },
    {
      value: "timing",
      text: m.vip_achievements_bucket_timing,
      label: m.vip_achievements_bucket_timing,
      icon: timingIcon,
    },
    {
      value: "ratings",
      text: m.vip_achievements_bucket_ratings,
      label: m.vip_achievements_bucket_ratings,
      icon: ratingsIcon,
    },
    {
      value: "curation",
      text: m.vip_achievements_bucket_curation,
      label: m.vip_achievements_bucket_curation,
      icon: curationIcon,
    },
    {
      value: "prestige",
      text: m.vip_achievements_bucket_prestige,
      label: m.vip_achievements_bucket_prestige,
      icon: prestigeIcon,
    },
  ];

  const visible = $derived.by(() => {
    const inBucket = active === "all"
      ? achievements
      : achievements.filter((achievement) => achievement.bucket === active);

    return showLocked
      ? inBucket
      : inBucket.filter((achievement) => achievement.isUnlocked);
  });
</script>

{#snippet allIcon()}
  <SparkleStarIcon />
{/snippet}
{#snippet volumeIcon()}
  <ClockIcon />
{/snippet}
{#snippet bingeIcon()}
  <FlameIcon />
{/snippet}
{#snippet timingIcon()}
  <CalendarIcon />
{/snippet}
{#snippet ratingsIcon()}
  <CommentIcon />
{/snippet}
{#snippet curationIcon()}
  <ListIcon />
{/snippet}
{#snippet prestigeIcon()}
  <CrownIcon />
{/snippet}

<Drawer title={m.vip_achievements_section_title()} {onClose}>
  <div class="achievements-drawer">
    <p class="achievements-drawer-subtitle">{m.vip_achievements_subtitle()}</p>

    <div class="achievements-drawer-toggler">
      <Toggler
        value={active}
        onChange={(value) => (active = value)}
        {options}
        variant="text"
      />
    </div>

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

  .achievements-drawer-toggler {
    display: flex;
    overflow-x: auto;

    --toggle-large-width: var(--ni-120);
  }

  .achievements-drawer-controls {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: var(--gap-s);
  }
</style>
