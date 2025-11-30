<script lang="ts">
  import CrossOriginImage from "$lib/features/image/components/CrossOriginImage.svelte";
  import { isWellKnownSource } from "../isWellKnownSource";
  import type { StreamingServiceLogoIntl } from "../StreamingServiceLogoIntl";
  import WellKnownLogo from "./WellKnownLogo.svelte";

  const {
    source,
    logoSrc,
    displayName,
    i18n,
  }: {
    source: string;
    logoSrc: HttpsUrl;
    displayName: string;
    i18n: StreamingServiceLogoIntl;
  } = $props();

  const isWellKnown = $derived(isWellKnownSource(source));
</script>

{#if isWellKnown}
  <WellKnownLogo {source} {displayName} {i18n} />
{:else}
  <CrossOriginImage
    src={logoSrc}
    alt={i18n.alt(displayName)}
    classList="trakt-service-logo"
  />
{/if}
