<script lang="ts">
  import UserTierTag from "./UserTierTag.svelte";
  import type { TieredUser } from "./TieredUser.ts";
  import { toUserTier } from "./toUserTier.ts";

  const { member }: { member: TieredUser } = $props();

  const tier = $derived(toUserTier(member));
</script>

{#if tier !== "free" || member.isDirector}
  <UserTierTag {tier} isDirector={member.isDirector} />
{/if}
