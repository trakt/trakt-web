<script lang="ts">
  import AndroidIcon from "$lib/components/icons/AndroidIcon.svelte";
  import AppleIcon from "$lib/components/icons/AppleIcon.svelte";
  import GithubIcon from "$lib/components/icons/GithubIcon.svelte";
  import InstallIcon from "$lib/components/icons/InstallIcon.svelte";
  import RedditIcon from "$lib/components/icons/RedditIcon.svelte";

  import Link from "$lib/components/link/Link.svelte";
  import { AnalyticsEvent } from "$lib/features/analytics/events/AnalyticsEvent";
  import { useTrack } from "$lib/features/analytics/useTrack";
  import * as m from "$lib/features/i18n/messages.ts";
  import { print, PrintTarget } from "$lib/utils/console/print";
  import { UrlBuilder } from "$lib/utils/url/UrlBuilder";
  import { useInstallPrompt } from "../stores/useInstallPrompt";

  const { track } = useTrack(AnalyticsEvent.Link);

  const trackLink = (target: string) => {
    track({ target, source: "footer" });
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
  {#if $install}
    <Link href="#" label={m.link_label_install_pwa()} onclick={handleInstall}>
      <InstallIcon />
    </Link>
  {/if}

  <Link
    href={UrlBuilder.app.ios()}
    target="_blank"
    label={m.link_label_ios_app()}
    onclick={() => trackLink("ios-app")}
  >
    <AppleIcon />
  </Link>

  <Link
    href={UrlBuilder.app.android()}
    target="_blank"
    label={m.link_label_android_app()}
    onclick={() => trackLink("android-app")}
  >
    <AndroidIcon />
  </Link>

  <Link
    href={UrlBuilder.socialMedia.reddit()}
    target="_blank"
    label={m.link_label_reddit()}
    onclick={() => trackLink("reddit")}
  >
    <RedditIcon />
  </Link>

  <Link
    href={UrlBuilder.github.web()}
    target="_blank"
    label={m.link_label_github()}
    onclick={() => trackLink("github-web")}
  >
    <GithubIcon />
  </Link>
</div>

<style>
  .trakt-external-links {
    --external-link-size: var(--ni-30);

    display: flex;
    align-items: center;
    gap: var(--gap-s);
    flex-wrap: wrap;
    justify-content: flex-end;

    :global(.trakt-link) {
      height: var(--external-link-size);
      width: var(--external-link-size);

      display: flex;
      justify-content: center;
      align-items: center;
    }

    :global(.trakt-link svg) {
      height: var(--ni-24);
      width: auto;

      color: var(--color-text-secondary);
      transition: color var(--transition-increment) ease;
    }

    :global(.trakt-link:hover svg) {
      color: var(--color-text-primary);
    }
  }
</style>
