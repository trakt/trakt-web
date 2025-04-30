<script lang="ts">
  import SvgQR from "@svelte-put/qr/svg/QR.svelte";
  import logo from "./assets/logo.svg";

  const { data }: { data: string } = $props();

  const FAKE_URL = "data:image/svg+xml,";

  function encodedSvgToNode(encoded: string) {
    const decoded = decodeURIComponent(encoded.split(",")[1]);

    const parser = new DOMParser();
    const svgDoc = parser.parseFromString(decoded, "image/svg+xml");
    return svgDoc.documentElement;
  }
</script>

<div class="trakt-qr-code">
  <SvgQR
    {data}
    logo={FAKE_URL}
    shape="circle"
    onqrinit={(svg) => {
      const logoElement = encodedSvgToNode(logo);

      const image = svg.querySelector("image");
      image?.replaceWith(logoElement);
    }}
  />
</div>

<style>
  .trakt-qr-code {
    width: var(--qr-code-size);
    height: var(--qr-code-size);
    color: var(--color-text-primary);
  }
</style>
