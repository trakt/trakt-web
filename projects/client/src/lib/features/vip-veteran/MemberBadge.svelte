<script lang="ts">
  import VipBadge from "$lib/components/badge/VipBadge.svelte";
  import MemberTierTag from "./MemberTierTag.svelte";
  import { useVipVeteranEnabled } from "./stores/useVipVeteranEnabled.ts";
  import type { TieredMember } from "./TieredMember.ts";
  import { toMemberTier } from "./toMemberTier.ts";

  const { member }: { member: TieredMember } = $props();

  const isEnabled = useVipVeteranEnabled();
  const tier = $derived(toMemberTier(member));
</script>

{#if $isEnabled && tier !== "free"}
  <MemberTierTag {tier} />
{:else if member.isVip || member.isDirector}
  <VipBadge isDirector={member.isDirector} />
{/if}
