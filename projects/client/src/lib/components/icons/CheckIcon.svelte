<script lang="ts">
  const { size = "normal" }: IconProps = $props();
  const strokeWidth = $derived(size === "small" ? 3 : 2);
</script>

<svg
  width="24"
  height="24"
  viewBox="0 0 24 24"
  fill="none"
  xmlns="http://www.w3.org/2000/svg"
  data-size={size}
>
  <path
    class="when-inactive"
    d="M22.6661 3.24663L9.16757 19.3336L1.37548 12.7952"
    stroke="currentColor"
    stroke-width={strokeWidth}
  />
  <path
    class="when-active"
    d="M20.6595 2.50823L15.1953 9.02014L8.44608 17.0636M8.44608 17.0636L1.55168 11.2785M8.44608 17.0636L12.2763 20.2775"
    stroke="currentColor"
    stroke-width={strokeWidth}
  />
  <path
    class="when-active"
    d="M8.71946 12.0717L4.12319 8.21497"
    stroke="currentColor"
    stroke-width={strokeWidth}
  />
  <path
    class="when-active"
    d="M23.7231 5.07892L13.4385 17.3356"
    stroke="currentColor"
    stroke-width={strokeWidth}
  />
</svg>

<style>
  path {
    transition: opacity var(--transition-increment) ease-in-out;
  }

  .when-inactive {
    opacity: 1;
  }

  .when-active {
    opacity: 0;
  }

  :global(button):active {
    .when-inactive {
      opacity: 0;
    }

    .when-active {
      opacity: 1;
    }
  }

  svg[data-size="small"] {
    transform: scale(0.75);
  }
</style>
