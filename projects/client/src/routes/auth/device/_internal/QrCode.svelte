<script lang="ts">
  import SvgQR from "@svelte-put/qr/svg/QR.svelte";
  import logo_dark from "./assets/logo_dark.svg";
  import logo_light from "./assets/logo_light.svg";

  import { Theme } from "$lib/features/theme/models/Theme";
  import { useTheme } from "$lib/features/theme/useTheme";

  const { data }: { data: string } = $props();
  const { theme } = useTheme();

  const logo = $derived($theme === Theme.Light ? logo_light : logo_dark);
</script>

<div class="trakt-qr-code">
  <SvgQR {data} {logo} shape="circle"></SvgQR>
</div>

<style>
  .trakt-qr-code {
    :global(svg) {
      width: var(--ni-320);
      height: var(--ni-320);
      color: var(--color-text-primary);
    }
  }
</style>
