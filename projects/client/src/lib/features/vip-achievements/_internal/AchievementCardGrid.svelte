<script lang="ts">
  import * as m from "$lib/features/i18n/messages.ts";
  import type { VipAchievement } from "../models/VipAchievement.ts";
  import AchievementCard from "./AchievementCard.svelte";

  const { achievements }: { achievements: readonly VipAchievement[] } =
    $props();
</script>

{#if achievements.length === 0}
  <p class="achievements-empty">{m.vip_achievements_empty()}</p>
{:else}
  <div class="achievement-grid">
    {#each achievements as achievement (achievement.id)}
      <AchievementCard {achievement} />
    {/each}
  </div>
{/if}

<style lang="scss">
  @use "$style/scss/mixins/index" as *;

  .achievement-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(var(--ni-280), 1fr));
    gap: var(--gap-m);

    @include for-mobile {
      grid-template-columns: 1fr;
      gap: var(--gap-s);
    }
  }

  .achievements-empty {
    padding: var(--ni-24) 0;
    text-align: center;
    color: var(--color-text-secondary);
  }
</style>
