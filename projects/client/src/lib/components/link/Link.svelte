<script lang="ts">
  const { children, href, target }: ChildrenProps & HTMLAnchorProps = $props();
</script>

{#if href}
  <a {href} {target} class="trakt-link">
    {@render children?.()}
  </a>
{:else}
  {@render children?.()}
{/if}

<style>
  .trakt-link {
    -webkit-tap-highlight-color: transparent;
    display: content;

    text-decoration: none;
    cursor: pointer;

    &:visited {
      color: inherit;
    }
  }
</style>
