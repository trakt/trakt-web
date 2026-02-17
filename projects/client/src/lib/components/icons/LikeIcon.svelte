<script lang="ts">
  const { style = "open" }: { style?: "filled" | "open" } = $props();
</script>

<svg
  width="24"
  height="24"
  viewBox="0 0 24 24"
  fill="none"
  xmlns="http://www.w3.org/2000/svg"
>
  <path
    d="M18 21H8V8L15 1L16.25 2.25C16.3667 2.36667 16.4625 2.525 16.5375 2.725C16.6125 2.925 16.65 3.11667 16.65 3.3V3.65L15.55 8H21C21.5333 8 22 8.2 22.4 8.6C22.8 9 23 9.46667 23 10V12C23 12.1167 22.9875 12.2417 22.9625 12.375C22.9375 12.5083 22.9 12.6333 22.85 12.75L19.85 19.8C19.7 20.1333 19.45 20.4167 19.1 20.65C18.75 20.8833 18.3833 21 18 21ZM6 8V21H2V8H6Z"
    fill="currentColor"
    class:is-active={style === "filled"}
  />

  <path
    d="M18 21H7V8L14 1L15.25 2.25C15.3667 2.36667 15.4625 2.525 15.5375 2.725C15.6125 2.925 15.65 3.11667 15.65 3.3V3.65L14.55 8H21C21.5333 8 22 8.2 22.4 8.6C22.8 9 23 9.46667 23 10V12C23 12.1167 22.9833 12.2417 22.95 12.375C22.9167 12.5083 22.8833 12.6333 22.85 12.75L19.85 19.8C19.7 20.1333 19.45 20.4167 19.1 20.65C18.75 20.8833 18.3833 21 18 21ZM9 19H18L21 12V10H12L13.35 4.5L9 8.85V19ZM7 8V10H4V19H7V21H2V8H7Z"
    fill="currentColor"
    class:is-active={style === "open"}
  />
</svg>

<style>
  path {
    transition: opacity var(--transition-duration-short) ease-in-out;
    opacity: 0;

    &.is-active {
      opacity: 1;
    }
  }
</style>
