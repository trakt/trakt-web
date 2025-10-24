<script lang="ts">
  import AndroidIcon from "$lib/components/icons/AndroidIcon.svelte";
  import AppleIcon from "$lib/components/icons/AppleIcon.svelte";
  import GithubIcon from "$lib/components/icons/GithubIcon.svelte";
  import InstagramIcon from "$lib/components/icons/InstagramIcon.svelte";
  import InstallIcon from "$lib/components/icons/InstallIcon.svelte";
  import XIcon from "$lib/components/icons/XIcon.svelte";

  import Link from "$lib/components/link/Link.svelte";
  import { AnalyticsEvent } from "$lib/features/analytics/events/AnalyticsEvent";
  import { useTrack } from "$lib/features/analytics/useTrack";
  import FeatureFlagTool from "$lib/features/feature-flag/FeatureFlagTool.svelte";
  import { print, PrintTarget } from "$lib/utils/console/print";
  import { UrlBuilder } from "$lib/utils/url/UrlBuilder";
  import { useInstallPrompt } from "../stores/useInstallPrompt";

  const { track } = useTrack(AnalyticsEvent.Link);

  const trackLink = (target: string) => {
    console.log("Tracking link:", target);
    track({ target });
  };

  const install = useInstallPrompt();

  async function handleInstall(ev: MouseEvent) {
    ev.preventDefault();

    trackLink("pwa-install");
    const installed = await install.prompt();

    if (installed) {
      print(PrintTarget.PWA, "info", "Installation was successful!");
    }
  }
</script>

<div class="trakt-external-links">
  <div class="trakt-app-links">
    <FeatureFlagTool />

    {#if $install}
      <Link href="#" onclick={handleInstall}>
        <InstallIcon />
      </Link>
    {/if}

    <Link
      href={UrlBuilder.github.web()}
      target="_blank"
      onclick={() => trackLink("github-web")}
    >
      <GithubIcon />
    </Link>
    <Link
      href={UrlBuilder.app.ios()}
      target="_blank"
      onclick={() => trackLink("ios-app")}
    >
      <AppleIcon />
    </Link>
    <Link
      href={UrlBuilder.app.android()}
      target="_blank"
      onclick={() => trackLink("android-app")}
    >
      <AndroidIcon />
    </Link>
  </div>

  <div class="trakt-social-media-links">
    <Link
      href={UrlBuilder.socialMedia.x()}
      target="_blank"
      onclick={() => trackLink("x")}
    >
      <XIcon />
    </Link>
    <Link
      href={UrlBuilder.socialMedia.instagram()}
      target="_blank"
      onclick={() => trackLink("instagram")}
    >
      <InstagramIcon />
    </Link>
  </div>
</div>

<style lang="scss">
  @use "$style/scss/mixins/index" as *;

  .trakt-external-links {
    display: flex;
    align-items: center;
    gap: var(--gap-xl);

    :global(svg) {
      height: var(--ni-32);
      width: auto;
    }

    @include for-tablet-sm-and-below {
      gap: 0;
      justify-content: space-between;
      flex-grow: 1;
    }
  }

  .trakt-app-links,
  .trakt-social-media-links {
    display: flex;
    align-items: center;
    gap: var(--gap-s);
  }
</style>
