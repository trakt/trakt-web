<script lang="ts">
  import VipBadge from "$lib/components/badge/VipBadge.svelte";
  import Link from "$lib/components/link/Link.svelte";
  import * as m from "$lib/features/i18n/messages.ts";
  import { toVipVeteranLabel } from "$lib/features/vip-veteran/toVipVeteranLabel.ts";
  import { toVipVeteranTone } from "$lib/features/vip-veteran/toVipVeteranTone.ts";
  import type { VipVeteran } from "$lib/requests/models/VipVeteran.ts";
  import { profileDrawerNavigation } from "../_internal/profileDrawerNavigation.ts";

  const { veteran }: { veteran: VipVeteran } = $props();

  const { buildVipStreakDrawerLink } = profileDrawerNavigation();
  const drawerLink = $derived(buildVipStreakDrawerLink());
</script>

<div class="trakt-vip-streak-badge">
  <Link
    href={drawerLink.href}
    noscroll={drawerLink.noscroll}
    replacestate={drawerLink.replacestate}
    color="inherit"
    label={m.button_label_open_vip_streak()}
    onclick={() => navigator.vibrate?.(8)}
  >
    <VipBadge
      tone={toVipVeteranTone(veteran.tier)}
      label={toVipVeteranLabel(veteran.title)}
    />
  </Link>
</div>

<style>
  .trakt-vip-streak-badge {
    display: flex;
    animation: vip-streak-pop 420ms cubic-bezier(0.3, 1.5, 0.6, 1) 200ms both;

    :global(.trakt-link) {
      display: flex;
      text-decoration: none;
      border-radius: var(--border-radius-xl);
    }
  }

  @keyframes vip-streak-pop {
    from {
      opacity: 0;
      transform: scale(0.6);
    }
  }

  @media (prefers-reduced-motion: reduce) {
    .trakt-vip-streak-badge {
      animation: none;
    }
  }
</style>
