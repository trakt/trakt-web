<script lang="ts">
  import type { Snippet } from "svelte";
  import { useVipVeteranEnabled } from "./stores/useVipVeteranEnabled.ts";
  import type { TieredMember } from "./TieredMember.ts";
  import { toVipVeteranRingTone } from "./toVipVeteranRingTone.ts";

  type MemberAvatarProps = {
    member: TieredMember | Nil;
    children: Snippet;
  };

  const { member, children }: MemberAvatarProps = $props();

  const isEnabled = useVipVeteranEnabled();
  const tone = $derived(
    $isEnabled && member?.isVip ? toVipVeteranRingTone(member.veteran) : null,
  );
</script>

<span class="trakt-member-avatar" data-tone={tone}>
  {@render children()}
</span>

<style>
  .trakt-member-avatar {
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
