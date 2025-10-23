<script lang="ts">
  const { fillPercent }: { fillPercent: number } = $props();

  const fill = $derived(Math.max(0, Math.min(100, fillPercent)));

  const gradientId = `starFill-${Math.random().toString(36).slice(2, 10)}`;
</script>

<svg
  width="24"
  height="24"
  viewBox="0 0 24 24"
  fill="none"
  xmlns="http://www.w3.org/2000/svg"
>
  <defs>
    <linearGradient id={gradientId} x1="0%" y1="0%" x2="100%" y2="0%">
      <stop offset={`${fill}%`} stop-color="currentColor" />
      <stop offset={`${fill}%`} stop-color="transparent" />
    </linearGradient>
  </defs>
  <path
    class="trakt-star-path"
    d="M12 2L14.8214 8.11672L21.5106 8.90983L16.5651 13.4833L17.8779 20.0902L12 16.8L6.12215 20.0902L7.43493 13.4833L2.48944 8.90983L9.17863 8.11672L12 2Z"
    stroke="currentColor"
    stroke-width="2"
    stroke-linejoin="bevel"
    fill={`url(#${gradientId})`}
  />
</svg>

<style>
  .trakt-star-path {
    transition:
      fill,
      stroke var(--transition-increment) ease-in-out;
  }
</style>
