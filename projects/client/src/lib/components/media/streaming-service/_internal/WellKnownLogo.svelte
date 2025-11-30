<script lang="ts">
  import type { StreamingServiceLogoIntl } from "../StreamingServiceLogoIntl";
  import { WELL_KNOWN_SERVICES } from "./constants";
  import AmazonPrimeVideoLogo from "./logos/AmazonPrimeVideoLogo.svelte";
  import CrunchyrollLogo from "./logos/CrunchyrollLogo.svelte";
  import DisneyPlusLogo from "./logos/DisneyPlusLogo.svelte";
  import GooglePlayLogo from "./logos/GooglePlayLogo.svelte";
  import HuluLogo from "./logos/HuluLogo.svelte";
  import NetflixLogo from "./logos/NetflixLogo.svelte";
  import ParamountPlusLogo from "./logos/ParamountPlusLogo.svelte";
  import PeacockLogo from "./logos/PeacockLogo.svelte";
  import PlexLogo from "./logos/PlexLogo.svelte";
  import RakutenTvLogo from "./logos/RakutenTvLogo.svelte";
  import YouTubeLogo from "./logos/YouTubeLogo.svelte";

  const {
    source,
    displayName,
    i18n,
  }: {
    source: string;
    displayName: string;
    i18n: StreamingServiceLogoIntl;
  } = $props();

  const alt = $derived(i18n.alt(displayName));
</script>

{#if WELL_KNOWN_SERVICES.amazon.includes(source)}
  <AmazonPrimeVideoLogo {alt} />
{/if}

{#if WELL_KNOWN_SERVICES.netflix.includes(source)}
  <NetflixLogo {alt} />
{/if}

{#if WELL_KNOWN_SERVICES.disneyPlus.includes(source)}
  <DisneyPlusLogo {alt} />
{/if}

{#if WELL_KNOWN_SERVICES.googlePlayMovies.includes(source)}
  <GooglePlayLogo {alt} />
{/if}

{#if WELL_KNOWN_SERVICES.youtube.includes(source)}
  <YouTubeLogo {alt} />
{/if}

{#if WELL_KNOWN_SERVICES.crunchyroll.includes(source)}
  <CrunchyrollLogo {alt} />
{/if}

{#if WELL_KNOWN_SERVICES.hulu.includes(source)}
  <HuluLogo {alt} />
{/if}

{#if WELL_KNOWN_SERVICES.peacock.includes(source)}
  <PeacockLogo {alt} />
{/if}

{#if WELL_KNOWN_SERVICES.paramountPlus.includes(source)}
  <ParamountPlusLogo {alt} />
{/if}

{#if WELL_KNOWN_SERVICES.rakutenTv.includes(source)}
  <RakutenTvLogo {alt} />
{/if}

{#if WELL_KNOWN_SERVICES.plex.includes(source)}
  <PlexLogo {alt} />
{/if}
