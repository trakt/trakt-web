<svelte:options css="injected" />

<script lang="ts">
  import SparkleStarIcon from "$lib/components/icons/SparkleStarIcon.svelte";

  const {
    label,
    size = "normal",
  }: { label: string; size?: "small" | "normal" } = $props();
</script>

<div class="trakt-share-vip-badge" data-size={size}>
  <SparkleStarIcon />
  <span>{label}</span>
</div>

<style>
  .trakt-share-vip-badge {
    display: flex;
    align-items: center;
    gap: 8px;

    height: 56px;
    padding: 0 22px;
    box-sizing: border-box;

    font-size: 26px;
    font-weight: bold;
    color: #fdfcff;

    background: linear-gradient(135deg, #a08efe, #6438d0);
    border-radius: 28px;
    box-shadow: 0 4px 24px rgba(118, 84, 226, 0.55);
  }

  .trakt-share-vip-badge :global(svg) {
    width: 28px;
    height: 28px;
  }

  .trakt-share-vip-badge[data-size="small"] {
    gap: 6px;

    height: 36px;
    padding: 0 14px;

    font-size: 18px;

    border-radius: 18px;
    box-shadow: 0 2px 12px rgba(118, 84, 226, 0.55);
  }

  .trakt-share-vip-badge[data-size="small"] :global(svg) {
    width: 18px;
    height: 18px;
  }
</style>
