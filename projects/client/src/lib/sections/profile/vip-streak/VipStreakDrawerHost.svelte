<script lang="ts">
  import Drawer from "$lib/components/drawer/Drawer.svelte";
  import { languageTag } from "$lib/features/i18n";
  import * as m from "$lib/features/i18n/messages.ts";
  import { useVipVeteran } from "$lib/features/vip-veteran/stores/useVipVeteran.ts";
  import { toHumanLongDate } from "$lib/utils/formatting/date/toHumanLongDate.ts";
  import { fromRune } from "$lib/utils/store/fromRune.svelte";
  import VipStreakDial from "./_internal/VipStreakDial.svelte";
  import VipStreakLadder from "./_internal/VipStreakLadder.svelte";

  const { slug, onClose }: { slug: string; onClose: () => void } = $props();

  const { veteran } = useVipVeteran(fromRune(() => slug));
</script>

{#if $veteran}
  <Drawer {onClose} title={m.header_vip_streak()} variant="vip">
    <div class="trakt-vip-streak">
      <VipStreakDial years={$veteran.years} />
      <p class="streak-since">
        {m.text_vip_streak_since({
          date: toHumanLongDate($veteran.since, languageTag()),
        })}
      </p>
      <VipStreakLadder veteran={$veteran} />
      <p class="streak-note tag secondary">{m.text_vip_streak_grace_note()}</p>
    </div>
  </Drawer>
{/if}

<style>
  .trakt-vip-streak {
    display: flex;
    flex-direction: column;
    gap: var(--gap-l);
    padding-block: var(--gap-m);
  }

  .streak-since,
  .streak-note {
    text-align: center;
  }
</style>
