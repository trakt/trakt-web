<script lang="ts">
  import CrossOriginImage from "$lib/features/image/components/CrossOriginImage.svelte";
  import { useWatchNowSources } from "$lib/stores/useWatchNowSources";
  import type { WatchNowButtonIntl } from "../WatchNowButtonIntl";

  type WatchNowServiceLogoProps = {
    source: string;
    i18n: WatchNowButtonIntl;
    style?: "black" | "white";
  };

  const { source, i18n, style = "white" }: WatchNowServiceLogoProps = $props();
  const { sources } = useWatchNowSources();

  const service = $derived($sources.find((s) => s.source === source));
  const displayName = $derived(service?.name ?? "");
</script>

<div
  class="trakt-watch-now-service-logo"
  class:is-black-icon={style === "black"}
>
  <CrossOriginImage
    src={service?.logoUrl ?? ""}
    alt={i18n.logoAlt(displayName)}
  />
</div>

<style>
  .trakt-watch-now-service-logo {
    display: flex;
    align-items: center;

    :global(img) {
      width: auto;
      height: var(--ni-24);
      filter: brightness(0) invert(1);
    }
  }

  .is-black-icon {
    :global(img) {
      filter: brightness(0);
    }
  }
</style>
