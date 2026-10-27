<script lang="ts">
  import VipTierTag from "$lib/components/badge/VipTierTag.svelte";
  import VipStreakBadge from "$lib/sections/profile/vip-streak/VipStreakBadge.svelte";
  import type { ProfileTierTagProps } from "./ProfileTierTagProps.ts";

  const { tier, veteran, promotion }: ProfileTierTagProps = $props();
</script>

<!-- A streak opens its drawer; every other tier is a plain tag. -->
{#if veteran && tier !== "director" && tier !== "free"}
  <VipStreakBadge {veteran} {promotion} />
{:else}
  <VipTierTag {tier} />
{/if}
