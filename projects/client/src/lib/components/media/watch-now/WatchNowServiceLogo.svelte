<script lang="ts">
  import CrossOriginImage from "$lib/features/image/components/CrossOriginImage.svelte";
  import { useWatchNowSources } from "$lib/stores/useWatchNowSources";
  import type { WatchNowServiceLogoIntl } from "./WatchNowServiceLogoIntl";

  type WatchNowServiceLogoProps = {
    source: string;
    i18n?: WatchNowServiceLogoIntl;
    style?: "black" | "white";
  };

  const {
    source,
    i18n = WatchNowServiceLogoIntlProvider,
    style = "white",
  }: WatchNowServiceLogoProps = $props();
  const { sources } = useWatchNowSources();

  const service = $derived($sources.find((s) => s.source === source));
  const displayName = $derived(service?.name ?? "");

  /*
    TODO:
    - 4k tag
  */
</script>

<div
  class="trakt-watch-now-service-logo"
  class:is-black-icon={style === "black"}
>
  <CrossOriginImage src={service?.logoUrl ?? ""} alt={i18n.alt(displayName)} />
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
