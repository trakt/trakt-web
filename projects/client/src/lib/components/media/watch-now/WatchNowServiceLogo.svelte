<script lang="ts">
  import CrossOriginImage from "$lib/features/image/components/CrossOriginImage.svelte";
  import { useWatchNowSources } from "$lib/stores/useWatchNowSources";
  import type { WatchNowServiceLogoIntl } from "./WatchNowServiceLogoIntl";

  type WatchNowServiceLogoProps = {
    source: string;
    i18n: WatchNowServiceLogoIntl;
  };

  const { source, i18n }: WatchNowServiceLogoProps = $props();
  const { sources } = useWatchNowSources();

  const service = $derived($sources.find((s) => s.source === source));
  const displayName = $derived(service?.name ?? "");

  /*
    TODO:
    - 4k tag
  */
</script>

<div class="trakt-watch-now-service-logo">
  <CrossOriginImage src={service?.logoUrl ?? ""} alt={i18n.alt(displayName)} />
</div>

<style>
  .trakt-watch-now-service-logo {
    display: flex;
    align-items: center;
    width: var(--ni-36);
    height: auto;
  }
</style>
