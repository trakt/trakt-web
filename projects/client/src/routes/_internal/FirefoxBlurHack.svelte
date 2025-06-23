<script lang="ts">
  import { browser } from "$app/environment";

  const isFirefox = $derived(
    browser && navigator.userAgent.toLowerCase().includes("firefox"),
  );
</script>

<!--
  Firefox performs terrible in case of backdrop-filter: blur(),
  so we use a hack to use an svg filter instead.
-->
{#if isFirefox}
  <svg style="position: absolute; width: 0; height: 0">
    <filter id="trakt-firefox-blur">
      <feGaussianBlur stdDeviation="8" />
    </filter>
  </svg>
{/if}
