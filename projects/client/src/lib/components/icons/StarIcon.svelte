<script lang="ts">
  const { fill }: { fill: "none" | "half" | "full" } = $props();

  const fillWidth = $derived.by(() => {
    switch (fill) {
      case "none":
        return "0";
      case "half":
        return "50%";
      case "full":
        return "100%";
    }
  });

  const clipId = `starFill-${Math.random().toString(36).slice(2, 10)}`;
</script>

<svg
  width="24"
  height="24"
  viewBox="0 0 24 24"
  fill="none"
  xmlns="http://www.w3.org/2000/svg"
>
  <defs>
    <clipPath id={clipId}>
      <path
        d="M12 2L14.8214 8.11672L21.5106 8.90983L16.5651 13.4833L17.8779 20.0902L12 16.8L6.12215 20.0902L7.43493 13.4833L2.48944 8.90983L9.17863 8.11672L12 2Z"
      />
    </clipPath>
  </defs>
  <path
    class="trakt-star-path"
    d="M12 2L14.8214 8.11672L21.5106 8.90983L16.5651 13.4833L17.8779 20.0902L12 16.8L6.12215 20.0902L7.43493 13.4833L2.48944 8.90983L9.17863 8.11672L12 2Z"
    stroke="currentColor"
    stroke-width="2"
    stroke-linejoin="bevel"
    fill="transparent"
  />
  <rect
    class="trakt-star-fill"
    x="0"
    y="0"
    height="24"
    width={fillWidth}
    fill="currentColor"
    clip-path={`url(#${clipId})`}
  />
</svg>

<style>
  .trakt-star-path {
    transition:
      fill,
      stroke var(--transition-increment) ease-in-out;
  }

  .trakt-star-fill {
    transition: width var(--transition-increment) ease-in-out;
  }
</style>
