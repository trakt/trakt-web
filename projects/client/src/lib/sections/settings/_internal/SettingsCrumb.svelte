<script lang="ts">
  import Link from "$lib/components/link/Link.svelte";

  const { href, label }: { href: string; label: string } = $props();
</script>

<span class="title-prefix">
  <Link {href} color="inherit">
    {label}
  </Link>
  <span class="title-sep">/</span>
</span>

<style lang="scss">
  .title-prefix {
    display: contents;

    color: var(--color-text-secondary);

    :global(.trakt-link) {
      color: var(--color-text-secondary);
      text-decoration: none;

      transition: color var(--transition-increment) ease-in-out;
    }

    :global(.trakt-link:hover) {
      color: var(--color-link-active);
    }
  }
</style>
