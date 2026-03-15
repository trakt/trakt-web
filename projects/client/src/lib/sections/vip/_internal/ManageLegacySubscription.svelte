<script lang="ts">
  import GearIcon from "$lib/components/icons/GearIcon.svelte";
  import Link from "$lib/components/link/Link.svelte";
  import { AnalyticsEvent } from "$lib/features/analytics/events/AnalyticsEvent";
  import { useTrack } from "$lib/features/analytics/useTrack";
  import { m } from "$lib/features/i18n/messages";
  import { UrlBuilder } from "$lib/utils/url/UrlBuilder";

  const { track } = useTrack(AnalyticsEvent.VipManage);
</script>

<Link href={UrlBuilder.og.vip()} target="_blank" onclick={() => track()}>
  <div class="trakt-manage-legacy-subscription">
    <GearIcon /><span class="secondary">{m.button_text_manage_vip()}</span>
  </div>
</Link>

<style>
  .trakt-manage-legacy-subscription {
    display: flex;
    align-items: center;
    gap: var(--gap-micro);
    color: var(--color-text-secondary);

    :global(svg) {
      width: var(--ni-16);
      height: var(--ni-16);
    }
  }
</style>
