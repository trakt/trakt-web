<script lang="ts">
  const isFirefox = $derived(
    navigator.userAgent.toLowerCase().includes("firefox"),
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
