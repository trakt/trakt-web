<script lang="ts">
  type WatchedIconProps = {
    state: "missing" | "added";
  } & IconProps;

  const { state, size }: IconProps & WatchedIconProps = $props();
</script>

<svg
  xmlns="http://www.w3.org/2000/svg"
  data-size={size}
  fill="currentColor"
  viewBox="0 -960 960 960"
  width="24px"
  height="24px"
>
  {#if state === "missing"}
    <path d="M440-440H200v-80h240v-240h80v240h240v80H520v240h-80v-240Z" />
  {/if}
  {#if state === "added"}
    <path d="M200-440v-80h560v80H200Z" />
  {/if}
</svg>

<style>
  path {
    transition: opacity var(--transition-increment) ease-in-out;
  }

  svg[data-size="small"] {
    transform: scale(0.9);
  }
</style>
