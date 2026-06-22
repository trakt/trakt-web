<script lang="ts">
  import { matchesServiceSlug } from "../isWellKnownSource";
  import { WELL_KNOWN_SERVICES } from "./constants";
  import AmazonPrimeVideoLogo from "./logos/AmazonPrimeVideoLogo.svelte";
  import CrunchyrollLogo from "./logos/CrunchyrollLogo.svelte";
  import DisneyPlusLogo from "./logos/DisneyPlusLogo.svelte";
  import FandangoLogo from "./logos/FandangoLogo.svelte";
  import GooglePlayLogo from "./logos/GooglePlayLogo.svelte";
  import HuluLogo from "./logos/HuluLogo.svelte";
  import NetflixLogo from "./logos/NetflixLogo.svelte";
  import ParamountPlusLogo from "./logos/ParamountPlusLogo.svelte";
  import PeacockLogo from "./logos/PeacockLogo.svelte";
  import PlexLogo from "./logos/PlexLogo.svelte";
  import RakutenTvLogo from "./logos/RakutenTvLogo.svelte";
  import YouTubeLogo from "./logos/YouTubeLogo.svelte";

  // Each logo renders the passed string as its SVG <title> (the hover tooltip),
  // so the bare service name is forwarded straight through. The "… logo" alt
  // wording stays on the <img> fallback in ServiceLogo, where it never shows as
  // a title.
  const {
    source,
    displayName,
  }: {
    source: string;
    displayName: string;
  } = $props();
</script>

{#if matchesServiceSlug(WELL_KNOWN_SERVICES.amazon, source)}
  <AmazonPrimeVideoLogo alt={displayName} />
{/if}

{#if matchesServiceSlug(WELL_KNOWN_SERVICES.netflix, source)}
  <NetflixLogo alt={displayName} />
{/if}

{#if matchesServiceSlug(WELL_KNOWN_SERVICES.disneyPlus, source)}
  <DisneyPlusLogo alt={displayName} />
{/if}

{#if matchesServiceSlug(WELL_KNOWN_SERVICES.fandango, source)}
  <FandangoLogo alt={displayName} />
{/if}

{#if matchesServiceSlug(WELL_KNOWN_SERVICES.googlePlayMovies, source)}
  <GooglePlayLogo alt={displayName} />
{/if}

{#if matchesServiceSlug(WELL_KNOWN_SERVICES.youtube, source)}
  <YouTubeLogo alt={displayName} />
{/if}

{#if matchesServiceSlug(WELL_KNOWN_SERVICES.crunchyroll, source)}
  <CrunchyrollLogo alt={displayName} />
{/if}

{#if matchesServiceSlug(WELL_KNOWN_SERVICES.hulu, source)}
  <HuluLogo alt={displayName} />
{/if}

{#if matchesServiceSlug(WELL_KNOWN_SERVICES.peacock, source)}
  <PeacockLogo alt={displayName} />
{/if}

{#if matchesServiceSlug(WELL_KNOWN_SERVICES.paramountPlus, source)}
  <ParamountPlusLogo alt={displayName} />
{/if}

{#if matchesServiceSlug(WELL_KNOWN_SERVICES.rakutenTv, source)}
  <RakutenTvLogo alt={displayName} />
{/if}

{#if matchesServiceSlug(WELL_KNOWN_SERVICES.plex, source)}
  <PlexLogo alt={displayName} />
{/if}
