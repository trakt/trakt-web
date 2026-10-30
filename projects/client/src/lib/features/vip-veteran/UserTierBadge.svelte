<script lang="ts">
  import VipBadge from "$lib/components/badge/VipBadge.svelte";
  import { useVipVeteranEnabled } from "./stores/useVipVeteranEnabled.ts";
  import UserTierTag from "./UserTierTag.svelte";
  import type { TieredUser } from "./TieredUser.ts";
  import { toUserTier } from "./toUserTier.ts";

  const { member }: { member: TieredUser } = $props();

  const isEnabled = useVipVeteranEnabled();
  const tier = $derived(toUserTier(member));
</script>

{#if !$isEnabled}
  {#if member.isVip || member.isDirector}
    <VipBadge isDirector={member.isDirector} />
  {/if}
{:else if tier !== "free" || member.isDirector}
  <UserTierTag {tier} isDirector={member.isDirector} />
{/if}
