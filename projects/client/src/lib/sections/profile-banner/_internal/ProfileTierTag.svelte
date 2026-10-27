<script lang="ts">
  import VipTierTag from "$lib/components/badge/VipTierTag.svelte";
  import * as m from "$lib/features/i18n/messages.ts";
  import VipStreakBadge from "$lib/sections/profile/vip-streak/VipStreakBadge.svelte";
  import type { ProfileTierTagProps } from "./ProfileTierTagProps.ts";

  const { tier, veteran, promotion }: ProfileTierTagProps = $props();
</script>

<!-- A streak opens its drawer; every other tier is a plain tag. -->
{#if tier === "director"}
  <VipTierTag {tier} label="DIRECTOR" />
{:else if tier === "free"}
  <VipTierTag {tier} label={m.text_vip_tier_free()} />
{:else if veteran}
  <VipStreakBadge {veteran} {promotion} />
{:else}
  <VipTierTag {tier} label="VIP" />
{/if}
