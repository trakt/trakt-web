<script lang="ts">
  import CrossOriginImage from "$lib/features/image/components/CrossOriginImage.svelte";
  import type { StreamingServiceLogoIntl } from "../StreamingServiceLogoIntl";
  import { WELL_KNOWN_SERVICES } from "./constants";
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

  const isWellKnownSource = $derived(WELL_KNOWN_SERVICES.includes(source));
</script>

{#if isWellKnownSource}
  <WellKnownLogo {source} {displayName} {i18n} />
{:else}
  <CrossOriginImage
    src={logoSrc}
    alt={i18n.alt(displayName)}
    classList="trakt-service-logo"
  />
{/if}
