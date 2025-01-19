<script lang="ts">
  import { useWatchNowSources } from "$lib/stores/useWatchNowSources";
  import type { WatchNowButtonIntl } from "../WatchNowButtonIntl";

  type WatchNowServiceLogoProps = {
    source: string;
    i18n: WatchNowButtonIntl;
    style?: "black" | "white";
  };

  const { source, i18n, style = "white" }: WatchNowServiceLogoProps = $props();
  const { sources } = useWatchNowSources();

  const sourceService = $sources.find((s) => s.source === source);
  const sourceDisplayName = sourceService?.name ?? "";
</script>

<img
  class="trakt-watch-now-service-logo"
  class:is-black-icon={style === "black"}
  loading="lazy"
  alt={i18n.logoAlt(sourceDisplayName)}
  src={sourceService?.logoUrl ?? ""}
/>

<style>
  .trakt-watch-now-service-logo {
    width: auto;
    height: var(--ni-24);
    filter: brightness(0) invert(1);
  }

  .is-black-icon {
    filter: brightness(0);
  }
</style>
