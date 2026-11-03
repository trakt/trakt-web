<script lang="ts">
  import Drawer from "$lib/components/drawer/Drawer.svelte";
  import { languageTag } from "$lib/features/i18n";
  import * as m from "$lib/features/i18n/messages.ts";
  import type { VipVeteran } from "$lib/requests/models/VipVeteran.ts";
  import { toHumanLongDate } from "$lib/utils/formatting/date/toHumanLongDate.ts";
  import VipStreakDial from "./_internal/VipStreakDial.svelte";
  import VipStreakLadder from "./_internal/VipStreakLadder.svelte";

  const { veteran, onClose }: { veteran: VipVeteran; onClose: () => void } =
    $props();
</script>

<Drawer {onClose} title={m.header_vip_streak()} variant="vip">
  <div class="trakt-vip-streak">
    <VipStreakDial years={veteran.years} />
    <p class="streak-since">
      {m.text_vip_streak_since({
        date: toHumanLongDate(veteran.since, languageTag()),
      })}
    </p>
    <VipStreakLadder {veteran} />
    <p class="streak-note tag secondary">{m.text_vip_streak_grace_note()}</p>
  </div>
</Drawer>

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
