<script lang="ts">
  import VipBadge from "$lib/components/badge/VipBadge.svelte";
  import { useVipVeteranEnabled } from "./stores/useVipVeteranEnabled.ts";
  import type { TieredMember } from "./TieredMember.ts";
  import { toVipTier } from "./toVipTier.ts";
  import VipTierTag from "./VipTierTag.svelte";

  type MemberBadgeProps = {
    member: TieredMember;
    isTierKnown?: boolean;
  };

  const { member, isTierKnown = true }: MemberBadgeProps = $props();

  const isEnabled = useVipVeteranEnabled();
  const tier = $derived(isTierKnown && $isEnabled ? toVipTier(member) : null);
</script>

{#if tier}
  <VipTierTag {tier} />
{:else if member.isVip || member.isDirector}
  <VipBadge isDirector={member.isDirector} />
{/if}
