<script lang="ts">
  import AndroidIcon from "$lib/components/icons/AndroidIcon.svelte";
  import AppleIcon from "$lib/components/icons/AppleIcon.svelte";
  import GithubIcon from "$lib/components/icons/GithubIcon.svelte";
  import InstallIcon from "$lib/components/icons/InstallIcon.svelte";

  import Link from "$lib/components/link/Link.svelte";
  import { print, PrintTarget } from "$lib/utils/console/print";
  import { UrlBuilder } from "$lib/utils/url/UrlBuilder";
  import { useInstallPrompt } from "../stores/useInstallPrompt";

  const install = useInstallPrompt();

  async function handleInstall(ev: MouseEvent) {
    ev.preventDefault();

    const installed = await install.prompt();

    if (installed) {
      print(PrintTarget.PWA, "info", "Installation was successful!");
    }
  }
</script>

<div class="trakt-external-links">
  {#if $install}
    <Link href="#" onclick={handleInstall}>
      <InstallIcon />
    </Link>
  {/if}

  <Link href={UrlBuilder.github.web()} target="_blank">
    <GithubIcon />
  </Link>
  <Link href={UrlBuilder.app.ios()} target="_blank">
    <AppleIcon />
  </Link>
  <Link href={UrlBuilder.app.android()} target="_blank">
    <AndroidIcon />
  </Link>
</div>

<style>
  .trakt-external-links {
    display: flex;
    gap: var(--gap-l);

    :global(svg) {
      height: var(--ni-24);
      width: auto;
    }
  }
</style>
