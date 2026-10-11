<script lang="ts">
  import { useIsMe } from "$lib/features/auth/stores/useIsMe.ts";
  import type { MediaListSummary } from "$lib/requests/models/MediaListSummary.ts";
  import { useBannerDismissal } from "../_internal/useBannerDismissal.ts";
  import SmartListUpgradeContent from "./_internal/SmartListUpgradeContent.svelte";

  const { list }: { list: MediaListSummary } = $props();

  const { isMe } = $derived(useIsMe(list.user.slug ?? ""));
  const { isDismissed, dismiss } = $derived(
    useBannerDismissal(`smart-list-upgrade-${list.id}`, "dismissed"),
  );

  const isVisible = $derived($isMe && list.staleOrigin != null && !$isDismissed);
</script>

{#if isVisible}
  {#key list.id}
    <SmartListUpgradeContent {list} onDismiss={dismiss} />
  {/key}
{/if}
