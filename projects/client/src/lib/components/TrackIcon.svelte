<script lang="ts">
  const { state = "watched" }: { state?: "watched" | "unwatched" } = $props();
</script>

<svg
  width="24"
  height="24"
  viewBox="0 0 24 24"
  fill="none"
  xmlns="http://www.w3.org/2000/svg"
>
  <path
    class="icon-path {state !== 'watched' ? 'hidden' : ''}"
    d="M20.5166 3.15137L8.94531 16.9404L12.0098 19.5117L10.7246 21.0439L0 12.0449L1.28516 10.5127L7.41309 15.6553L18.9844 1.86523L20.5166 3.15137ZM23.5801 5.72168L13.2949 17.9785L11.7637 16.6924L22.0479 4.43652L23.5801 5.72168ZM8.45312 11.3057L7.16699 12.8379L2.57129 8.98145L3.85645 7.44922L8.45312 11.3057Z"
    fill="currentColor"
  />

  <path
    class="icon-path {state === 'watched' ? 'hidden' : ''}"
    d="M22.6661 3.2466L9.16758 19.3335L1.37548 12.7952"
    stroke="currentColor"
    stroke-width="2"
  />
</svg>

<style>
  .icon-path {
    transition: opacity var(--transition-increment) ease-in-out;
    opacity: 1;

    &:global(.hidden) {
      opacity: 0;
    }
  }
</style>
