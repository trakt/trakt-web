<script lang="ts">
  import VipBadge from "$lib/components/badge/VipBadge.svelte";
  import { useVipVeteranEnabled } from "./stores/useVipVeteranEnabled.ts";
  import type { TieredMember } from "./TieredMember.ts";
  import { toVipVeteranLabel } from "./toVipVeteranLabel.ts";
  import { toVipVeteranTone } from "./toVipVeteranTone.ts";

  const { member }: { member: TieredMember } = $props();

  const isEnabled = useVipVeteranEnabled();
  const veteran = $derived($isEnabled && member.isVip ? member.veteran : null);
</script>

{#if member.isVip || member.isDirector}
  <VipBadge
    isDirector={member.isDirector}
    tone={veteran ? toVipVeteranTone(veteran.tier) : null}
    label={toVipVeteranLabel(veteran?.title)}
  />
{/if}
