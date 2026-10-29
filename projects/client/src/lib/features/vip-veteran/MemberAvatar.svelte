<script lang="ts">
  import TierAura from "$lib/components/tier-aura/TierAura.svelte";
  import type { Snippet } from "svelte";
  import { MEMBER_AVATAR_LOOKS } from "./MEMBER_AVATAR_LOOKS.ts";
  import type { MemberAvatarSize } from "./MemberAvatarSize.ts";
  import { useVipVeteranEnabled } from "./stores/useVipVeteranEnabled.ts";
  import type { TieredMember } from "./TieredMember.ts";
  import { toVipTier } from "./toVipTier.ts";

  type MemberAvatarProps = {
    member: TieredMember | Nil;
    size: MemberAvatarSize;
    isTierKnown?: boolean;
    children: Snippet;
  };

  const {
    member,
    size,
    isTierKnown = true,
    children,
  }: MemberAvatarProps = $props();

  const isEnabled = useVipVeteranEnabled();
  const tier = $derived(
    member && isTierKnown && $isEnabled ? toVipTier(member) : null,
  );
  const look = $derived(MEMBER_AVATAR_LOOKS[size]);
</script>

{#if tier}
  <TierAura {tier} variant={look.variant} motion={look.motion}>
    {@render children()}
  </TierAura>
{:else}
  {@render children()}
{/if}
