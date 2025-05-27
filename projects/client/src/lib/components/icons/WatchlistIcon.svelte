<script lang="ts">
  type WatchedIconProps = {
    state: "missing" | "added";
  } & IconProps;

  const { state, size }: IconProps & WatchedIconProps = $props();
</script>

<svg
  width="24"
  height="24"
  viewBox="0 0 24 24"
  fill="none"
  xmlns="http://www.w3.org/2000/svg"
>
  {#if state === "missing"}
    <path d="M12 2L12 22" stroke="currentColor" stroke-width="2" />
    <path d="M2 12L22 12" stroke="currentColor" stroke-width="2" />
  {/if}

  {#if state === "added"}
    <path d="M3 12L21 12" stroke="currentColor" stroke-width="2" />
  {/if}
</svg>

<style lang="scss">
  @use "$style/scss/mixins/index" as *;

  path {
    transition: opacity var(--transition-increment) ease-in-out;
  }

  svg[data-size="small"] {
    transform: scale(0.75);
  }
</style>
