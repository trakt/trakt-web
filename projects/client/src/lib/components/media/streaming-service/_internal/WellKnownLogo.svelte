<script lang="ts">
  import type { StreamingServiceLogoIntl } from "../StreamingServiceLogoIntl";
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

  const isPrimeVideo = $derived(
    source === "amazon_video" ||
      source === "amazon_prime_video" ||
      source === "amazon_prime_video_with_ads" ||
      source === "amazon_prime",
  );
</script>

{#if isPrimeVideo}
  <AmazonPrimeVideoLogo {alt} />
{/if}

{#if source === "netflix"}
  <NetflixLogo {alt} />
{/if}

{#if source === "disney_plus"}
  <DisneyPlusLogo {alt} />
{/if}

{#if source === "google_play_movies"}
  <GooglePlayLogo {alt} />
{/if}

{#if source === "youtube"}
  <YouTubeLogo {alt} />
{/if}

{#if source === "crunchyroll"}
  <CrunchyrollLogo {alt} />
{/if}

{#if source === "hulu"}
  <HuluLogo {alt} />
{/if}

{#if source === "peacock"}
  <PeacockLogo {alt} />
{/if}

{#if source === "paramount_plus"}
  <ParamountPlusLogo {alt} />
{/if}

{#if source === "rakuten_tv"}
  <RakutenTvLogo {alt} />
{/if}

{#if source === "plex"}
  <PlexLogo {alt} />
{/if}
