<script lang="ts">
  import type { Snippet } from "svelte";
  import { useVipVeteranEnabled } from "./stores/useVipVeteranEnabled.ts";
  import type { TieredUser } from "./TieredUser.ts";
  import { toVipVeteranRingTone } from "./toVipVeteranRingTone.ts";

  type UserTierRingProps = {
    member: TieredUser | Nil;
    children: Snippet;
  };

  const { member, children }: UserTierRingProps = $props();

  const isEnabled = useVipVeteranEnabled();
  const tone = $derived(
    $isEnabled && member?.isVip ? toVipVeteranRingTone(member.veteran) : null,
  );
</script>

<span class="trakt-user-tier-ring" data-tone={tone}>
  {@render children()}
</span>

<style>
  .trakt-user-tier-ring {
    display: contents;

    &[data-tone="copper"] {
      --member-avatar-ring: var(--color-border-vip-avatar-copper);
      --member-avatar-glow: var(--color-glow-vip-badge-copper);
    }

    &[data-tone="silver"] {
      --member-avatar-ring: var(--color-border-vip-avatar-silver);
      --member-avatar-glow: var(--color-glow-vip-badge-silver);
    }

    &[data-tone="gold"] {
      --member-avatar-ring: var(--color-border-vip-avatar-gold);
      --member-avatar-glow: var(--color-glow-vip-badge-gold);
    }
  }
</style>
