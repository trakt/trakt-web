<script lang="ts">
  import type { Snippet } from "svelte";

  const { children, active }: ChildrenProps & { active: Snippet } = $props();
</script>

<g class="content-inactive">
  {@render children()}
</g>
<g class="content-active">
  {@render active()}
</g>

<style>
  .content-inactive {
    opacity: 1;
  }
  .content-active {
    opacity: 0;
  }

  .content-active,
  .content-inactive {
    transition: opacity var(--transition-increment) ease-in-out;
  }

  :global(.trakt-link-active),
  :global(button:active) {
    .content-active {
      opacity: 1;
    }

    .content-inactive {
      opacity: 0;
    }
  }
</style>
